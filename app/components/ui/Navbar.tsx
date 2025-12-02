"use client";

import { siteConfig } from "@/app/siteConfig";
import useScroll from "../../lib/use-scroll";
import { anyRouteStartsWith, cx } from "../../lib/utils";
import { RiCloseLine, RiMenuLine } from "@remixicon/react";
import Link from "next/link";
import { FC, useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/app/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface NavigationProps {
  sticky?: boolean;
}

export const Navigation: FC<NavigationProps> = ({ sticky = true }) => {
  const scrolled = useScroll(15);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginStatus, setLoginStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  if (anyRouteStartsWith(siteConfig.chatgptPages, pathname)) {
    return null;
  }

  useEffect(() => {
    const mediaQuery: MediaQueryList = window.matchMedia("(min-width: 768px)");
    const handleMediaQueryChange = () => {
      setOpen(false);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    handleMediaQueryChange();

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  // Check auth state
  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLoginDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleRequestMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!loginEmail) return;

    setLoginStatus("loading");
    try {
      const res = await fetch("/api/auth/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail }),
      });

      if (res.ok) {
        setLoginStatus("success");
      } else {
        setLoginStatus("error");
      }
    } catch {
      setLoginStatus("error");
    }
  }

  return (
    <header
      className={cx(
        "mx-auto flex w-full transform-gpu justify-center overflow-visible px-6 py-5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1.03)] will-change-transform",
        sticky
          ? "fixed inset-x-0 top-0 z-50"
          : "relative",
        open === true ? "h-auto" : "h-18",
        "bg-transparent"
      )}
    >
      <div className="w-full max-w-6xl md:my-auto">
        <div className="relative flex items-center justify-between">
          <Link
            href={siteConfig.baseLinks.home}
            aria-label="Home"
            className="flex items-center gap-4"
          >
            <span className="font-cormorant text-2xl font-semibold tracking-wide text-[#E8C547] sm:text-3xl">
              {siteConfig.name}
            </span>
          </Link>
          <div className="flex items-center gap-x-3">
            {/* Account icon - always shown */}
            <div className="relative" ref={dropdownRef}>
              {user ? (
                <Link
                  href="/account"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  title="My Account"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowLoginDropdown(!showLoginDropdown);
                      setLoginStatus("idle");
                      setLoginEmail("");
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                    title="Sign In"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>

                  {/* Login dropdown */}
                  {showLoginDropdown && (
                    <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-white/10 bg-black/95 p-5 shadow-xl backdrop-blur-md">
                      {loginStatus === "success" ? (
                        <div className="text-center">
                          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                            <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-sm text-white">Check your email for the magic link!</p>
                          <button
                            onClick={() => setShowLoginDropdown(false)}
                            className="mt-4 text-xs text-white/50 hover:text-white"
                          >
                            Close
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="mb-4 text-sm text-white/70">
                            Already have an account? Enter your email to receive a sign-in link.
                          </p>
                          <form onSubmit={handleRequestMagicLink}>
                            <input
                              type="email"
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              placeholder="your@email.com"
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-[#E8C547]/50"
                              required
                            />
                            <button
                              type="submit"
                              disabled={loginStatus === "loading"}
                              className="mt-3 w-full rounded-xl bg-[#E8C547] py-3 text-sm font-semibold text-black transition-colors hover:bg-[#d4b33d] disabled:opacity-60"
                            >
                              {loginStatus === "loading" ? "Sending..." : "Send Magic Link"}
                            </button>
                          </form>
                          {loginStatus === "error" && (
                            <p className="mt-3 text-center text-xs text-red-400">
                              Failed to send. Please try again.
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* CTA Button */}
            <Link
              href={user ? "/product/flashback/start" : siteConfig.mainCta}
              className="hidden h-10 items-center justify-center rounded-full bg-[#E8C547] px-6 font-semibold text-black transition-colors hover:bg-[#d4b33d] md:flex"
            >
              {user ? "Create Film" : "Get Started"}
            </Link>
            
            <button
              onClick={() => setOpen(!open)}
              className="z-10 aspect-square rounded-lg p-2 text-white md:hidden"
            >
              {open ? (
                <RiCloseLine aria-hidden="true" className="size-5" />
              ) : (
                <RiMenuLine aria-hidden="true" className="size-5" />
              )}
            </button>
          </div>
        </div>
        <nav
          className={cx(
            "mt-6 flex flex-col rounded-xl bg-black/60 p-4 text-lg ease-in-out backdrop-blur-md will-change-transform md:hidden",
            open ? "block" : "hidden"
          )}
        >
          {/* Mobile menu */}
          <ul className="space-y-4 font-medium">
            {user ? (
              <li onClick={() => setOpen(false)}>
                <Link
                  href="/account"
                  className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-white transition-colors hover:bg-white/20"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Account
                </Link>
              </li>
            ) : (
              <li>
                <div className="rounded-xl bg-white/10 px-4 py-4">
                  {loginStatus === "success" ? (
                    <div className="text-center">
                      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm text-white">Check your email!</p>
                    </div>
                  ) : (
                    <>
                      <p className="mb-3 text-sm text-white/70">
                        Already have an account?
                      </p>
                      <form onSubmit={handleRequestMagicLink} className="flex flex-col gap-2">
                        <input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-[#E8C547]/50"
                          required
                        />
                        <button
                          type="submit"
                          disabled={loginStatus === "loading"}
                          className="rounded-lg bg-white/20 py-2 text-sm font-medium text-white transition-colors hover:bg-white/30 disabled:opacity-60"
                        >
                          {loginStatus === "loading" ? "Sending..." : "Send Magic Link"}
                        </button>
                      </form>
                      {loginStatus === "error" && (
                        <p className="mt-2 text-center text-xs text-red-400">Failed to send</p>
                      )}
                    </>
                  )}
                </div>
              </li>
            )}
            <li onClick={() => setOpen(false)}>
              <Link
                href={user ? "/product/flashback/start" : siteConfig.mainCta}
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#E8C547] py-3 text-black transition-colors hover:bg-[#d4b33d]"
              >
                {user ? "Create Film" : "Get Started"}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
