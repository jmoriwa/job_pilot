import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { researchCompanyForJob } from "@/agent/research";
import type { CompanyResearchDossier } from "@/components/job-details/types";
import { createInsforgeServer } from "@/lib/insforge-server";
import { captureServerEvent } from "@/lib/posthog-server";
import { normalizeProfile } from "@/lib/profile";

export const runtime = "nodejs";

type ResearchRequest = {
  jobId: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseResearchRequest(value: unknown): ResearchRequest | null {
  if (!isRecord(value) || typeof value.jobId !== "string") {
    return null;
  }

  const jobId = value.jobId.trim();

  return jobId ? { jobId } : null;
}

function stringFrom(record: unknown, key: string): string {
  if (!isRecord(record)) {
    return "";
  }

  const value = record[key];
  return typeof value === "string" ? value : "";
}

function stringArrayFrom(record: unknown, key: string): string[] {
  if (!isRecord(record) || !Array.isArray(record[key])) {
    return [];
  }

  return record[key].filter(
    (item: unknown): item is string => typeof item === "string" && item.trim().length > 0,
  );
}

async function captureCompanyResearched(
  userId: string,
  jobId: string,
  company: string,
): Promise<void> {
  try {
    await captureServerEvent({
      event: "company_researched",
      properties: {
        userId,
        jobId,
        company,
      },
    });
  } catch (error) {
    console.error("[api/agent/research] Could not capture company_researched event", error);
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    let requestBody: unknown;

    try {
      requestBody = await req.json();
    } catch (error) {
      console.error("[api/agent/research] Invalid JSON", error);
      return NextResponse.json(
        { success: false, error: "Send a valid company research request." },
        { status: 400 },
      );
    }

    const body = parseResearchRequest(requestBody);

    if (!body) {
      return NextResponse.json(
        { success: false, error: "Choose a job before researching the company." },
        { status: 400 },
      );
    }

    const insforge = await createInsforgeServer();
    const {
      data: { user },
      error: userError,
    } = await insforge.auth.getCurrentUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "Please sign in before researching a company." },
        { status: 401 },
      );
    }

    const { data: jobRecord, error: jobError } = await insforge.database
      .from("jobs")
      .select(
        "id, run_id, user_id, title, company, source_url, external_apply_url, about_role, match_reason, matched_skills, missing_skills",
      )
      .eq("id", body.jobId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (jobError) {
      console.error("[api/agent/research]", jobError);
      return NextResponse.json(
        { success: false, error: "Could not load this job." },
        { status: 500 },
      );
    }

    if (!jobRecord) {
      return NextResponse.json(
        { success: false, error: "Could not find that job." },
        { status: 404 },
      );
    }

    const { data: profileRecord, error: profileError } = await insforge.database
      .from("profiles")
      .select(
        "id, full_name, email, phone, location, current_title, experience_level, years_experience, skills, industries, work_experience, education, job_titles_seeking, remote_preference, preferred_locations, salary_expectation, cover_letter_tone, linkedin_url, portfolio_url, work_authorization, resume_pdf_url, resume_pdf_key, is_complete, completion_percentage, missing_fields",
      )
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("[api/agent/research]", profileError);
      return NextResponse.json(
        { success: false, error: "Could not load your profile." },
        { status: 500 },
      );
    }

    if (!profileRecord) {
      return NextResponse.json(
        { success: false, error: "Save your profile before researching companies." },
        { status: 404 },
      );
    }

    const job = {
      id: stringFrom(jobRecord, "id"),
      run_id: stringFrom(jobRecord, "run_id"),
      user_id: user.id,
      title: stringFrom(jobRecord, "title"),
      company: stringFrom(jobRecord, "company"),
      source_url: stringFrom(jobRecord, "source_url"),
      external_apply_url: stringFrom(jobRecord, "external_apply_url"),
      about_role: stringFrom(jobRecord, "about_role"),
      match_reason: stringFrom(jobRecord, "match_reason"),
      matched_skills: stringArrayFrom(jobRecord, "matched_skills"),
      missing_skills: stringArrayFrom(jobRecord, "missing_skills"),
    };

    if (!job.id || !job.title || !job.company) {
      return NextResponse.json(
        { success: false, error: "This job is missing details needed for research." },
        { status: 422 },
      );
    }

    const profile = normalizeProfile(profileRecord, user.id, user.email ?? "");
    const result = await researchCompanyForJob(job, profile);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 422 },
      );
    }

    const dossier: CompanyResearchDossier = result.dossier;
    const { error: updateError } = await insforge.database
      .from("jobs")
      .update({ company_research: dossier })
      .eq("id", job.id)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("[api/agent/research]", updateError);
      return NextResponse.json(
        { success: false, error: "Could not save company research." },
        { status: 500 },
      );
    }

    await captureCompanyResearched(user.id, job.id, job.company);
    revalidatePath(`/find-jobs/${job.id}`);

    return NextResponse.json({
      success: true,
      data: {
        dossier,
      },
    });
  } catch (error) {
    console.error("[api/agent/research]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
}
