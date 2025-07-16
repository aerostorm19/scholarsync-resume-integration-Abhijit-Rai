import { NextRequest, NextResponse } from "next/server";
import { scrapeScholarProfile } from "@/lib/scholar/scraper";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || !url.includes("scholar.google.com")) {
      return NextResponse.json({ error: "Invalid Google Scholar URL" }, { status: 400 });
    }

    const profileData = await scrapeScholarProfile(url);
    return NextResponse.json(profileData);
  } catch (error) {
    console.error("[ScholarScrapeError]:", error);
    return NextResponse.json({ error: "Failed to scrape Google Scholar profile" }, { status: 500 });
  }
}
