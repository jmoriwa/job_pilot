import Link from "next/link";

export type MockJob = {
  id: string;
  company: string;
  role: string;
  matchScore: number;
  salary: string;
  dateFound: string;
};

type Props = {
  jobs: MockJob[];
};

function BuildingIcon({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path
        d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M9 8h1m4 0h1M9 12h1m4 0h1M9 16h1m4 0h1M4 21h16"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function getScoreColor(score: number): string {
  if (score >= 90) {
    return "bg-success";
  }

  if (score >= 80) {
    return "bg-info-medium";
  }

  return "bg-warning";
}

function getScoreWidth(score: number): string {
  if (score >= 95) {
    return "w-[95%]";
  }

  if (score >= 90) {
    return "w-[90%]";
  }

  if (score >= 85) {
    return "w-[85%]";
  }

  if (score >= 80) {
    return "w-[80%]";
  }

  if (score >= 70) {
    return "w-[70%]";
  }

  if (score >= 60) {
    return "w-[60%]";
  }

  if (score >= 50) {
    return "w-[50%]";
  }

  if (score >= 40) {
    return "w-[40%]";
  }

  if (score >= 30) {
    return "w-[30%]";
  }

  if (score >= 20) {
    return "w-[20%]";
  }

  if (score >= 10) {
    return "w-[10%]";
  }

  return "w-[4%]";
}

export function JobsTable({ jobs }: Props) {
  if (jobs.length === 0) {
    return (
      <div className="px-10 py-16 text-center">
        <p className="text-base font-semibold leading-6 text-text-primary">
          No jobs found yet
        </p>
        <p className="mt-2 text-sm font-normal leading-5 text-text-muted">
          Search for a role above and saved matches will appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid min-w-[880px] grid-cols-[1.15fr_1.45fr_0.9fr_0.95fr_0.8fr] bg-surface-secondary px-10 py-6 text-sm font-semibold uppercase leading-5 text-text-secondary">
        <span>Company</span>
        <span>Role</span>
        <span>Match Score</span>
        <span>Salary Est.</span>
        <span>Date Found</span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[880px]">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/find-jobs/${job.id}`}
              className="grid grid-cols-[1.15fr_1.45fr_0.9fr_0.95fr_0.8fr] items-center border-t border-border px-10 py-6 transition hover:bg-surface-secondary"
            >
              <span className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-surface-secondary text-text-secondary">
                  <BuildingIcon className="h-5 w-5" />
                </span>
                <span className="text-base font-semibold leading-6 text-text-primary">
                  {job.company}
                </span>
              </span>
              <span className="text-base font-medium leading-6 text-text-dark">
                {job.role}
              </span>
              <span className="flex items-center gap-3">
                <span className="h-2 w-32 overflow-hidden rounded-full bg-border-light">
                  <span
                    className={`block h-full rounded-full ${getScoreColor(job.matchScore)} ${getScoreWidth(job.matchScore)}`}
                  />
                </span>
                <span className="text-base font-semibold leading-6 text-text-dark">
                  {job.matchScore}%
                </span>
              </span>
              <span className="text-base font-medium leading-6 text-text-dark">
                {job.salary}
              </span>
              <span className="text-base font-medium leading-6 text-text-secondary">
                {job.dateFound}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
