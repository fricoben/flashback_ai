"use client";

import Link from "next/link";
import { useState } from "react";

export default function FlashbackProductPage() {
  const [selectedPlan, setSelectedPlan] = useState<"single" | "pack">("pack");
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleCheckout() {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Top fade gradient */}
      <div 
        className="pointer-events-none fixed inset-x-0 top-0 z-[5] h-32"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Product Section */}
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 pt-24 lg:flex-row lg:items-center lg:gap-20 lg:px-12">
        
        {/* Left side - Video Demo */}
        <div className="flex flex-1 items-center justify-center py-8 lg:py-0">
          <div className="relative w-full max-w-lg">
            {/* Video container with subtle frame */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-neutral-900 shadow-2xl shadow-black/50 ring-1 ring-white/10">
              <video
                src="/demo.webm"
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
              
              {/* Play indicator overlay */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                <span className="text-xs font-medium text-white/80">Sample Preview</span>
              </div>
            </div>

            {/* Navigation arrows like in the reference */}
            <div className="mt-6 flex justify-center">
              <div className="flex items-center gap-1 rounded-full bg-neutral-800/80 px-4 py-2.5">
                <button className="p-1 text-white/60 transition-colors hover:text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="mx-2 h-4 w-px bg-white/20" />
                <button className="p-1 text-white/60 transition-colors hover:text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Product Info */}
        <div className="flex flex-1 flex-col py-8 lg:py-0">
          <div className="max-w-lg">
            {/* Product Name */}
            <h1 className="font-cormorant text-4xl font-light italic tracking-wide text-white sm:text-5xl lg:text-6xl">
              The Magic of a Lifetime in One Film
            </h1>

            {/* Pricing Tiers */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              {/* Single Film */}
              <button
                onClick={() => setSelectedPlan("single")}
                className={`flex-1 rounded-2xl border-2 p-5 text-left transition-all ${
                  selectedPlan === "single"
                    ? "border-[#E8C547] bg-[#E8C547]/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white">$19.99</span>
                  <span className="text-sm text-white/40">USD</span>
                </div>
                <p className="mt-2 text-sm text-white/60">1 Film</p>
              </button>

              {/* 3 Films Pack */}
              <button
                onClick={() => setSelectedPlan("pack")}
                className={`relative flex-1 rounded-2xl border-2 p-5 text-left transition-all ${
                  selectedPlan === "pack"
                    ? "border-[#E8C547] bg-[#E8C547]/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <span className="absolute -top-3 right-4 rounded-full bg-[#E8C547] px-3 py-1 text-xs font-semibold text-black">
                  Best Value
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white">$29.99</span>
                  <span className="text-sm text-white/40">USD</span>
                </div>
                <p className="mt-2 text-sm text-white/60">3 Films</p>
              </button>
            </div>

            {/* Divider */}
            <div className="my-8 h-px bg-white/10" />

            {/* Brief description */}
            <p className="text-lg leading-relaxed text-white/40">
              Turn a lifetime of photos into a cinematic mini-film. 
              Upload your memories, we bring them to life.
            </p>

            {/* CTA Button */}
            <div className="mt-10">
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-[#E8C547] py-5 text-lg font-semibold text-black transition-all duration-300 hover:bg-[#d4b33d] hover:shadow-lg hover:shadow-[#E8C547]/25 disabled:cursor-not-allowed disabled:opacity-70"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                    <span>Redirecting to checkout...</span>
                  </div>
                ) : (
                  <>
                    <span className={`absolute left-8 text-xl transition-all duration-300 ${isHovered ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
                      +
                    </span>
                    <span className={`transition-transform duration-300 ${isHovered ? 'translate-x-2' : 'translate-x-0'}`}>
                      Create Your Film
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="bg-black px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-16 text-center font-cormorant text-3xl font-light italic text-white/80 sm:text-4xl">
            Stories from families like yours
          </h2>

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {/* Review 1 */}
            <div className="flex flex-col">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/10">
                <video
                  src="/demo.webm"
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
              <div className="mt-6">
                <p className="font-cormorant text-xl italic leading-relaxed text-white/70">
                  &ldquo;I gave this to my mom for her 70th birthday. She cried for 20 minutes. 
                  It captured 70 years of her life in the most beautiful way.&rdquo;
                </p>
                <p className="mt-4 text-sm text-white/40">— Sarah M., California</p>
              </div>
            </div>

            {/* Review 2 */}
            <div className="flex flex-col">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/10">
                <video
                  src="/demo.webm"
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
              <div className="mt-6">
                <p className="font-cormorant text-xl italic leading-relaxed text-white/70">
                  &ldquo;We made one for my grandfather&apos;s memorial. The whole family 
                  watched together — it felt like he was still with us.&rdquo;
                </p>
                <p className="mt-4 text-sm text-white/40">— David R., Texas</p>
              </div>
            </div>

            {/* Review 3 */}
            <div className="flex flex-col md:col-span-2 md:mx-auto md:max-w-sm lg:col-span-1 lg:mx-0 lg:max-w-none">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/10">
                <video
                  src="/demo.webm"
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
              <div className="mt-6">
                <p className="font-cormorant text-xl italic leading-relaxed text-white/70">
                  &ldquo;From baby photos to wedding day to grandkids — seeing my parents&apos; 
                  entire journey in 3 minutes was incredibly moving.&rdquo;
                </p>
                <p className="mt-4 text-sm text-white/40">— Jennifer L., New York</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-sm text-white/40">
            © {new Date().getFullYear()} Movila. All rights reserved.
          </span>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
