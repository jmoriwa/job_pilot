import Link from "next/link";
import type { JobDetailsViewModel } from "@/components/job-details/types";

type Props = {
  job: JobDetailsViewModel;
};

export function JobHeader({ job }: Props) {
  return (
    <section className="rounded-xl border border-border bg-surface p-7 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-secondary text-text-secondary">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8">
              <path
                d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M9 8h1m4 0h1M9 12h1m4 0h1M9 16h1m4 0h1M4 21h16"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </span>
          <div>
            <h1 className="text-3xl font-bold leading-10 text-text-primary">
              {job.title}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <p className="text-base font-semibold leading-6 text-text-secondary">
                {job.company}
              </p>
              <span className="h-1 w-1 rounded-full bg-text-muted" />
              <span className="rounded-full bg-success-lightest px-3 py-1 text-sm font-semibold leading-5 text-success-foreground">
                {job.matchScore}% Match Score
              </span>
            </div>
          </div>
        </div>

        <Link
          href={job.applyUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-12 items-center justify-center gap-3 rounded-xl border border-border bg-surface px-5 text-base font-semibold leading-6 text-text-primary shadow-sm transition hover:bg-surface-secondary"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
            <path
              d="M14 4h6v6m0-6-9 9m-2-7H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
          View Job Post
        </Link>
      </div>
    </section>
  );
}
