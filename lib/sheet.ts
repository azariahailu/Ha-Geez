import { strToU8, unzipSync, zipSync } from "fflate";
import { decodeXml, hasEthiopic, normalize, xmlEscape } from "@/lib/text";

export type SheetRow = {
  line: number;
  word: string;
  origin: string;
  definition: string;
};

export type SheetParse = {
  rows: SheetRow[];
  errors: string[];
};

const MAX_ROWS = 20_000;
const MAX_UNZIPPED = 20 * 1024 * 1024;

const WORD_HEADERS = new Set([
  "word",
  "lemma",
  "geez",
  "gez",
  "letters",
  "letter",
  "headword",
  "ቃል",
  "ግዕዝ",
  "ፊደል",
  "ቃላት",
]);
const ORIGIN_HEADERS = new Set([
  "origin",
  "source",
  "etymology",
  "መነሻ",
  "ምንጭ",
  "አመጣጥ",
]);
const DEFINITION_HEADERS = new Set([
  "definition",
  "meaning",
  "gloss",
  "amharic",
  "ትርጉም",
  "ትርጓሜ",
  "ፍቺ",
]);

function headerToken(value: string): string {
  return normalize(value)
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/\s+/g, "");
}

function columnMap(header: string[]): { word: number; origin: number; definition: number } | null {
  const map = { word: -1, origin: -1, definition: -1 };
  header.forEach((cell, index) => {
    const token = headerToken(cell);
    if (WORD_HEADERS.has(token)) map.word = index;
    else if (ORIGIN_HEADERS.has(token)) map.origin = index;
    else if (DEFINITION_HEADERS.has(token)) map.definition = index;
  });
  if (map.word >= 0 && map.definition >= 0) {
    if (map.origin < 0) map.origin = -1;
    return map;
  }
  return null;
}

function looksLikeLooseHeader(row: string[]): boolean {
  const cells = row.map((cell) => cell.trim()).filter(Boolean);
  if (cells.length < 2) return false;
  if (cells.some((cell) => hasEthiopic(cell) || cell.length > 40)) return false;
  return true;
}

export function rowsFromMatrix(
  matrix: string[][],
  options?: { allowEmptyDefinition?: boolean },
): SheetParse {
  const cleaned = matrix
    .map((row) => row.map((cell) => normalize(String(cell ?? ""))))
    .filter((row) => row.some(Boolean));

  if (cleaned.length === 0) {
    return { rows: [], errors: ["The file has no rows."] };
  }
  if (cleaned.length > MAX_ROWS + 1) {
    return {
      rows: [],
      errors: [`This sheet has more than ${MAX_ROWS.toLocaleString()} rows. Split it and import in parts.`],
    };
  }

  let start = 0;
  let columns = { word: 0, origin: 1, definition: 2 };

  const headerLimit = Math.min(8, cleaned.length);
  let namedHeader = -1;
  for (let index = 0; index < headerLimit; index += 1) {
    const mapped = columnMap(cleaned[index]);
    if (mapped) {
      namedHeader = index;
      columns = mapped;
      break;
    }
  }

  if (namedHeader >= 0) {
    start = namedHeader + 1;
  } else if (
    looksLikeLooseHeader(cleaned[0]) &&
    cleaned.slice(1).some((row) => row.some((cell) => hasEthiopic(cell)))
  ) {
    start = 1;
  }

  const rows: SheetRow[] = [];
  const errors: string[] = [];

  for (let index = start; index < cleaned.length; index += 1) {
    const row = cleaned[index];
    const word = row[columns.word] ?? "";
    const origin = columns.origin >= 0 ? (row[columns.origin] ?? "") : "";
    const definition = row[columns.definition] ?? "";
    const line = index + 1;

    if (!word && !origin && !definition) continue;
    if (word && !definition && options?.allowEmptyDefinition && word.length <= 120 && hasEthiopic(word)) {
      rows.push({ line, word, origin, definition: "" });
      continue;
    }
    if (!word || !definition) {
      if (errors.length < 30) {
        errors.push(
          `Row ${line} needs both a Ge'ez word and an Amharic definition. It was skipped.`,
        );
      }
      continue;
    }
    if (word.length > 120 || origin.length > 500 || definition.length > 4000) {
      if (errors.length < 30) {
        errors.push(`Row ${line} is longer than the allowed field sizes. It was skipped.`);
      }
      continue;
    }
    rows.push({ line, word, origin, definition });
  }

  if (rows.length === 0 && errors.length === 0) {
    errors.push("No word rows were found. Use three columns: word, origin, definition.");
  }

  return { rows, errors };
}

function parseCsv(text: string): string[][] {
  const source = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const sample = source.split(/\r?\n/).slice(0, 6).join("\n");
  const commas = sample.split(",").length;
  const semis = sample.split(";").length;
  const tabs = sample.split("\t").length;
  const delimiter = tabs > commas && tabs > semis ? "\t" : semis > commas ? ";" : ",";

  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (quoted) {
      if (character === '"') {
        if (source[index + 1] === '"') {
          cell += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        cell += character;
      }
      continue;
    }

    if (character === '"') {
      quoted = true;
    } else if (character === delimiter) {
      row.push(cell);
      cell = "";
    } else if (character === "\n" || (character === "\r" && source[index + 1] !== "\n")) {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (character !== "\r") {
      cell += character;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function decodeTable(bytes: Uint8Array): string {
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) {
    return new TextDecoder("utf-16le").decode(bytes);
  }
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    return new TextDecoder("utf-16be").decode(bytes);
  }
  return new TextDecoder("utf-8").decode(bytes);
}

function findZipEntry(files: Record<string, Uint8Array>, name: string): Uint8Array | undefined {
  const want = name.toLowerCase();
  const key = Object.keys(files).find(
    (entry) => entry.replace(/^\/+/, "").toLowerCase() === want,
  );
  return key ? files[key] : undefined;
}

function stripNamespaces(xml: string): string {
  return xml.replace(/<(\/?)[A-Za-z0-9]+:([A-Za-z0-9]+)/g, "<$1$2");
}

function sharedStrings(xml: string): string[] {
  const strings: string[] = [];
  const pattern = /<si\b[^>]*>([\s\S]*?)<\/si>/g;
  for (const match of xml.matchAll(pattern)) {
    const texts = [...match[1].matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map((part) =>
      decodeXml(part[1]),
    );
    strings.push(texts.join(""));
  }
  return strings;
}

function columnIndex(ref: string): number {
  let value = 0;
  for (const character of ref) {
    value = value * 26 + (character.charCodeAt(0) - 64);
  }
  return value - 1;
}

function worksheetRows(xml: string, strings: string[]): string[][] {
  const rows: string[][] = [];
  const rowPattern = /<row\b[^>]*>([\s\S]*?)<\/row>/g;
  for (const rowMatch of xml.matchAll(rowPattern)) {
    const cells: string[] = [];
    const cellPattern = /<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g;
    for (const cellMatch of rowMatch[1].matchAll(cellPattern)) {
      const attributes = cellMatch[1];
      const inner = cellMatch[2] ?? "";
      const ref = /r="([A-Z]+)\d+"/i.exec(attributes)?.[1];
      const index = ref ? columnIndex(ref.toUpperCase()) : cells.length;
      const type = /t="([^"]+)"/.exec(attributes)?.[1] ?? "";
      let value = "";
      if (type === "inlineStr") {
        value = [...inner.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)]
          .map((part) => decodeXml(part[1]))
          .join("");
      } else if (type === "s") {
        const pointer = Number(/<v>([\s\S]*?)<\/v>/.exec(inner)?.[1] ?? "");
        value = strings[pointer] ?? "";
      } else {
        value = decodeXml(/<v>([\s\S]*?)<\/v>/.exec(inner)?.[1] ?? "");
      }
      while (cells.length < index) cells.push("");
      cells[index] = value;
    }
    if (cells.some((cell) => cell.trim())) rows.push(cells);
  }
  return rows;
}

function parseXlsx(bytes: Uint8Array): string[][] {
  let files: Record<string, Uint8Array>;
  try {
    let expanded = 0;
    files = unzipSync(bytes, {
      filter(file) {
        expanded += file.originalSize;
        if (expanded > MAX_UNZIPPED) {
          throw new Error("That spreadsheet expands to more than 20 MB. Split it and try again.");
        }
        return true;
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("That spreadsheet")) throw error;
    throw new Error("That Excel file could not be opened. Save it again as .xlsx or .csv.");
  }

  let total = 0;
  for (const part of Object.values(files)) {
    total += part.byteLength;
    if (total > MAX_UNZIPPED) {
      throw new Error("That spreadsheet expands to more than 20 MB. Split it and try again.");
    }
  }

  const sheetNames = Object.keys(files)
    .map((name) => name.replace(/^\/+/, ""))
    .filter((name) => /^xl\/worksheets\/sheet\d+\.xml$/i.test(name))
    .sort((left, right) => {
      const leftNumber = Number(left.match(/sheet(\d+)/i)?.[1] ?? 0);
      const rightNumber = Number(right.match(/sheet(\d+)/i)?.[1] ?? 0);
      return leftNumber - rightNumber;
    });

  const sheet = sheetNames.length > 0 ? findZipEntry(files, sheetNames[0]) : undefined;
  if (!sheet) {
    throw new Error("The workbook has no worksheet.");
  }

  const shared = findZipEntry(files, "xl/sharedStrings.xml");
  const strings = shared ? sharedStrings(stripNamespaces(decodeTable(shared))) : [];
  return worksheetRows(stripNamespaces(decodeTable(sheet)), strings);
}

export function parseLexiconSheet(
  bytes: Uint8Array,
  filename = "",
  options?: { allowEmptyDefinition?: boolean },
): SheetParse {
  if (bytes.byteLength === 0) {
    return { rows: [], errors: ["The file is empty."] };
  }

  const ole = bytes[0] === 0xd0 && bytes[1] === 0xcf && bytes[2] === 0x11 && bytes[3] === 0xe0;
  if (ole || filename.toLowerCase().endsWith(".xls")) {
    return {
      rows: [],
      errors: ["Older .xls workbooks are not read. In Excel, use Save As → .xlsx or CSV."],
    };
  }

  const zip = bytes[0] === 0x50 && bytes[1] === 0x4b;
  try {
    const matrix = zip || filename.toLowerCase().endsWith(".xlsx")
      ? parseXlsx(bytes)
      : parseCsv(decodeTable(bytes));
    return rowsFromMatrix(matrix, options);
  } catch (error) {
    const message = error instanceof Error ? error.message : "The file could not be read.";
    return { rows: [], errors: [message] };
  }
}

function columnName(index: number): string {
  let number = index + 1;
  let name = "";
  while (number > 0) {
    const remainder = (number - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    number = Math.floor((number - 1) / 26);
  }
  return name;
}

/** Minimal .xlsx used for the sample file and tests. Excel and the importer both read it. */
export function buildXlsx(rows: string[][]): Uint8Array {
  const strings: string[] = [];
  const pointer = (value: string) => {
    const existing = strings.indexOf(value);
    if (existing >= 0) return existing;
    strings.push(value);
    return strings.length - 1;
  };

  const sheetRows = rows
    .map((row, rowIndex) => {
      const cells = row
        .map((value, column) => {
          const ref = `${columnName(column)}${rowIndex + 1}`;
          return `<c r="${ref}" t="s"><v>${pointer(value)}</v></c>`;
        })
        .join("");
      return `<row r="${rowIndex + 1}">${cells}</row>`;
    })
    .join("");

  const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sheetRows}</sheetData></worksheet>`;

  const shared = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${strings.length}" uniqueCount="${strings.length}">${strings
    .map((value) => `<si><t xml:space="preserve">${xmlEscape(value)}</t></si>`)
    .join("")}</sst>`;

  const files: Record<string, Uint8Array> = {
    "[Content_Types].xml": strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
</Types>`),
    "_rels/.rels": strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`),
    "xl/workbook.xml": strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="Lexicon" sheetId="1" r:id="rId1"/></sheets>
</workbook>`),
    "xl/_rels/workbook.xml.rels": strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
</Relationships>`),
    "xl/worksheets/sheet1.xml": strToU8(sheet),
    "xl/sharedStrings.xml": strToU8(shared),
  };

  return zipSync(files);
}
