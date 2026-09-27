import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About ሀ ግእዝ",
  description: "What ሀ ግእዝ is, and how to look up or send a Ge'ez word.",
};

export default function AboutHaGeezPage() {
  return (
    <main id="content" className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <p className="text-xs tracking-[0.2em] text-[#8d6b2f] uppercase">ስለ ሀ ግእዝ</p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">
        About <span lang="gez" className="font-gez text-primary">ሀ ግእዝ</span>
      </h1>
      <div className="mt-6 space-y-4 text-lg leading-8">
        <p>
          ሀ ግእዝ is a Ge&apos;ez–Amharic dictionary for readers of the liturgical language. Search a
          Ge&apos;ez word, or a word inside an Amharic meaning.
        </p>
        <p>
          If you know a word that is not here yet, open Submit a word. Write the Ge&apos;ez word, where
          it comes from if you know, and the meaning in Amharic. You can send one word or several.
          After you send them, the page shows the words you sent, and you can send more from there.
        </p>
        <p>
          The letters and the numbers are on{" "}
          <Link href="/about#abugida" className="underline decoration-[#c6a15a] underline-offset-4">
            About Ge&apos;ez
          </Link>
          .
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/dictionary" className={cn(buttonVariants(), "h-11 px-4 no-underline")}>
          Open the dictionary
        </Link>
        <Link
          href="/submit"
          className={cn(buttonVariants({ variant: "outline" }), "h-11 bg-card px-4 no-underline")}
        >
          Submit a word
        </Link>
      </div>
    </main>
  );
}
