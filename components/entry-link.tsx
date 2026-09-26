import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PublicEntry } from "@/lib/types";

export function EntryLink({
  entry,
  variant = "row",
}: {
  entry: PublicEntry;
  variant?: "row" | "card";
}) {
  return (
    <Link
      href={`/dictionary/${entry.id}`}
      className={cn(
        "group block focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        variant === "row"
          ? "border-b border-border py-5"
          : "paper h-full p-5 transition-colors hover:border-[#c6a15a]",
      )}
    >
      <span
        lang="gez"
        className="font-gez block text-3xl leading-tight text-foreground group-hover:text-primary"
      >
        {entry.word}
      </span>
      {entry.origin ? (
        <span lang="am" className="mt-2 block text-sm text-[#8d6b2f]">
          {entry.origin}
        </span>
      ) : null}
      <span lang="am" className="mt-2 block text-lg leading-relaxed text-foreground/90">
        {entry.definition}
      </span>
    </Link>
  );
}
