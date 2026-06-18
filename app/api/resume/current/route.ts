import { type NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";

function getStringField(record: unknown, field: string): string {
  if (typeof record !== "object" || record === null || Array.isArray(record)) {
    return "";
  }

  const value = Object.entries(record).find(([key]) => key === field)?.[1];

  return typeof value === "string" ? value : "";
}

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const insforge = await createInsforgeServer();
    const {
      data: { user },
      error: userError,
    } = await insforge.auth.getCurrentUser();

    if (userError || !user) {
      return NextResponse.redirect(new URL("/login?next=%2Fprofile", request.url));
    }

    const { data: profile, error: profileError } = await insforge.database
      .from("profiles")
      .select("resume_pdf_key")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("[api/resume/current]", profileError);
      return NextResponse.json(
        { success: false, error: "Could not load resume." },
        { status: 500 },
      );
    }

    const resumeKey = getStringField(profile, "resume_pdf_key");

    if (!resumeKey) {
      return NextResponse.json(
        { success: false, error: "No resume uploaded." },
        { status: 404 },
      );
    }

    const { data: resume, error: resumeError } = await insforge.storage
      .from("resumes")
      .download(resumeKey);

    if (resumeError || !resume) {
      console.error("[api/resume/current]", resumeError);
      return NextResponse.json(
        { success: false, error: "Could not open resume." },
        { status: 500 },
      );
    }

    return new Response(resume, {
      headers: {
        "Content-Disposition": 'inline; filename="resume.pdf"',
        "Content-Type": "application/pdf",
      },
    });
  } catch (error) {
    console.error("[api/resume/current]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
}
