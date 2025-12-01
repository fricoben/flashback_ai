import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id } = body as { session_id: string };

    if (!session_id) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    // 1. Verify payment with Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    const email = session.customer_details?.email;
    if (!email) {
      return NextResponse.json(
        { error: "No email found in Stripe session" },
        { status: 400 }
      );
    }

    const plan = session.metadata?.plan || "single";
    const filmsTotal = parseInt(session.metadata?.films_total || "1", 10);

    const supabase = createAdminClient();

    // 2. Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find((u) => u.email === email);

    let userId: string;

    if (existingUser) {
      // User exists
      userId = existingUser.id;
    } else {
      // Create new user
      const { data: newUser, error: createError } =
        await supabase.auth.admin.createUser({
          email,
          email_confirm: true, // Auto-confirm since they paid
        });

      if (createError || !newUser.user) {
        console.error("Error creating user:", createError);
        return NextResponse.json(
          { error: "Failed to create user" },
          { status: 500 }
        );
      }

      userId = newUser.user.id;
    }

    // 3. Check if order already exists (prevent duplicates)
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("stripe_session_id", session_id)
      .single();

    if (!existingOrder) {
      // 4. Create order in database
      const { error: orderError } = await supabase.from("orders").insert({
        user_id: userId,
        stripe_session_id: session_id,
        stripe_payment_intent: session.payment_intent as string,
        plan,
        films_total: filmsTotal,
        films_used: 0,
        status: "active",
      });

      if (orderError) {
        console.error("Error creating order:", orderError);
        return NextResponse.json(
          { error: "Failed to create order" },
          { status: 500 }
        );
      }
    }

    // 5. Generate and send magic link using inviteUserByEmail for new users
    // or generateLink for existing users
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    
    const { data: linkData, error: linkError } =
      await supabase.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: {
          redirectTo: `${baseUrl}/auth/callback?next=/product/flashback/start`,
        },
      });

    if (linkError) {
      console.error("Error generating magic link:", linkError);
      // Don't fail the whole request - user can request a new link
    }

    return NextResponse.json({
      success: true,
      email,
      userId,
      // The magic link email will be sent by Supabase
      magicLinkSent: !linkError,
    });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
