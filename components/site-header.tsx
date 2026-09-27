"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavLink = { href: string; label: string };

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({
  brand,
  subtitle,
  links,
  contact,
}: {
  brand: string;
  subtitle: string;
  links: NavLink[];
  contact: NavLink;
}) {
  const pathname = usePathname();
  const contactActive = isActive(pathname, contact.href);

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-card focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <img
            src="/mark.jpg"
            alt=""
            width={372}
            height={398}
            className="h-11 w-11 shrink-0 object-contain mix-blend-multiply"
          />
          <span className="min-w-0">
            <span lang="gez" className="font-gez block text-[1.65rem] leading-none text-primary">
              {brand}
            </span>
            <span className="mt-1 block text-[0.68rem] tracking-[0.14em] text-muted-foreground">
              {subtitle}
            </span>
          </span>
        </Link>
        <nav className="ml-auto flex flex-wrap items-center justify-end gap-1" aria-label="Primary">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
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
          <Link
            href={contact.href}
            aria-current={contactActive ? "page" : undefined}
            className={cn(
              "ml-1 rounded-full px-3 py-1.5 text-sm ring-1 ring-[#c6a15a]",
              contactActive
                ? "bg-primary text-primary-foreground ring-primary"
                : "text-foreground hover:bg-secondary",
            )}
          >
            {contact.label}
          </Link>
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
