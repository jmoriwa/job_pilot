import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ApplyJobButton } from "@/components/job-details/ApplyJobButton";
import { CompanyResearchCard } from "@/components/job-details/CompanyResearchCard";
import { JobDescriptionCard } from "@/components/job-details/JobDescriptionCard";
import { JobHeader } from "@/components/job-details/JobHeader";
import { JobInfoCards } from "@/components/job-details/JobInfoCards";
import { MatchReasoning } from "@/components/job-details/MatchReasoning";
import { SkillsComparison } from "@/components/job-details/SkillsComparison";
import type {
  CompanyResearchDossier,
  JobDetailsViewModel,
} from "@/components/job-details/types";
import { AppHeader } from "@/components/layout/AppHeader";
import { fetchFullJobDescription, isLikelyTruncatedDescription } from "@/lib/adzuna";
import { createInsforgeServer } from "@/lib/insforge-server";

type Params = {
  id: string;
};

type Props = {
  params: Promise<Params>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringFrom(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function numberFrom(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function stringArrayFrom(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.length > 0);
}

function normalizeCompanyResearch(value: unknown): CompanyResearchDossier | null {
  if (!isRecord(value)) {
    return null;
  }

  const companyOverview = stringFrom(value.companyOverview);
  const whyThisRole = stringFrom(value.whyThisRole);

  if (!companyOverview && !whyThisRole) {
    return null;
  }

  return {
    companyOverview,
    techStack: stringArrayFrom(value.techStack),
    culture: stringArrayFrom(value.culture),
    whyThisRole,
    yourEdge: stringArrayFrom(value.yourEdge),
    gapsToAddress: stringArrayFrom(value.gapsToAddress),
    smartQuestions: stringArrayFrom(value.smartQuestions),
    interviewPrep: stringArrayFrom(value.interviewPrep),
    sources: stringArrayFrom(value.sources),
  };
}

function formatJobType(value: string): string {
  if (value === "parttime") {
    return "Part time";
  }

  if (value === "contract") {
    return "Contract";
  }

  return "Full time";
}

function formatDateFound(value: string): string {
  const foundAt = new Date(value);

  if (Number.isNaN(foundAt.getTime())) {
    return "Recently";
  }

  const differenceMs = Date.now() - foundAt.getTime();
  const minutes = Math.max(0, Math.floor(differenceMs / 60000));

  if (minutes < 60) {
    return minutes <= 1 ? "Just now" : `${minutes} minutes ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) {
    return "Yesterday";
  }

  return `${days} days ago`;
}

async function normalizeJob(record: unknown): Promise<JobDetailsViewModel | null> {
  if (!isRecord(record)) {
    return null;
  }

  const id = stringFrom(record.id);
  const title = stringFrom(record.title);
  const company = stringFrom(record.company);
  const applyUrl = stringFrom(record.external_apply_url) || stringFrom(record.source_url);

  if (!id || !title || !company || !applyUrl) {
    return null;
  }

  const savedDescription = stringFrom(record.about_role);
  const expandedDescription =
    savedDescription && isLikelyTruncatedDescription(savedDescription)
      ? await fetchFullJobDescription(applyUrl)
      : null;
  const description =
    expandedDescription ||
    savedDescription ||
    "No job description was saved for this role.";

  return {
    id,
    title,
    company,
    location: stringFrom(record.location) || "Not listed",
    salary: stringFrom(record.salary) || "Not listed",
    jobType: formatJobType(stringFrom(record.job_type)),
    dateFound: formatDateFound(stringFrom(record.found_at)),
    matchScore: numberFrom(record.match_score),
    matchReason:
      stringFrom(record.match_reason) ||
      "This job has been matched against your profile, but no written reasoning was saved.",
    matchedSkills: stringArrayFrom(record.matched_skills),
    missingSkills: stringArrayFrom(record.missing_skills),
    description,
    descriptionIsTruncated: isLikelyTruncatedDescription(description),
    applyUrl,
    companyResearch: normalizeCompanyResearch(record.company_research),
  };
}

export default async function JobDetailsPage({ params }: Props) {
  const { id } = await params;
  const insforge = await createInsforgeServer();
  const {
    data: { user },
  } = await insforge.auth.getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { data: jobRecord, error: jobError } = await insforge.database
    .from("jobs")
    .select(
      "id, title, company, location, salary, job_type, about_role, source_url, external_apply_url, match_score, match_reason, matched_skills, missing_skills, company_research, found_at",
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (jobError) {
    console.error("[app/find-jobs/[id]]", jobError);
    notFound();
  }

  const job = await normalizeJob(jobRecord);

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader userId={user.id} activeHref="/find-jobs" />
      <main className="px-8 py-12">
        <div className="mx-auto max-w-[880px] space-y-7">
          <Link
            href="/find-jobs"
            className="inline-flex items-center gap-3 text-base font-semibold leading-6 text-text-secondary transition hover:text-accent"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
              <path
                d="m15 18-6-6 6-6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            Back to Jobs
          </Link>

          <JobHeader job={job} />
          <JobInfoCards job={job} />
          <MatchReasoning job={job} />
          <SkillsComparison job={job} />
          <JobDescriptionCard job={job} />
          <CompanyResearchCard job={job} />
          <ApplyJobButton job={job} />
        </div>
      </main>
    </div>
  );
}
