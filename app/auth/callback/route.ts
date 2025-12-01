import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/product/flashback/start";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Successful auth - redirect to the intended destination
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth error - redirect to product page
  return NextResponse.redirect(`${origin}/product/flashback?error=auth_failed`);
}

