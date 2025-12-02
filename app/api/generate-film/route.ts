import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { film_id } = body as { film_id: string };

    if (!film_id) {
      return NextResponse.json(
        { error: "Missing film_id" },
        { status: 400 }
      );
    }

    // Verify the film exists and belongs to the authenticated user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: film, error: filmError } = await supabase
      .from("films")
      .select("*")
      .eq("id", film_id)
      .eq("user_id", user.id)
      .single();

    if (filmError || !film) {
      return NextResponse.json(
        { error: "Film not found" },
        { status: 404 }
      );
    }

    // Create Fly.io machine to generate the video
    const flyToken = process.env.FLY_TOKEN;
    if (!flyToken) {
      console.error("FLY_TOKEN not configured");
      return NextResponse.json(
        { error: "Video generation service not configured" },
        { status: 500 }
      );
    }

    const flyResponse = await fetch(
      "https://api.machines.dev/v1/apps/movilagen/machines",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${flyToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          config: {
            image: "registry.fly.io/movilagen:latest",
            guest: {
              cpu_kind: "performance",
              cpus: 2,
              memory_mb: 4096,
            },
            auto_destroy: true,
            processes: [
              {
                entrypoint: ["python", "movilagen.py", film_id],
              },
            ],
          },
        }),
      }
    );

    if (!flyResponse.ok) {
      const errorText = await flyResponse.text();
      console.error("Fly.io API error:", flyResponse.status, errorText);
      return NextResponse.json(
        { error: "Failed to start video generation" },
        { status: 500 }
      );
    }

    const flyData = await flyResponse.json();
    console.log("Fly.io machine created for film:", film_id, "machine:", flyData.id);

    return NextResponse.json({
      success: true,
      machine_id: flyData.id,
    });
  } catch (error) {
    console.error("Generate film error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
