import { unstable_cache } from "next/cache";
import { searchPublished } from "@/lib/entries";

const readSearch = unstable_cache(
  async (query: string, letter: string, limitKey: string) => {
    const limit = limitKey === "" ? undefined : Number(limitKey);
    return searchPublished(query, letter, limit);
  },
  ["lexicon-search"],
  { revalidate: 600, tags: ["lexicon"] },
);

/** Identical lookups share one stored result for ten minutes, until the lexicon changes. */
export function cachedSearch(query: string, letter: string, limit?: number | null) {
  const limitKey = limit == null ? "" : String(limit);
  return readSearch(query, letter, limitKey);
}
