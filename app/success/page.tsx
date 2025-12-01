"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface OrderData {
  session_id: string;
  email: string | null;
  plan: string;
  films_total: number;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setError("No session ID found");
      setStatus("error");
      return;
    }

    // Verify payment with our API
    async function verifyPayment() {
      try {
        const response = await fetch(`/api/verify-payment?session_id=${sessionId}`);
        const data = await response.json();

        if (!response.ok || !data.paid) {
          setError(data.error || "Payment verification failed");
          setStatus("error");
          return;
        }

        // Store order in localStorage
        const orderData: OrderData = {
          session_id: data.session_id,
          email: data.email,
          plan: data.plan,
          films_total: data.films_total,
        };

        localStorage.setItem("flashback_order", JSON.stringify({
          ...orderData,
          films_used: 0,
          paid_at: new Date().toISOString(),
        }));

        setOrder(orderData);
        setStatus("success");
      } catch (err) {
        console.error("Verification error:", err);
        setError("Failed to verify payment");
        setStatus("error");
      }
    }

    verifyPayment();
  }, [searchParams]);

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[#E8C547]" />
          <p className="mt-6 text-lg text-white/60">Verifying your payment...</p>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="font-cormorant text-3xl font-light text-white">Something went wrong</h1>
          <p className="mt-4 text-white/60">{error}</p>
          <Link
            href="/product/flashback"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#E8C547] px-8 py-3 font-semibold text-black transition-colors hover:bg-[#d4b33d]"
          >
            Try Again
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="max-w-lg text-center">
        {/* Success Icon */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#E8C547]/20">
          <svg className="h-10 w-10 text-[#E8C547]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-cormorant text-4xl font-light italic text-white sm:text-5xl">
          Your order is confirmed!
        </h1>

        <p className="mt-6 text-lg text-white/60">
          {order?.films_total === 1 
            ? "You have 1 film ready to create."
            : `You have ${order?.films_total} films ready to create.`
          }
        </p>

        {order?.email && (
          <p className="mt-2 text-sm text-white/40">
            Confirmation sent to {order.email}
          </p>
        )}

        {/* CTA */}
        <Link
          href="/product/flashback/start"
          className="mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-[#E8C547] px-10 py-4 text-lg font-semibold text-black transition-all hover:bg-[#d4b33d] hover:shadow-lg hover:shadow-[#E8C547]/25"
        >
          Start Creating
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>

        {/* Order details */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
          <h3 className="text-sm font-medium uppercase tracking-wider text-white/40">Order Details</h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-white/60">Plan</span>
              <span className="text-white">{order?.plan === "pack" ? "3 Films Pack" : "1 Film"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Films Available</span>
              <span className="text-white">{order?.films_total}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

