import { redirect } from "next/navigation";
import { AnalyticsCharts } from "@/components/dashboard/AnalyticsCharts";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { AppHeader } from "@/components/layout/AppHeader";
import { createInsforgeServer } from "@/lib/insforge-server";

export default async function DashboardPage() {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
  } = await insforge.auth.getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader activeHref="/dashboard" showSignOut={false} userId={user.id} />
      <main className="px-8 py-12">
        <div className="mx-auto max-w-[2360px] space-y-10">
          <StatsBar />
          <div className="grid grid-cols-1 gap-10 xl:grid-cols-12">
            <div className="xl:col-span-6">
              <RecentActivity />
            </div>
            <AnalyticsCharts />
          </div>
        </div>
      </main>
    </div>
  );
}
