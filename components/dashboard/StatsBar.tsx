type StatCard = {
  label: string;
  value: string;
  helper: string;
};

export type DashboardStats = {
  totalJobsFound: number;
  averageMatchRate: number;
  companiesResearched: number;
  jobsThisWeek: number;
};

type Props = {
  stats: DashboardStats;
};

function buildStatCards(stats: DashboardStats): StatCard[] {
  return [
    {
      label: "Total Jobs Found",
      value: stats.totalJobsFound.toLocaleString("en-US"),
      helper: "Saved job matches",
    },
    {
      label: "Avg. Match Rate",
      value: `${stats.averageMatchRate}%`,
      helper: "Across saved jobs",
    },
    {
      label: "Companies Researched",
      value: stats.companiesResearched.toLocaleString("en-US"),
      helper: "Total researched",
    },
    {
      label: "Jobs This Week",
      value: stats.jobsThisWeek.toLocaleString("en-US"),
      helper: "New this week",
    },
  ];
}

export function StatsBar({ stats }: Props) {
  const statCards = buildStatCards(stats);

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {statCards.map((stat) => (
        <article
          key={stat.label}
          className="rounded-xl border border-border bg-surface p-8 shadow-sm"
        >
          <p className="text-base font-semibold leading-6 text-text-secondary">{stat.label}</p>
          <p className="mt-2 text-4xl font-semibold leading-10 text-text-primary">{stat.value}</p>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm font-medium leading-5 text-text-muted">{stat.helper}</span>
          </div>
        </article>
      ))}
    </section>
  );
}
