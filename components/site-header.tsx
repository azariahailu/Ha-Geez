"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dictionary", label: "Dictionary" },
  { href: "/about", label: "About Ge'ez" },
  { href: "/about-ha-geez", label: "About ሀ ግእዝ" },
  { href: "/submit", label: "Submit" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-card focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
        <Link href="/" className="min-w-0">
          <span lang="gez" className="font-gez block text-[1.65rem] leading-none text-primary">
            ሀ ግእዝ
          </span>
          <span className="mt-1 block text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase">
            Ge&apos;ez → Amharic
          </span>
        </Link>
        <nav className="flex flex-wrap gap-1" aria-label="Primary">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/80 hover:bg-secondary",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="grid h-1 grid-cols-3" aria-hidden="true">
        <span className="bg-[#2f4634]" />
        <span className="bg-[#c6a15a]" />
        <span className="bg-[#8c2f2b]" />
      </div>
    </header>
  );
}
