"use client";

import { siteConfig } from "@/app/siteConfig";
import { usePathname } from "next/navigation";
import { anyRouteStartsWith } from "@/app/lib/utils";
import Link from "next/link";

export default function Footer() {
  const pathname = usePathname();

  if (anyRouteStartsWith(siteConfig.chatgptPages, pathname)) {
    return null;
  }

  // Hide footer on fullscreen pages
  if (pathname === "/" || pathname.startsWith("/product/") || pathname.startsWith("/flashback")) {
    return null;
  }

  return (
    <footer id="footer" className="mt-24">
      <div className="mx-auto max-w-6xl px-3 pb-8">
        <div className="flex flex-col items-center justify-between gap-6 border-t border-black/10 pt-8 sm:flex-row dark:border-white/10">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <span className="font-cormorant text-xl font-semibold text-black dark:text-white">{siteConfig.name}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Turn life memories into mini-films
            </span>
          </div>
          <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/privacy" className="transition-colors hover:text-black dark:hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-black dark:hover:text-white">
              Terms
            </Link>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
