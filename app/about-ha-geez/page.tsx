import type { Metadata } from "next";
import Link from "next/link";
import { RichText } from "@/components/rich-text";
import { buttonVariants } from "@/components/ui/button";
import { loadCopy } from "@/lib/copy";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "About ሀ ግእዝ",
  description: "What ሀ ግእዝ is, where the words come from, and how to look up or send a Ge'ez word.",
};

export default async function AboutHaGeezPage() {
  const copy = await loadCopy();

  return (
    <main id="content" className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <p className="text-xs tracking-[0.2em] text-[#8d6b2f]">{copy["about-ha-geez.eyebrow"]}</p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">
        {copy["about-ha-geez.titleBefore"]}{" "}
        <span lang="gez" className="font-gez text-primary">
          {copy["about-ha-geez.titleName"]}
        </span>
      </h1>
      <div className="mt-6 space-y-4 text-lg leading-8">
        <RichText text={copy["about-ha-geez.p1"]} />
        <RichText text={copy["about-ha-geez.p2"]} />
        <RichText text={copy["about-ha-geez.p3"]} />
      </div>

      <section className="mt-10">
        <h2 className="font-serif text-3xl">{copy["about-ha-geez.sourcesTitle"]}</h2>
        <div className="mt-3 space-y-4 text-lg leading-8">
          <RichText text={copy["about-ha-geez.book"]} />
          <RichText text={copy["about-ha-geez.otherSources"]} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-3xl">{copy["about-ha-geez.tourTitle"]}</h2>
        <div className="mt-3 text-lg leading-8">
          <RichText text={copy["about-ha-geez.tourCaption"]} />
        </div>
        <video
          controls
          playsInline
          preload="metadata"
          poster={copy["about-ha-geez.posterUrl"]}
          className="paper mt-4 aspect-video w-full bg-[#241c16]"
        >
          <source src={copy["about-ha-geez.tourUrl"]} type="video/mp4" />
        </video>
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/dictionary" className={cn(buttonVariants(), "h-11 px-4 no-underline")}>
          {copy["about-ha-geez.openDictionary"]}
        </Link>
        <Link
          href="/submit"
          className={cn(buttonVariants({ variant: "outline" }), "h-11 bg-card px-4 no-underline")}
        >
          {copy["about-ha-geez.submitWord"]}
        </Link>
      </div>
    </main>
  );
}
