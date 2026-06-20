import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { ProfileAttentionBanner } from "@/components/profile/ProfileAttentionBanner";
import { ProfileFormShell } from "@/components/profile/ProfileFormShell";
import { createInsforgeServer } from "@/lib/insforge-server";
import { normalizeProfile } from "@/lib/profile";

export default async function ProfilePage() {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
  } = await insforge.auth.getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profileRecord, error: profileError } = await insforge.database
    .from("profiles")
    .select(
      "id, full_name, email, phone, location, current_title, experience_level, years_experience, skills, industries, work_experience, education, job_titles_seeking, remote_preference, preferred_locations, salary_expectation, cover_letter_tone, linkedin_url, portfolio_url, work_authorization, resume_pdf_url, resume_pdf_key, is_complete, completion_percentage, missing_fields",
    )
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("[app/profile]", profileError);
  }

  const profile = normalizeProfile(profileRecord, user.id, user.email ?? "");

  return (
    <div className="min-h-screen bg-background">
      <AppHeader userId={user.id} activeHref="/profile" />
      <main className="space-y-14 px-8 py-14">
        {!profile.is_complete ? (
          <ProfileAttentionBanner
            completionPercentage={profile.completion_percentage}
            missingFields={profile.missing_fields}
          />
        ) : null}
        <ProfileFormShell initialProfile={profile} />
      </main>
    </div>
  );
}
