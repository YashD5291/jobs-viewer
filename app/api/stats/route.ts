import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Job from "@/models/Job";

export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Count total jobs
    const totalJobs = await Job.countDocuments();

    // Count today's jobs
    const todayJobs = await Job.countDocuments({
      date_posted: { $gte: today },
    });

    // Count jobs by site
    const linkedinJobs = await Job.countDocuments({ site: "linkedin" });
    const indeedJobs = await Job.countDocuments({ site: "indeed" });
    const googleJobs = await Job.countDocuments({ site: "google" });
    const glassdoorJobs = await Job.countDocuments({ site: "glassdoor" });
    const zipRecruiterJobs = await Job.countDocuments({
      site: "zip_recruiter",
    });

    return NextResponse.json({
      success: true,
      data: {
        totalJobs,
        todayJobs,
        linkedinJobs,
        indeedJobs,
        googleJobs,
        glassdoorJobs,
        zipRecruiterJobs,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch stats",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
