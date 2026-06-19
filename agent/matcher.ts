import OpenAI, { APIError } from "openai";
import type { JobMatch, MatchingProfile } from "@/agent/types";
import type { AdzunaJob } from "@/lib/adzuna";

type JobMatchSuccess = {
  success: true;
  match: JobMatch;
};

type JobMatchFailure = {
  success: false;
  error: string;
};

export type JobMatchResult = JobMatchSuccess | JobMatchFailure;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringFrom(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function stringArrayFrom(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function scoreFrom(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function parseMatch(content: string): JobMatch | null {
  const parsed: unknown = JSON.parse(content);

  if (!isRecord(parsed)) {
    return null;
  }

  return {
    matchScore: scoreFrom(parsed.matchScore),
    matchReason: stringFrom(parsed.matchReason),
    matchedSkills: stringArrayFrom(parsed.matchedSkills),
    missingSkills: stringArrayFrom(parsed.missingSkills),
  };
}

function getOpenAiErrorMessage(error: unknown): string {
  if (error instanceof APIError) {
    console.error("[agent/matcher] OpenAI API error", {
      status: error.status,
      type: error.type,
      code: error.code,
      requestID: error.requestID,
    });

    if (error.status === 401 || error.status === 403) {
      return "Job matching could not authenticate with OpenAI.";
    }

    if (error.status === 429) {
      return "OpenAI is rate limiting job matching right now.";
    }

    return "OpenAI could not score this job.";
  }

  console.error("[agent/matcher] OpenAI request failed", error);

  return error instanceof Error
    ? `OpenAI request failed before scoring this job: ${error.message}`
    : "OpenAI request failed before scoring this job.";
}

export async function scoreJobAgainstProfile(
  job: AdzunaJob,
  profile: MatchingProfile,
): Promise<JobMatchResult> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      success: false,
      error: "Job matching is not configured.",
    };
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content:
            "You score software jobs against a candidate profile. Return only valid JSON with matchScore, matchReason, matchedSkills, and missingSkills. Be specific, conservative, and do not invent job requirements.",
        },
        {
          role: "user",
          content: `JOB:
Title: ${job.title}
Company: ${job.company.display_name}
Location: ${job.location.display_name}
Description snippet: ${job.description}

CANDIDATE PROFILE:
Current title: ${profile.current_title}
Experience level: ${profile.experience_level}
Years experience: ${profile.years_experience}
Skills: ${profile.skills.join(", ")}
Industries: ${profile.industries.join(", ")}
Target roles: ${profile.job_titles_seeking.join(", ")}
Remote preference: ${profile.remote_preference}
Preferred locations: ${profile.preferred_locations.join(", ")}
Salary expectation: ${profile.salary_expectation}
Work history: ${JSON.stringify(profile.work_experience)}

Return JSON:
{
  "matchScore": number,
  "matchReason": "one paragraph",
  "matchedSkills": ["string"],
  "missingSkills": ["string"]
}`,
        },
      ],
    });

    const content = response.choices[0]?.message.content ?? "";

    if (!content) {
      return {
        success: false,
        error: "OpenAI returned an empty job match.",
      };
    }

    const match = parseMatch(content);

    if (!match) {
      return {
        success: false,
        error: "OpenAI returned an incomplete job match.",
      };
    }

    return {
      success: true,
      match,
    };
  } catch (error) {
    return {
      success: false,
      error: getOpenAiErrorMessage(error),
    };
  }
}
