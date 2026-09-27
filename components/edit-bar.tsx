"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function pageSlug(pathname: string): string | null {
  if (pathname === "/") return "home";
  if (pathname === "/dictionary" || pathname.startsWith("/dictionary/")) return "dictionary";
  if (pathname === "/about") return "about";
  if (pathname === "/about-ha-geez") return "about-ha-geez";
  if (pathname === "/submit") return "submit";
  if (pathname === "/contact") return "contact";
  return null;
}

export function EditBar() {
  const pathname = usePathname();
  const slug = pageSlug(pathname);
  if (!slug) return null;

  return (
    <div className="fixed right-4 bottom-4 z-40">
      <Link
        href={`/admin/pages/${slug}`}
        className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm text-primary-foreground shadow-md"
      >
        Edit this page
      </Link>
    </div>
  );
}
