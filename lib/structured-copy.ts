import {
  ALEFAT_INTRO,
  ALEFAT_LETTERS,
  ALEFAT_TITLE,
  FIDEL_LINES,
  GEEZ_NUMBERS,
  type AlefatLetter,
  type FidelLine,
  type NumberRow,
} from "@/lib/abugida-source";

const COL = " | ";

export const NUMBER_HEADERS = [
  "Symbol",
  "English Number",
  "Ge'ez Name",
  "Amharic Name",
  "English Name",
];

export function serializeNumbers(rows: readonly NumberRow[]): string {
  return rows
    .map((row) =>
      [row.symbol, row.englishNumber, row.geezName, row.amharicName, row.englishName].join(COL),
    )
    .join("\n");
}

export function parseNumbers(text: string): NumberRow[] | null {
  const lines = text.replace(/\r\n/g, "\n").split("\n").filter((line) => line.trim() !== "");
  if (lines.length === 0) return null;
  const rows: NumberRow[] = [];
  for (const line of lines) {
    const parts = line.split(COL);
    if (parts.length !== 5 || parts.some((part) => part.trim() === "")) return null;
    rows.push({
      symbol: parts[0],
      englishNumber: parts[1],
      geezName: parts[2],
      amharicName: parts[3],
      englishName: parts[4],
    });
  }
  return rows;
}

export function serializeFidel(lines: readonly FidelLine[]): string {
  return lines
    .map((line) => `${line.numeral}${COL}${line.letter}\n${line.geez}\n${line.amharic}\n${line.english}`)
    .join("\n\n");
}

export function parseFidel(text: string): FidelLine[] | null {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n\s*\n/).filter((block) => block.trim() !== "");
  if (blocks.length === 0) return null;
  const lines: FidelLine[] = [];
  for (const block of blocks) {
    const parts = block.split("\n");
    if (parts.length < 4) return null;
    const header = parts[0].split(COL);
    if (header.length !== 2 || !header[0].trim() || !header[1].trim()) return null;
    lines.push({
      numeral: header[0],
      letter: header[1],
      geez: parts[1],
      amharic: parts[2],
      english: parts.slice(3).join("\n"),
    });
  }
  return lines;
}

export function serializeAlefat(
  title: string,
  intro: readonly string[],
  letters: readonly AlefatLetter[],
): string {
  const blocks = letters.map((letter) => `${letter.n}${COL}${letter.name}\n${letter.line}\n${letter.meaning}`);
  return `${title}\n\n${intro.join("\n")}\n\n---\n${blocks.join("\n---\n")}`;
}

export function parseAlefat(text: string): {
  title: string;
  intro: string[];
  letters: AlefatLetter[];
} | null {
  const parts = text.replace(/\r\n/g, "\n").split("\n---\n");
  if (parts.length < 2) return null;
  const head = parts[0].replace(/\n+$/g, "").split("\n");
  const title = head[0] ?? "";
  if (!title.trim()) return null;
  const intro = head.slice(1).join("\n").replace(/^\n+/, "").split("\n").filter((line) => line !== "");
  const letters: AlefatLetter[] = [];
  for (const part of parts.slice(1)) {
    const chunk = part.replace(/\n+$/g, "").split("\n");
    if (chunk.length < 3) return null;
    const splitAt = chunk[0].indexOf(COL);
    if (splitAt <= 0) return null;
    const n = chunk[0].slice(0, splitAt);
    const name = chunk[0].slice(splitAt + COL.length);
    if (!n.trim() || name === "") return null;
    letters.push({ n, name, line: chunk[1], meaning: chunk.slice(2).join("\n") });
  }
  return { title, intro, letters };
}

export const NUMBERS_TEXT = serializeNumbers(GEEZ_NUMBERS);
export const FIDEL_TEXT = serializeFidel(FIDEL_LINES);
export const ALEFAT_TEXT = serializeAlefat(ALEFAT_TITLE, ALEFAT_INTRO, ALEFAT_LETTERS);
export const NUMBER_HEADER_TEXT = NUMBER_HEADERS.join(COL);

export function numbersFrom(text: string): NumberRow[] {
  if (text === NUMBERS_TEXT) return GEEZ_NUMBERS;
  return parseNumbers(text) ?? GEEZ_NUMBERS;
}

export function fidelFrom(text: string): FidelLine[] {
  if (text === FIDEL_TEXT) return FIDEL_LINES;
  return parseFidel(text) ?? FIDEL_LINES;
}

export function alefatFrom(text: string): { title: string; intro: string[]; letters: AlefatLetter[] } {
  if (text === ALEFAT_TEXT) {
    return { title: ALEFAT_TITLE, intro: [...ALEFAT_INTRO], letters: ALEFAT_LETTERS };
  }
  return parseAlefat(text) ?? { title: ALEFAT_TITLE, intro: [...ALEFAT_INTRO], letters: ALEFAT_LETTERS };
}

export function headersFrom(text: string): string[] {
  if (text === NUMBER_HEADER_TEXT) return NUMBER_HEADERS;
  const parts = text.split(COL);
  return parts.length === 5 ? parts : NUMBER_HEADERS;
}
