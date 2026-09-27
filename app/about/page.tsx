import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AbugidaTables } from "@/components/abugida-tables";
import { RichText, SevenOrders } from "@/components/rich-text";
import { Rule } from "@/components/rule";
import { loadCopy } from "@/lib/copy";
import { alefatFrom, fidelFrom, headersFrom, numbersFrom } from "@/lib/structured-copy";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "About Ge'ez",
  description:
    "A short introduction to Ge'ez, the liturgical language of the Ethiopian and Eritrean Orthodox churches, with the letters and the numbers.",
};

function Section({
  numeral,
  title,
  children,
  id,
}: {
  numeral: string;
  title: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="mt-10 scroll-mt-24">
      <p lang="gez" className="font-gez text-2xl text-primary">
        {numeral}
      </p>
      <h2 className="mt-1 font-serif text-3xl">{title}</h2>
      <div className="mt-3 space-y-4 text-lg leading-8">{children}</div>
    </section>
  );
}

export default async function AboutPage() {
  const copy = await loadCopy();
  const alefat = alefatFrom(copy["about.alefat"]);

  return (
    <main id="content" className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <img
        src={copy["about.sealUrl"]}
        alt={copy["about.sealAlt"]}
        width={458}
        height={545}
        className="mx-auto mb-8 h-auto w-52 sm:w-64"
      />
      <p className="text-xs tracking-[0.2em] text-[#8d6b2f] uppercase">{copy["about.eyebrow"]}</p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">{copy["about.title"]}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        (
        <a
          href={copy["about.citeUrl"]}
          className="text-foreground underline decoration-[#c6a15a] underline-offset-4"
        >
          {copy["about.citeAuthor"]}, “{copy["about.citeTitle"]},”
        </a>{" "}
        {copy["about.citePublisher"]}, {copy["about.citeDate"]}.)
      </p>
      <p className="mt-4 font-serif text-2xl leading-snug text-foreground/90">{copy["about.lede"]}</p>
      <div className="mt-6">
        <Rule />
      </div>

      <Section numeral={copy["about.s1.numeral"]} title={copy["about.s1.title"]}>
        <RichText text={copy["about.s1.body"]} />
      </Section>

      <Section id="abugida" numeral={copy["about.s2.numeral"]} title={copy["about.s2.title"]}>
        <RichText text={copy["about.s2.p1"]} />
        <SevenOrders text={copy["about.orders"]} />
        <RichText text={copy["about.s2.p2"]} />
        <AbugidaTables
          quote={copy["about.quote"]}
          numbers={numbersFrom(copy["about.numbers"])}
          numberHeaders={headersFrom(copy["about.numberHeaders"])}
          fidel={fidelFrom(copy["about.fidel"])}
          alefatTitle={alefat.title}
          alefatIntro={alefat.intro}
          alefatLetters={alefat.letters}
          glory={copy["about.glory"]}
        />
      </Section>

      <Section numeral={copy["about.s3.numeral"]} title={copy["about.s3.title"]}>
        <RichText text={copy["about.s3.body"]} />
      </Section>

      <Section numeral={copy["about.s4.numeral"]} title={copy["about.s4.title"]}>
        <RichText text={copy["about.s4.p1"]} />
        <RichText text={copy["about.s4.p2"]} />
      </Section>

      <Section numeral={copy["about.s5.numeral"]} title={copy["about.s5.title"]}>
        <RichText text={copy["about.s5.p1"]} />
        <RichText text={copy["about.s5.p2"]} />
      </Section>
    </main>
  );
}
