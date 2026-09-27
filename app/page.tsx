import Link from "next/link";
import { EntryLink } from "@/components/entry-link";
import { RichText } from "@/components/rich-text";
import { Rule } from "@/components/rule";
import { buttonVariants } from "@/components/ui/button";
import { loadCopy } from "@/lib/copy";
import { featuredEntries, publishedCount } from "@/lib/entries";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function HomePage() {
  const [featured, count, copy] = await Promise.all([featuredEntries(), publishedCount(), loadCopy()]);

  const steps = [
    { numeral: copy["home.step1.numeral"], title: copy["home.step1.title"], body: copy["home.step1.body"] },
    { numeral: copy["home.step2.numeral"], title: copy["home.step2.title"], body: copy["home.step2.body"] },
    { numeral: copy["home.step3.numeral"], title: copy["home.step3.title"], body: copy["home.step3.body"] },
  ];

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
        <p className="text-xs tracking-[0.22em] text-[#8d6b2f] uppercase">{copy["home.eyebrow"]}</p>
        <h1 lang="gez" className="font-gez mt-3 text-6xl text-primary sm:text-7xl">
          {copy["home.title"]}
        </h1>
        <p className="mt-4 max-w-xl font-serif text-2xl leading-snug text-foreground sm:text-3xl">
          {copy["home.lede"]}
        </p>
        <div className="mt-6 max-w-2xl space-y-4 text-lg leading-8">
          <RichText text={copy["home.p1"]} />
          <RichText text={copy["home.p2"]} />
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dictionary"
            className={cn(buttonVariants({ size: "lg" }), "h-11 px-5 text-base no-underline")}
          >
            {copy["home.searchButton"]}
          </Link>
          <Link
            href="/about"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "h-11 bg-card px-5 text-base no-underline",
            )}
          >
            {copy["home.aboutButton"]}
          </Link>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          {count.toLocaleString("en-US")} {count === 1 ? "word" : "words"}.{" "}
          <RichText inline text={copy["home.lettersLink"]} />
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8">
        <Rule />
        <div className="mt-8 flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl">{copy["home.featuredTitle"]}</h2>
          <Link href="/dictionary" className="text-sm underline decoration-[#c6a15a] underline-offset-4">
            {copy["home.browse"]}
          </Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {featured.map((entry) => (
            <EntryLink key={entry.id} entry={entry} variant="card" />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8">
        <h2 className="font-serif text-3xl">{copy["home.howTitle"]}</h2>
        <ol className="mt-5 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.title} className="paper p-5">
              <span lang="gez" className="font-gez text-3xl text-primary">
                {step.numeral}
              </span>
              <h3 className="mt-2 font-serif text-2xl">{step.title}</h3>
              <div className="mt-2 text-sm leading-6 text-muted-foreground">
                <RichText text={step.body} />
              </div>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
