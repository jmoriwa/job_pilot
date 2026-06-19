type BarPoint = {
  label: string;
  value: number;
  heightClass: string;
};

const companyResearchData: BarPoint[] = [
  { label: "Mon", value: 2, heightClass: "h-12" },
  { label: "Tue", value: 5, heightClass: "h-24" },
  { label: "Wed", value: 3, heightClass: "h-16" },
  { label: "Thu", value: 8, heightClass: "h-36" },
  { label: "Fri", value: 12, heightClass: "h-56" },
  { label: "Sat", value: 4, heightClass: "h-20" },
  { label: "Sun", value: 1, heightClass: "h-8" },
];

const matchScoreData: BarPoint[] = [
  { label: "50-60%", value: 5, heightClass: "h-4" },
  { label: "60-70%", value: 15, heightClass: "h-14" },
  { label: "70-80%", value: 45, heightClass: "h-32" },
  { label: "80-90%", value: 85, heightClass: "h-56" },
  { label: "90-100%", value: 35, heightClass: "h-24" },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function ChartGrid({ labels }: { labels: string[] }) {
  return (
    <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between">
      {labels.map((label) => (
        <div key={label} className="flex items-start gap-3">
          <span className="w-10 -translate-y-2 text-right text-sm font-normal leading-5 text-text-muted">
            {label}
          </span>
          <span className="mt-0.5 flex-1 border-t border-dashed border-border" />
        </div>
      ))}
    </div>
  );
}

function BarChart({
  axisLabels,
  barClassName,
  data,
}: {
  axisLabels: string[];
  barClassName: string;
  data: BarPoint[];
}) {
  return (
    <div className="mt-14">
      <div className="relative h-72">
        <ChartGrid labels={axisLabels} />
        <div className="absolute bottom-0 left-14 right-0 top-0 flex items-end justify-between gap-5">
          {data.map((point) => (
            <div key={point.label} className="flex h-full flex-1 flex-col justify-end">
              <div
                aria-label={`${point.label}: ${point.value}`}
                className={`mx-auto w-full max-w-16 rounded-md ${barClassName} ${point.heightClass}`}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="ml-14 mt-4 flex justify-between gap-5">
        {data.map((point) => (
          <span
            key={point.label}
            className="min-w-0 flex-1 whitespace-nowrap text-center text-sm font-medium leading-5 text-text-muted"
          >
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function JobsFoundLineChart() {
  return (
    <div className="mt-14">
      <div className="relative h-72 overflow-hidden">
        <ChartGrid labels={["100", "75", "50", "25", "0"]} />
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
          <path
            d="M0 235 C58 160 92 130 140 132 C206 135 220 174 294 170 C360 166 392 95 470 66 C532 42 575 31 620 97 C650 142 666 193 700 240 L700 260 L0 260 Z"
            fill="url(#jobs-found-fill)"
          />
          <path
            d="M0 235 C58 160 92 130 140 132 C206 135 220 174 294 170 C360 166 392 95 470 66 C532 42 575 31 620 97 C650 142 666 193 700 240"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="4"
          />
        </svg>
      </div>
      <div className="ml-14 mt-4 flex justify-between">
        {days.map((day) => (
          <span key={day} className="whitespace-nowrap text-sm font-medium leading-5 text-text-muted">
            {day}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsCharts() {
  return (
    <>
      <section className="rounded-xl border border-border bg-surface p-8 shadow-sm xl:col-span-6">
        <h2 className="text-xl font-semibold leading-7 text-text-primary">
          Company Research Activity
        </h2>
        <BarChart
          axisLabels={["12", "9", "6", "3", "0"]}
          barClassName="bg-info"
          data={companyResearchData}
        />
      </section>
      <section className="rounded-xl border border-border bg-surface p-8 shadow-sm xl:col-span-8">
        <h2 className="text-xl font-semibold leading-7 text-text-primary">
          Jobs Found Over Time
        </h2>
        <JobsFoundLineChart />
      </section>
      <section className="rounded-xl border border-border bg-surface p-8 shadow-sm xl:col-span-4">
        <h2 className="text-xl font-semibold leading-7 text-text-primary">
          Match Score Distribution
        </h2>
        <BarChart
          axisLabels={["100", "75", "50", "25", "0"]}
          barClassName="bg-success"
          data={matchScoreData}
        />
      </section>
    </>
  );
}
