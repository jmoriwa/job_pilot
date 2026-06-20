type BarPoint = {
  label: string;
  value: number;
};

export type DailyAnalyticsPoint = {
  date: string;
  label: string;
  value: number;
};

export type MatchScoreBucketPoint = {
  label: string;
  value: number;
};

export type DashboardAnalytics = {
  companyResearchActivity: DailyAnalyticsPoint[];
  jobsFoundOverTime: DailyAnalyticsPoint[];
  matchScoreDistribution: MatchScoreBucketPoint[];
};

const HEIGHT_CLASSES = [
  "h-4",
  "h-8",
  "h-12",
  "h-16",
  "h-20",
  "h-24",
  "h-28",
  "h-32",
  "h-36",
  "h-40",
  "h-44",
  "h-48",
  "h-52",
  "h-56",
];

function hasValues(data: BarPoint[]): boolean {
  return data.some((point) => point.value > 0);
}

function maxValue(data: BarPoint[]): number {
  return Math.max(...data.map((point) => point.value), 0);
}

function heightClassForValue(value: number, max: number): string {
  if (value <= 0 || max <= 0) {
    return "h-4";
  }

  const index = Math.max(
    0,
    Math.min(HEIGHT_CLASSES.length - 1, Math.ceil((value / max) * HEIGHT_CLASSES.length) - 1),
  );

  return HEIGHT_CLASSES[index];
}

function axisLabelsForMax(max: number): string[] {
  if (max <= 0) {
    return ["4", "3", "2", "1", "0"];
  }

  const roundedMax = Math.max(4, Math.ceil(max / 4) * 4);

  return [1, 0.75, 0.5, 0.25, 0].map((multiplier) =>
    Math.round(roundedMax * multiplier).toString(),
  );
}

function xAxisLabelsForLine(data: DailyAnalyticsPoint[]): string[] {
  if (data.length <= 7) {
    return data.map((point) => point.label);
  }

  return data.filter((_, index) => index % 5 === 0 || index === data.length - 1).map((point) => point.label);
}

function ChartGrid({ labels }: { labels: string[] }) {
  return (
    <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between">
      {labels.map((label) => (
        <div key={label} className="flex items-start gap-3">
          <span className="w-10 text-right text-sm font-normal leading-5 text-text-muted">
            {label}
          </span>
          <span className="mt-0.5 flex-1 border-t border-dashed border-border" />
        </div>
      ))}
    </div>
  );
}

function BarChart({
  barClassName,
  compactLabels = false,
  data,
}: {
  barClassName: string;
  compactLabels?: boolean;
  data: BarPoint[];
}) {
  const max = maxValue(data);
  const axisLabels = axisLabelsForMax(max);

  return (
    <div className="mt-14">
      <div className="relative h-72">
        <ChartGrid labels={axisLabels} />
        <div className="absolute bottom-0 left-14 right-0 top-0 flex items-end justify-between gap-5">
          {data.map((point) => (
            <div key={point.label} className="flex h-full flex-1 flex-col justify-end">
              <div
                aria-label={`${point.label}: ${point.value}`}
                className={`mx-auto w-full max-w-16 rounded-md ${barClassName} ${heightClassForValue(point.value, max)}`}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="ml-14 mt-4 flex justify-between gap-5">
        {data.map((point) => (
          <span
            key={point.label}
            className="min-w-0 flex-1 text-center text-sm font-medium leading-5 text-text-muted"
          >
            {compactLabels ? (
              <>
                <span className="block">{point.label.replace("%", "")}</span>
                <span className="block">%</span>
              </>
            ) : (
              point.label
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

function chartPath(data: DailyAnalyticsPoint[]): { fillPath: string; linePath: string } {
  const max = Math.max(...data.map((point) => point.value), 1);
  const width = 700;
  const height = 260;
  const topPadding = 16;
  const bottomPadding = 22;
  const usableHeight = height - topPadding - bottomPadding;
  const lastIndex = Math.max(1, data.length - 1);
  const points = data.map((point, index) => {
    const x = Math.round((index / lastIndex) * width);
    const y = Math.round(height - bottomPadding - (point.value / max) * usableHeight);

    return `${x} ${y}`;
  });
  const linePath = points.length > 0 ? `M${points.join(" L")}` : "";
  const fillPath = linePath ? `${linePath} L${width} ${height} L0 ${height} Z` : "";

  return { fillPath, linePath };
}

function JobsFoundLineChart({ data }: { data: DailyAnalyticsPoint[] }) {
  const { fillPath, linePath } = chartPath(data);
  const axisLabels = axisLabelsForMax(maxValue(data));
  const xAxisLabels = xAxisLabelsForLine(data);

  return (
    <div className="mt-14">
      <div className="relative h-72 overflow-hidden">
        <ChartGrid labels={axisLabels} />
        <svg
          aria-label="Jobs found over time"
          className="absolute bottom-0 left-14 right-0 top-2 h-[calc(100%-0.5rem)] w-[calc(100%-3.5rem)] text-accent"
          preserveAspectRatio="none"
          role="img"
          viewBox="0 0 700 260"
        >
          <defs>
            <linearGradient id="jobs-found-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.24" />
              <stop offset="100%" stopColor="var(--color-surface)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={fillPath} fill="url(#jobs-found-fill)" />
          <path
            d={linePath}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="4"
          />
        </svg>
      </div>
      <div className="ml-14 mt-4 flex justify-between">
        {xAxisLabels.map((label) => (
          <span key={label} className="whitespace-nowrap text-sm font-medium leading-5 text-text-muted">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="mt-14 flex h-72 items-center justify-center rounded-xl bg-surface-secondary px-6 text-center">
      <p className="max-w-sm text-sm font-medium leading-5 text-text-muted">{message}</p>
    </div>
  );
}

function companyResearchPoints(data: DailyAnalyticsPoint[]): BarPoint[] {
  return data.map((point) => ({
    label: point.label,
    value: point.value,
  }));
}

function matchScorePoints(data: MatchScoreBucketPoint[]): BarPoint[] {
  return data.map((point) => ({
    label: point.label,
    value: point.value,
  }));
}

type Props = {
  analytics: DashboardAnalytics;
};

export function AnalyticsCharts({ analytics }: Props) {
  const companyResearchData = companyResearchPoints(analytics.companyResearchActivity);
  const matchScoreData = matchScorePoints(analytics.matchScoreDistribution);
  const hasCompanyResearch = hasValues(companyResearchData);
  const hasJobsFound = hasValues(analytics.jobsFoundOverTime);
  const hasMatchScores = hasValues(matchScoreData);

  return (
    <>
      <section className="self-start rounded-xl border border-border bg-surface p-8 shadow-sm xl:col-span-6">
        <h2 className="text-xl font-semibold leading-7 text-text-primary">
          Company Research Activity
        </h2>
        {hasCompanyResearch ? (
          <BarChart barClassName="bg-info" data={companyResearchData} />
        ) : (
          <EmptyChart message="No company research activity has been saved yet." />
        )}
      </section>
      <section className="rounded-xl border border-border bg-surface p-8 shadow-sm xl:col-span-8">
        <h2 className="text-xl font-semibold leading-7 text-text-primary">
          Jobs Found Over Time
        </h2>
        {hasJobsFound ? (
          <JobsFoundLineChart data={analytics.jobsFoundOverTime} />
        ) : (
          <EmptyChart message="No jobs have been found in the last 30 days." />
        )}
      </section>
      <section className="rounded-xl border border-border bg-surface p-8 shadow-sm xl:col-span-4">
        <h2 className="text-xl font-semibold leading-7 text-text-primary">
          Match Score Distribution
        </h2>
        {hasMatchScores ? (
          <BarChart barClassName="bg-success" compactLabels data={matchScoreData} />
        ) : (
          <EmptyChart message="No match scores have been saved yet." />
        )}
      </section>
    </>
  );
}
