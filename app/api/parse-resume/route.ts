import { type NextRequest, NextResponse } from "next/server";
import { parseResumeFile } from "@/lib/resume/parser";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("resume");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded or invalid format" }, { status: 400 });
    }

    const parsedData = await parseResumeFile(file);

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("[ResumeParsingError]", error);
    return NextResponse.json({ error: "Failed to parse resume" }, { status: 500 });
  }
}
