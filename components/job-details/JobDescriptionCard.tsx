import type { JobDetailsViewModel } from "@/components/job-details/types";
import { LoadFullDescriptionButton } from "@/components/job-details/LoadFullDescriptionButton";

type Props = {
  job: JobDetailsViewModel;
};

export function JobDescriptionCard({ job }: Props) {
  return (
    <section className="rounded-xl border border-border bg-surface p-7 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-secondary text-text-secondary">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
            <path
              d="M8 3h6l4 4v14H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm6 0v5h5M9 13h6M9 17h4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </span>
        <h2 className="text-xl font-bold leading-7 text-text-primary">
          Job Description
        </h2>
      </div>
      <p className="mt-8 whitespace-pre-line text-base font-semibold leading-7 text-text-primary">
        {job.description}
      </p>
      {job.descriptionIsTruncated ? (
        <LoadFullDescriptionButton applyUrl={job.applyUrl} />
      ) : null}
    </section>
  );
}
