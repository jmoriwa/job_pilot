import { redirect } from "next/navigation";
import { JobFilters } from "@/components/find-jobs/JobFilters";
import { JobsPagination } from "@/components/find-jobs/JobsPagination";
import { JobsTable, type MockJob } from "@/components/find-jobs/JobsTable";
import { SearchControls } from "@/components/find-jobs/SearchControls";
import { AppHeader } from "@/components/layout/AppHeader";
import { createInsforgeServer } from "@/lib/insforge-server";
import { MATCH_THRESHOLD } from "@/lib/utils";

const JOBS_PER_PAGE = 20;
const MAX_LIST_CANDIDATES = 500;

type MatchFilter = "all" | "high" | "low";
type JobSort = "match" | "newest" | "oldest";

type JobsQueryState = {
  runId: string;
  query: string;
  filter: MatchFilter;
  sort: JobSort;
  page: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringFrom(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function scoreFrom(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function searchParamString(value: string | string[] | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function runIdFromSearchParams(searchParams: SearchParams): string {
  const value = searchParamString(searchParams.runId);

  return /^[0-9a-fA-F-]{36}$/.test(value) ? value : "";
}

function filterFromSearchParams(searchParams: SearchParams): MatchFilter {
  const value = searchParamString(searchParams.filter);

  if (value === "high" || value === "low") {
    return value;
  }

  return "all";
}

function sortFromSearchParams(searchParams: SearchParams): JobSort {
  const value = searchParamString(searchParams.sort);

  if (value === "newest" || value === "oldest") {
    return value;
  }

  return "match";
}

function pageFromSearchParams(searchParams: SearchParams): number {
  const value = Number.parseInt(searchParamString(searchParams.page), 10);

  if (!Number.isFinite(value) || value < 1) {
    return 1;
  }

  return value;
}

function queryStateFromSearchParams(searchParams: SearchParams): JobsQueryState {
  return {
    runId: runIdFromSearchParams(searchParams),
    query: searchParamString(searchParams.q),
    filter: filterFromSearchParams(searchParams),
    sort: sortFromSearchParams(searchParams),
    page: pageFromSearchParams(searchParams),
  };
}

function formatDateFound(value: string): string {
  const foundAt = new Date(value);

  if (Number.isNaN(foundAt.getTime())) {
    return "";
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

function normalizeJobRow(record: unknown): MockJob | null {
  if (!isRecord(record)) {
    return null;
  }

  const id = stringFrom(record.id);
  const company = stringFrom(record.company);
  const role = stringFrom(record.title);

  if (!id || !company || !role) {
    return null;
  }

  return {
    id,
    company,
    role,
    matchScore: scoreFrom(record.match_score),
    salary: stringFrom(record.salary) || "Not listed",
    dateFound: formatDateFound(stringFrom(record.found_at)),
  };
}

function normalizeJobRows(records: unknown): MockJob[] {
  if (!Array.isArray(records)) {
    return [];
  }

  return records
    .map(normalizeJobRow)
    .filter((job): job is MockJob => job !== null);
}

function jobMatchesQuery(job: MockJob, query: string): boolean {
  if (!query) {
    return true;
  }

  const normalizedQuery = query.toLowerCase();

  return (
    job.company.toLowerCase().includes(normalizedQuery) ||
    job.role.toLowerCase().includes(normalizedQuery)
  );
}

function paginateJobs(jobs: MockJob[], page: number): MockJob[] {
  const startingIndex = (page - 1) * JOBS_PER_PAGE;

  return jobs.slice(startingIndex, startingIndex + JOBS_PER_PAGE);
}

type SearchParams = Record<string, string | string[] | undefined>;

type Props = {
  searchParams?: Promise<SearchParams>;
};

export default async function FindJobsPage({ searchParams }: Props) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const queryState = queryStateFromSearchParams(resolvedSearchParams);
  const insforge = await createInsforgeServer();
  const {
    data: { user },
  } = await insforge.auth.getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  let jobsQuery = insforge.database
    .from("jobs")
    .select("id, title, company, salary, match_score, found_at")
    .eq("user_id", user.id);

  if (queryState.runId) {
    jobsQuery = jobsQuery.eq("run_id", queryState.runId);
  }

  if (queryState.filter === "high") {
    jobsQuery = jobsQuery.gte("match_score", MATCH_THRESHOLD);
  }

  if (queryState.filter === "low") {
    jobsQuery = jobsQuery.lt("match_score", MATCH_THRESHOLD);
  }

  const sortColumn = queryState.sort === "match" ? "match_score" : "found_at";
  const sortAscending = queryState.sort === "oldest";
  const { data: jobsRecord, error: jobsError } = await jobsQuery
    .order(sortColumn, { ascending: sortAscending })
    .limit(MAX_LIST_CANDIDATES);

  if (jobsError) {
    console.error("[app/find-jobs]", jobsError);
  }

  const filteredJobs = normalizeJobRows(jobsRecord).filter((job) =>
    jobMatchesQuery(job, queryState.query),
  );
  const totalCount = filteredJobs.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / JOBS_PER_PAGE));
  const activePage = Math.min(queryState.page, totalPages);
  const jobs = paginateJobs(filteredJobs, activePage);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader userId={user.id} activeHref="/find-jobs" showSignOut={false} />
      <main className="px-8 py-12">
        <div className="mx-auto max-w-[2360px] space-y-10">
          <SearchControls />
          <JobFilters
            filter={queryState.filter}
            query={queryState.query}
            runId={queryState.runId}
            sort={queryState.sort}
          />
          <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <JobsTable jobs={jobs} />
            <JobsPagination
              currentPage={activePage}
              filter={queryState.filter}
              query={queryState.query}
              runId={queryState.runId}
              shownCount={jobs.length}
              sort={queryState.sort}
              totalCount={totalCount}
              totalPages={totalPages}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
