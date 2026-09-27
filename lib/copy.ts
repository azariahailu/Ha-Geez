import { rollback, getDb } from "@/lib/db";
import {
  COPY_FIELDS,
  fieldByKey,
  fieldsFor,
  type CopyField,
} from "@/lib/site-copy";
import { parseAlefat, parseFidel, parseNumbers } from "@/lib/structured-copy";

export async function loadCopy(): Promise<Record<string, string>> {
  const client = await getDb();
  const result = await client.execute("SELECT key, body FROM page_copy");
  const overrides = new Map(result.rows.map((row) => [String(row.key), String(row.body)]));
  const copy: Record<string, string> = {};
  for (const field of COPY_FIELDS) {
    copy[field.key] = overrides.get(field.key) ?? field.defaultText;
  }
  return copy;
}

function safeUrl(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes(" ")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function validateField(field: CopyField, value: string): string | null {
  if (value.length > 50000) return `${field.label} is too long.`;
  if (field.kind === "url") {
    if (!safeUrl(value.trim())) return `${field.label} needs a site path or an http(s) link.`;
  }
  if (field.kind === "numbers" && !parseNumbers(value)) {
    return `${field.label} needs five columns on every line, separated by " | ".`;
  }
  if (field.kind === "fidel" && !parseFidel(value)) {
    return `${field.label} needs each letter as numeral | letter, then three lines, with a blank line between letters.`;
  }
  if (field.kind === "alefat" && !parseAlefat(value)) {
    return `${field.label} needs a title, the introduction, and each name after a line that is only ---.`;
  }
  if (field.kind === "orders") {
    const lines = value.replace(/\r\n/g, "\n").split("\n").filter((line) => line.trim() !== "");
    if (lines.length < 2) return `${field.label} needs a heading and at least one order.`;
  }
  if (field.key === "about.numberHeaders") {
    const parts = value.split(" | ");
    if (parts.length !== 5 || parts.some((part) => part.trim() === "")) {
      return "Number column headings need five names separated by \" | \".";
    }
  }
  return null;
}

export async function savePageCopy(slug: string, values: Record<string, string>): Promise<string | null> {
  const fields = fieldsFor(slug);
  if (fields.length === 0) return "That page is not editable.";
  for (const field of fields) {
    const value = values[field.key];
    if (typeof value !== "string") return `${field.label} is missing.`;
    const issue = validateField(field, value);
    if (issue) return issue;
  }

  const client = await getDb();
  const now = new Date().toISOString();
  const tx = await client.transaction("write");
  try {
    for (const field of fields) {
      const value = values[field.key].replace(/\r\n/g, "\n");
      if (value === field.defaultText) {
        await tx.execute({ sql: "DELETE FROM page_copy WHERE key = ?", args: [field.key] });
      } else {
        await tx.execute({
          sql: `INSERT INTO page_copy (key, body, updated_at) VALUES (?, ?, ?)
            ON CONFLICT(key) DO UPDATE SET body = excluded.body, updated_at = excluded.updated_at`,
          args: [field.key, value, now],
        });
      }
    }
    await tx.commit();
    return null;
  } catch (error) {
    await rollback(tx);
    throw error;
  }
}

export function knownField(key: string): boolean {
  return Boolean(fieldByKey(key));
}
