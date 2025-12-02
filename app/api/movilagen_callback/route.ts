import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { Resend } from "resend";
import { readFileSync } from "fs";
import { join } from "path";

const resend = new Resend(process.env.RESEND_KEY);

// Helper function to load and process email templates
function loadEmailTemplate(
  templatePath: string,
  replacements: Record<string, string>
): string {
  const template = readFileSync(
    join(process.cwd(), "emails", templatePath),
    "utf-8"
  );
  let result = template;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  return result;
}

interface MovilagenCallback {
  video_id: string;
  video_filename: string;
  run_data: {
    film_id: string;
    status: string;
    photos: string[];
    videos_generated: number;
    skipped: string[];
    warnings: string[];
    error: string | null;
    output_file: string;
    started_at: string;
    ended_at: string;
    duration_seconds: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as MovilagenCallback;
    const { video_filename, run_data } = body;

    if (!run_data?.film_id || !video_filename) {
      return NextResponse.json(
        { error: "Missing film_id or video_filename" },
        { status: 400 }
      );
    }

    // Check if generation failed
    if (run_data.status !== "completed" || run_data.error) {
      console.error("Video generation failed:", run_data.error);
      return NextResponse.json(
        { error: "Video generation failed", details: run_data.error },
        { status: 400 }
      );
    }

    const film_id = run_data.film_id;
    const supabase = createAdminClient();

    // Get film and user info
    const { data: film, error: filmError } = await supabase
      .from("films")
      .select("*, orders!inner(user_id)")
      .eq("id", film_id)
      .single();

    if (filmError || !film) {
      console.error("Film not found:", filmError);
      return NextResponse.json({ error: "Film not found" }, { status: 404 });
    }

    // Get user email
    const { data: userData, error: userError } =
      await supabase.auth.admin.getUserById(film.orders.user_id);

    if (userError || !userData.user?.email) {
      console.error("User not found:", userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userEmail = userData.user.email;
    const userName = userEmail.split("@")[0]; // Simple name extraction

    // Update film status to completed and store the output file path
    await supabase
      .from("films")
      .update({
        status: "completed",
        output_file: video_filename,
      })
      .eq("id", film_id);

    // Build account URL for the email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const accountUrl = `${baseUrl}/account`;

    // Load email template
    const emailHtml = loadEmailTemplate("video-ready.html", {
      name: userName,
      account_url: accountUrl,
      year: new Date().getFullYear().toString(),
    });

    // Send email
    const emailResponse = await resend.emails.send({
      from: "Ben from Movila <ben@noreply.movila.io>",
      replyTo: "ben@relens.ai",
      to: userEmail,
      subject: "Your film is ready ✨",
      html: emailHtml,
    });

    if (emailResponse.error) {
      console.error("Resend error:", emailResponse.error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    console.log(
      "Email sent for film:",
      film_id,
      "to:",
      userEmail,
      "email_id:",
      emailResponse.data?.id,
      "duration:",
      run_data.duration_seconds,
      "seconds"
    );

    return NextResponse.json({
      success: true,
      email_id: emailResponse.data?.id,
    });
  } catch (error) {
    console.error("Movilagen callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
