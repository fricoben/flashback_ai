"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Status = "loading" | "creating_account" | "sending_link" | "success" | "error";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setError("No session ID found");
      setStatus("error");
      return;
    }

    async function processPayment() {
      try {
        // 1. Verify payment and create user
        setStatus("creating_account");
        
        const createResponse = await fetch("/api/auth/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });

        const createData = await createResponse.json();

        if (!createResponse.ok) {
          setError(createData.error || "Failed to create account");
          setStatus("error");
          return;
        }

        setEmail(createData.email);

        // 2. Send magic link
        setStatus("sending_link");
        
        const linkResponse = await fetch("/api/auth/send-magic-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: createData.email }),
        });

        const linkData = await linkResponse.json();

        if (!linkResponse.ok) {
          // Don't fail completely - user account was created
          console.warn("Magic link send failed:", linkData.error);
        }

        setStatus("success");
      } catch (err) {
        console.error("Process error:", err);
        setError("Something went wrong");
        setStatus("error");
      }
    }

    processPayment();
  }, [searchParams]);

  if (status === "loading" || status === "creating_account" || status === "sending_link") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[#E8C547]" />
          <p className="mt-6 text-lg text-white/60">
            {status === "loading" && "Verifying your payment..."}
            {status === "creating_account" && "Setting up your account..."}
            {status === "sending_link" && "Sending your access link..."}
          </p>
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="font-cormorant text-4xl font-light italic text-white sm:text-5xl">
          Check your email
        </h1>

        <p className="mt-6 text-lg text-white/60">
          We&apos;ve sent a magic link to
        </p>
        
        {email && (
          <p className="mt-2 text-xl font-medium text-[#E8C547]">
            {email}
          </p>
        )}

        <p className="mt-6 text-white/40">
          Click the link in your email to access your films. The link works on any device.
        </p>

        {/* What to expect */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
          <h3 className="text-sm font-medium uppercase tracking-wider text-white/40">What happens next</h3>
          <ul className="mt-4 space-y-3 text-white/60">
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#E8C547]/20 text-xs font-bold text-[#E8C547]">1</span>
              <span>Click the magic link in your email</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#E8C547]/20 text-xs font-bold text-[#E8C547]">2</span>
              <span>Upload your photos (15-50 recommended)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#E8C547]/20 text-xs font-bold text-[#E8C547]">3</span>
              <span>Receive your film within 24-48 hours</span>
            </li>
          </ul>
        </div>

        {/* Resend link */}
        <p className="mt-8 text-sm text-white/40">
          Didn&apos;t receive the email?{" "}
          <button 
            onClick={async () => {
              if (email) {
                await fetch("/api/auth/send-magic-link", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                });
                alert("Magic link resent!");
              }
            }}
            className="text-[#E8C547] hover:underline"
          >
            Resend link
          </button>
        </p>
      </div>
    </main>
  );
}

