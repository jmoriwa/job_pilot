type ActivityTone = "accent" | "info" | "success";

type ActivityItem = {
  label: string;
  timestamp: string;
  tone: ActivityTone;
};

const activities: ActivityItem[] = [
  {
    label: "Found 8 jobs for Frontend Engineer",
    timestamp: "10 mins ago",
    tone: "accent",
  },
  {
    label: "Researched Stripe",
    timestamp: "1 hour ago",
    tone: "info",
  },
  {
    label: "Found 12 jobs for React Developer",
    timestamp: "2 hours ago",
    tone: "success",
  },
  {
    label: "Researched Vercel",
    timestamp: "Yesterday",
    tone: "accent",
  },
  {
    label: "Found 10 jobs for Full Stack Engineer",
    timestamp: "Yesterday",
    tone: "success",
  },
];

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

export function RecentActivity() {
  return (
    <section className="rounded-xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border px-8 py-7">
        <h2 className="text-xl font-semibold leading-7 text-text-primary">Recent Activity</h2>
      </div>
      <div className="px-8 py-8">
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
      </div>
    </section>
  );
}
