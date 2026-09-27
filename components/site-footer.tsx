import Link from "next/link";

export function SiteFooter({
  brand,
  links,
}: {
  brand: string;
  links: { href: string; label: string }[];
}) {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-end sm:justify-between">
        <p lang="gez" className="font-gez text-xl text-primary">
          {brand}
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="underline decoration-[#c6a15a] underline-offset-4">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
