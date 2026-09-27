import { existsSync, readFileSync } from "node:fs";

function loadLocalEnv() {
  if (!existsSync(".env.local")) return;
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function remoteUrl(): string {
  return [process.env.TURSO_DATABASE_URL, process.env.LIBSQL_URL, process.env.DATABASE_URL]
    .map((value) => value?.trim() ?? "")
    .find((value) => value.startsWith("libsql:") || value.startsWith("https:") || value.startsWith("wss:")) ?? "";
}

async function main() {
  loadLocalEnv();
  const url = remoteUrl();
  if (!url) {
    if (process.env.VERCEL) {
      console.log(
        "TURSO_DATABASE_URL is not visible to this build. The first visits will load the word list.",
      );
    } else {
      console.log("No Turso database configured. Skipping the production word list.");
    }
    return;
  }

  const { getDb } = await import("../lib/db");
  const db = await getDb();
  const count = await db.execute("SELECT COUNT(*) AS c FROM entries WHERE status = 'published'");
  const words = Number(count.rows[0]?.c ?? 0);
  if (words < 1000 && process.env.HA_GEEZ_SEED !== "demo") {
    throw new Error(`The production word list has ${words} words. Expected the bundled lexicon.`);
  }
  console.log(`Lexicon ready: ${words} published words.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
