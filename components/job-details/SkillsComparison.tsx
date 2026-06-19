import type { JobDetailsViewModel } from "@/components/job-details/types";

type Props = {
  job: JobDetailsViewModel;
};

export function SkillsComparison({ job }: Props) {
  return (
    <section className="rounded-xl border border-border bg-surface p-7 shadow-sm">
      <h2 className="text-sm font-bold uppercase leading-5 text-text-secondary">
        Required Skills vs Your Profile
      </h2>

      <div className="mt-5">
        <p className="text-sm font-medium leading-5 text-text-muted">You have</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {job.matchedSkills.length > 0 ? (
            job.matchedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 rounded-full bg-success-lightest px-4 py-1 text-sm font-semibold leading-5 text-success-foreground"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3 w-3">
                  <path
                    d="m5 13 4 4L19 7"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                  />
                </svg>
                {skill}
              </span>
            ))
          ) : (
            <span className="text-sm font-medium leading-5 text-text-muted">
              No matched skills were detected yet.
            </span>
          )}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium leading-5 text-text-muted">Gap skills</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {job.missingSkills.length > 0 ? (
            job.missingSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 rounded-full bg-accent-muted px-4 py-1 text-sm font-semibold leading-5 text-accent"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3 w-3">
                  <path
                    d="m6 6 12 12M18 6 6 18"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                  />
                </svg>
                {skill}
              </span>
            ))
          ) : (
            <span className="text-sm font-medium leading-5 text-text-muted">
              No gap skills were detected.
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
