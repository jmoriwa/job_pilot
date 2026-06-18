import { NextResponse } from "next/server";
import { extractProfileFromResumePdf } from "@/agent/resume";
import { createInsforgeServer } from "@/lib/insforge-server";

export const runtime = "nodejs";

function getStringField(record: unknown, field: string): string {
  if (typeof record !== "object" || record === null || Array.isArray(record)) {
    return "";
  }

  const value = Object.entries(record).find(([key]) => key === field)?.[1];

  return typeof value === "string" ? value : "";
}

export async function POST(): Promise<Response> {
  try {
    const insforge = await createInsforgeServer();
    const {
      data: { user },
      error: userError,
    } = await insforge.auth.getCurrentUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "Please sign in before extracting your resume." },
        { status: 401 },
      );
    }

    const { data: profile, error: profileError } = await insforge.database
      .from("profiles")
      .select("resume_pdf_key")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("[api/resume/extract]", profileError);
      return NextResponse.json(
        { success: false, error: "Could not load your resume." },
        { status: 500 },
      );
    }

    const resumeKey = getStringField(profile, "resume_pdf_key");

    if (!resumeKey) {
      return NextResponse.json(
        { success: false, error: "Upload a resume before extracting profile details." },
        { status: 404 },
      );
    }

    const { data: resume, error: resumeError } = await insforge.storage
      .from("resumes")
      .download(resumeKey);

    if (resumeError || !resume) {
      console.error("[api/resume/extract]", resumeError);
      return NextResponse.json(
        { success: false, error: "Could not open your resume." },
        { status: 500 },
      );
    }

    const extraction = await extractProfileFromResumePdf(
      await resume.arrayBuffer(),
      user.id,
      user.email ?? "",
    );

    if (!extraction.success) {
      return NextResponse.json(
        { success: false, error: extraction.error },
        { status: 422 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        profile: extraction.profile,
      },
    });
  } catch (error) {
    console.error("[api/resume/extract]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
}
