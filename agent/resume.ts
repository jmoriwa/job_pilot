import OpenAI, { APIError } from "openai";
import { PDFParse } from "pdf-parse";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { normalizeExtractedProfile, type ProfileFormValues } from "@/lib/profile";

type ResumeExtractionSuccess = {
  success: true;
  profile: ProfileFormValues;
};

type ResumeExtractionFailure = {
  success: false;
  error: string;
};

export type ResumeExtractionResult = ResumeExtractionSuccess | ResumeExtractionFailure;

const minimumResumeTextLength = 100;
const maximumResumeTextLength = 18000;
const maximumVisionPages = 2;
const screenshotWidth = 1000;
let pdfWorkerConfigured = false;

const profileJsonInstruction = `Extract this resume into JSON with exactly these fields:
{
  "full_name": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "current_title": "string",
  "experience_level": "junior | mid | senior | lead | empty string",
  "years_experience": "string",
  "skills": ["string"],
  "industries": ["string"],
  "work_experience": [
    {
      "company_name": "string",
      "job_title": "string",
      "start_date": "string",
      "end_date": "string",
      "currently_working": boolean,
      "responsibilities": "string"
    }
  ],
  "education": {
    "highest_degree": "string",
    "field_of_study": "string",
    "institution_name": "string",
    "graduation_year": "string"
  },
  "job_titles_seeking": ["string"],
  "remote_preference": "remote | onsite | hybrid | any | empty string",
  "preferred_locations": ["string"],
  "salary_expectation": "string",
  "cover_letter_tone": "formal | casual | enthusiastic | empty string",
  "linkedin_url": "string",
  "portfolio_url": "string",
  "work_authorization": "citizen | permanent_resident | visa_required | empty string"
}

Rules:
- Use at most 3 work_experience entries, most recent first.
- Put resume bullets or role summaries into responsibilities as compact plain text.
- Infer experience_level only from the resume's scope and seniority signals.
- Infer job_titles_seeking from recent titles and obvious target roles.
- Do not guess salary_expectation, work_authorization, or cover_letter_tone.`;

function configurePdfWorker(): void {
  if (pdfWorkerConfigured) {
    return;
  }

  const workerPath = join(
    process.cwd(),
    "node_modules",
    "pdfjs-dist",
    "legacy",
    "build",
    "pdf.worker.mjs",
  );
  PDFParse.setWorker(pathToFileURL(workerPath).href);
  pdfWorkerConfigured = true;
}

async function extractResumeText(pdfData: ArrayBuffer): Promise<string> {
  configurePdfWorker();
  const parser = new PDFParse({ data: new Uint8Array(pdfData) });

  try {
    const result = await parser.getText();

    return result.text.trim();
  } finally {
    await parser.destroy();
  }
}

async function renderResumePageImages(pdfData: ArrayBuffer): Promise<string[]> {
  configurePdfWorker();
  const parser = new PDFParse({ data: new Uint8Array(pdfData) });

  try {
    const result = await parser.getScreenshot({
      first: maximumVisionPages,
      desiredWidth: screenshotWidth,
      imageDataUrl: true,
      imageBuffer: false,
    });

    return result.pages
      .map((page) => page.dataUrl)
      .filter((dataUrl) => dataUrl.startsWith("data:image/"));
  } finally {
    await parser.destroy();
  }
}

function parseJson(content: string): unknown {
  const parsed: unknown = JSON.parse(content);

  return parsed;
}

function getResumePromptText(resumeText: string): string {
  return resumeText.slice(0, maximumResumeTextLength);
}

function getSystemPrompt(): string {
  return "You extract structured profile data from developer resumes. Return only valid JSON. Do not invent details. Use empty strings or empty arrays when a field is missing. Keep arrays concise.";
}

function getOpenAiErrorMessage(error: unknown): string {
  if (error instanceof APIError) {
    const status = error.status ? `status ${error.status}` : "unknown status";
    const code = error.code ? `, code ${error.code}` : "";
    const type = error.type ? `, type ${error.type}` : "";
    const requestId = error.requestID ? `, request ${error.requestID}` : "";

    console.error("[agent/resume] OpenAI API error", {
      status: error.status,
      type: error.type,
      code: error.code,
      requestID: error.requestID,
    });

    if (error.status === 401 || error.status === 403) {
      return "Resume extraction could not authenticate with OpenAI. Check the API key and restart the dev server.";
    }

    if (error.status === 429) {
      return "OpenAI is rate limiting resume extraction right now. Please try again in a minute.";
    }

    return `OpenAI could not process this resume (${status}${code}${type}${requestId}). Check the dev server console for details.`;
  }

  console.error("[agent/resume] OpenAI request failed", error);

  if (error instanceof Error) {
    return `OpenAI request failed before receiving a response (${error.name}: ${error.message}). Check the dev server console for details.`;
  }

  return "OpenAI request failed before receiving a response. Check the dev server console for details.";
}

function getUnexpectedErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    console.error("[agent/resume] Unexpected extraction failure", {
      name: error.name,
      message: error.message,
    });
  } else {
    console.error("[agent/resume] Unexpected extraction failure", error);
  }

  return "Resume extraction failed while preparing the extracted profile fields. Please try again.";
}

async function extractProfileJsonFromText(openai: OpenAI, resumeText: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 1600,
    messages: [
      {
        role: "system",
        content: getSystemPrompt(),
      },
      {
        role: "user",
        content: `${profileJsonInstruction}

RESUME TEXT:
${getResumePromptText(resumeText)}`,
      },
    ],
  });

  return response.choices[0]?.message.content ?? "";
}

async function extractProfileJsonFromImages(
  openai: OpenAI,
  resumePageImages: string[],
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 1600,
    messages: [
      {
        role: "system",
        content: getSystemPrompt(),
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `${profileJsonInstruction}

The resume is provided as page images because embedded PDF text was unavailable. Read the visible text from the images and extract the profile fields.`,
          },
          ...resumePageImages.map((imageUrl) => ({
            type: "image_url" as const,
            image_url: {
              url: imageUrl,
            },
          })),
        ],
      },
    ],
  });

  return response.choices[0]?.message.content ?? "";
}

export async function extractProfileFromResumePdf(
  pdfData: ArrayBuffer,
  userId: string,
  email: string,
): Promise<ResumeExtractionResult> {
  try {
    let resumeText = "";

    try {
      resumeText = await extractResumeText(pdfData);
    } catch (error) {
      console.error("[agent/resume] PDF text extraction failed", error);
    }

    if (!process.env.OPENAI_API_KEY) {
      return {
        success: false,
        error: "Resume extraction is not configured yet.",
      };
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    let content = "";

    try {
      if (resumeText.length >= minimumResumeTextLength) {
        content = await extractProfileJsonFromText(openai, resumeText);
      } else {
        const pageImages = await renderResumePageImages(pdfData);

        if (pageImages.length === 0) {
          return {
            success: false,
            error:
              "Could not read text or page images from this PDF. Please try a different file.",
          };
        }

        content = await extractProfileJsonFromImages(openai, pageImages);
      }
    } catch (error) {
      return {
        success: false,
        error: getOpenAiErrorMessage(error),
      };
    }

    if (!content) {
      return {
        success: false,
        error: "OpenAI returned an empty extraction. Please try again.",
      };
    }

    let parsed: unknown;

    try {
      parsed = parseJson(content);
    } catch (error) {
      console.error("[agent/resume] Invalid OpenAI JSON", error);
      return {
        success: false,
        error: "OpenAI returned an incomplete extraction. Please try again.",
      };
    }

    const profile = normalizeExtractedProfile(parsed, userId, email);

    return {
      success: true,
      profile,
    };
  } catch (error) {
    return {
      success: false,
      error: getUnexpectedErrorMessage(error),
    };
  }
}
