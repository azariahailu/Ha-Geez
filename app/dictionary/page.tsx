import type { Metadata } from "next";
import { DictionaryBrowser } from "@/components/dictionary-browser";
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
  const result = await searchPublished(query, letter);

  return (
    <main id="content" className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs tracking-[0.2em] text-[#8d6b2f] uppercase">መዝገበ ቃላት</p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Dictionary</h1>
      <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
        Ge&apos;ez words, with origin and a meaning in Amharic. The letters run in አበገደ order:
        አ፣ በ፣ ገ፣ ደ. Spacing does not matter: ቤተ ክርስቲያን and ቤተክርስቲያን are the same search.
      </p>
      <div className="mt-6">
        <DictionaryBrowser
          key={`${query}::${letter}`}
          initialQuery={query}
          initialLetter={letter}
          initialEntries={result.entries}
          initialTotal={result.total}
        />
      </div>
    </main>
  );
}
