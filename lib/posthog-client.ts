import posthog from "posthog-js";

type JobSearchStartedProperties = {
  userId: string;
  jobTitle: string;
  location: string;
};

type JobFoundProperties = {
  userId: string;
  source: "search";
  matchScore: number;
};

type ProfileCompletedProperties = {
  userId: string;
};

type CompanyResearchedProperties = {
  userId: string;
  jobId: string;
  company: string;
};

let isInitialized = false;

export function initPostHog(): void {
  if (typeof window === "undefined" || isInitialized) {
    return;
  }

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
    capture_pageview: false,
    person_profiles: "identified_only",
  });

  isInitialized = true;
}

export function identifyPostHogUser(userId: string): void {
  initPostHog();
  posthog.identify(userId);
}

export function resetPostHog(): void {
  initPostHog();
  posthog.reset();
}

export function captureJobSearchStarted(properties: JobSearchStartedProperties): void {
  initPostHog();
  posthog.capture("job_search_started", properties);
}

export function captureJobFound(properties: JobFoundProperties): void {
  initPostHog();
  posthog.capture("job_found", properties);
}

export function captureProfileCompleted(properties: ProfileCompletedProperties): void {
  initPostHog();
  posthog.capture("profile_completed", properties);
}

export function captureCompanyResearched(properties: CompanyResearchedProperties): void {
  initPostHog();
  posthog.capture("company_researched", properties);
}

export { posthog };
