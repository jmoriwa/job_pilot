export type AdzunaJob = {
  id: string;
  title: string;
  company: {
    display_name: string;
  };
  location: {
    display_name: string;
  };
  description: string;
  redirect_url: string;
  salary_min?: number;
  salary_max?: number;
  salary_is_predicted: "0" | "1";
  contract_type?: string;
  created: string;
  category: {
    tag: string;
    label: string;
  };
};

const minFullDescriptionLength = 240;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringFrom(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_match, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, code: string) =>
      String.fromCharCode(Number.parseInt(code, 16)),
    );
}

function stripHtml(value: string): string {
  return decodeHtmlEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractJsonLdBlocks(html: string): string[] {
  const blocks: string[] = [];
  const scriptPattern =
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match = scriptPattern.exec(html);

  while (match) {
    blocks.push(decodeHtmlEntities(match[1] ?? "").trim());
    match = scriptPattern.exec(html);
  }

  return blocks;
}

function collectRecords(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value.flatMap(collectRecords);
  }

  if (!isRecord(value)) {
    return [];
  }

  const graph = value["@graph"];
  const nested = Array.isArray(graph) ? graph.flatMap(collectRecords) : [];

  return [value, ...nested];
}

function isJobPostingRecord(record: Record<string, unknown>): boolean {
  const type = record["@type"];

  if (typeof type === "string") {
    return type.toLowerCase() === "jobposting";
  }

  return Array.isArray(type)
    ? type.some((item) => typeof item === "string" && item.toLowerCase() === "jobposting")
    : false;
}

function extractJsonLdDescription(html: string): string | null {
  for (const block of extractJsonLdBlocks(html)) {
    try {
      const parsed: unknown = JSON.parse(block);
      const jobPosting = collectRecords(parsed).find(isJobPostingRecord);
      const description = jobPosting ? stringFrom(jobPosting.description) : "";
      const cleaned = stripHtml(description);

      if (cleaned.length >= minFullDescriptionLength) {
        return cleaned;
      }
    } catch {
      continue;
    }
  }

  return null;
}

function extractMetaDescription(html: string): string | null {
  const metaPattern =
    /<meta[^>]+(?:name|property)=["'](?:description|og:description|twitter:description)["'][^>]+content=["']([^"']+)["'][^>]*>/i;
  const match = metaPattern.exec(html);
  const cleaned = stripHtml(match?.[1] ?? "");

  return cleaned.length >= minFullDescriptionLength ? cleaned : null;
}

function extractBodyDescription(html: string): string | null {
  const bodyMatch = /<body[^>]*>([\s\S]*?)<\/body>/i.exec(html);
  const cleaned = stripHtml(bodyMatch?.[1] ?? html);

  return cleaned.length >= minFullDescriptionLength ? cleaned.slice(0, 12000) : null;
}

export function isLikelyTruncatedDescription(value: string): boolean {
  const trimmed = value.trim();

  return /(\u2026|\.{3})$/.test(trimmed) || trimmed.length < minFullDescriptionLength;
}

export async function fetchFullJobDescription(sourceUrl: string): Promise<string | null> {
  if (!sourceUrl) {
    return null;
  }

  try {
    const response = await fetch(sourceUrl, {
      redirect: "follow",
      cache: "no-store",
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.includes("text/html")) {
      return null;
    }

    const html = await response.text();

    return (
      extractJsonLdDescription(html) ?? extractMetaDescription(html) ?? extractBodyDescription(html)
    );
  } catch (error) {
    console.error("[lib/adzuna] Could not fetch full job description", error);
    return null;
  }
}

function numberFrom(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function parseAdzunaJob(value: unknown): AdzunaJob | null {
  if (!isRecord(value)) {
    return null;
  }

  const company = isRecord(value.company) ? value.company : {};
  const location = isRecord(value.location) ? value.location : {};
  const category = isRecord(value.category) ? value.category : {};
  const id = stringFrom(value.id);
  const title = stringFrom(value.title);
  const companyName = stringFrom(company.display_name);
  const locationName = stringFrom(location.display_name);
  const description = stringFrom(value.description);
  const redirectUrl = stringFrom(value.redirect_url);
  const created = stringFrom(value.created);

  if (!id || !title || !companyName || !redirectUrl) {
    return null;
  }

  return {
    id,
    title,
    company: {
      display_name: companyName,
    },
    location: {
      display_name: locationName,
    },
    description,
    redirect_url: redirectUrl,
    salary_min: numberFrom(value.salary_min),
    salary_max: numberFrom(value.salary_max),
    salary_is_predicted: value.salary_is_predicted === "0" ? "0" : "1",
    contract_type: stringFrom(value.contract_type),
    created,
    category: {
      tag: stringFrom(category.tag),
      label: stringFrom(category.label),
    },
  };
}

function parseAdzunaJobs(value: unknown): AdzunaJob[] {
  if (!isRecord(value) || !Array.isArray(value.results)) {
    return [];
  }

  return value.results
    .map(parseAdzunaJob)
    .filter((job): job is AdzunaJob => job !== null);
}

export function detectAdzunaCountry(location: string): string {
  const normalized = location.trim().toLowerCase();

  if (
    /\b(uk|united kingdom|england|scotland|wales|london|manchester|birmingham)\b/.test(
      normalized,
    )
  ) {
    return "gb";
  }

  if (/\b(canada|toronto|vancouver|montreal|ottawa|calgary)\b/.test(normalized)) {
    return "ca";
  }

  if (/\b(australia|sydney|melbourne|brisbane|perth|adelaide)\b/.test(normalized)) {
    return "au";
  }

  return "us";
}

export async function searchJobs(
  jobTitle: string,
  location: string,
  country: string = "us",
): Promise<AdzunaJob[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    throw new Error("Adzuna search is not configured.");
  }

  const params = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    what: jobTitle,
    category: "it-jobs",
    results_per_page: "10",
    "content-type": "application/json",
  });

  if (location) {
    params.set("where", location);
  }

  const response = await fetch(
    `https://api.adzuna.com/v1/api/jobs/${country}/search/1?${params}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`Adzuna API error: ${response.status}`);
  }

  const data: unknown = await response.json();

  return parseAdzunaJobs(data);
}
