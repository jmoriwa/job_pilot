import { PostHog } from "posthog-node";

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

type ServerEvent =
  | {
      event: "job_search_started";
      properties: JobSearchStartedProperties;
    }
  | {
      event: "job_found";
      properties: JobFoundProperties;
    }
  | {
      event: "profile_completed";
      properties: ProfileCompletedProperties;
    }
  | {
      event: "company_researched";
      properties: CompanyResearchedProperties;
    };

export function createPostHogServer(): PostHog {
  return new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
    flushAt: 1,
    flushInterval: 0,
  });
}

export async function captureServerEvent({ event, properties }: ServerEvent): Promise<void> {
  const posthog = createPostHogServer();

  try {
    posthog.capture({
      distinctId: properties.userId,
      event,
      properties,
    });
  } finally {
    await posthog.shutdown();
  }
}
