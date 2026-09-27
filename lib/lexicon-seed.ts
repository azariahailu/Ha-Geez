import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { parseLexiconSheet, type SheetRow } from "@/lib/sheet";
export type LexiconRow = {
  line?: number;
  word: string;
  origin: string;
  definition: string;
};

/** Every spreadsheet row stays its own word, including a repeated spelling. */
export function readBundledLexicon(): LexiconRow[] | null {
  const file = path.join(process.cwd(), "data", "geez-lexicon.xlsx");
  if (!existsSync(file)) return null;
  const parsed = parseLexiconSheet(readFileSync(file), "geez-lexicon.xlsx", {
    allowEmptyDefinition: true,
  });
  if (parsed.rows.length === 0) return null;
  return parsed.rows.map((row) => ({
    line: row.line,
    word: row.word,
    origin: row.origin,
    definition: row.definition,
  }));
}
