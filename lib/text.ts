/** Collapse whitespace and compose Ethiopic characters to a stable form. */
export function normalize(input: string): string {
  return input
    .normalize("NFC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const ETHIOPIC_PUNCTUATION = /[፡።፣፤፥፦፧፨]/g;

/** Headword key: no spaces, no Ethiopic punctuation, so ቤተ ክርስቲያን matches ቤተክርስቲያን. */
export function wordKey(input: string): string {
  return normalize(input).replace(/\s+/g, "").replace(ETHIOPIC_PUNCTUATION, "");
}

export function hasEthiopic(input: string): boolean {
  return /[\u1200-\u137F\u1380-\u139F\u2D80-\u2DDF\uAB00-\uAB2F]/.test(input);
}

function escapeLike(input: string): string {
  return input.replace(/[\\%_]/g, (mark) => `\\${mark}`);
}

export function likePattern(input: string): string {
  return `%${escapeLike(input)}%`;
}

export function prefixPattern(input: string): string {
  return `${escapeLike(input)}%`;
}

export function decodeXml(input: string): string {
  return input
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#([0-9]+);/g, (_, dec: string) =>
      String.fromCodePoint(parseInt(dec, 10)),
    )
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

export function xmlEscape(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
