import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { buildXlsx, parseLexiconSheet } from "../lib/sheet";
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

async function main() {
process.env.TURSO_DATABASE_URL = "file:/tmp/ha-geez-self-check.db";
rmSync("/tmp/ha-geez-self-check.db", { force: true });

const { searchPublished, insertSubmissions, publishEntry, importPublished, getPublished, listAdmin } =
  await import("../lib/entries");

const peace = await searchPublished("ሰላ", "", 10);
assert(peace.entries.some((entry) => entry.word === "ሰላም"), "contains search finds ሰላም");

const water = await searchPublished("ውሃ", "", 10);
assert(water.entries.some((entry) => entry.word === "ማይ"), "Amharic gloss search finds ማይ");

const church = await searchPublished("ቤተክርስቲያን", "", 10);
assert(church.entries.some((entry) => entry.word === "ቤተ ክርስቲያን"), "spaceless query finds the spaced headword");

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

console.log("self-check ok");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
