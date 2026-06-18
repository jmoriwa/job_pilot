export type WorkExperienceEntry = {
  company_name: string;
  job_title: string;
  start_date: string;
  end_date: string;
  currently_working: boolean;
  responsibilities: string;
};

export type Education = {
  highest_degree: string;
  field_of_study: string;
  institution_name: string;
  graduation_year: string;
};

export type ProfileFormValues = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  current_title: string;
  experience_level: string;
  years_experience: string;
  skills: string[];
  industries: string[];
  work_experience: WorkExperienceEntry[];
  education: Education;
  job_titles_seeking: string[];
  remote_preference: string;
  preferred_locations: string[];
  salary_expectation: string;
  cover_letter_tone: string;
  linkedin_url: string;
  portfolio_url: string;
  work_authorization: string;
  resume_pdf_url: string;
  resume_pdf_key: string;
  is_complete: boolean;
  completion_percentage: number;
  missing_fields: string[];
};

export type ProfileCompletion = {
  completion_percentage: number;
  missing_fields: string[];
  is_complete: boolean;
};

const emptyEducation: Education = {
  highest_degree: "",
  field_of_study: "",
  institution_name: "",
  graduation_year: "",
};

const emptyWorkExperience: WorkExperienceEntry = {
  company_name: "",
  job_title: "",
  start_date: "",
  end_date: "",
  currently_working: false,
  responsibilities: "",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringFrom(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function numberStringFrom(value: unknown): string {
  return typeof value === "number" && Number.isFinite(value) ? String(value) : stringFrom(value);
}

function booleanFrom(value: unknown): boolean {
  return typeof value === "boolean" ? value : false;
}

function numberFrom(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function stringArrayFrom(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

export function parseList(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseText(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEducation(value: unknown): Education {
  if (!isRecord(value)) {
    return emptyEducation;
  }

  return {
    highest_degree: stringFrom(value.highest_degree),
    field_of_study: stringFrom(value.field_of_study),
    institution_name: stringFrom(value.institution_name),
    graduation_year: numberStringFrom(value.graduation_year),
  };
}

function normalizeWorkEntry(value: unknown): WorkExperienceEntry {
  if (!isRecord(value)) {
    return emptyWorkExperience;
  }

  return {
    company_name: stringFrom(value.company_name),
    job_title: stringFrom(value.job_title),
    start_date: stringFrom(value.start_date),
    end_date: stringFrom(value.end_date),
    currently_working: booleanFrom(value.currently_working),
    responsibilities: stringFrom(value.responsibilities),
  };
}

function normalizeWorkExperience(value: unknown): WorkExperienceEntry[] {
  if (!Array.isArray(value)) {
    return [{ ...emptyWorkExperience }];
  }

  const entries = value.map(normalizeWorkEntry).slice(0, 3);

  return entries.length > 0 ? entries : [{ ...emptyWorkExperience }];
}

export function emptyProfile(userId: string, email: string): ProfileFormValues {
  const baseProfile: ProfileFormValues = {
    id: userId,
    full_name: "",
    email,
    phone: "",
    location: "",
    current_title: "",
    experience_level: "",
    years_experience: "",
    skills: [],
    industries: [],
    work_experience: [{ ...emptyWorkExperience }],
    education: emptyEducation,
    job_titles_seeking: [],
    remote_preference: "",
    preferred_locations: [],
    salary_expectation: "",
    cover_letter_tone: "",
    linkedin_url: "",
    portfolio_url: "",
    work_authorization: "",
    resume_pdf_url: "",
    resume_pdf_key: "",
    is_complete: false,
    completion_percentage: 0,
    missing_fields: [],
  };

  return {
    ...baseProfile,
    ...calculateProfileCompletion(baseProfile),
  };
}

export function normalizeProfile(record: unknown, userId: string, email: string): ProfileFormValues {
  if (!isRecord(record)) {
    return emptyProfile(userId, email);
  }

  const profile: ProfileFormValues = {
    id: stringFrom(record.id) || userId,
    full_name: stringFrom(record.full_name),
    email: stringFrom(record.email) || email,
    phone: stringFrom(record.phone),
    location: stringFrom(record.location),
    current_title: stringFrom(record.current_title),
    experience_level: stringFrom(record.experience_level),
    years_experience: numberStringFrom(record.years_experience),
    skills: stringArrayFrom(record.skills),
    industries: stringArrayFrom(record.industries),
    work_experience: normalizeWorkExperience(record.work_experience),
    education: normalizeEducation(record.education),
    job_titles_seeking: stringArrayFrom(record.job_titles_seeking),
    remote_preference: stringFrom(record.remote_preference),
    preferred_locations: stringArrayFrom(record.preferred_locations),
    salary_expectation: stringFrom(record.salary_expectation),
    cover_letter_tone: stringFrom(record.cover_letter_tone),
    linkedin_url: stringFrom(record.linkedin_url),
    portfolio_url: stringFrom(record.portfolio_url),
    work_authorization: stringFrom(record.work_authorization),
    resume_pdf_url: stringFrom(record.resume_pdf_url),
    resume_pdf_key: stringFrom(record.resume_pdf_key),
    is_complete: booleanFrom(record.is_complete),
    completion_percentage: numberFrom(record.completion_percentage),
    missing_fields: stringArrayFrom(record.missing_fields),
  };

  const completion = calculateProfileCompletion(profile);

  return {
    ...profile,
    ...completion,
  };
}

export function normalizeExtractedProfile(
  record: unknown,
  userId: string,
  email: string,
): ProfileFormValues {
  if (!isRecord(record)) {
    return emptyProfile(userId, email);
  }

  return normalizeProfile(
    {
      ...record,
      id: userId,
      email: stringFrom(record.email) || email,
      resume_pdf_url: "",
      resume_pdf_key: "",
    },
    userId,
    email,
  );
}

function hasText(value: string): boolean {
  return value.trim().length > 0;
}

function hasCompleteEducation(education: Education): boolean {
  return (
    hasText(education.highest_degree) &&
    hasText(education.field_of_study) &&
    hasText(education.institution_name) &&
    hasText(education.graduation_year)
  );
}

function hasWorkExperience(workExperience: WorkExperienceEntry[]): boolean {
  return workExperience.some(
    (entry) =>
      hasText(entry.company_name) &&
      hasText(entry.job_title) &&
      hasText(entry.start_date) &&
      (entry.currently_working || hasText(entry.end_date)) &&
      hasText(entry.responsibilities),
  );
}

export function calculateProfileCompletion(profile: ProfileFormValues): ProfileCompletion {
  const requiredChecks = [
    { label: "FULL NAME", complete: hasText(profile.full_name) },
    { label: "EMAIL", complete: hasText(profile.email) },
    { label: "PHONE", complete: hasText(profile.phone) },
    { label: "LOCATION", complete: hasText(profile.location) },
    { label: "CURRENT TITLE", complete: hasText(profile.current_title) },
    { label: "EXPERIENCE LEVEL", complete: hasText(profile.experience_level) },
    { label: "YEARS EXPERIENCE", complete: hasText(profile.years_experience) },
    { label: "SKILLS", complete: profile.skills.length > 0 },
    { label: "WORK EXPERIENCE", complete: hasWorkExperience(profile.work_experience) },
    { label: "EDUCATION", complete: hasCompleteEducation(profile.education) },
    { label: "JOB TITLES", complete: profile.job_titles_seeking.length > 0 },
    { label: "REMOTE PREFERENCE", complete: hasText(profile.remote_preference) },
    { label: "COVER LETTER TONE", complete: hasText(profile.cover_letter_tone) },
    { label: "WORK AUTHORIZATION", complete: hasText(profile.work_authorization) },
  ];

  const completedCount = requiredChecks.filter((check) => check.complete).length;
  const missingFields = requiredChecks
    .filter((check) => !check.complete)
    .map((check) => check.label);

  return {
    completion_percentage: Math.round((completedCount / requiredChecks.length) * 100),
    missing_fields: missingFields,
    is_complete: missingFields.length === 0,
  };
}

export function parseWorkExperience(formData: FormData): WorkExperienceEntry[] {
  const entries = [0, 1, 2].map((index) => ({
    company_name: parseText(formData.get(`work_experience_${index}_company_name`)),
    job_title: parseText(formData.get(`work_experience_${index}_job_title`)),
    start_date: parseText(formData.get(`work_experience_${index}_start_date`)),
    end_date: parseText(formData.get(`work_experience_${index}_end_date`)),
    currently_working: formData.get(`work_experience_${index}_currently_working`) === "on",
    responsibilities: parseText(formData.get(`work_experience_${index}_responsibilities`)),
  }));

  return entries.filter(
    (entry) =>
      hasText(entry.company_name) ||
      hasText(entry.job_title) ||
      hasText(entry.start_date) ||
      hasText(entry.end_date) ||
      entry.currently_working ||
      hasText(entry.responsibilities),
  );
}
