import { ProfileSubmitButton } from "@/components/profile/ProfileSubmitButton";
import type { ProfileFormValues, WorkExperienceEntry } from "@/lib/profile";

type ProfileInformationFormProps = {
  profile: ProfileFormValues;
};

type SelectOption = {
  value: string;
  label: string;
};

const labelClass = "text-xl font-bold uppercase leading-7 text-text-dark";
const inputClass =
  "mt-3 h-[72px] w-full rounded-xl border border-border bg-surface px-7 text-2xl font-medium leading-8 text-text-primary shadow-sm placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:bg-surface-secondary disabled:text-text-secondary";
const textareaClass =
  "mt-3 min-h-32 w-full rounded-xl border border-border bg-surface px-7 py-5 text-2xl font-medium leading-8 text-text-primary shadow-sm placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
const sectionDividerClass = "border-t border-border pt-24";
const twoColumnClass = "grid gap-x-9 gap-y-8 md:grid-cols-2";

const experienceLevels: SelectOption[] = [
  { value: "", label: "Select experience level" },
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
];

const workAuthorizations: SelectOption[] = [
  { value: "", label: "Select work authorization" },
  { value: "citizen", label: "Citizen" },
  { value: "permanent_resident", label: "Permanent resident" },
  { value: "visa_required", label: "Visa required" },
];

const remotePreferences: SelectOption[] = [
  { value: "", label: "Select remote preference" },
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "Onsite" },
  { value: "hybrid", label: "Hybrid" },
  { value: "any", label: "Any" },
];

const coverLetterTones: SelectOption[] = [
  { value: "", label: "Select cover letter tone" },
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "enthusiastic", label: "Enthusiastic" },
];

const degreeOptions: SelectOption[] = [
  { value: "", label: "Select highest degree" },
  { value: "High School", label: "High School" },
  { value: "Associate", label: "Associate" },
  { value: "Bachelor's", label: "Bachelor's" },
  { value: "Master's", label: "Master's" },
  { value: "Doctorate", label: "Doctorate" },
  { value: "Bootcamp", label: "Bootcamp" },
  { value: "Self-taught", label: "Self-taught" },
];

function listValue(items: string[]): string {
  return items.join(", ");
}

function renderOptions(options: SelectOption[]) {
  return options.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ));
}

function getWorkEntries(profile: ProfileFormValues): WorkExperienceEntry[] {
  const entries = profile.work_experience.slice(0, 3);

  return entries.length > 0
    ? entries
    : [
        {
          company_name: "",
          job_title: "",
          start_date: "",
          end_date: "",
          currently_working: false,
          responsibilities: "",
        },
      ];
}

export function ProfileInformationForm({ profile }: ProfileInformationFormProps) {
  const workEntries = getWorkEntries(profile);

  return (
    <section className="mx-auto max-w-[1628px] rounded-xl border border-border bg-surface p-14 shadow-sm">
      <div>
        <h2 className="text-4xl font-bold leading-10 text-text-primary">
          Profile Information
        </h2>
        <p className="mt-4 text-2xl font-medium leading-8 text-text-secondary">
          This context is used to accurately represent you in agent interactions.
        </p>
      </div>

      <div className="mt-8 border-t border-border pt-24">
        <h3 className="text-3xl font-bold leading-9 text-text-primary">Personal Info</h3>
        <div className={`${twoColumnClass} mt-12`}>
          <label>
            <span className={labelClass}>FULL NAME</span>
            <input className={inputClass} defaultValue={profile.full_name} name="full_name" />
          </label>
          <label>
            <span className={labelClass}>EMAIL</span>
            <input
              className={inputClass}
              defaultValue={profile.email}
              name="email"
              readOnly
            />
          </label>
          <label>
            <span className={labelClass}>PHONE NUMBER</span>
            <input className={inputClass} defaultValue={profile.phone} name="phone" placeholder="+1 (555) 000-0000" />
          </label>
          <label>
            <span className={labelClass}>LOCATION</span>
            <input className={inputClass} defaultValue={profile.location} name="location" placeholder="City, Country" />
          </label>
          <label>
            <span className={labelClass}>LINKEDIN URL</span>
            <input className={inputClass} defaultValue={profile.linkedin_url} name="linkedin_url" placeholder="https://linkedin.com/in/you" />
          </label>
          <label>
            <span className={labelClass}>PORTFOLIO / GITHUB</span>
            <input className={inputClass} defaultValue={profile.portfolio_url} name="portfolio_url" placeholder="https://github.com/you" />
          </label>
          <label>
            <span className={labelClass}>WORK AUTHORIZATION</span>
            <select className={inputClass} defaultValue={profile.work_authorization} name="work_authorization">
              {renderOptions(workAuthorizations)}
            </select>
          </label>
        </div>
      </div>

      <div className={`${sectionDividerClass} mt-24`}>
        <h3 className="text-3xl font-bold leading-9 text-text-primary">Professional Info</h3>
        <div className="mt-12 grid gap-x-9 gap-y-8 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className={labelClass}>CURRENT/RECENT JOB TITLE</span>
            <input className={inputClass} defaultValue={profile.current_title} name="current_title" placeholder="Frontend Engineer" />
          </label>
          <label>
            <span className={labelClass}>EXPERIENCE LEVEL</span>
            <select className={inputClass} defaultValue={profile.experience_level} name="experience_level">
              {renderOptions(experienceLevels)}
            </select>
          </label>
          <label>
            <span className={labelClass}>YEARS OF EXPERIENCE</span>
            <input className={inputClass} defaultValue={profile.years_experience} name="years_experience" placeholder="4" />
          </label>
          <div className="md:col-span-2">
            <span className={labelClass}>SKILLS</span>
            <div className="mt-3 flex gap-4">
              <input className={inputClass} defaultValue={listValue(profile.skills)} name="skills" placeholder="React, TypeScript, Next.js" />
              <button
                type="button"
                className="h-[72px] rounded-xl bg-surface-secondary px-8 text-2xl font-bold leading-8 text-text-dark transition hover:bg-surface-tertiary"
              >
                Add
              </button>
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              {profile.skills.map((tag) => (
                <span
                  key={tag}
                  className="rounded-xl border border-border bg-surface-secondary px-6 py-3 text-2xl font-medium leading-8 text-text-primary"
                >
                  {tag} <span className="text-text-muted">x</span>
                </span>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <span className={labelClass}>INDUSTRIES WORKED IN (OPTIONAL)</span>
            <div className="mt-3 flex gap-4">
              <input className={inputClass} defaultValue={listValue(profile.industries)} name="industries" placeholder="FinTech, Healthcare" />
              <button
                type="button"
                className="h-[72px] rounded-xl bg-surface-secondary px-8 text-2xl font-bold leading-8 text-text-dark transition hover:bg-surface-tertiary"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`${sectionDividerClass} mt-24`}>
        <div className="flex items-center justify-between gap-6">
          <h3 className="text-3xl font-bold leading-9 text-text-primary">Work Experience</h3>
          <button
            type="button"
            className="text-2xl font-bold leading-8 text-accent transition hover:text-accent-dark"
          >
            + Add role
          </button>
        </div>
        <div className="mt-12 space-y-8">
          {workEntries.map((entry, index) => (
            <div key={index} className="rounded-xl border border-border bg-surface-secondary p-9">
              <div className={twoColumnClass}>
                <label>
                  <span className={labelClass}>COMPANY NAME</span>
                  <input
                    className={inputClass}
                    defaultValue={entry.company_name}
                    name={`work_experience_${index}_company_name`}
                    placeholder="Vercel"
                  />
                </label>
                <label>
                  <span className={labelClass}>JOB TITLE</span>
                  <input
                    className={inputClass}
                    defaultValue={entry.job_title}
                    name={`work_experience_${index}_job_title`}
                    placeholder="Frontend Engineer"
                  />
                </label>
                <label>
                  <span className={labelClass}>START DATE</span>
                  <input
                    className={inputClass}
                    defaultValue={entry.start_date}
                    name={`work_experience_${index}_start_date`}
                    placeholder="January 2022"
                  />
                </label>
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className={labelClass}>END DATE</span>
                    <label className="flex items-center gap-3 text-xl font-semibold leading-7 text-text-dark">
                      <input
                        type="checkbox"
                        className="h-6 w-6 rounded border-border accent-info-dark"
                        defaultChecked={entry.currently_working}
                        name={`work_experience_${index}_currently_working`}
                      />
                      Currently working here
                    </label>
                  </div>
                  <input
                    className={inputClass}
                    defaultValue={entry.end_date}
                    name={`work_experience_${index}_end_date`}
                    placeholder="Present"
                  />
                </div>
                <label className="md:col-span-2">
                  <span className={labelClass}>KEY RESPONSIBILITIES</span>
                  <textarea
                    className={textareaClass}
                    defaultValue={entry.responsibilities}
                    name={`work_experience_${index}_responsibilities`}
                    placeholder="Built Next.js features and optimized web vitals."
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${sectionDividerClass} mt-24`}>
        <h3 className="text-3xl font-bold leading-9 text-text-primary">Education</h3>
        <div className={`${twoColumnClass} mt-12`}>
          <label>
            <span className={labelClass}>HIGHEST DEGREE</span>
            <select className={inputClass} defaultValue={profile.education.highest_degree} name="highest_degree">
              {renderOptions(degreeOptions)}
            </select>
          </label>
          <label>
            <span className={labelClass}>FIELD OF STUDY</span>
            <input className={inputClass} defaultValue={profile.education.field_of_study} name="field_of_study" placeholder="Computer Science" />
          </label>
          <label>
            <span className={labelClass}>INSTITUTION NAME</span>
            <input className={inputClass} defaultValue={profile.education.institution_name} name="institution_name" placeholder="E.g. State University" />
          </label>
          <label>
            <span className={labelClass}>GRADUATION YEAR</span>
            <input className={inputClass} defaultValue={profile.education.graduation_year} name="graduation_year" placeholder="YYYY" />
          </label>
        </div>
      </div>

      <div className={`${sectionDividerClass} mt-24`}>
        <h3 className="text-3xl font-bold leading-9 text-text-primary">Job Preferences</h3>
        <div className="mt-12 grid gap-x-9 gap-y-8 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className={labelClass}>JOB TITLES SEEKING</span>
            <input className={inputClass} defaultValue={listValue(profile.job_titles_seeking)} name="job_titles_seeking" placeholder="Frontend Engineer, React Developer" />
          </label>
          <label>
            <span className={labelClass}>REMOTE PREFERENCE</span>
            <select className={inputClass} defaultValue={profile.remote_preference} name="remote_preference">
              {renderOptions(remotePreferences)}
            </select>
          </label>
          <label>
            <span className={labelClass}>SALARY EXPECTATION (OPTIONAL)</span>
            <input className={inputClass} defaultValue={profile.salary_expectation} name="salary_expectation" placeholder="E.g. $120k+" />
          </label>
          <label className="md:col-span-2">
            <span className={labelClass}>PREFERRED LOCATIONS (OPTIONAL)</span>
            <input className={inputClass} defaultValue={listValue(profile.preferred_locations)} name="preferred_locations" placeholder="E.g. New York, London" />
          </label>
          <label className="md:col-span-2">
            <span className={labelClass}>COVER LETTER TONE</span>
            <select className={inputClass} defaultValue={profile.cover_letter_tone} name="cover_letter_tone">
              {renderOptions(coverLetterTones)}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-24 border-t border-border pt-14">
        <ProfileSubmitButton />
      </div>
    </section>
  );
}
