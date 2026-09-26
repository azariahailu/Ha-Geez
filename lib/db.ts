import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createClient, type Client, type ResultSet, type Transaction } from "@libsql/client";
import { baseLetter, sortKey } from "@/lib/fidel";
import { SEED_ENTRIES } from "@/lib/seed-data";
import { wordKey } from "@/lib/text";

const globalForDb = globalThis as unknown as {
  haGeezClient?: Client;
  haGeezReady?: Promise<void>;
};

const SCHEMA = `
CREATE TABLE IF NOT EXISTS entries (
  id TEXT PRIMARY KEY,
  word TEXT NOT NULL,
  origin TEXT NOT NULL DEFAULT '',
  definition TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('pending', 'published', 'rejected')),
  letter TEXT NOT NULL DEFAULT '',
  word_key TEXT NOT NULL,
  sort_key TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_entries_status ON entries(status, sort_key);
CREATE INDEX IF NOT EXISTS idx_entries_letter ON entries(status, letter, sort_key);
CREATE UNIQUE INDEX IF NOT EXISTS idx_entries_published_word
  ON entries(word_key) WHERE status = 'published';
`;

function databaseTarget(): { url: string; authToken?: string } {
  const raw = [process.env.TURSO_DATABASE_URL, process.env.LIBSQL_URL, process.env.DATABASE_URL]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));

  if (raw.some((value) => /^postgres(ql)?:/i.test(value))) {
    throw new Error(
      "A Postgres URL was set. ሀ ግእዝ uses libSQL (Turso) or a local SQLite file. Unset DATABASE_URL for local dev, or set TURSO_DATABASE_URL.",
    );
  }

  const remote = raw.find(
    (value) =>
      value.startsWith("libsql:") || value.startsWith("https:") || value.startsWith("wss:"),
  );

  if (process.env.VERCEL && !remote) {
    throw new Error(
      "Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN on Vercel. The local SQLite file is only for npm run dev.",
    );
  }

  if (remote) {
    const authToken = process.env.TURSO_AUTH_TOKEN || process.env.LIBSQL_AUTH_TOKEN;
    if (!authToken) {
      throw new Error("TURSO_DATABASE_URL is set, but TURSO_AUTH_TOKEN is missing.");
    }
    return { url: remote, authToken };
  }

  const fileUrl = raw.find((value) => value.startsWith("file:"));
  if (fileUrl) {
    const stripped = fileUrl.replace(/^file:\/\//, "").replace(/^file:/, "");
    if (!path.isAbsolute(stripped)) {
      throw new Error(
        "A file: database URL must be absolute. Unset it to use data/ha-geez.db.",
      );
    }
    fs.mkdirSync(path.dirname(stripped), { recursive: true });
    return { url: `file:${stripped}` };
  }

  const dataDir = path.join(process.cwd(), "data");
  fs.mkdirSync(dataDir, { recursive: true });
  return { url: `file:${path.join(dataDir, "ha-geez.db")}` };
}

function seedId(key: string): string {
  const hex = createHash("sha256").update(`ha-geez:${key}`).digest("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

async function seedIfEmpty(client: Client) {
  const keys = new Set<string>();
  for (const entry of SEED_ENTRIES) {
    const key = wordKey(entry.word);
    if (keys.has(key)) throw new Error(`Duplicate seed headword: ${entry.word}`);
    keys.add(key);
  }

  const tx = await client.transaction("write");
  try {
    const count = await tx.execute("SELECT COUNT(*) AS c FROM entries");
    if (Number(count.rows[0].c) > 0) {
      await tx.commit();
      return;
    }

    const now = new Date().toISOString();
    for (const entry of SEED_ENTRIES) {
      const key = wordKey(entry.word);
      await tx.execute({
        sql: `INSERT INTO entries (
          id, word, origin, definition, notes, email, status, letter, word_key, sort_key, created_at, updated_at
        ) VALUES (?, ?, ?, ?, '', '', 'published', ?, ?, ?, ?, ?)`,
        args: [
          seedId(key),
          entry.word,
          entry.origin,
          entry.definition,
          baseLetter(entry.word),
          key,
          sortKey(entry.word),
          now,
          now,
        ],
      });
    }
    await tx.commit();
  } catch (error) {
    await rollback(tx);
    throw error;
  }
}

export async function rollback(tx: Transaction) {
  try {
    await tx.rollback();
  } catch {
    tx.close();
  }
}

export async function getDb(): Promise<Client> {
  if (!globalForDb.haGeezClient) {
    const target = databaseTarget();
    globalForDb.haGeezClient = createClient(target);
  }

  if (!globalForDb.haGeezReady) {
    const client = globalForDb.haGeezClient;
    globalForDb.haGeezReady = client
      .executeMultiple(SCHEMA)
      .then(() => seedIfEmpty(client))
      .catch((error: unknown) => {
        globalForDb.haGeezReady = undefined;
        throw error;
      });
  }

  await globalForDb.haGeezReady;
  return globalForDb.haGeezClient;
}

export function numberValue(result: ResultSet, key = "c"): number {
  return Number(result.rows[0]?.[key] ?? 0);
}
