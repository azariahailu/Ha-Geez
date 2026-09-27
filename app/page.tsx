import Link from "next/link";
import { EntryLink } from "@/components/entry-link";
import { Rule } from "@/components/rule";
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
        <p className="text-xs tracking-[0.22em] text-[#8d6b2f] uppercase">Dictionary</p>
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
            ሀ ግእዝ is a dictionary of that language, with the meaning in Amharic. Look up a word. If
            it is missing, send the Ge&apos;ez word, where it comes from if you know, and the meaning
            in Amharic.
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
          {count.toLocaleString("en-US")} {count === 1 ? "word" : "words"}.{" "}
          <Link href="/about#abugida" className="underline decoration-[#c6a15a] underline-offset-4">
            Letters and numbers
          </Link>
          .
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
        <h2 className="font-serif text-3xl">How to use it</h2>
        <ol className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              numeral: "፩",
              title: "Search",
              body: "Type a Ge'ez word or an Amharic meaning. Filter by the first letter, in አበገደ order: አ፣ በ፣ ገ፣ ደ.",
            },
            {
              numeral: "፪",
              title: "Submit",
              body: "Open Submit a word. Write the Ge'ez word, where it comes from if you know, and the meaning in Amharic. Add another row if you have more than one. An email is optional.",
            },
            {
              numeral: "፫",
              title: "What you see next",
              body: "The page lists the words you sent. You can send another from the same page.",
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
      </section>
    </main>
  );
}
