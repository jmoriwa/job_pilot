"use client";

import { createContext, useActionState, useContext, useEffect, useState } from "react";
import { saveProfile, type ProfileActionState } from "@/actions/profile";
import { ProfileInformationForm } from "@/components/profile/ProfileInformationForm";
import { ResumeSection } from "@/components/profile/ResumeSection";
import type { ProfileFormValues } from "@/lib/profile";

type ProfileFormShellProps = {
  initialProfile: ProfileFormValues;
};

const initialState: ProfileActionState = {
  success: false,
  message: "",
};

const ProfileFormStateContext = createContext<ProfileActionState>(initialState);

export function useProfileFormState() {
  return useContext(ProfileFormStateContext);
}

export function ProfileFormShell({ initialProfile }: ProfileFormShellProps) {
  const [state, formAction] = useActionState(saveProfile, initialState);
  const [profile, setProfile] = useState(initialProfile);
  const [profileVersion, setProfileVersion] = useState(0);

  useEffect(() => {
    if (!state.message) {
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state.message]);

  function handleProfileExtracted(extractedProfile: ProfileFormValues): void {
    setProfile({
      ...extractedProfile,
      id: initialProfile.id,
      email: extractedProfile.email || initialProfile.email,
      resume_pdf_url: initialProfile.resume_pdf_url,
      resume_pdf_key: initialProfile.resume_pdf_key,
    });
    setProfileVersion((currentVersion) => currentVersion + 1);
  }

  return (
    <form action={formAction} className="space-y-14">
      <ProfileFormStateContext.Provider value={state}>
        {state.message ? (
          <p
            className={`mx-auto max-w-[1628px] rounded-xl border px-6 py-4 text-xl font-bold leading-7 ${
              state.success
                ? "border-success-light bg-success-lightest text-success-foreground"
                : "border-error/20 bg-error/5 text-error"
            }`}
          >
            {state.message}
          </p>
        ) : null}
        <ResumeSection
          resumeUrl={initialProfile.resume_pdf_url}
          onProfileExtracted={handleProfileExtracted}
        />
        <ProfileInformationForm key={profileVersion} profile={profile} />
      </ProfileFormStateContext.Provider>
    </form>
  );
}
