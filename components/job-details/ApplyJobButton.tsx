import Link from "next/link";
import type { JobDetailsViewModel } from "@/components/job-details/types";

type Props = {
  job: JobDetailsViewModel;
};

export function ApplyJobButton({ job }: Props) {
  return (
    <Link
      href={job.applyUrl}
      target="_blank"
      rel="noreferrer"
      className="flex h-14 items-center justify-center rounded-xl bg-accent px-6 text-base font-bold leading-6 text-accent-foreground shadow-sm transition hover:bg-accent-dark"
    >
      Apply Now at {job.company}
    </Link>
  );
}
