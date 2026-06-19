import type { ReactNode } from "react";
import Link from "next/link";

const PAGE_SIZE = 20;

type MatchFilter = "all" | "high" | "low";
type JobSort = "match" | "newest" | "oldest";

type Props = {
  currentPage: number;
  filter: MatchFilter;
  query: string;
  runId: string;
  shownCount: number;
  sort: JobSort;
  totalCount: number;
  totalPages: number;
};

function buildPageHref(
  page: number,
  runId: string,
  query: string,
  filter: MatchFilter,
  sort: JobSort,
): string {
  const params = new URLSearchParams();

  if (runId) {
    params.set("runId", runId);
  }

  if (query) {
    params.set("q", query);
  }

  if (filter !== "all") {
    params.set("filter", filter);
  }

  if (sort !== "match") {
    params.set("sort", sort);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const queryString = params.toString();

  return queryString ? `/find-jobs?${queryString}` : "/find-jobs";
}

function getPageNumbers(currentPage: number, totalPages: number): number[] {
  const pageNumbers = new Set<number>([1, totalPages, currentPage]);

  if (currentPage > 1) {
    pageNumbers.add(currentPage - 1);
  }

  if (currentPage < totalPages) {
    pageNumbers.add(currentPage + 1);
  }

  return [...pageNumbers].sort((first, second) => first - second);
}

function PaginationLink({
  children,
  className,
  href,
}: {
  children: ReactNode;
  className: string;
  href: string;
}) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function JobsPagination({
  currentPage,
  filter,
  query,
  runId,
  shownCount,
  sort,
  totalCount,
  totalPages,
}: Props) {
  const startingCount = totalCount > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const endingCount = totalCount > 0 ? startingCount + shownCount - 1 : 0;
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex flex-col gap-4 border-t border-border px-8 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-base font-normal leading-6 text-text-secondary">
          Showing <span className="font-semibold text-text-dark">{startingCount}</span> to{" "}
          <span className="font-semibold text-text-dark">{endingCount}</span> of{" "}
          <span className="font-semibold text-text-dark">{totalCount}</span> results
        </p>
        <p className="mt-1 text-xs font-medium leading-4 text-text-muted">
          Jobs by Adzuna
        </p>
      </div>

      <nav aria-label="Pagination" className="flex items-center gap-3">
        {hasPrevious ? (
          <PaginationLink
            href={buildPageHref(currentPage - 1, runId, query, filter, sort)}
            className="h-11 rounded-md border border-border bg-surface px-4 text-base font-medium leading-6 text-text-primary shadow-sm transition hover:bg-surface-secondary"
          >
            Previous
          </PaginationLink>
        ) : (
          <span className="h-11 rounded-md border border-border bg-surface px-4 text-base font-medium leading-10 text-text-muted shadow-sm">
            Previous
          </span>
        )}

        {pageNumbers.map((pageNumber, index) => {
          const previousPage = pageNumbers[index - 1];
          const showGap = previousPage !== undefined && pageNumber - previousPage > 1;
          const isActive = pageNumber === currentPage;

          return (
            <span key={pageNumber} className="contents">
              {showGap ? (
                <span className="px-2 text-base font-medium leading-6 text-text-secondary">
                  ...
                </span>
              ) : null}
              {isActive ? (
                <span
                  aria-current="page"
                  className="h-11 min-w-11 rounded-md border border-accent-light bg-accent-muted px-4 text-center text-base font-medium leading-10 text-accent shadow-sm"
                >
                  {pageNumber}
                </span>
              ) : (
                <PaginationLink
                  href={buildPageHref(pageNumber, runId, query, filter, sort)}
                  className="h-11 min-w-11 rounded-md border border-border bg-surface px-4 text-center text-base font-medium leading-10 text-text-primary shadow-sm transition hover:bg-surface-secondary"
                >
                  {pageNumber}
                </PaginationLink>
              )}
            </span>
          );
        })}

        {hasNext ? (
          <PaginationLink
            href={buildPageHref(currentPage + 1, runId, query, filter, sort)}
            className="h-11 rounded-md border border-border bg-surface px-4 text-base font-medium leading-6 text-text-primary shadow-sm transition hover:bg-surface-secondary"
          >
            Next
          </PaginationLink>
        ) : (
          <span className="h-11 rounded-md border border-border bg-surface px-4 text-base font-medium leading-10 text-text-muted shadow-sm">
            Next
          </span>
        )}
      </nav>
    </div>
  );
}
