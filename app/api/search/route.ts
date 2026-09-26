import { searchPublished } from "@/lib/entries";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  const letter = url.searchParams.get("letter") ?? "";
  const result = await searchPublished(query, letter);
  return Response.json(result);
}
