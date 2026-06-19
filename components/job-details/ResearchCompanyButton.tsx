"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  jobId: string;
};

type ResearchResponse = {
  success: boolean;
  error?: string;
};

function isResearchResponse(value: unknown): value is ResearchResponse {
  return typeof value === "object" && value !== null && "success" in value;
}

export function ResearchCompanyButton({ jobId }: Props) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  async function handleResearch(): Promise<void> {
    setIsPending(true);
    setError("");

    try {
      const response = await fetch("/api/agent/research", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ jobId }),
      });
      const payload: unknown = await response.json().catch(() => null);
      const message =
        isResearchResponse(payload) && payload.error
          ? payload.error
          : "Could not research this company right now.";

      if (!response.ok || !isResearchResponse(payload) || !payload.success) {
        setError(message);
        return;
      }

      router.refresh();
    } catch (requestError) {
      console.error("[ResearchCompanyButton]", requestError);
      setError("Could not research this company right now.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-3 sm:items-end">
      <button
        type="button"
        onClick={handleResearch}
        disabled={isPending}
        className="inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-accent px-5 text-base font-semibold leading-6 text-accent-foreground shadow-sm transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
          <path
            d="m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
        {isPending ? "Researching..." : "Research Company"}
      </button>
      {error ? (
        <p className="max-w-sm rounded-md border border-error/20 bg-error/5 px-3 py-2 text-sm font-medium leading-5 text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
