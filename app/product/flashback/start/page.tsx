"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Order {
  session_id: string;
  email: string | null;
  plan: string;
  films_total: number;
  films_used: number;
  paid_at: string;
}

export default function FlashbackStartPage() {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for valid order in localStorage
    const stored = localStorage.getItem("flashback_order");
    
    if (!stored) {
      // No order found, redirect to product page
      router.push("/product/flashback");
      return;
    }

    try {
      const orderData = JSON.parse(stored) as Order;
      
      // Check if user has films remaining
      if (orderData.films_used >= orderData.films_total) {
        // All films used, redirect to product page
        router.push("/product/flashback");
        return;
      }

      setOrder(orderData);
      setLoading(false);
    } catch {
      router.push("/product/flashback");
    }
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[#E8C547]" />
      </main>
    );
  }

  const filmsRemaining = (order?.films_total || 0) - (order?.films_used || 0);

  return (
    <main className="min-h-screen bg-black">
      {/* Top gradient */}
      <div 
        className="pointer-events-none fixed inset-x-0 top-0 z-[5] h-32"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-4xl px-6 pt-32 pb-24">
        {/* Header */}
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#E8C547]/10 px-4 py-2 text-sm text-[#E8C547]">
            <span className="h-2 w-2 rounded-full bg-[#E8C547]" />
            {filmsRemaining} {filmsRemaining === 1 ? "film" : "films"} remaining
          </div>
          
          <h1 className="font-cormorant text-4xl font-light italic text-white sm:text-5xl lg:text-6xl">
            Let&apos;s create your film
          </h1>
          
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
            Upload photos from different stages of life. The more variety, the richer your story becomes.
          </p>
        </div>

        {/* Timeline stages */}
        <div className="mt-16">
          <h2 className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-white/40">
            Suggested photo categories
          </h2>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { stage: "Childhood", years: "0-12 years", icon: "👶" },
              { stage: "Youth", years: "13-25 years", icon: "🎓" },
              { stage: "Adulthood", years: "26-50 years", icon: "💼" },
              { stage: "Golden Years", years: "50+ years", icon: "🌟" },
            ].map((item) => (
              <div
                key={item.stage}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-[#E8C547]/30 hover:bg-white/10"
              >
                <span className="text-3xl">{item.icon}</span>
                <h3 className="mt-4 font-medium text-white">{item.stage}</h3>
                <p className="mt-1 text-sm text-white/40">{item.years}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upload area */}
        <div className="mt-16">
          <div className="rounded-3xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center transition-all hover:border-[#E8C547]/40 hover:bg-white/10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#E8C547]/10">
              <svg className="h-8 w-8 text-[#E8C547]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            
            <h3 className="font-cormorant text-2xl font-light text-white">
              Drop your photos here
            </h3>
            <p className="mt-2 text-white/40">
              or click to browse (15-50 photos recommended)
            </p>
            
            <button className="mt-8 inline-flex items-center justify-center rounded-full bg-[#E8C547] px-8 py-3 font-semibold text-black transition-colors hover:bg-[#d4b33d]">
              Select Photos
            </button>
            
            <p className="mt-4 text-xs text-white/30">
              Supports JPG, PNG, HEIC • Max 20MB per photo
            </p>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-8">
          <h3 className="text-sm font-medium uppercase tracking-wider text-white/40">Tips for the best film</h3>
          <ul className="mt-4 space-y-3 text-white/60">
            <li className="flex items-start gap-3">
              <svg className="mt-1 h-4 w-4 flex-shrink-0 text-[#E8C547]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Include photos from different life stages for a richer narrative
            </li>
            <li className="flex items-start gap-3">
              <svg className="mt-1 h-4 w-4 flex-shrink-0 text-[#E8C547]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Mix candid shots with milestone moments (birthdays, weddings, graduations)
            </li>
            <li className="flex items-start gap-3">
              <svg className="mt-1 h-4 w-4 flex-shrink-0 text-[#E8C547]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Don&apos;t worry about photo quality — we enhance old and faded images
            </li>
          </ul>
        </div>

        {/* Footer nav */}
        <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-8">
          <Link 
            href="/product/flashback" 
            className="text-sm text-white/40 transition-colors hover:text-white"
          >
            ← Back to product
          </Link>
          <p className="text-sm text-white/40">
            Questions? <a href="mailto:contact@movila.io" className="text-[#E8C547] hover:underline">Contact us</a>
          </p>
        </div>
      </div>
    </main>
  );
}

