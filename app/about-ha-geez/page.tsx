import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { KIDANEWOLD_BOOK } from "@/lib/credits";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About ሀ ግእዝ",
  description: "What ሀ ግእዝ is, where the words come from, and how to look up or send a Ge'ez word.",
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
          ሀ ግእዝ is a Ge&apos;ez–Amharic dictionary built from more than 13,000 words. Search a
          Ge&apos;ez word, or a word inside an Amharic meaning. The origin sits under the word.
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

      <section className="mt-10">
        <h2 className="font-serif text-3xl">Sources</h2>
        <div className="mt-3 space-y-4 text-lg leading-8">
          <p>
            Most of the words come from{" "}
            <a
              href={KIDANEWOLD_BOOK.url}
              lang="gez"
              className="font-gez text-primary underline decoration-[#c6a15a] underline-offset-4"
            >
              {KIDANEWOLD_BOOK.title}
            </a>
            .
          </p>
          <p>Others were gathered by web scraping, and from entries sent in by the public.</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-3xl">A short tour</h2>
        <p className="mt-3 text-lg leading-8">
          Play this to see the home page, a search, one word, and the place where a word is sent.
        </p>
        <video
          controls
          playsInline
          preload="metadata"
          poster="/tour-poster.jpg"
          className="paper mt-4 aspect-video w-full bg-[#241c16]"
        >
          <source src="/tour.mp4" type="video/mp4" />
        </video>
      </section>

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
