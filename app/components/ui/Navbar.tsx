"use client";

import { siteConfig } from "@/app/siteConfig";
import useScroll from "../../lib/use-scroll";
import { anyRouteStartsWith, cx } from "../../lib/utils";
import { RiCloseLine, RiMenuLine } from "@remixicon/react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
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
            {/* Account icon - shown when logged in */}
            {user && (
              <Link
                href="/account"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                title="My Account"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
            
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
            {user && (
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
