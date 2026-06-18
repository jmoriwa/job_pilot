type ProfileAttentionBannerProps = {
  completionPercentage: number;
  missingFields: string[];
};

export function ProfileAttentionBanner({
  completionPercentage,
  missingFields,
}: ProfileAttentionBannerProps) {
  const dashOffset = 100 - completionPercentage;

  return (
    <section className="mx-auto max-w-[1628px] rounded-xl border border-error/20 bg-surface p-14 shadow-sm">
      <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-error text-xl font-semibold leading-none text-error">
              !
            </span>
            <h1 className="text-4xl font-bold leading-10 text-text-primary">
              Profile needs attention
            </h1>
          </div>
          <p className="mt-7 max-w-[720px] text-2xl font-medium leading-9 text-text-dark">
            Complete the missing fields to improve your chance of getting tailored matches and
            generating quality resumes.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {missingFields.map((field) => (
              <span
                key={field}
                className="rounded-md bg-error/5 px-4 py-2 text-xl font-bold leading-7 text-error"
              >
                {field}
              </span>
            ))}
          </div>
        </div>
        <div
          aria-label={`Profile completion ${completionPercentage} percent`}
          className="relative mx-auto flex h-56 w-56 shrink-0 items-center justify-center rounded-full md:mx-0"
        >
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              fill="none"
              r="52"
              stroke="color-mix(in srgb, var(--color-error) 16%, var(--color-surface))"
              strokeWidth="16"
            />
            <circle
              cx="60"
              cy="60"
              fill="none"
              r="52"
              stroke="var(--color-error)"
              strokeDasharray="100"
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              strokeWidth="16"
              pathLength="100"
            />
          </svg>
          <div className="flex h-36 w-36 items-center justify-center rounded-full bg-surface">
            <span className="text-6xl font-bold leading-none text-text-primary">
              {completionPercentage}%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
