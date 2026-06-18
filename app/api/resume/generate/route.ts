import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { generateResumePdfFromProfile } from "@/agent/resumeGenerator";
import { createInsforgeServer } from "@/lib/insforge-server";
import { normalizeProfile } from "@/lib/profile";

export const runtime = "nodejs";

export async function POST(): Promise<Response> {
  try {
    const insforge = await createInsforgeServer();
    const {
      data: { user },
      error: userError,
    } = await insforge.auth.getCurrentUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "Please sign in before generating your resume." },
        { status: 401 },
      );
    }

    const { data: profileRecord, error: profileError } = await insforge.database
      .from("profiles")
      .select(
        "id, full_name, email, phone, location, current_title, experience_level, years_experience, skills, industries, work_experience, education, job_titles_seeking, remote_preference, preferred_locations, salary_expectation, cover_letter_tone, linkedin_url, portfolio_url, work_authorization, resume_pdf_url, resume_pdf_key, is_complete, completion_percentage, missing_fields",
      )
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("[api/resume/generate]", profileError);
      return NextResponse.json(
        { success: false, error: "Could not load your profile." },
        { status: 500 },
      );
    }

    if (!profileRecord) {
      return NextResponse.json(
        { success: false, error: "Save your profile before generating a resume." },
        { status: 404 },
      );
    }

    const profile = normalizeProfile(profileRecord, user.id, user.email ?? "");
    const generation = await generateResumePdfFromProfile(profile);

    if (!generation.success) {
      return NextResponse.json(
        { success: false, error: generation.error },
        { status: 422 },
      );
    }

    const resumeKey = `resumes/${user.id}/resume.pdf`;
    const resumeBytes = new Uint8Array(generation.buffer.length);
    resumeBytes.set(generation.buffer);
    const resumeBlob = new Blob([resumeBytes], { type: "application/pdf" });
    const { data: uploadedResume, error: uploadError } = await insforge.storage
      .from("resumes")
      .upload(resumeKey, resumeBlob);

    if (uploadError || !uploadedResume) {
      console.error("[api/resume/generate]", uploadError);
      return NextResponse.json(
        { success: false, error: "Could not upload the generated resume." },
        { status: 500 },
      );
    }

    const { error: updateError } = await insforge.database
      .from("profiles")
      .update({
        resume_pdf_url: uploadedResume.url,
        resume_pdf_key: uploadedResume.key,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("[api/resume/generate]", updateError);
      return NextResponse.json(
        { success: false, error: "Could not save the generated resume." },
        { status: 500 },
      );
    }

    revalidatePath("/profile");

    return NextResponse.json({
      success: true,
      data: {
        resumeUrl: uploadedResume.url,
      },
    });
  } catch (error) {
    console.error("[api/resume/generate]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
}
