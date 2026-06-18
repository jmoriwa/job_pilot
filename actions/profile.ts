"use server";

import { revalidatePath } from "next/cache";
import {
  calculateProfileCompletion,
  parseList,
  parseText,
  parseWorkExperience,
  type Education,
  type ProfileFormValues,
} from "@/lib/profile";
import { createInsforgeServer } from "@/lib/insforge-server";

export type ProfileActionState = {
  success: boolean;
  message: string;
  resumeName?: string;
  resumeUrl?: string;
};

const emptyActionState: ProfileActionState = {
  success: false,
  message: "",
};

const maxResumeSize = 5 * 1024 * 1024;

type ProfileMutation = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  current_title: string | null;
  experience_level: string | null;
  years_experience: number | null;
  skills: string[];
  industries: string[];
  work_experience: ProfileFormValues["work_experience"];
  education: Education;
  job_titles_seeking: string[];
  remote_preference: string | null;
  preferred_locations: string[];
  salary_expectation: string | null;
  cover_letter_tone: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  work_authorization: string | null;
  resume_pdf_url?: string | null;
  resume_pdf_key?: string | null;
  is_complete: boolean;
  completion_percentage: number;
  missing_fields: string[];
};

function nullableText(value: string): string | null {
  return value.length > 0 ? value : null;
}

function parseYearsExperience(value: string): number | null {
  if (value.length === 0) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function buildProfileFromForm(userId: string, email: string, formData: FormData): ProfileFormValues {
  const education: Education = {
    highest_degree: parseText(formData.get("highest_degree")),
    field_of_study: parseText(formData.get("field_of_study")),
    institution_name: parseText(formData.get("institution_name")),
    graduation_year: parseText(formData.get("graduation_year")),
  };

  return {
    id: userId,
    full_name: parseText(formData.get("full_name")),
    email: parseText(formData.get("email")) || email,
    phone: parseText(formData.get("phone")),
    location: parseText(formData.get("location")),
    current_title: parseText(formData.get("current_title")),
    experience_level: parseText(formData.get("experience_level")),
    years_experience: parseText(formData.get("years_experience")),
    skills: parseList(formData.get("skills")),
    industries: parseList(formData.get("industries")),
    work_experience: parseWorkExperience(formData),
    education,
    job_titles_seeking: parseList(formData.get("job_titles_seeking")),
    remote_preference: parseText(formData.get("remote_preference")),
    preferred_locations: parseList(formData.get("preferred_locations")),
    salary_expectation: parseText(formData.get("salary_expectation")),
    cover_letter_tone: parseText(formData.get("cover_letter_tone")),
    linkedin_url: parseText(formData.get("linkedin_url")),
    portfolio_url: parseText(formData.get("portfolio_url")),
    work_authorization: parseText(formData.get("work_authorization")),
    resume_pdf_url: "",
    resume_pdf_key: "",
    is_complete: false,
    completion_percentage: 0,
    missing_fields: [],
  };
}

function buildMutation(profile: ProfileFormValues): ProfileMutation {
  const completion = calculateProfileCompletion(profile);

  return {
    id: profile.id,
    full_name: nullableText(profile.full_name),
    email: nullableText(profile.email),
    phone: nullableText(profile.phone),
    location: nullableText(profile.location),
    current_title: nullableText(profile.current_title),
    experience_level: nullableText(profile.experience_level),
    years_experience: parseYearsExperience(profile.years_experience),
    skills: profile.skills,
    industries: profile.industries,
    work_experience: profile.work_experience,
    education: profile.education,
    job_titles_seeking: profile.job_titles_seeking,
    remote_preference: nullableText(profile.remote_preference),
    preferred_locations: profile.preferred_locations,
    salary_expectation: nullableText(profile.salary_expectation),
    cover_letter_tone: nullableText(profile.cover_letter_tone),
    linkedin_url: nullableText(profile.linkedin_url),
    portfolio_url: nullableText(profile.portfolio_url),
    work_authorization: nullableText(profile.work_authorization),
    is_complete: completion.is_complete,
    completion_percentage: completion.completion_percentage,
    missing_fields: completion.missing_fields,
  };
}

function isResumeFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0;
}

async function uploadResume(
  resume: File,
  userId: string,
): Promise<{ url: string; key: string; error: string | null }> {
  if (resume.type !== "application/pdf") {
    return { url: "", key: "", error: "Please upload a PDF resume." };
  }

  if (resume.size > maxResumeSize) {
    return { url: "", key: "", error: "Resume must be 5MB or smaller." };
  }

  const resumeKey = `resumes/${userId}/resume.pdf`;
  const insforge = await createInsforgeServer();
  const { data, error } = await insforge.storage.from("resumes").upload(resumeKey, resume);

  if (error || !data) {
    console.error("[actions/profile]", error);
    return { url: "", key: "", error: "Could not upload resume. Please try again." };
  }

  return {
    url: data.url,
    key: data.key,
    error: null,
  };
}

export async function saveProfile(
  previousState: ProfileActionState = emptyActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  void previousState;

  try {
    const insforge = await createInsforgeServer();
    const {
      data: { user },
      error: userError,
    } = await insforge.auth.getCurrentUser();

    if (userError || !user) {
      return {
        success: false,
        message: "Please sign in before saving your profile.",
      };
    }

    const userEmail = user.email ?? "";
    const profile = buildProfileFromForm(user.id, userEmail, formData);
    const mutation = buildMutation(profile);
    const resume = formData.get("resume");
    let uploadedResumeName = "";
    let uploadedResumeUrl = "";

    if (isResumeFile(resume)) {
      const upload = await uploadResume(resume, user.id);

      if (upload.error) {
        return {
          success: false,
          message: upload.error,
        };
      }

      mutation.resume_pdf_url = upload.url;
      mutation.resume_pdf_key = upload.key;
      uploadedResumeName = resume.name;
      uploadedResumeUrl = upload.url;
    }

    const { data: existingProfile, error: lookupError } = await insforge.database
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (lookupError) {
      console.error("[actions/profile]", lookupError);
      return {
        success: false,
        message: "Could not load your existing profile. Please try again.",
      };
    }

    const writeResult = existingProfile
      ? await insforge.database.from("profiles").update(mutation).eq("id", user.id)
      : await insforge.database.from("profiles").insert([mutation]);

    if (writeResult.error) {
      console.error("[actions/profile]", writeResult.error);
      return {
        success: false,
        message: "Could not save your profile. Please try again.",
      };
    }

    revalidatePath("/profile");

    return {
      success: true,
      message: uploadedResumeName ? `Resume uploaded: ${uploadedResumeName}` : "Profile saved.",
      resumeName: uploadedResumeName || undefined,
      resumeUrl: uploadedResumeUrl || undefined,
    };
  } catch (error) {
    console.error("[actions/profile]", error);
    return {
      success: false,
      message: "Something went wrong while saving your profile.",
    };
  }
}
