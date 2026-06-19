"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type SearchStatus =
  | {
      kind: "idle";
      message: "";
    }
  | {
      kind: "success";
      message: string;
    }
  | {
      kind: "error";
      message: string;
    };

function SearchIcon({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path
        d="m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function SparkleIcon({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path
        d="M12 3v4m0 10v4M3 12h4m10 0h4m-3.5-6.5-2.8 2.8M9.3 14.7l-2.8 2.8m0-12 2.8 2.8m5.4 6.4 2.8 2.8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getErrorMessage(value: unknown): string {
  if (!isRecord(value)) {
    return "Could not find jobs right now.";
  }

  return typeof value.error === "string" ? value.error : "Could not find jobs right now.";
}

function getSuccessMessage(value: unknown): string {
  if (!isRecord(value) || !isRecord(value.data)) {
    return "Job search completed.";
  }

  const jobsFound = typeof value.data.jobsFound === "number" ? value.data.jobsFound : 0;
  const strongMatches =
    typeof value.data.strongMatches === "number" ? value.data.strongMatches : 0;

  return `Found ${jobsFound} jobs and saved ${strongMatches} strong matches.`;
}

function getRunId(value: unknown): string {
  if (!isRecord(value) || !isRecord(value.data)) {
    return "";
  }

  return typeof value.data.runId === "string" ? value.data.runId : "";
}

export function SearchControls() {
  const router = useRouter();
  const [status, setStatus] = useState<SearchStatus>({ kind: "idle", message: "" });
  const [isSearching, setIsSearching] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const jobTitle = String(formData.get("jobTitle") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();

    if (!jobTitle) {
      setStatus({
        kind: "error",
        message: "Enter a job title before searching.",
      });
      return;
    }

    setIsSearching(true);
    setStatus({ kind: "idle", message: "" });

    try {
      const response = await fetch("/api/agent/find", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ jobTitle, location }),
        cache: "no-store",
      });
      const result: unknown = await response.json();

      if (!response.ok || !isRecord(result) || result.success !== true) {
        setStatus({
          kind: "error",
          message: getErrorMessage(result),
        });
        return;
      }

      setStatus({
        kind: "success",
        message: getSuccessMessage(result),
      });
      const runId = getRunId(result);

      if (runId) {
        router.replace(`/find-jobs?runId=${encodeURIComponent(runId)}`);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("[SearchControls]", error);
      setStatus({
        kind: "error",
        message: "Could not find jobs right now.",
      });
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-8 shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <label className="block">
            <span className="text-sm font-semibold uppercase leading-5 text-text-dark">
              Job Title
            </span>
            <span className="mt-2 flex h-14 items-center gap-3 rounded-xl border border-border bg-surface px-4 shadow-sm">
              <SearchIcon className="h-5 w-5 shrink-0 text-text-muted" />
              <input
                type="text"
                name="jobTitle"
                placeholder="Frontend Engineer"
                className="h-full w-full bg-transparent text-base font-normal leading-6 text-text-primary outline-none placeholder:text-text-muted"
              />
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-semibold uppercase leading-5 text-text-dark">
              Location
            </span>
            <span className="mt-2 flex h-14 items-center rounded-xl border border-border bg-surface px-5 shadow-sm">
              <input
                type="text"
                name="location"
                placeholder="Remote, New York..."
                className="h-full w-full bg-transparent text-base font-normal leading-6 text-text-primary outline-none placeholder:text-text-muted"
              />
            </span>
          </label>

          <button
            type="submit"
            disabled={isSearching}
            className="inline-flex h-14 items-center justify-center gap-3 rounded-xl bg-accent px-8 text-base font-semibold leading-6 text-accent-foreground shadow-sm transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            <SearchIcon className="h-5 w-5" />
            {isSearching ? "Finding..." : "Find Jobs"}
          </button>
        </div>
      </form>

      {status.kind !== "idle" ? (
        <div
          className={`mt-5 flex min-h-14 items-center gap-3 rounded-md border px-5 text-base font-semibold leading-6 ${
            status.kind === "success"
              ? "border-success-light bg-success-lightest text-success-foreground"
              : "border-error/20 bg-error/5 text-error"
          }`}
        >
          <SparkleIcon
            className={`h-5 w-5 shrink-0 ${
              status.kind === "success" ? "text-success" : "text-error"
            }`}
          />
          <p>{status.message}</p>
        </div>
      ) : null}
    </section>
  );
}
