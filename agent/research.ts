import OpenAI, { APIError } from "openai";
import { z } from "zod";
import { Stagehand } from "@browserbasehq/stagehand";
import type { CompanyResearchDossier } from "@/components/job-details/types";
import { createBrowserbaseClient } from "@/lib/browserbase";
import type { ProfileFormValues } from "@/lib/profile";

type ResearchJob = {
  id: string;
  run_id: string;
  user_id: string;
  title: string;
  company: string;
  source_url: string;
  external_apply_url: string;
  about_role: string;
  match_reason: string;
  matched_skills: string[];
  missing_skills: string[];
};

type CompanyResearchSuccess = {
  success: true;
  dossier: CompanyResearchDossier;
};

type CompanyResearchFailure = {
  success: false;
  error: string;
};

export type CompanyResearchResult = CompanyResearchSuccess | CompanyResearchFailure;

type ResearchLogLevel = "info" | "success" | "warning" | "error";

type HomepageResearch = {
  url: string;
  oneLiner: string;
  productSummary: string;
  signals: string[];
  pageLinks: ResearchLink[];
};

type ResearchLink = {
  url: string;
  kind: "about" | "careers" | "blog" | "engineering" | "product" | "team" | "other";
};

type SubPageResearch = {
  url: string;
  kind: ResearchLink["kind"];
  keyPoints: string[];
  technologies: string[];
  valuesOrCulture: string[];
  notable: string[];
};

type CollectedResearch = {
  homepageUrl: string;
  homepage?: HomepageResearch;
  subPages: SubPageResearch[];
  notes: string[];
};

const homepageSchema = z.object({
  oneLiner: z.string().optional().default(""),
  productSummary: z.string().optional().default(""),
  signals: z.array(z.string()).optional().default([]),
  pageLinks: z
    .array(
      z.object({
        url: z.string(),
        kind: z.enum(["about", "careers", "blog", "engineering", "product", "team", "other"]),
      }),
    )
    .optional()
    .default([]),
});

const subPageSchema = z.object({
  keyPoints: z.array(z.string()).optional().default([]),
  technologies: z.array(z.string()).optional().default([]),
  valuesOrCulture: z.array(z.string()).optional().default([]),
  notable: z.array(z.string()).optional().default([]),
});

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

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function normalizeDossier(value: unknown, job: ResearchJob): CompanyResearchDossier {
  const record = isRecord(value) ? value : {};

  return {
    companyOverview:
      stringFrom(record.companyOverview) ||
      `Research was limited, but ${job.company} is hiring for ${job.title}. Use the job posting as the strongest signal for what the team needs right now.`,
    techStack: stringArrayFrom(record.techStack),
    culture: stringArrayFrom(record.culture),
    whyThisRole:
      stringFrom(record.whyThisRole) ||
      "The role appears to support the needs described in the job posting.",
    yourEdge: stringArrayFrom(record.yourEdge),
    gapsToAddress: stringArrayFrom(record.gapsToAddress),
    smartQuestions: stringArrayFrom(record.smartQuestions),
    interviewPrep: stringArrayFrom(record.interviewPrep),
    sources: stringArrayFrom(record.sources),
  };
}

function cleanCompanyDomainCandidate(company: string): string {
  return company
    .replace(/\s*(Inc\.?|LLC|Ltd\.?|Corp\.?|Corporation|Company|Co\.?).*$/i, "")
    .replace(/[^a-z0-9\s-]/gi, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

function rootDomainFromHostname(hostname: string): string {
  const normalized = hostname.replace(/^www\./i, "").toLowerCase();
  const parts = normalized.split(".").filter(Boolean);

  if (parts.length <= 2) {
    return normalized;
  }

  return parts.slice(-2).join(".");
}

async function deriveHomepageUrl(job: ResearchJob): Promise<string> {
  const fallbackName = cleanCompanyDomainCandidate(job.company);
  const fallbackUrl = fallbackName ? `https://www.${fallbackName}.com` : "";
  const redirectUrl = job.external_apply_url || job.source_url;

  if (!redirectUrl) {
    return fallbackUrl;
  }

  try {
    const response = await fetch(redirectUrl, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
    });
    const resolved = new URL(response.url);

    if (resolved.hostname.includes("adzuna.com")) {
      return fallbackUrl;
    }

    return `https://${rootDomainFromHostname(resolved.hostname)}`;
  } catch (error) {
    console.error("[agent/research] Could not resolve employer URL", error);
    return fallbackUrl;
  }
}

function normalizeLink(url: string, homepageUrl: string): string | null {
  try {
    const normalized = new URL(url, homepageUrl);
    const homepage = new URL(homepageUrl);

    if (rootDomainFromHostname(normalized.hostname) !== rootDomainFromHostname(homepage.hostname)) {
      return null;
    }

    normalized.hash = "";
    return normalized.toString();
  } catch {
    return null;
  }
}

function selectSubPageLinks(links: ResearchLink[], homepageUrl: string): ResearchLink[] {
  const priority: Record<ResearchLink["kind"], number> = {
    about: 0,
    blog: 1,
    engineering: 2,
    product: 3,
    team: 4,
    careers: 5,
    other: 6,
  };
  const seen = new Set<string>();

  return links
    .map((link) => ({
      ...link,
      url: normalizeLink(link.url, homepageUrl) ?? "",
    }))
    .filter((link) => {
      if (!link.url || seen.has(link.url) || link.url === homepageUrl) {
        return false;
      }

      seen.add(link.url);
      return true;
    })
    .sort((left, right) => priority[left.kind] - priority[right.kind])
    .slice(0, 3);
}

async function logResearchMessage(
  job: ResearchJob,
  message: string,
  level: ResearchLogLevel,
): Promise<void> {
  if (!job.run_id) {
    console[level === "error" ? "error" : "log"](`[agent/research] ${message}`);
    return;
  }

  try {
    const { createInsforgeServer } = await import("@/lib/insforge-server");
    const insforge = await createInsforgeServer();
    const { error } = await insforge.database.from("agent_logs").insert([
      {
        run_id: job.run_id,
        user_id: job.user_id,
        job_id: job.id,
        message,
        level,
      },
    ]);

    if (error) {
      console.error("[agent/research] Could not write agent log", error);
    }
  } catch (error) {
    console.error("[agent/research] Could not write agent log", error);
  }
}

async function collectWebsiteResearch(job: ResearchJob, homepageUrl: string): Promise<CollectedResearch> {
  const research: CollectedResearch = {
    homepageUrl,
    subPages: [],
    notes: [],
  };

  if (!process.env.BROWSERBASE_API_KEY || !process.env.BROWSERBASE_PROJECT_ID) {
    research.notes.push("Browserbase is not configured; synthesis used job and profile data only.");
    return research;
  }

  if (!process.env.OPENAI_API_KEY) {
    research.notes.push("OpenAI is not configured for Stagehand extraction.");
    return research;
  }

  const browserbase = createBrowserbaseClient();
  const session = await browserbase.sessions.create({
    projectId: process.env.BROWSERBASE_PROJECT_ID,
    timeout: 120,
  });

  const stagehand = new Stagehand({
    env: "BROWSERBASE",
    apiKey: process.env.BROWSERBASE_API_KEY,
    projectId: process.env.BROWSERBASE_PROJECT_ID,
    browserbaseSessionID: session.id,
    model: {
      modelName: "openai/gpt-4o",
      apiKey: process.env.OPENAI_API_KEY,
    },
    disablePino: true,
    verbose: 0,
  });

  try {
    await stagehand.init();
    const page = stagehand.context.activePage();

    if (!page) {
      research.notes.push("Stagehand started without an active page.");
      return research;
    }

    await page.goto(homepageUrl, { waitUntil: "networkidle", timeoutMs: 30000 });
    const homepage = await stagehand.extract(
      "This is a company's homepage. Capture what the company actually does, who it's for, and any concrete signals (funding, customers, scale, mission, recent launches). Then find the internal links most worth visiting to research them as an employer.",
      homepageSchema,
      { timeout: 30000 },
    );

    research.homepage = {
      url: homepageUrl,
      oneLiner: homepage.oneLiner,
      productSummary: homepage.productSummary,
      signals: homepage.signals,
      pageLinks: homepage.pageLinks,
    };

    if (!homepage.oneLiner.trim() && !homepage.productSummary.trim()) {
      research.notes.push("Homepage research did not return meaningful company content.");
      return research;
    }

    const links = selectSubPageLinks(homepage.pageLinks, homepageUrl);

    for (const link of links) {
      try {
        await page.goto(link.url, { waitUntil: "networkidle", timeoutMs: 30000 });
        const extracted = await stagehand.extract(
          "Extract substance that helps a candidate understand this company before applying: what they do, their values and how they work, the specific technologies and tools they use, notable projects or customers, and how the team operates. Ignore nav, footers, cookie banners, and generic marketing copy.",
          subPageSchema,
          { timeout: 30000 },
        );

        research.subPages.push({
          url: link.url,
          kind: link.kind,
          keyPoints: extracted.keyPoints,
          technologies: extracted.technologies,
          valuesOrCulture: extracted.valuesOrCulture,
          notable: extracted.notable,
        });
      } catch (error) {
        await logResearchMessage(
          job,
          `Could not extract ${link.kind} page for ${job.company}.`,
          "warning",
        );
        console.error("[agent/research] Sub-page extraction failed", error);
      }
    }
  } catch (error) {
    research.notes.push("Browser research failed; synthesis used available job and profile data.");
    console.error("[agent/research] Browser research failed", error);
    await logResearchMessage(job, `Browser research failed for ${job.company}.`, "warning");
  } finally {
    await stagehand.close({ force: true });
  }

  return research;
}

function getOpenAiResearchError(error: unknown): string {
  if (error instanceof APIError) {
    console.error("[agent/research] OpenAI API error", {
      status: error.status,
      type: error.type,
      code: error.code,
      requestID: error.requestID,
    });

    if (error.status === 401 || error.status === 403) {
      return "Company research could not authenticate with OpenAI.";
    }

    if (error.status === 429) {
      return "OpenAI is rate limiting company research right now.";
    }

    return "OpenAI could not synthesize company research.";
  }

  console.error("[agent/research] OpenAI request failed", error);
  return "Company research could not be generated right now.";
}

async function synthesizeDossier(
  job: ResearchJob,
  profile: ProfileFormValues,
  companyResearch: CollectedResearch,
): Promise<CompanyResearchResult> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      success: false,
      error: "Company research is not configured.",
    };
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content: `You are a sharp career strategist preparing a candidate to apply for a specific role.
You are given (a) research collected from the company's own website, (b) the job posting, and (c) the candidate's profile. Produce a concise, concrete briefing that gives this specific candidate an edge for this specific role.

Rules:
- Ground every company claim in the provided research or job posting. Never invent funding, customers, headcount, or facts. If research was thin, infer carefully from the job posting and say what's inferred.
- Be specific to THIS candidate. Connect their actual skills and past work to this company's stack, product, and values. No generic advice that would apply to anyone.
- Turn the candidate's missing skills into a strategy: how to frame the gap honestly and what adjacent experience to lean on.
- Talking points and questions must reference real things from the research, the kind of detail that signals the candidate did their homework.
- Keep every item tight: one or two sentences. No fluff.

Return ONLY valid JSON matching this shape:
{
  "companyOverview": "string",
  "techStack": ["string"],
  "culture": ["string"],
  "whyThisRole": "string",
  "yourEdge": ["string"],
  "gapsToAddress": ["string"],
  "smartQuestions": ["string"],
  "interviewPrep": ["string"],
  "sources": ["string"]
}`,
        },
        {
          role: "user",
          content: `COMPANY RESEARCH (from their website):
${JSON.stringify(companyResearch)}

JOB POSTING:
Title: ${job.title}
Company: ${job.company}
Description: ${job.about_role}
Match reason: ${job.match_reason}
Matched skills: ${job.matched_skills.join(", ")}
Missing skills: ${job.missing_skills.join(", ")}

CANDIDATE PROFILE:
Current title: ${profile.current_title}
Experience: ${profile.years_experience} years, level ${profile.experience_level}
Skills: ${profile.skills.join(", ")}
Industries: ${profile.industries.join(", ")}
Target roles: ${profile.job_titles_seeking.join(", ")}
Work history: ${JSON.stringify(profile.work_experience)}`,
        },
      ],
    });

    const content = response.choices[0]?.message.content ?? "";

    if (!content) {
      return {
        success: false,
        error: "OpenAI returned empty company research.",
      };
    }

    const parsed: unknown = JSON.parse(content);

    return {
      success: true,
      dossier: normalizeDossier(parsed, job),
    };
  } catch (error) {
    return {
      success: false,
      error: getOpenAiResearchError(error),
    };
  }
}

export async function researchCompanyForJob(
  job: ResearchJob,
  profile: ProfileFormValues,
): Promise<CompanyResearchResult> {
  try {
    await logResearchMessage(job, `Researching ${job.company}.`, "info");

    const homepageUrl = await deriveHomepageUrl(job);
    const companyResearch = homepageUrl
      ? await collectWebsiteResearch(job, homepageUrl)
      : {
          homepageUrl: "",
          subPages: [],
          notes: ["Could not derive a likely company homepage."],
        };
    const synthesis = await synthesizeDossier(job, profile, companyResearch);

    if (!synthesis.success) {
      await logResearchMessage(job, synthesis.error, "error");
      return synthesis;
    }

    await logResearchMessage(job, `Company research saved for ${job.company}.`, "success");

    return synthesis;
  } catch (error) {
    console.error("[agent/research]", error);
    await logResearchMessage(job, `Company research failed for ${job.company}.`, "error");

    return {
      success: false,
      error: "Company research failed.",
    };
  }
}
