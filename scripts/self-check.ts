import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { buildXlsx, parseLexiconSheet } from "../lib/sheet";
import { readBundledLexicon } from "../lib/lexicon-seed";
import { baseLetter, FILTER_LETTERS, sortKey } from "../lib/fidel";
import { wordKey } from "../lib/text";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

const seen = new Set<string>();
for (const letter of FILTER_LETTERS) {
  assert(!seen.has(letter), `repeated family ${letter}`);
  seen.add(letter);
  assert(baseLetter(letter) === letter, `${letter} should be its own base`);
}

assert(FILTER_LETTERS[0] === "አ", "አበገደ order starts with አ");
assert(FILTER_LETTERS.indexOf("በ") < FILTER_LETTERS.indexOf("ገ"), "በ comes before ገ");
assert(FILTER_LETTERS.indexOf("ደ") < FILTER_LETTERS.indexOf("ሀ"), "ደ comes before ሀ");
assert(baseLetter("እ") === "አ", "እ belongs with አ");
assert(baseLetter("ሁ") === "ሀ", "ሁ belongs with ሀ");
assert(baseLetter("ቈ") === "ቀ", "labialized ቈ belongs with ቀ");
assert(baseLetter("ቤተ ክርስቲያን") === "በ", "ቤተ ክርስቲያን starts with በ");
assert(wordKey("ቤተ ክርስቲያን") === wordKey("ቤተክርስቲያን"), "spaces are ignored in the headword key");
assert(sortKey("አ") < sortKey("በ") && sortKey("በ") < sortKey("ሀ"), "አ sorts before በ, and በ before ሀ");
assert(sortKey("ሠ") < sortKey("ሸ"), "ሠ sorts before ሸ");

const csv = parseLexiconSheet(
  new TextEncoder().encode("word,origin,definition\nሰላም,መሠረታዊ,ሰላም።\n,missing,definition\n"),
  "sample.csv",
);
assert(csv.rows.length === 1 && csv.rows[0].word === "ሰላም", "csv header is recognized");
assert(csv.errors.length === 1, "incomplete csv row is reported");

const headerless = parseLexiconSheet(
  new TextEncoder().encode("ማይ,መሠረታዊ የግዕዝ ቃል,ውሃ።\n"),
  "plain.csv",
);
assert(headerless.rows[0]?.definition === "ውሃ።", "headerless csv uses column order");

const semicolon = parseLexiconSheet(
  new TextEncoder().encode("ቃል;መነሻ;ትርጉም\nአብ;መሠረታዊ;አባት።\n"),
  "semi.csv",
);
assert(semicolon.rows[0]?.word === "አብ" && semicolon.rows[0].definition === "አባት።", "semicolon headers map by name");

const titled = parseLexiconSheet(
  new TextEncoder().encode("ሀ ግእዝ sample sheet\nword,origin,definition\nበግ,መሠረታዊ,በግ።\n"),
  "titled.csv",
);
assert(titled.rows.length === 1 && titled.rows[0].word === "በግ", "a title row before the header is skipped");

const sampleRows = [
  ["word", "origin", "definition"],
  ["እንስሳ", "መሠረታዊ የግዕዝ ቃል", "እንስሳ፤ አራዊት።"],
  ["ወርኅ", "መሠረታዊ የግዕዝ ቃል", "ወር።"],
  ["በግ", "መሠረታዊ የግዕዝ ቃል", "በግ።"],
  ["ጸሎት", "መሠረታዊ የግዕዝ ቃል", "ጸሎት፤ ወደ እግዚአብሔር የሚቀርብ ልመና።"],
];
const xlsx = buildXlsx(sampleRows);
writeFileSync(new URL("../data/sample-import.xlsx", import.meta.url), xlsx);
const fromXlsx = parseLexiconSheet(xlsx, "sample.xlsx");
assert(fromXlsx.rows.length === 4 && fromXlsx.rows[1].word === "ወርኅ", "xlsx round-trip");
assert(
  parseLexiconSheet(readFileSync(new URL("../data/sample-import.csv", import.meta.url)), "sample.csv").rows
    .length === 4,
  "committed sample csv parses",
);

const workbook = parseLexiconSheet(
  readFileSync(new URL("../data/geez-lexicon.xlsx", import.meta.url)),
  "geez-lexicon.xlsx",
  { allowEmptyDefinition: true },
);
assert(workbook.rows.length === 13079, "every word row is kept, and the introduction is not");
const qeneRows = workbook.rows.filter((row) => row.word === "ቅኔ");
assert(qeneRows.length > 1, "a repeated spelling stays as its own word");
assert(
  workbook.rows.some((row) => row.word === "ቤተ ክርስቲያን"),
  "ቤተ ክርስቲያን is in the workbook",
);
const bundled = readBundledLexicon();
assert(bundled?.length === 13079, "the bundled lexicon lists every word row");

async function main() {
process.env.HA_GEEZ_SEED = "demo";
process.env.TURSO_DATABASE_URL = "file:/tmp/ha-geez-self-check.db";
rmSync("/tmp/ha-geez-self-check.db", { force: true });

const { searchPublished, insertSubmissions, publishEntry, importPublished, getPublished, listAdmin } =
  await import("../lib/entries");

const peace = await searchPublished("ሰላ", "", 10);
assert(peace.entries.some((entry) => entry.word === "ሰላም"), "contains search finds ሰላም");

const water = await searchPublished("ውሃ", "", 10);
assert(water.entries.some((entry) => entry.word === "ማይ"), "Amharic gloss search finds ማይ");

const church = await searchPublished("ቤተክርስቲያን", "", 10);
assert(church.entries[0]?.word === "ቤተ ክርስቲያን", "the headword itself leads the search");

const may = await searchPublished("ማይ", "", 8);
assert(may.entries[0]?.word === "ማይ", "ማይ leads a search for ማይ");
assert(
  may.entries.every((entry) => wordKey(entry.word).includes("ማይ")),
  "a headword search does not list gloss mentions",
);
const mayFamily = await searchPublished("ማይ", "መ");
assert(mayFamily.entries[0]?.word === "ማይ", "ማይ leads under the መ tab");
assert(
  mayFamily.entries.every((entry) => entry.letter === "መ" && wordKey(entry.word).includes("ማይ")),
  "መ plus ማይ stays on that family's headwords",
);

const underSa = await searchPublished("", "ሱ", 80);
assert(underSa.entries.every((entry) => entry.letter === "ሰ"), "ሱ filters to the ሰ family");
assert(underSa.entries.some((entry) => entry.word === "ሰላም"), "ሰላም is in the ሰ family");
assert(!underSa.entries.some((entry) => entry.word === "አብ"), "አብ is not in the ሰ family");

const ids = await insertSubmissions({
  email: "reader@example.com",
  entries: [{ word: "እንስሳ", origin: "የሙከራ ቃል", definition: "አራዊት።", notes: "from the check" }],
});
const hidden = await searchPublished("እንስሳ", "", 10);
assert(!hidden.entries.some((entry) => entry.id === ids[0]), "pending tickets are not public");
const queue = await listAdmin("pending");
assert(queue.some((entry) => entry.id === ids[0] && entry.email === "reader@example.com"), "pending ticket is queued");

await publishEntry(ids[0], {
  word: "እንስሳ",
  origin: "የሙከራ ቃል",
  definition: "አራዊት።",
  notes: "from the check",
});
const visible = await getPublished(ids[0]);
assert(visible?.word === "እንስሳ", "approval publishes the ticket");

const imported = await importPublished([
  { line: 2, word: "እንስሳ", origin: "መሠረታዊ የግዕዝ ቃል", definition: "እንስሳ፤ አራዊት።" },
  { line: 3, word: "ወርኅ", origin: "መሠረታዊ የግዕዝ ቃል", definition: "ወር።" },
]);
assert(imported.updated === 1 && imported.created === 1, "import updates an existing headword and adds a new one");

const { createAdminPassword, hasAdminPassword, loginWithPassword, resetWithRecovery } = await import(
  "../lib/auth"
);
assert(!(await hasAdminPassword()), "no password until one is created");
const created = await createAdminPassword("correct horse");
assert(/^[A-Z0-9]{4}(?:-[A-Z0-9]{4}){3}$/.test(created.recoveryCode), "recovery code shape");
assert(await hasAdminPassword(), "password is stored");
let secondRefused = false;
try {
  await createAdminPassword("another password");
} catch (error) {
  secondRefused = error instanceof Error && error.message === "password-exists";
}
assert(secondRefused, "a second password is refused");
assert((await loginWithPassword("wrong-password")) === "bad", "a wrong password is refused");
assert((await loginWithPassword("correct horse")) === "ok", "the created password works");
const reset = await resetWithRecovery(created.recoveryCode, "new-password-1");
assert(reset.ok && reset.recoveryCode !== created.recoveryCode, "reset replaces the recovery code");
assert(!(await resetWithRecovery(created.recoveryCode, "another-pass-2")).ok, "the old recovery code stops working");
assert((await loginWithPassword("correct horse")) === "bad", "the old password stops working");
assert((await loginWithPassword("new-password-1")) === "ok", "the new password works");
if (reset.ok) {
  const loose = reset.recoveryCode.toLowerCase().split("-").join(" ");
  const again = await resetWithRecovery(loose, "third-password");
  assert(again.ok, "spaces and case do not matter in the recovery code");
}
for (let attempt = 0; attempt < 5; attempt += 1) {
  assert((await loginWithPassword("nope")) === "bad", "failed attempts are counted");
}
assert((await loginWithPassword("third-password")) === "locked", "repeated failures lock sign-in");

console.log("self-check ok");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
