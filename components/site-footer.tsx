import Link from "next/link";
import { SourceNote } from "@/components/source-note";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl space-y-2">
          <p lang="gez" className="font-gez text-xl text-primary">
            ሀ ግእዝ
          </p>
          <SourceNote compact />
          <p className="text-sm text-muted-foreground">
            The entries shipped with the app are a short demonstration set. Editors can replace them
            by importing a full sheet.
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          <Link href="/dictionary" className="underline decoration-[#c6a15a] underline-offset-4">
            Dictionary
          </Link>
          <Link href="/submit" className="underline decoration-[#c6a15a] underline-offset-4">
            Submit a word
          </Link>
        </div>
      </div>
    </footer>
  );
}
