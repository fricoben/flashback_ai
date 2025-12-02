import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: filmId } = await params;
    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the film and verify ownership
    const { data: film, error: filmError } = await supabase
      .from("films")
      .select("id, output_file, user_id, status")
      .eq("id", filmId)
      .single();

    if (filmError || !film) {
      return NextResponse.json({ error: "Film not found" }, { status: 404 });
    }

    // Verify the user owns this film
    if (film.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Check if film is completed
    if (film.status !== "completed" || !film.output_file) {
      return NextResponse.json(
        { error: "Film is not ready yet" },
        { status: 400 }
      );
    }

    console.log("🎬 Getting video URL for film:", filmId);
    console.log("📁 output_file from DB:", film.output_file);

    // Generate a signed URL (valid for 1 hour)
    const { data: urlData, error: signError } = await supabase.storage
      .from("output")
      .createSignedUrl(film.output_file, 60 * 60); // 1 hour

    if (signError || !urlData?.signedUrl) {
      console.error("❌ Failed to create signed URL:", signError);
      console.error("   Bucket: output");
      console.error("   Path:", film.output_file);
      return NextResponse.json(
        { error: "Failed to generate video URL" },
        { status: 500 }
      );
    }

    console.log("✅ Signed URL created successfully");

    return NextResponse.json({ url: urlData.signedUrl });
  } catch (error) {
    console.error("Error generating video URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
