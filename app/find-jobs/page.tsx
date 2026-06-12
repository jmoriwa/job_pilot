import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { createInsforgeServer } from "@/lib/insforge-server";

export default async function FindJobsPage() {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
  } = await insforge.auth.getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="px-8 py-8">
        <section className="mx-auto max-w-[1280px] rounded-xl border border-border bg-surface p-6 shadow-sm">
          <p className="text-sm font-medium leading-5 text-text-secondary">Find Jobs</p>
          <h1 className="mt-2 text-2xl font-semibold leading-8 text-text-primary">
            Job discovery will live here
          </h1>
        </section>
      </main>
    </div>
  );
}
