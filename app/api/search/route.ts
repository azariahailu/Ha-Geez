import { cachedSearch } from "@/lib/cached-search";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  const letter = url.searchParams.get("letter") ?? "";
  const result = await cachedSearch(query, letter);
  return Response.json(result, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=86400",
    },
  });
}
