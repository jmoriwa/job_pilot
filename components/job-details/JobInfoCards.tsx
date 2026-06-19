import type { JobDetailsViewModel } from "@/components/job-details/types";

type Props = {
  job: JobDetailsViewModel;
};

type InfoCard = {
  label: string;
  value: string;
  tone: "success" | "info" | "accent" | "muted";
  iconPath: string;
};

function getToneClasses(tone: InfoCard["tone"]): string {
  if (tone === "success") {
    return "bg-success-lightest text-success";
  }

  if (tone === "info") {
    return "bg-info-lightest text-info-dark";
  }

  if (tone === "accent") {
    return "bg-accent-muted text-accent";
  }

  return "bg-surface-secondary text-text-secondary";
}

export function JobInfoCards({ job }: Props) {
  const cards: InfoCard[] = [
    {
      label: "Salary Est.",
      value: job.salary,
      tone: "success",
      iconPath: "M12 2v20m4-16H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H7",
    },
    {
      label: "Location",
      value: job.location,
      tone: "info",
      iconPath:
        "M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
    },
    {
      label: "Job Type",
      value: job.jobType,
      tone: "accent",
      iconPath: "M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1m-8 0h12v14H6V6Zm3 4v2m6-2v2",
    },
    {
      label: "Date Found",
      value: job.dateFound,
      tone: "muted",
      iconPath:
        "M8 2v4m8-4v4M4 9h16M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="flex min-h-20 items-center gap-4 rounded-xl border border-border bg-surface p-5 shadow-sm"
        >
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${getToneClasses(
              card.tone,
            )}`}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6">
              <path
                d={card.iconPath}
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-bold leading-6 text-text-primary">
              {card.value}
            </span>
            <span className="mt-1 block text-sm font-semibold uppercase leading-5 text-text-muted">
              {card.label}
            </span>
          </span>
        </article>
      ))}
    </section>
  );
}
