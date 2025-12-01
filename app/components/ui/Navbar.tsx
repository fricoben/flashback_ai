"use client";

import { siteConfig } from "@/app/siteConfig";
import useScroll from "../../lib/use-scroll";
import { anyRouteStartsWith, cx } from "../../lib/utils";
import { RiCloseLine, RiMenuLine } from "@remixicon/react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface NavigationProps {
  sticky?: boolean;
}

export const Navigation: FC<NavigationProps> = ({ sticky = true }) => {
  const scrolled = useScroll(15);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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

  // Check if we're on a dark background page
  const isDarkPage = pathname === "/" || pathname.startsWith("/product/") || pathname.startsWith("/flashback");
  
  // Check if we're on the product page (different CTA text)
  const isProductPage = pathname.startsWith("/product/");

  return (
    <header
      className={cx(
        "mx-auto flex w-full transform-gpu justify-center overflow-visible px-6 py-5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1.03)] will-change-transform",
        sticky
          ? "fixed inset-x-0 top-0 z-50"
          : "relative",
        open === true ? "h-auto" : "h-18",
        // Transparent navbar - gradient fade is handled by page
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
            <span className={cx(
              "font-cormorant text-2xl font-semibold tracking-wide sm:text-3xl"
            )}>
              {siteConfig.name}
            </span>
          </Link>
          <div className="flex items-center gap-x-2">
            <Link
              href={siteConfig.mainCta}
              className={cx(
                "hidden h-10 items-center justify-center rounded-full px-6 font-semibold transition-colors md:flex",
                "bg-[#E8C547] text-black hover:bg-[#d4b33d]"
              )}
            >
              Create your Film
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className={cx(
                "z-10 aspect-square rounded-lg p-2 md:hidden",
                isDarkPage ? "text-white" : "text-black"
              )}
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
            <li onClick={() => setOpen(false)}>
              <Link
                href={isProductPage ? "/flashback" : siteConfig.mainCta}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#E8C547] py-3 text-black transition-colors hover:bg-[#d4b33d]"
              >
                {isProductPage ? "Create Your Film" : "Create your Film"}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
