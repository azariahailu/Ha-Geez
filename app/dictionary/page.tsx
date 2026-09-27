import type { Metadata } from "next";
import { DictionaryBrowser } from "@/components/dictionary-browser";
import { RichText } from "@/components/rich-text";
import { loadCopy } from "@/lib/copy";
import { searchPublished } from "@/lib/entries";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Dictionary",
  description: "Search Ge'ez words and Amharic meanings in ሀ ግእዝ.",
};

export default async function DictionaryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; letter?: string }>;
}) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const letter = typeof params.letter === "string" ? params.letter : "";
  const [result, copy] = await Promise.all([searchPublished(query, letter), loadCopy()]);

  return (
    <main id="content" className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs tracking-[0.2em] text-[#8d6b2f]">{copy["dictionary.eyebrow"]}</p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">{copy["dictionary.title"]}</h1>
      <div className="mt-3 max-w-xl leading-7 text-muted-foreground">
        <RichText text={copy["dictionary.intro"]} />
      </div>
      <div className="mt-6">
        <DictionaryBrowser
          key={`${query}::${letter}`}
          initialQuery={query}
          initialLetter={letter}
          initialEntries={result.entries}
          initialTotal={result.total}
          copy={Object.fromEntries(Object.entries(copy).filter(([key]) => key.startsWith("dictionary.")))}
        />
      </div>
    </main>
  );
}
