import type { Client, Row } from "@libsql/client";
import { getDb, numberValue, rollback } from "@/lib/db";
import { baseLetter, sortKey } from "@/lib/fidel";
import type { SheetRow } from "@/lib/sheet";
import { likePattern, normalize, wordKey } from "@/lib/text";
import type { AdminEntry, EntryDraft, EntryStatus, PublicEntry } from "@/lib/types";

const COLUMNS = `id, word, origin, definition, notes, email, status, letter, created_at, updated_at`;

function mapEntry(row: Row): AdminEntry {
  return {
    id: String(row.id),
    word: String(row.word),
    origin: String(row.origin ?? ""),
    definition: String(row.definition),
    notes: String(row.notes ?? ""),
    email: row.email == null ? "" : String(row.email),
    status: String(row.status) as EntryStatus,
    letter: String(row.letter ?? ""),
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
  };
}

export function toPublic(entry: AdminEntry): PublicEntry {
  return {
    id: entry.id,
    word: entry.word,
    origin: entry.origin,
    definition: entry.definition,
    notes: entry.notes,
    letter: entry.letter,
  };
}

function searchFilter(query: string, letter: string) {
  const text = normalize(query);
  const key = wordKey(query);
  const family = letter ? baseLetter(letter) || normalize(letter) : "";
  const clauses = ["status = 'published'"];
  const args: string[] = [];

  if (family) {
    clauses.push("letter = ?");
    args.push(family);
  }

  if (text) {
    const like = likePattern(text);
    const likeKey = likePattern(key);
    clauses.push(
      "(word LIKE ? ESCAPE '\\' OR definition LIKE ? ESCAPE '\\' OR origin LIKE ? ESCAPE '\\' OR word_key LIKE ? ESCAPE '\\')",
    );
    args.push(like, like, like, likeKey);
  }

  return { where: clauses.join(" AND "), args };
}

export async function searchPublished(query: string, letter: string, limit?: number | null) {
  const client = await getDb();
  const { where, args } = searchFilter(query, letter);
  const cap = limit === undefined ? (query.trim() || letter.trim() ? null : 80) : limit;
  const totalResult = await client.execute({
    sql: `SELECT COUNT(*) AS c FROM entries WHERE ${where}`,
    args,
  });
  const rows = await client.execute({
    sql: `SELECT ${COLUMNS} FROM entries WHERE ${where} ORDER BY sort_key, seq${cap == null ? "" : " LIMIT ?"}`,
    args: cap == null ? args : [...args, cap],
  });
  return {
    entries: rows.rows.map((row) => toPublic(mapEntry(row))),
    total: numberValue(totalResult),
  };
}

export async function getPublished(id: string): Promise<PublicEntry | null> {
  const client = await getDb();
  const result = await client.execute({
    sql: `SELECT ${COLUMNS} FROM entries WHERE id = ? AND status = 'published'`,
    args: [id],
  });
  const row = result.rows[0];
  return row ? toPublic(mapEntry(row)) : null;
}

export async function featuredEntries(): Promise<PublicEntry[]> {
  const wanted = ["ግዕዝ", "ቅኔ", "ማይ", "ቤተ ክርስቲያን"];
  const keys = wanted.map((word) => wordKey(word));
  const client = await getDb();
  const result = await client.execute({
    sql: `SELECT ${COLUMNS} FROM entries WHERE status = 'published' AND word_key IN (?, ?, ?, ?)`,
    args: keys,
  });
  const entries = result.rows.map((row) => toPublic(mapEntry(row)));
  return keys
    .map((key) => entries.find((entry) => wordKey(entry.word) === key))
    .filter((entry): entry is PublicEntry => Boolean(entry));
}

export async function publishedCount(): Promise<number> {
  const client = await getDb();
  const result = await client.execute(
    "SELECT COUNT(*) AS c FROM entries WHERE status = 'published'",
  );
  return numberValue(result);
}

export async function statusCounts(): Promise<Record<EntryStatus, number>> {
  const client = await getDb();
  const result = await client.execute("SELECT status, COUNT(*) AS c FROM entries GROUP BY status");
  const counts: Record<EntryStatus, number> = { pending: 0, published: 0, rejected: 0 };
  for (const row of result.rows) {
    const status = String(row.status) as EntryStatus;
    if (status in counts) counts[status] = Number(row.c);
  }
  return counts;
}

export async function listAdmin(status: EntryStatus, query = "", limit = 200): Promise<AdminEntry[]> {
  const client = await getDb();
  const text = normalize(query);
  const args: Array<string | number> = [status];
  let where = "status = ?";
  if (text) {
    where += " AND (word LIKE ? ESCAPE '\\' OR definition LIKE ? ESCAPE '\\' OR word_key LIKE ? ESCAPE '\\')";
    const like = likePattern(text);
    const likeKey = likePattern(wordKey(text));
    args.push(like, like, likeKey);
  }
  args.push(limit);
  const order = status === "published" ? "sort_key, seq" : "created_at DESC";
  const result = await client.execute({
    sql: `SELECT ${COLUMNS} FROM entries WHERE ${where} ORDER BY ${order} LIMIT ?`,
    args,
  });
  return result.rows.map((row) => mapEntry(row));
}

export async function findPublishedWords(keys: string[]): Promise<string[]> {
  if (keys.length === 0) return [];
  const client = await getDb();
  const marks = keys.map(() => "?").join(", ");
  const result = await client.execute({
    sql: `SELECT word FROM entries WHERE status = 'published' AND word_key IN (${marks})`,
    args: keys,
  });
  return result.rows.map((row) => String(row.word));
}

export async function insertSubmissions(input: {
  email: string;
  entries: EntryDraft[];
}): Promise<string[]> {
  const client = await getDb();
  const now = new Date().toISOString();
  const ids: string[] = [];
  const tx = await client.transaction("write");
  try {
    for (const entry of input.entries) {
      const id = crypto.randomUUID();
      ids.push(id);
      await tx.execute({
        sql: `INSERT INTO entries (
          id, word, origin, definition, notes, email, status, letter, word_key, sort_key, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?)`,
        args: [
          id,
          entry.word,
          entry.origin,
          entry.definition,
          entry.notes,
          input.email,
          baseLetter(entry.word),
          wordKey(entry.word),
          sortKey(entry.word),
          now,
          now,
        ],
      });
    }
    await tx.commit();
    return ids;
  } catch (error) {
    await rollback(tx);
    throw error;
  }
}

async function readEntry(client: Client | Awaited<ReturnType<Client["transaction"]>>, id: string) {
  const result = await client.execute({
    sql: `SELECT ${COLUMNS} FROM entries WHERE id = ?`,
    args: [id],
  });
  return result.rows[0] ? mapEntry(result.rows[0]) : null;
}

export async function publishEntry(id: string, draft: EntryDraft): Promise<AdminEntry | null> {
  const client = await getDb();
  const tx = await client.transaction("write");
  try {
    const current = await readEntry(tx, id);
    if (!current || current.status === "published") {
      await tx.rollback();
      return current?.status === "published" ? current : null;
    }

    const now = new Date().toISOString();
    const key = wordKey(draft.word);
    const other = await tx.execute({
      sql: "SELECT id FROM entries WHERE status = 'published' AND word_key = ? AND id != ?",
      args: [key, id],
    });

    if (other.rows[0]) {
      const keepId = String(other.rows[0].id);
      await tx.execute({
        sql: `UPDATE entries
          SET word = ?, origin = ?, definition = ?, notes = ?, letter = ?, word_key = ?, sort_key = ?, updated_at = ?
          WHERE id = ?`,
        args: [
          draft.word,
          draft.origin,
          draft.definition,
          draft.notes,
          baseLetter(draft.word),
          key,
          sortKey(draft.word),
          now,
          keepId,
        ],
      });
      await tx.execute({ sql: "DELETE FROM entries WHERE id = ?", args: [id] });
    } else {
      await tx.execute({
        sql: `UPDATE entries
          SET word = ?, origin = ?, definition = ?, notes = ?, email = ?, status = 'published',
              letter = ?, word_key = ?, sort_key = ?, updated_at = ?
          WHERE id = ?`,
        args: [
          draft.word,
          draft.origin,
          draft.definition,
          draft.notes,
          current.email,
          baseLetter(draft.word),
          key,
          sortKey(draft.word),
          now,
          id,
        ],
      });
    }

    await tx.commit();
    return current;
  } catch (error) {
    await rollback(tx);
    throw error;
  }
}

export async function savePublished(id: string, draft: EntryDraft): Promise<"ok" | "missing" | "conflict"> {
  const client = await getDb();
  const key = wordKey(draft.word);
  const conflict = await client.execute({
    sql: "SELECT id FROM entries WHERE status = 'published' AND word_key = ? AND id != ?",
    args: [key, id],
  });
  if (conflict.rows[0]) return "conflict";

  const result = await client.execute({
    sql: `UPDATE entries
      SET word = ?, origin = ?, definition = ?, notes = ?, letter = ?, word_key = ?, sort_key = ?, updated_at = ?
      WHERE id = ? AND status = 'published'`,
    args: [
      draft.word,
      draft.origin,
      draft.definition,
      draft.notes,
      baseLetter(draft.word),
      key,
      sortKey(draft.word),
      new Date().toISOString(),
      id,
    ],
  });
  return result.rowsAffected > 0 ? "ok" : "missing";
}

export async function setStatus(id: string, status: "pending" | "rejected"): Promise<boolean> {
  const client = await getDb();
  const result = await client.execute({
    sql: "UPDATE entries SET status = ?, updated_at = ? WHERE id = ? AND status != 'published'",
    args: [status, new Date().toISOString(), id],
  });
  if (result.rowsAffected > 0) return true;

  if (status === "pending") {
    const unpublished = await client.execute({
      sql: "UPDATE entries SET status = 'pending', updated_at = ? WHERE id = ? AND status = 'published'",
      args: [new Date().toISOString(), id],
    });
    return unpublished.rowsAffected > 0;
  }

  return false;
}

export async function importPublished(rows: SheetRow[]): Promise<{
  created: number;
  updated: number;
  unchanged: number;
}> {
  const client = await getDb();
  const tx = await client.transaction("write");
  let created = 0;
  let updated = 0;
  let unchanged = 0;

  try {
    for (const row of rows) {
      const key = wordKey(row.word);
      const existing = await tx.execute({
        sql: "SELECT id, word, origin, definition FROM entries WHERE status = 'published' AND word_key = ?",
        args: [key],
      });
      const now = new Date().toISOString();
      const current = existing.rows[0];
      if (current) {
        if (
          String(current.word) === row.word &&
          String(current.origin ?? "") === row.origin &&
          String(current.definition) === row.definition
        ) {
          unchanged += 1;
          continue;
        }
        await tx.execute({
          sql: `UPDATE entries
            SET word = ?, origin = ?, definition = ?, letter = ?, word_key = ?, sort_key = ?, updated_at = ?
            WHERE id = ?`,
          args: [
            row.word,
            row.origin,
            row.definition,
            baseLetter(row.word),
            key,
            sortKey(row.word),
            now,
            String(current.id),
          ],
        });
        updated += 1;
      } else {
        await tx.execute({
          sql: `INSERT INTO entries (
            id, word, origin, definition, notes, email, status, letter, word_key, sort_key, created_at, updated_at
          ) VALUES (?, ?, ?, ?, '', '', 'published', ?, ?, ?, ?, ?)`,
          args: [
            crypto.randomUUID(),
            row.word,
            row.origin,
            row.definition,
            baseLetter(row.word),
            key,
            sortKey(row.word),
            now,
            now,
          ],
        });
        created += 1;
      }
    }
    await tx.commit();
    return { created, updated, unchanged };
  } catch (error) {
    await rollback(tx);
    throw error;
  }
}
