import OpenAI, { APIError } from "openai";
import { Document, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import type { Education, ProfileFormValues, WorkExperienceEntry } from "@/lib/profile";

type GeneratedResumeWorkEntry = {
  company_name: string;
  job_title: string;
  date_range: string;
  bullets: string[];
};

type GeneratedResumeContent = {
  professional_summary: string;
  skills: string[];
  work_experience: GeneratedResumeWorkEntry[];
  education: string;
};

type ResumeGenerationSuccess = {
  success: true;
  buffer: Buffer;
};

type ResumeGenerationFailure = {
  success: false;
  error: string;
};

export type ResumeGenerationResult = ResumeGenerationSuccess | ResumeGenerationFailure;

const maximumSkills = 14;
const maximumWorkEntries = 3;
const maximumBulletsPerRole = 4;

const styles = StyleSheet.create({
  page: {
    padding: 34,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.35,
  },
  header: {
    marginBottom: 14,
    textAlign: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  contact: {
    fontSize: 9,
    marginBottom: 2,
  },
  section: {
    marginBottom: 12,
  },
  heading: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 5,
  },
  body: {
    fontSize: 10,
  },
  skillLine: {
    fontSize: 10,
  },
  role: {
    marginBottom: 9,
  },
  roleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  roleTitle: {
    fontSize: 10,
    fontWeight: "bold",
    width: "68%",
  },
  roleDate: {
    fontSize: 9,
    textAlign: "right",
    width: "30%",
  },
  bullet: {
    fontSize: 9,
    marginBottom: 2,
  },
});

type ResumeDocumentProps = {
  profile: ProfileFormValues;
  content: GeneratedResumeContent;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringFrom(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function stringArrayFrom(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => stringFrom(item))
    .filter(Boolean);
}

function getDateRange(entry: WorkExperienceEntry): string {
  const endDate = entry.currently_working ? "Present" : entry.end_date;

  return [entry.start_date, endDate].filter(Boolean).join(" - ");
}

function getEducationLine(education: Education): string {
  return [
    education.highest_degree,
    education.field_of_study,
    education.institution_name,
    education.graduation_year,
  ]
    .filter(Boolean)
    .join(", ");
}

function getFallbackContent(profile: ProfileFormValues): GeneratedResumeContent {
  const workExperience = profile.work_experience.slice(0, maximumWorkEntries).map((entry) => ({
    company_name: entry.company_name,
    job_title: entry.job_title,
    date_range: getDateRange(entry),
    bullets: entry.responsibilities
      .split(/\n+/)
      .map((responsibility) => responsibility.trim())
      .filter(Boolean)
      .slice(0, maximumBulletsPerRole),
  }));

  return {
    professional_summary: [
      profile.experience_level,
      profile.current_title,
      profile.years_experience ? `${profile.years_experience} years of experience` : "",
    ]
      .filter(Boolean)
      .join(" ")
      .trim(),
    skills: profile.skills.slice(0, maximumSkills),
    work_experience: workExperience,
    education: getEducationLine(profile.education),
  };
}

function normalizeGeneratedWorkEntry(value: unknown): GeneratedResumeWorkEntry {
  if (!isRecord(value)) {
    return {
      company_name: "",
      job_title: "",
      date_range: "",
      bullets: [],
    };
  }

  return {
    company_name: stringFrom(value.company_name),
    job_title: stringFrom(value.job_title),
    date_range: stringFrom(value.date_range),
    bullets: stringArrayFrom(value.bullets).slice(0, maximumBulletsPerRole),
  };
}

function normalizeGeneratedResumeContent(
  value: unknown,
  profile: ProfileFormValues,
): GeneratedResumeContent {
  const fallback = getFallbackContent(profile);

  if (!isRecord(value)) {
    return fallback;
  }

  const workExperience = Array.isArray(value.work_experience)
    ? value.work_experience.map(normalizeGeneratedWorkEntry).slice(0, maximumWorkEntries)
    : fallback.work_experience;

  return {
    professional_summary:
      stringFrom(value.professional_summary) || fallback.professional_summary,
    skills: stringArrayFrom(value.skills).slice(0, maximumSkills),
    work_experience: workExperience.length > 0 ? workExperience : fallback.work_experience,
    education: stringFrom(value.education) || fallback.education,
  };
}

function getContactLine(profile: ProfileFormValues): string {
  return [
    profile.email,
    profile.phone,
    profile.location,
    profile.linkedin_url,
    profile.portfolio_url,
  ]
    .filter(Boolean)
    .join(" | ");
}

function ResumeDocument({ profile, content }: ResumeDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{profile.full_name || profile.email}</Text>
          <Text style={styles.contact}>{getContactLine(profile)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>PROFESSIONAL SUMMARY</Text>
          <Text style={styles.body}>{content.professional_summary}</Text>
        </View>

        {content.skills.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.heading}>SKILLS</Text>
            <Text style={styles.skillLine}>{content.skills.join(" | ")}</Text>
          </View>
        ) : null}

        {content.work_experience.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.heading}>EXPERIENCE</Text>
            {content.work_experience.map((entry) => (
              <View key={`${entry.company_name}-${entry.job_title}`} style={styles.role}>
                <View style={styles.roleHeader}>
                  <Text style={styles.roleTitle}>
                    {[entry.job_title, entry.company_name].filter(Boolean).join(", ")}
                  </Text>
                  <Text style={styles.roleDate}>{entry.date_range}</Text>
                </View>
                {entry.bullets.map((bullet) => (
                  <Text key={bullet} style={styles.bullet}>
                    {`- ${bullet}`}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {content.education ? (
          <View style={styles.section}>
            <Text style={styles.heading}>EDUCATION</Text>
            <Text style={styles.body}>{content.education}</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}

function getPrompt(profile: ProfileFormValues): string {
  return `Create professional resume content from this saved profile.

Return ONLY valid JSON matching this shape:
{
  "professional_summary": "2 concise sentences",
  "skills": ["up to 14 high-signal skills"],
  "work_experience": [
    {
      "company_name": "string",
      "job_title": "string",
      "date_range": "string",
      "bullets": ["3-4 polished impact-focused resume bullets"]
    }
  ],
  "education": "single concise education line"
}

Rules:
- Keep the resume honest. Do not invent employers, degrees, dates, technologies, metrics, or accomplishments.
- Improve phrasing and clarity, but preserve the user's actual experience.
- Prefer strong action verbs and concrete technical language.
- Keep bullets compact enough for a single-page resume.
- Use at most 3 work experience entries.

SAVED PROFILE:
${JSON.stringify({
    full_name: profile.full_name,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    current_title: profile.current_title,
    experience_level: profile.experience_level,
    years_experience: profile.years_experience,
    skills: profile.skills,
    industries: profile.industries,
    work_experience: profile.work_experience,
    education: profile.education,
    job_titles_seeking: profile.job_titles_seeking,
    linkedin_url: profile.linkedin_url,
    portfolio_url: profile.portfolio_url,
  })}`;
}

function getOpenAiErrorMessage(error: unknown): string {
  if (error instanceof APIError) {
    console.error("[agent/resumeGenerator] OpenAI API error", {
      status: error.status,
      type: error.type,
      code: error.code,
      requestID: error.requestID,
    });

    if (error.status === 401 || error.status === 403) {
      return "Resume generation could not authenticate with OpenAI. Check the API key and restart the dev server.";
    }

    if (error.status === 429) {
      return "OpenAI is rate limiting resume generation right now. Please try again in a minute.";
    }

    return "OpenAI could not generate the resume content right now. Check the dev server console for details.";
  }

  console.error("[agent/resumeGenerator] OpenAI request failed", error);

  if (error instanceof Error) {
    return `OpenAI request failed before receiving a response (${error.name}: ${error.message}). Check the dev server console for details.`;
  }

  return "OpenAI request failed before receiving a response. Check the dev server console for details.";
}

async function generateResumeContent(profile: ProfileFormValues): Promise<GeneratedResumeContent> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 1000,
    messages: [
      {
        role: "system",
        content:
          "You are an expert technical resume writer. Return only valid JSON. Improve wording without inventing facts.",
      },
      {
        role: "user",
        content: getPrompt(profile),
      },
    ],
  });
  const content = response.choices[0]?.message.content ?? "";

  if (!content) {
    return getFallbackContent(profile);
  }

  try {
    return normalizeGeneratedResumeContent(JSON.parse(content), profile);
  } catch (error) {
    console.error("[agent/resumeGenerator] Invalid OpenAI JSON", error);
    return getFallbackContent(profile);
  }
}

export async function generateResumePdfFromProfile(
  profile: ProfileFormValues,
): Promise<ResumeGenerationResult> {
  try {
    let content: GeneratedResumeContent;

    try {
      content = await generateResumeContent(profile);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error && error.message === "OPENAI_API_KEY is not configured."
            ? "Resume generation is not configured yet."
            : getOpenAiErrorMessage(error),
      };
    }

    const buffer = await renderToBuffer(<ResumeDocument profile={profile} content={content} />);

    return {
      success: true,
      buffer,
    };
  } catch (error) {
    console.error("[agent/resumeGenerator]", error);
    return {
      success: false,
      error: "Could not render your resume PDF. Please try again.",
    };
  }
}
