"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/client";

export default function SubmittedPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/product/flashback");
        return;
      }
      
      setEmail(user.email || null);
    }

    checkAuth();
  }, [router, supabase]);

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
          Your film is being created!
        </h1>

        <p className="mt-6 text-lg text-white/60">
          We&apos;ve received your photos and our team is crafting your cinematic film.
        </p>

        {/* Timeline */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-8 text-left">
          <h3 className="text-sm font-medium uppercase tracking-wider text-white/40">What happens next</h3>
          
          <div className="mt-6 space-y-6">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#E8C547] text-sm font-bold text-black">
                1
              </div>
              <div>
                <h4 className="font-medium text-white">Photo Review</h4>
                <p className="mt-1 text-sm text-white/40">We&apos;ll review and enhance your photos</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white/60">
                2
              </div>
              <div>
                <h4 className="font-medium text-white/60">Film Creation</h4>
                <p className="mt-1 text-sm text-white/40">AI crafts your cinematic story</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white/60">
                3
              </div>
              <div>
                <h4 className="font-medium text-white/60">Delivery</h4>
                <p className="mt-1 text-sm text-white/40">Receive your HD film within 24-48 hours</p>
              </div>
            </div>
          </div>
        </div>

        {email && (
          <p className="mt-8 text-sm text-white/40">
            We&apos;ll send your film to <span className="text-[#E8C547]">{email}</span>
          </p>
        )}

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/product/flashback/start"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10"
          >
            Create Another Film
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-[#E8C547] px-8 py-3 font-semibold text-black transition-colors hover:bg-[#d4b33d]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

