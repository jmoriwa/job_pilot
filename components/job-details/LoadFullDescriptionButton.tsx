type Props = {
  applyUrl: string;
};

export function LoadFullDescriptionButton({ applyUrl }: Props) {
  return (
    <div className="mt-6 rounded-xl border border-border bg-surface-secondary p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium leading-5 text-text-secondary">
          This source only provided a preview. Open the original post to read the full description.
        </p>
        <a
          href={applyUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold leading-5 text-accent-foreground shadow-sm transition hover:bg-accent-dark"
        >
          Open source
        </a>
      </div>
    </div>
  );
}
