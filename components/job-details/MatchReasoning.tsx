import type { JobDetailsViewModel } from "@/components/job-details/types";

type Props = {
  job: JobDetailsViewModel;
};

export function MatchReasoning({ job }: Props) {
  return (
    <section className="rounded-xl border border-border bg-surface p-7 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success-lightest text-success">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
            <path
              d="M4 16h4l2-7 4 10 2-6h4m-3-8 2 2m0-2-2 2"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </span>
        <h2 className="text-sm font-bold uppercase leading-5 text-text-secondary">
          AI Match Reasoning
        </h2>
      </div>
      <p className="mt-5 text-base font-semibold leading-7 text-text-primary">
        {job.matchReason}
      </p>
    </section>
  );
}
