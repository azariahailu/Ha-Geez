import Link from "next/link";
import { EntryLink } from "@/components/entry-link";
import { Rule } from "@/components/rule";
import { SourceNote } from "@/components/source-note";
import { buttonVariants } from "@/components/ui/button";
import { featuredEntries, publishedCount } from "@/lib/entries";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function HomePage() {
  const [featured, count] = await Promise.all([featuredEntries(), publishedCount()]);

  return (
    <main id="content">
      <section className="relative mx-auto max-w-5xl overflow-hidden px-4 pt-12 pb-8 sm:pt-16">
        <p
          lang="gez"
          aria-hidden="true"
          className="font-gez pointer-events-none absolute -top-8 right-0 text-[9rem] leading-none text-primary opacity-[0.07] sm:text-[12rem]"
        >
          ሀ
        </p>
        <p className="text-xs tracking-[0.22em] text-[#8d6b2f] uppercase">Liturgical lexicon</p>
        <h1 lang="gez" className="font-gez mt-3 text-6xl text-primary sm:text-7xl">
          ሀ ግእዝ
        </h1>
        <p className="mt-4 max-w-xl font-serif text-2xl leading-snug text-foreground sm:text-3xl">
          A community lexicon from Ge&apos;ez into Amharic.
        </p>
        <div className="mt-6 max-w-2xl space-y-4 text-lg leading-8">
          <p>
            Ge&apos;ez is the liturgical language of the Ethiopian and Eritrean Orthodox churches. It
            was spoken in the northern highlands; between the tenth and thirteenth centuries it left
            everyday conversation and remained the language of prayer, chant, and the church schools.
          </p>
          <p>
            ሀ ግእዝ keeps a public dictionary of that language, written in the Amharic readers use to
            explain it. Look up a word, or propose one. Nothing is published until an editor approves
            it.
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dictionary"
            className={cn(buttonVariants({ size: "lg" }), "h-11 px-5 text-base no-underline")}
          >
            Search the dictionary
          </Link>
          <Link
            href="/about"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "h-11 bg-card px-5 text-base no-underline",
            )}
          >
            About Ge&apos;ez
          </Link>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          {count} published {count === 1 ? "headword" : "headwords"} in the lexicon.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8">
        <Rule />
        <div className="mt-8 flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl">From the lexicon</h2>
          <Link href="/dictionary" className="text-sm underline decoration-[#c6a15a] underline-offset-4">
            Browse all
          </Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {featured.map((entry) => (
            <EntryLink key={entry.id} entry={entry} variant="card" />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8">
        <h2 className="font-serif text-3xl">How a word gets in</h2>
        <ol className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              numeral: "፩",
              title: "Search",
              body: "Type a Ge'ez lemma or an Amharic gloss. Filter by the first Fidel family, in ሀሁ order.",
            },
            {
              numeral: "፪",
              title: "Submit",
              body: "Send one word or a short list: headword, origin when you know it, and an Amharic definition.",
            },
            {
              numeral: "፫",
              title: "Review",
              body: "Editors approve, edit, or decline. Only approved entries appear in the public lexicon.",
            },
          ].map((step) => (
            <li key={step.title} className="paper p-5">
              <span lang="gez" className="font-gez text-3xl text-primary">
                {step.numeral}
              </span>
              <h3 className="mt-2 font-serif text-2xl">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 max-w-2xl">
          <SourceNote compact />
        </div>
      </section>
    </main>
  );
}
