"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useProfileFormState } from "@/components/profile/ProfileFormShell";
import type { ProfileFormValues } from "@/lib/profile";

type ResumeSectionProps = {
  resumeUrl: string;
  onProfileExtracted: (profile: ProfileFormValues) => void;
};

type ResumeExtractResponse = {
  success: boolean;
  data?: {
    profile: ProfileFormValues;
  };
  error?: string;
};

type ExtractionStatus = {
  success: boolean;
  message: string;
};

function isResumeExtractResponse(value: unknown): value is ResumeExtractResponse {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  return "success" in value && typeof value.success === "boolean";
}

function getExtractionErrorMessage(response: Response, result: ResumeExtractResponse): string {
  if (result.error) {
    return result.error;
  }

  if (response.ok) {
    return "Resume extraction returned an incomplete success response. Check the dev server console for details.";
  }

  return `Resume extraction returned an error without details (${response.status}). Check the dev server console for details.`;
}

async function readExtractResponse(response: Response): Promise<ResumeExtractResponse> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const result: unknown = await response.json();

    if (isResumeExtractResponse(result)) {
      return result;
    }

    return {
      success: false,
      error: `Resume extraction returned an unexpected response (${response.status}).`,
    };
  }

  const text = await response.text();
  console.error("[ResumeSection] Non-JSON extraction response", {
    status: response.status,
    preview: text.slice(0, 240),
  });

  return {
    success: false,
    error: `Resume extraction failed on the server (${response.status}). Check the dev server console for details.`,
  };
}

export function ResumeSection({ resumeUrl, onProfileExtracted }: ResumeSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState<ExtractionStatus>({
    success: false,
    message: "",
  });
  const { pending } = useFormStatus();
  const actionState = useProfileFormState();
  const hasCurrentResume = Boolean(actionState.resumeUrl ?? resumeUrl);
  const currentResumeName = actionState.resumeName ?? "current resume";
  const uploadedSelectedResume =
    Boolean(selectedFileName) &&
    actionState.success &&
    Boolean(actionState.resumeName);

  function handleResumeChange(): void {
    const input = inputRef.current;
    const file = input?.files?.[0];

    if (!input || !file) {
      return;
    }

    setSelectedFileName(file.name);
    input.form?.requestSubmit();
  }

  async function handleExtractProfile(): Promise<void> {
    setExtracting(true);
    setExtractionStatus({ success: false, message: "" });

    try {
      const response = await fetch("/api/resume/extract", {
        method: "POST",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });
      const result = await readExtractResponse(response);

      if (!response.ok || !result.success || !result.data) {
        setExtractionStatus({
          success: false,
          message: getExtractionErrorMessage(response, result),
        });
        return;
      }

      onProfileExtracted(result.data.profile);
      setExtractionStatus({
        success: true,
        message: "Profile fields filled from resume. Review and save when ready.",
      });
    } catch (error) {
      console.error("[ResumeSection]", error);
      setExtractionStatus({
        success: false,
        message:
          "Resume extraction could not reach the server. Check that the dev server is running and try again.",
      });
    } finally {
      setExtracting(false);
    }
  }

  return (
    <section className="mx-auto max-w-[1628px] rounded-xl border border-border bg-surface p-14 shadow-sm">
      <h2 className="text-4xl font-bold leading-10 text-text-primary">Resume</h2>
      <p className="mt-4 text-2xl font-medium leading-8 text-text-secondary">
        Upload an existing resume to auto-fill the profile, or generate a new tailored one from
        your details below.
      </p>

      <div className="mt-12 flex min-h-[440px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface-secondary px-6 py-16 text-center">
        <input
          ref={inputRef}
          id="resume"
          name="resume"
          type="file"
          accept="application/pdf"
          className="sr-only"
          onChange={handleResumeChange}
        />
        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-border bg-surface text-accent shadow-sm">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-12 w-12">
            <path
              d="M12 16V5m0 0 4 4m-4-4-4 4M7 19h10a4 4 0 0 0 .7-7.94A6 6 0 0 0 6.4 9.1 4.5 4.5 0 0 0 7 19Z"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </div>
        <p className="mt-9 text-3xl font-bold leading-9 text-text-primary">
          Click to upload or drag and drop
        </p>
        <p className="mt-3 text-2xl font-medium leading-8 text-text-secondary">
          {pending && selectedFileName
            ? `Uploading ${selectedFileName}...`
            : uploadedSelectedResume
              ? `Uploaded ${currentResumeName}`
            : resumeUrl
              ? "Current resume saved. Upload a PDF to replace it."
              : "PDF formatting only. Maximum file size 5MB."}
        </p>
        {hasCurrentResume ? (
          <a
            href="/api/resume/current"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-xl border border-border bg-surface px-7 py-4 text-xl font-bold leading-7 text-accent shadow-sm transition hover:bg-surface-secondary hover:text-accent-dark"
          >
            View Current Resume
          </a>
        ) : null}
        {extractionStatus.message ? (
          <p
            className={`mt-6 rounded-xl border px-6 py-4 text-xl font-bold leading-7 ${
              extractionStatus.success
                ? "border-success-light bg-success-lightest text-success-foreground"
                : "border-error/20 bg-error/5 text-error"
            }`}
          >
            {extractionStatus.message}
          </p>
        ) : null}
        <label
          htmlFor="resume"
          className="mt-12 rounded-xl border border-border bg-surface px-9 py-5 text-2xl font-bold leading-8 text-text-dark shadow-sm transition hover:bg-surface-secondary"
        >
          {pending && selectedFileName ? "Uploading..." : "Select Resume"}
        </label>
      </div>

      <div className="mt-12 flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
        <p className="text-2xl font-medium leading-8 text-text-secondary">
          Need a fresh document based on the fields below?
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {hasCurrentResume ? (
            <button
              type="button"
              onClick={handleExtractProfile}
              disabled={extracting || pending}
              className="inline-flex items-center justify-center gap-4 rounded-xl border border-border bg-surface px-9 py-5 text-2xl font-bold leading-8 text-text-dark shadow-sm transition hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-70"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7">
                <path
                  d="M8 4h8l4 4v12H8V4Zm8 0v4h4M4 8v12h12"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              {extracting ? "Extracting..." : "Extract from Resume"}
            </button>
          ) : null}
          <button
            type="button"
            className="inline-flex items-center justify-center gap-4 rounded-xl bg-accent px-9 py-5 text-2xl font-bold leading-8 text-accent-foreground shadow-sm transition hover:bg-accent-dark"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7">
              <path
                d="M7 3h7l5 5v13H7V3Zm7 0v5h5M10 13h6m-6 4h6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            Generate Resume from Profile
          </button>
        </div>
      </div>
    </section>
  );
}
