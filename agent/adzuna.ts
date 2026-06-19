import { scoreJobAgainstProfile } from "@/agent/matcher";
import type { JobMatch, MatchingProfile } from "@/agent/types";
import {
  detectAdzunaCountry,
  fetchFullJobDescription,
  isLikelyTruncatedDescription,
  searchJobs,
  type AdzunaJob,
} from "@/lib/adzuna";
import { createInsforgeServer } from "@/lib/insforge-server";
import { captureServerEvent } from "@/lib/posthog-server";
import { MATCH_THRESHOLD } from "@/lib/utils";

type DiscoverJobsSuccess = {
  success: true;
  jobsFound: number;
  strongMatches: number;
};

type DiscoverJobsFailure = {
  success: false;
  error: string;
};

export type DiscoverJobsResult = DiscoverJobsSuccess | DiscoverJobsFailure;

type JobMutation = {
  run_id: string;
  user_id: string;
  source: "search";
  source_url: string;
  external_apply_url: string;
  title: string;
  company: string;
  location: string | null;
  salary: string | null;
  job_type: "fulltime" | "parttime" | "contract";
  about_role: string | null;
  responsibilities: string[];
  requirements: string[];
  nice_to_have: string[];
  benefits: string[];
  about_company: string | null;
  match_score: number;
  match_reason: string;
  matched_skills: string[];
  missing_skills: string[];
  found_at: string;
};

async function logAgentMessage(
  runId: string,
  userId: string,
  message: string,
  level: "info" | "success" | "warning" | "error",
): Promise<void> {
  const insforge = await createInsforgeServer();
  const { error } = await insforge.database.from("agent_logs").insert([
    {
      run_id: runId,
      user_id: userId,
      message,
      level,
    },
  ]);

  if (error) {
    console.error("[agent/adzuna] Could not write agent log", error);
  }
}

function formatSalary(job: AdzunaJob): string | null {
  if (typeof job.salary_min === "number" && typeof job.salary_max === "number") {
    return `$${Math.round(job.salary_min / 1000)}k - $${Math.round(job.salary_max / 1000)}k`;
  }

  if (typeof job.salary_min === "number") {
    return `$${Math.round(job.salary_min / 1000)}k+`;
  }

  if (typeof job.salary_max === "number") {
    return `Up to $${Math.round(job.salary_max / 1000)}k`;
  }

  return null;
}

function normalizeJobType(contractType: string | undefined): "fulltime" | "parttime" | "contract" {
  const normalized = contractType?.toLowerCase() ?? "";

  if (normalized.includes("part")) {
    return "parttime";
  }

  if (normalized.includes("contract") || normalized.includes("temp")) {
    return "contract";
  }

  return "fulltime";
}

function buildJobMutation(
  job: AdzunaJob,
  match: JobMatch,
  runId: string,
  userId: string,
): JobMutation {
  return {
    run_id: runId,
    user_id: userId,
    source: "search",
    source_url: job.redirect_url,
    external_apply_url: job.redirect_url,
    title: job.title,
    company: job.company.display_name,
    location: job.location.display_name || null,
    salary: formatSalary(job),
    job_type: normalizeJobType(job.contract_type),
    about_role: job.description || null,
    responsibilities: [],
    requirements: [],
    nice_to_have: [],
    benefits: [],
    about_company: null,
    match_score: match.matchScore,
    match_reason: match.matchReason,
    matched_skills: match.matchedSkills,
    missing_skills: match.missingSkills,
    found_at: new Date().toISOString(),
  };
}

async function enrichJobDescription(
  job: AdzunaJob,
  runId: string,
  userId: string,
): Promise<AdzunaJob> {
  if (!isLikelyTruncatedDescription(job.description)) {
    return job;
  }

  const fullDescription = await fetchFullJobDescription(job.redirect_url);

  if (!fullDescription || fullDescription.length <= job.description.length) {
    await logAgentMessage(
      runId,
      userId,
      `Could not expand the job description for ${job.title} at ${job.company.display_name}.`,
      "warning",
    );
    return job;
  }

  return {
    ...job,
    description: fullDescription,
  };
}

async function captureJobFound(userId: string, matchScore: number): Promise<void> {
  try {
    await captureServerEvent({
      event: "job_found",
      properties: {
        userId,
        source: "search",
        matchScore,
      },
    });
  } catch (error) {
    console.error("[agent/adzuna] Could not capture job_found event", error);
  }
}

export async function discoverJobs(
  jobTitle: string,
  location: string,
  profile: MatchingProfile,
  runId: string,
  userId: string,
): Promise<DiscoverJobsResult> {
  try {
    await logAgentMessage(runId, userId, `Searching Adzuna for ${jobTitle}.`, "info");

    const country = detectAdzunaCountry(location);
    const adzunaJobs = await searchJobs(jobTitle, location, country);
    const mutations: JobMutation[] = [];
    let scoreFailureCount = 0;

    for (const job of adzunaJobs) {
      const enrichedJob = await enrichJobDescription(job, runId, userId);
      const scored = await scoreJobAgainstProfile(enrichedJob, profile);

      if (!scored.success) {
        scoreFailureCount += 1;
        await logAgentMessage(
          runId,
          userId,
          `Could not score ${job.title} at ${job.company.display_name}.`,
          "warning",
        );
        continue;
      }

      mutations.push(buildJobMutation(enrichedJob, scored.match, runId, userId));
    }

    if (adzunaJobs.length > 0 && mutations.length === 0) {
      await logAgentMessage(
        runId,
        userId,
        "Adzuna returned jobs, but none could be scored.",
        "error",
      );

      return {
        success: false,
        error: "Could not score any jobs. Check the AI configuration and try again.",
      };
    }

    if (mutations.length > 0) {
      const insforge = await createInsforgeServer();
      const { error } = await insforge.database.from("jobs").insert(mutations);

      if (error) {
        console.error("[agent/adzuna]", error);
        await logAgentMessage(runId, userId, "Could not save discovered jobs.", "error");

        return {
          success: false,
          error: "Could not save discovered jobs.",
        };
      }

      await Promise.all(mutations.map((job) => captureJobFound(userId, job.match_score)));
    }

    const strongMatches = mutations.filter((job) => job.match_score >= MATCH_THRESHOLD).length;
    const skippedText =
      scoreFailureCount > 0 ? ` Skipped ${scoreFailureCount} unscored jobs.` : "";

    await logAgentMessage(
      runId,
      userId,
      `Saved ${mutations.length} scored jobs and ${strongMatches} strong matches.${skippedText}`,
      "success",
    );

    return {
      success: true,
      jobsFound: mutations.length,
      strongMatches,
    };
  } catch (error) {
    console.error("[agent/adzuna]", error);
    await logAgentMessage(
      runId,
      userId,
      "Job discovery failed before results could be saved.",
      "error",
    );

    return {
      success: false,
      error: error instanceof Error ? error.message : "Job discovery failed.",
    };
  }
}
