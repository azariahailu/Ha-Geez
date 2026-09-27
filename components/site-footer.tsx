import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-end sm:justify-between">
        <p lang="gez" className="font-gez text-xl text-primary">
          ሀ ግእዝ
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/dictionary" className="underline decoration-[#c6a15a] underline-offset-4">
            Dictionary
          </Link>
          <Link href="/about" className="underline decoration-[#c6a15a] underline-offset-4">
            About Ge&apos;ez
          </Link>
          <Link href="/about-ha-geez" className="underline decoration-[#c6a15a] underline-offset-4">
            About ሀ ግእዝ
          </Link>
          <Link href="/submit" className="underline decoration-[#c6a15a] underline-offset-4">
            Submit a word
          </Link>
        </div>
      </div>
    </footer>
  );
}
