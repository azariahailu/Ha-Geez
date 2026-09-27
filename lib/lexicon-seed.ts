import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { parseLexiconSheet, type SheetRow } from "@/lib/sheet";
import { wordKey } from "@/lib/text";

export type LexiconRow = {
  word: string;
  origin: string;
  definition: string;
};

/** Same spelling keeps every distinct meaning, in sheet order, on one headword. */
export function mergeSheetRows(rows: SheetRow[]): LexiconRow[] {
  const order: string[] = [];
  const grouped = new Map<string, { word: string; origins: string[]; definitions: string[] }>();

  for (const row of rows) {
    const key = wordKey(row.word);
    if (!key) continue;
    let item = grouped.get(key);
    if (!item) {
      item = { word: row.word, origins: [], definitions: [] };
      grouped.set(key, item);
      order.push(key);
    }
    const origin = row.origin.trim();
    if (origin && !item.origins.includes(origin)) item.origins.push(origin);
    const definition = row.definition.trim();
    if (definition && !item.definitions.includes(definition)) item.definitions.push(definition);
  }

  return order
    .map((key) => {
      const item = grouped.get(key);
      if (!item || item.definitions.length === 0) return null;
      return {
        word: item.word,
        origin: item.origins.join(" · "),
        definition: item.definitions.join("\n"),
      };
    })
    .filter((row): row is LexiconRow => row !== null);
}

export function readBundledLexicon(): LexiconRow[] | null {
  const file = path.join(process.cwd(), "data", "geez-lexicon.xlsx");
  if (!existsSync(file)) return null;
  const parsed = parseLexiconSheet(readFileSync(file), "geez-lexicon.xlsx");
  if (parsed.rows.length === 0) return null;
  return mergeSheetRows(parsed.rows);
}
