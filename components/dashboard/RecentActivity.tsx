export type ActivityTone = "accent" | "info" | "success";

export type ActivityItem = {
  label: string;
  timestamp: string;
  tone: ActivityTone;
};

const dotClasses: Record<ActivityTone, { outer: string; inner: string }> = {
  accent: {
    outer: "bg-accent-light",
    inner: "bg-accent",
  },
  info: {
    outer: "bg-info-light",
    inner: "bg-info",
  },
  success: {
    outer: "bg-success-light",
    inner: "bg-success-alt",
  },
};

type Props = {
  activities: ActivityItem[];
};

export function RecentActivity({ activities }: Props) {
  return (
    <section className="flex h-[472px] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <div className="shrink-0 border-b border-border px-8 py-7">
        <h2 className="text-xl font-semibold leading-7 text-text-primary">Recent Activity</h2>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-8 py-8">
        {activities.length > 0 ? (
          <ol className="space-y-8">
            {activities.map((activity, index) => {
              const classes = dotClasses[activity.tone];
              const hasConnector = index < activities.length - 1;

              return (
                <li key={`${activity.label}-${activity.timestamp}`} className="relative flex gap-6">
                  <div className="relative flex w-6 justify-center pt-1">
                    {hasConnector ? (
                      <span className="absolute left-1/2 top-6 h-14 w-px -translate-x-1/2 bg-border" />
                    ) : null}
                    <span
                      className={`relative flex h-4 w-4 items-center justify-center rounded-full ${classes.outer}`}
                    >
                      <span className={`h-2 w-2 rounded-full ${classes.inner}`} />
                    </span>
                  </div>
                  <div>
                    <p className="text-base font-semibold leading-6 text-text-primary">
                      {activity.label}
                    </p>
                    <p className="mt-2 text-sm font-medium leading-5 text-text-muted">
                      {activity.timestamp}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-base font-semibold leading-6 text-text-primary">
              No recent activity yet
            </p>
            <p className="mt-2 text-sm font-medium leading-5 text-text-muted">
              Search for jobs or research a company to see activity here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
