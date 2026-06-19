import type { ProfileFormValues } from "@/lib/profile";

export type MatchingProfile = Pick<
  ProfileFormValues,
  | "current_title"
  | "experience_level"
  | "years_experience"
  | "skills"
  | "industries"
  | "work_experience"
  | "job_titles_seeking"
  | "remote_preference"
  | "preferred_locations"
  | "salary_expectation"
>;

export type JobMatch = {
  matchScore: number;
  matchReason: string;
  matchedSkills: string[];
  missingSkills: string[];
};
