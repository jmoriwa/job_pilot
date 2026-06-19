type StatCard = {
  label: string;
  value: string;
  trend?: string;
  helper: string;
};

const stats: StatCard[] = [
  {
    label: "Total Jobs Found",
    value: "284",
    trend: "+12%",
    helper: "vs last week",
  },
  {
    label: "Avg. Match Rate",
    value: "82%",
    trend: "+3%",
    helper: "vs last week",
  },
  {
    label: "Companies Researched",
    value: "35",
    helper: "Total researched",
  },
  {
    label: "Jobs This Week",
    value: "28",
    helper: "New this week",
  },
];

export function StatsBar() {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className="rounded-xl border border-border bg-surface p-8 shadow-sm"
        >
          <p className="text-base font-semibold leading-6 text-text-secondary">{stat.label}</p>
          <p className="mt-2 text-4xl font-semibold leading-10 text-text-primary">{stat.value}</p>
          <div className="mt-4 flex items-center gap-3">
            {stat.trend ? (
              <span className="rounded-sm bg-success-lightest px-3 py-1 text-sm font-semibold leading-5 text-success-darker">
                {stat.trend}
              </span>
            ) : null}
            <span className="text-sm font-medium leading-5 text-text-muted">{stat.helper}</span>
          </div>
        </article>
      ))}
    </section>
  );
}
