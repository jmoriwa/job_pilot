import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { discoverJobs } from "@/agent/adzuna";
import { createInsforgeServer } from "@/lib/insforge-server";
import { captureServerEvent } from "@/lib/posthog-server";
import { normalizeProfile } from "@/lib/profile";

export const runtime = "nodejs";

type FindJobsRequest = {
  jobTitle: string;
  location: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseFindJobsRequest(value: unknown): FindJobsRequest | null {
  if (!isRecord(value)) {
    return null;
  }

  const jobTitle = typeof value.jobTitle === "string" ? value.jobTitle.trim() : "";
  const location = typeof value.location === "string" ? value.location.trim() : "";

  if (!jobTitle) {
    return null;
  }

  return {
    jobTitle,
    location,
  };
}

function getStringField(record: unknown, field: string): string {
  if (!isRecord(record)) {
    return "";
  }

  const value = record[field];

  return typeof value === "string" ? value : "";
}

async function captureJobSearchStarted(
  userId: string,
  jobTitle: string,
  location: string,
): Promise<void> {
  try {
    await captureServerEvent({
      event: "job_search_started",
      properties: {
        userId,
        jobTitle,
        location,
      },
    });
  } catch (error) {
    console.error("[api/agent/find] Could not capture job_search_started event", error);
  }
}

async function updateRun(
  runId: string,
  userId: string,
  status: "completed" | "failed",
  jobsFound: number,
  errorMessage?: string,
): Promise<void> {
  const insforge = await createInsforgeServer();
  const { error } = await insforge.database
    .from("agent_runs")
    .update({
      status,
      jobs_found: jobsFound,
      error_message: errorMessage ?? null,
      completed_at: new Date().toISOString(),
    })
    .eq("id", runId)
    .eq("user_id", userId);

  if (error) {
    console.error("[api/agent/find] Could not update agent run", error);
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    let requestBody: unknown;

    try {
      requestBody = await req.json();
    } catch (error) {
      console.error("[api/agent/find] Invalid JSON", error);
      return NextResponse.json(
        { success: false, error: "Send a valid job search request." },
        { status: 400 },
      );
    }

    const body = parseFindJobsRequest(requestBody);

    if (!body) {
      return NextResponse.json(
        { success: false, error: "Enter a job title before searching." },
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
        { success: false, error: "Please sign in before finding jobs." },
        { status: 401 },
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
      console.error("[api/agent/find]", profileError);
      return NextResponse.json(
        { success: false, error: "Could not load your profile." },
        { status: 500 },
      );
    }

    if (!profileRecord) {
      return NextResponse.json(
        { success: false, error: "Save your profile before finding jobs." },
        { status: 404 },
      );
    }

    const profile = normalizeProfile(profileRecord, user.id, user.email ?? "");
    const { data: runRecord, error: runError } = await insforge.database
      .from("agent_runs")
      .insert([
        {
          user_id: user.id,
          status: "running",
          job_title_searched: body.jobTitle,
          location_searched: body.location || null,
          jobs_found: 0,
        },
      ])
      .select("id")
      .single();

    if (runError || !runRecord) {
      console.error("[api/agent/find]", runError);
      return NextResponse.json(
        { success: false, error: "Could not start the job search." },
        { status: 500 },
      );
    }

    const runId = getStringField(runRecord, "id");

    if (!runId) {
      return NextResponse.json(
        { success: false, error: "Could not start the job search." },
        { status: 500 },
      );
    }

    await captureJobSearchStarted(user.id, body.jobTitle, body.location);

    const discovery = await discoverJobs(
      body.jobTitle,
      body.location,
      profile,
      runId,
      user.id,
    );

    if (!discovery.success) {
      await updateRun(runId, user.id, "failed", 0, discovery.error);

      return NextResponse.json(
        { success: false, error: discovery.error },
        { status: 422 },
      );
    }

    await updateRun(runId, user.id, "completed", discovery.jobsFound);
    revalidatePath("/find-jobs");

    return NextResponse.json({
      success: true,
      data: {
        runId,
        jobsFound: discovery.jobsFound,
        strongMatches: discovery.strongMatches,
      },
    });
  } catch (error) {
    console.error("[api/agent/find]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
}
