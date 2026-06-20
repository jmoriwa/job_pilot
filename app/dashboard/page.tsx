import { redirect } from "next/navigation";
import {
  AnalyticsCharts,
  type DashboardAnalytics,
  type DailyAnalyticsPoint,
  type MatchScoreBucketPoint,
} from "@/components/dashboard/AnalyticsCharts";
import {
  RecentActivity,
  type ActivityItem,
} from "@/components/dashboard/RecentActivity";
import { StatsBar, type DashboardStats } from "@/components/dashboard/StatsBar";
import { AppHeader } from "@/components/layout/AppHeader";
import { createInsforgeServer } from "@/lib/insforge-server";

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
const RECENT_ACTIVITY_LIMIT = 50;
const MATCH_SCORE_BUCKETS = ["50-60%", "60-70%", "70-80%", "80-90%", "90-100%"];
const DAY_FORMATTER = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function numberFrom(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function countFrom(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.round(value));
}

function stringFrom(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function dateMsFrom(value: unknown): number | null {
  const timestamp = new Date(stringFrom(value)).getTime();

  return Number.isFinite(timestamp) ? timestamp : null;
}

function companyResearchExists(value: unknown): boolean {
  return isRecord(value) && Object.keys(value).length > 0;
}

function foundThisWeek(value: unknown, now: number): boolean {
  const foundAt = dateMsFrom(value);

  return foundAt !== null && foundAt >= now - WEEK_IN_MS && foundAt <= now;
}

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);

  return nextDate;
}

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function buildDailySeries(
  days: number,
  counts: Map<string, number>,
  labelMode: "weekday" | "date",
): DailyAnalyticsPoint[] {
  const today = startOfUtcDay(new Date());
  const firstDay = addDays(today, -(days - 1));

  return Array.from({ length: days }, (_, index) => {
    const date = addDays(firstDay, index);
    const key = dayKey(date);

    return {
      date: key,
      label:
        labelMode === "weekday"
          ? DAY_FORMATTER.format(date)
          : SHORT_DATE_FORMATTER.format(date),
      value: counts.get(key) ?? 0,
    };
  });
}

function incrementDay(counts: Map<string, number>, value: unknown): void {
  const timestamp = dateMsFrom(value);

  if (timestamp === null) {
    return;
  }

  const key = dayKey(new Date(timestamp));
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

function bucketLabelForScore(score: number): string | null {
  if (score >= 90) {
    return "90-100%";
  }

  if (score >= 80) {
    return "80-90%";
  }

  if (score >= 70) {
    return "70-80%";
  }

  if (score >= 60) {
    return "60-70%";
  }

  if (score >= 50) {
    return "50-60%";
  }

  return null;
}

function buildMatchScoreDistribution(records: unknown[]): MatchScoreBucketPoint[] {
  const counts = new Map<string, number>();

  for (const record of records) {
    if (!isRecord(record)) {
      continue;
    }

    const score = numberFrom(record.match_score);
    const label = score === null ? null : bucketLabelForScore(score);

    if (label) {
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
  }

  return MATCH_SCORE_BUCKETS.map((label) => ({
    label,
    value: counts.get(label) ?? 0,
  }));
}

function buildDashboardAnalytics(records: unknown): DashboardAnalytics {
  if (!Array.isArray(records)) {
    return {
      companyResearchActivity: buildDailySeries(7, new Map(), "weekday"),
      jobsFoundOverTime: buildDailySeries(30, new Map(), "date"),
      matchScoreDistribution: buildMatchScoreDistribution([]),
    };
  }

  const jobsFoundCounts = new Map<string, number>();
  const companyResearchCounts = new Map<string, number>();

  for (const record of records) {
    if (!isRecord(record)) {
      continue;
    }

    incrementDay(jobsFoundCounts, record.found_at);

    if (companyResearchExists(record.company_research)) {
      incrementDay(companyResearchCounts, record.updated_at);
    }
  }

  return {
    companyResearchActivity: buildDailySeries(7, companyResearchCounts, "weekday"),
    jobsFoundOverTime: buildDailySeries(30, jobsFoundCounts, "date"),
    matchScoreDistribution: buildMatchScoreDistribution(records),
  };
}

function buildDashboardStats(records: unknown): DashboardStats {
  if (!Array.isArray(records)) {
    return {
      totalJobsFound: 0,
      averageMatchRate: 0,
      companiesResearched: 0,
      jobsThisWeek: 0,
    };
  }

  const now = Date.now();
  const scores: number[] = [];
  let companiesResearched = 0;
  let jobsThisWeek = 0;

  for (const record of records) {
    if (!isRecord(record)) {
      continue;
    }

    const score = numberFrom(record.match_score);

    if (score !== null) {
      scores.push(score);
    }

    if (companyResearchExists(record.company_research)) {
      companiesResearched += 1;
    }

    if (foundThisWeek(record.found_at, now)) {
      jobsThisWeek += 1;
    }
  }

  const scoreTotal = scores.reduce((total, score) => total + score, 0);
  const averageMatchRate =
    scores.length > 0 ? Math.round(scoreTotal / scores.length) : 0;

  return {
    totalJobsFound: records.length,
    averageMatchRate,
    companiesResearched,
    jobsThisWeek,
  };
}

function formatRelativeTime(timestamp: number, now: number): string {
  const differenceMs = Math.max(0, now - timestamp);
  const minutes = Math.floor(differenceMs / 60000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 30) {
    return `${days} days ago`;
  }

  const months = Math.floor(days / 30);

  return months === 1 ? "1 month ago" : `${months} months ago`;
}

type ActivityCandidate = ActivityItem & {
  sortTime: number;
};

function buildRunActivity(record: unknown, now: number): ActivityCandidate | null {
  if (!isRecord(record)) {
    return null;
  }

  const completedAt = dateMsFrom(record.completed_at);
  const startedAt = dateMsFrom(record.started_at);
  const sortTime = completedAt ?? startedAt;

  if (sortTime === null) {
    return null;
  }

  const jobTitle = stringFrom(record.job_title_searched) || "your search";
  const jobsFound = countFrom(record.jobs_found);
  const jobLabel = jobsFound === 1 ? "job" : "jobs";

  return {
    label: `Found ${jobsFound.toLocaleString("en-US")} ${jobLabel} for ${jobTitle}`,
    timestamp: formatRelativeTime(sortTime, now),
    tone: "success",
    sortTime,
  };
}

function buildResearchActivity(record: unknown, now: number): ActivityCandidate | null {
  if (!isRecord(record) || !companyResearchExists(record.company_research)) {
    return null;
  }

  const sortTime = dateMsFrom(record.updated_at);
  const company = stringFrom(record.company);

  if (sortTime === null || !company) {
    return null;
  }

  return {
    label: `Researched ${company}`,
    timestamp: formatRelativeTime(sortTime, now),
    tone: "info",
    sortTime,
  };
}

function buildRecentActivities(runRecords: unknown, jobRecords: unknown): ActivityItem[] {
  const now = Date.now();
  const activities: ActivityCandidate[] = [];

  if (Array.isArray(runRecords)) {
    for (const record of runRecords) {
      const activity = buildRunActivity(record, now);

      if (activity) {
        activities.push(activity);
      }
    }
  }

  if (Array.isArray(jobRecords)) {
    for (const record of jobRecords) {
      const activity = buildResearchActivity(record, now);

      if (activity) {
        activities.push(activity);
      }
    }
  }

  return activities
    .sort((a, b) => b.sortTime - a.sortTime)
    .slice(0, RECENT_ACTIVITY_LIMIT)
    .map(({ label, timestamp, tone }) => ({ label, timestamp, tone }));
}

export default async function DashboardPage() {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
  } = await insforge.auth.getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { data: jobsRecord, error: jobsError } = await insforge.database
    .from("jobs")
    .select("match_score, company_research, found_at, updated_at")
    .eq("user_id", user.id);

  if (jobsError) {
    console.error("[app/dashboard]", jobsError);
  }

  const { data: runRecords, error: runsError } = await insforge.database
    .from("agent_runs")
    .select("job_title_searched, jobs_found, started_at, completed_at")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("started_at", { ascending: false })
    .limit(RECENT_ACTIVITY_LIMIT);

  if (runsError) {
    console.error("[app/dashboard]", runsError);
  }

  const { data: researchRecords, error: researchError } = await insforge.database
    .from("jobs")
    .select("company, company_research, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(RECENT_ACTIVITY_LIMIT);

  if (researchError) {
    console.error("[app/dashboard]", researchError);
  }

  const dashboardStats = buildDashboardStats(jobsRecord);
  const recentActivities = buildRecentActivities(runRecords, researchRecords);
  const dashboardAnalytics = buildDashboardAnalytics(jobsRecord);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader activeHref="/dashboard" showSignOut={false} userId={user.id} />
      <main className="px-8 py-12">
        <div className="mx-auto max-w-[2360px] space-y-10">
          <StatsBar stats={dashboardStats} />
          <div className="grid grid-cols-1 gap-10 xl:grid-cols-12">
            <div className="xl:col-span-6">
              <RecentActivity activities={recentActivities} />
            </div>
            <AnalyticsCharts analytics={dashboardAnalytics} />
          </div>
        </div>
      </main>
    </div>
  );
}
