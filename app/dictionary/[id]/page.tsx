import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EntryLink } from "@/components/entry-link";
import { loadCopy } from "@/lib/copy";
import { getPublished, searchPublished } from "@/lib/entries";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const entry = await getPublished(id);
  if (!entry) return { title: "Not found" };
  return {
    title: entry.word,
    description: entry.definition.replace(/\s+/g, " ").slice(0, 180),
  };
}

export default async function EntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [entry, copy] = await Promise.all([getPublished(id), loadCopy()]);
  if (!entry) notFound();

  const related = entry.letter
    ? (await searchPublished("", entry.letter, 6)).entries.filter((item) => item.id !== entry.id).slice(0, 4)
    : [];

  return (
    <main id="content" className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href={entry.letter ? `/dictionary?letter=${encodeURIComponent(entry.letter)}` : "/dictionary"}
        className="text-sm text-muted-foreground underline decoration-[#c6a15a] underline-offset-4"
      >
        {entry.letter
          ? copy["dictionary.more"].replace("{letter}", entry.letter)
          : copy["dictionary.back"]}
      </Link>
      <article className="paper mt-4 px-5 py-8 sm:px-8">
        <h1 lang="gez" className="font-gez text-5xl text-primary sm:text-6xl">
          {entry.word}
        </h1>
        {entry.origin ? (
          <p lang="am" className="mt-4 text-lg text-[#8d6b2f]">
            {entry.origin}
          </p>
        ) : null}
        <p lang="am" className="mt-6 text-xl leading-9 whitespace-pre-line">
          {entry.definition}
        </p>
        {entry.notes ? (
          <p className="mt-6 border-t border-border pt-4 text-sm leading-6 text-muted-foreground">
            <span className="text-foreground">{copy["dictionary.note"]} </span>
            {entry.notes}
          </p>
        ) : null}
      </article>
      {related.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-serif text-2xl">{copy["dictionary.nearby"]}</h2>
          <div className="mt-2">
            {related.map((item) => (
              <EntryLink key={item.id} entry={item} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
