import type { JobDetailsViewModel } from "@/components/job-details/types";
import { ResearchCompanyButton } from "@/components/job-details/ResearchCompanyButton";

type Props = {
  job: JobDetailsViewModel;
};

export function CompanyResearchCard({ job }: Props) {
  const research = job.companyResearch;

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <div className="flex flex-col gap-5 border-b border-border p-7 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-muted text-accent">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
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
          <h2 className="text-xl font-bold leading-7 text-text-primary">
            Company Research
          </h2>
        </div>
        <ResearchCompanyButton jobId={job.id} />
      </div>

      {research ? (
        <div className="space-y-8 p-7">
          <DossierSection title="Company Overview">
            <p className="text-base font-semibold leading-7 text-text-primary">
              {research.companyOverview}
            </p>
          </DossierSection>

          <DossierSection title="Tech Stack">
            <TagList items={research.techStack} emptyText="No specific technologies were found." />
          </DossierSection>

          <DossierSection title="Culture">
            <BulletList items={research.culture} emptyText="No culture signals were found." />
          </DossierSection>

          <DossierSection title="Why This Role">
            <p className="text-base font-semibold leading-7 text-text-primary">
              {research.whyThisRole}
            </p>
          </DossierSection>

          <DossierSection title="Your Edge">
            <BulletList items={research.yourEdge} emptyText="No candidate-specific edge was found." />
          </DossierSection>

          <DossierSection title="Gaps to Address">
            <BulletList
              items={research.gapsToAddress}
              emptyText="No gap strategy was generated."
            />
          </DossierSection>

          <DossierSection title="Smart Questions">
            <BulletList items={research.smartQuestions} emptyText="No questions were generated." />
          </DossierSection>

          <DossierSection title="Interview Prep">
            <BulletList items={research.interviewPrep} emptyText="No prep topics were generated." />
          </DossierSection>

          <DossierSection title="Sources">
            {research.sources.length > 0 ? (
              <div className="flex flex-col gap-2">
                {research.sources.map((source) => (
                  <a
                    key={source}
                    href={source}
                    target="_blank"
                    rel="noreferrer"
                    className="break-words text-sm font-medium leading-5 text-text-secondary transition hover:text-accent"
                  >
                    {source}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm font-medium leading-5 text-text-muted">
                No source pages were saved.
              </p>
            )}
          </DossierSection>
        </div>
      ) : (
        <div className="flex min-h-72 flex-col items-center justify-center px-8 py-14 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-secondary text-text-secondary">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7">
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
          <p className="mt-5 text-base font-bold leading-6 text-text-primary">
            No research yet
          </p>
          <p className="mt-3 max-w-sm text-base font-medium leading-6 text-text-muted">
            Click &quot;Research Company&quot; to let the AI browse {job.company}&apos;s public
            pages and build a dossier.
          </p>
        </div>
      )}
    </section>
  );
}

type DossierSectionProps = {
  title: string;
  children: React.ReactNode;
};

function DossierSection({ title, children }: DossierSectionProps) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase leading-5 text-text-secondary">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

type ListProps = {
  items: string[];
  emptyText: string;
};

function BulletList({ items, emptyText }: ListProps) {
  if (items.length === 0) {
    return <p className="text-sm font-medium leading-5 text-text-muted">{emptyText}</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-base font-semibold leading-7 text-text-primary">
          <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function TagList({ items, emptyText }: ListProps) {
  if (items.length === 0) {
    return <p className="text-sm font-medium leading-5 text-text-muted">{emptyText}</p>;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-accent-muted px-4 py-1 text-sm font-semibold leading-5 text-accent"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
