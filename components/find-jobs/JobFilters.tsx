import Link from "next/link";

type MatchFilter = "all" | "high" | "low";
type JobSort = "match" | "newest" | "oldest";

type Props = {
  filter: MatchFilter;
  query: string;
  runId: string;
  sort: JobSort;
};

function SearchIcon({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path
        d="m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path
        d="m6 9 6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function buildClearHref(runId: string): string {
  return runId ? `/find-jobs?runId=${encodeURIComponent(runId)}` : "/find-jobs";
}

export function JobFilters({ filter, query, runId, sort }: Props) {
  const hasActiveFilters = Boolean(query) || filter !== "all" || sort !== "match";

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-surface px-6 py-3 shadow-sm md:flex-row md:items-center">
      <form
        action="/find-jobs"
        className="flex flex-1 flex-col gap-4 md:flex-row md:items-center"
      >
        {runId ? <input type="hidden" name="runId" value={runId} /> : null}
        <div className="flex min-h-12 flex-1 items-center gap-3">
          <SearchIcon className="h-5 w-5 shrink-0 text-text-muted" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Filter by company or role..."
            className="h-12 w-full bg-transparent text-base font-normal leading-6 text-text-primary outline-none placeholder:text-text-muted"
          />
        </div>

        <div className="hidden h-12 w-px bg-border md:block" />

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative">
            <span className="sr-only">Match filter</span>
            <select
              name="filter"
              defaultValue={filter}
              className="h-12 min-w-40 appearance-none rounded-md border border-border bg-surface px-4 pr-11 text-base font-medium leading-6 text-text-primary shadow-sm outline-none transition hover:bg-surface-secondary focus:border-accent focus:ring-1 focus:ring-accent"
            >
              <option value="all">All Matches</option>
              <option value="high">High Match</option>
              <option value="low">Low Match</option>
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
          </label>
          <label className="relative">
            <span className="sr-only">Sort jobs</span>
            <select
              name="sort"
              defaultValue={sort}
              className="h-12 min-w-40 appearance-none rounded-md border border-border bg-surface px-4 pr-11 text-base font-medium leading-6 text-text-primary shadow-sm outline-none transition hover:bg-surface-secondary focus:border-accent focus:ring-1 focus:ring-accent"
            >
              <option value="match">Match Score</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
          </label>
          <button
            type="submit"
            className="h-12 rounded-md bg-accent px-5 text-base font-semibold leading-6 text-accent-foreground shadow-sm transition hover:bg-accent-dark"
          >
            Apply
          </button>
          {hasActiveFilters ? (
            <Link
              href={buildClearHref(runId)}
              className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-surface px-5 text-base font-medium leading-6 text-text-primary shadow-sm transition hover:bg-surface-secondary"
            >
              Clear
            </Link>
          ) : null}
        </div>
      </form>
    </section>
  );
}
