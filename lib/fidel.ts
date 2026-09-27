import { normalize } from "@/lib/text";

/**
 * Fidel families in the lexicon’s አበገደ order: አ፣ በ፣ ገ፣ ደ፣ …
 * Later Amharic shapes sit beside the letter the book relates them to.
 * Labialized orders stay with their base consonant (ቀ with ቈ, ከ with ኰ, and so on).
 */
const FAMILIES = [
  "አኡኢኣኤእኦኧ",
  "በቡቢባቤብቦቧ",
  "ቨቩቪቫቬቭቮቯ",
  "ገጉጊጋጌግጎጏጐጒጓጔጕ",
  "ጀጁጂጃጄጅጆጇ",
  "ደዱዲዳዴድዶዷ",
  "ሀሁሂሃሄህሆሇ",
  "ወዉዊዋዌውዎዏ",
  "ዘዙዚዛዜዝዞዟ",
  "ዠዡዢዣዤዥዦዧ",
  "ሐሑሒሓሔሕሖሗ",
  "ኀኁኂኃኄኅኆኇኈኊኋኌኍ",
  "ጠጡጢጣጤጥጦጧ",
  "ጨጩጪጫጬጭጮጯ",
  "የዩዪያዬይዮዯ",
  "ከኩኪካኬክኮኯኰኲኳኴኵ",
  "ኸኹኺኻኼኽኾዀዂዃዄዅ",
  "ለሉሊላሌልሎሏ",
  "መሙሚማሜምሞሟ",
  "ነኑኒናኔንኖኗ",
  "ኘኙኚኛኜኝኞኟ",
  "ሠሡሢሣሤሥሦሧ",
  "ሸሹሺሻሼሽሾሿ",
  "ዐዑዒዓዔዕዖ",
  "ፈፉፊፋፌፍፎፏ",
  "ጸጹጺጻጼጽጾጿ",
  "ፀፁፂፃፄፅፆፇ",
  "ቀቁቂቃቄቅቆቇቈቊቋቌቍ",
  "ረሩሪራሬርሮሯ",
  "ሰሱሲሳሴስሶሷ",
  "ተቱቲታቴትቶቷ",
  "ቸቹቺቻቼችቾቿ",
  "ጰጱጲጳጴጵጶጷ",
  "ፐፑፒፓፔፕፖፗ",
] as const;

const LETTER_OF = new Map<string, string>();
const ORDER = new Map<string, number>();

let orderIndex = 0;
for (const family of FAMILIES) {
  const base = [...family][0];
  for (const character of family) {
    if (LETTER_OF.has(character)) {
      throw new Error(`Duplicate Fidel character: ${character}`);
    }
    LETTER_OF.set(character, base);
    ORDER.set(character, orderIndex);
    orderIndex += 1;
  }
}

export const FILTER_LETTERS: string[] = FAMILIES.map((family) => [...family][0]);

export function baseLetter(word: string): string {
  for (const character of normalize(word)) {
    const known = LETTER_OF.get(character);
    if (known) return known;
  }

  for (const character of normalize(word)) {
    const codePoint = character.codePointAt(0);
    if (codePoint === undefined || codePoint < 0x1200 || codePoint > 0x135f) continue;
    const baseCode = 0x1200 + Math.floor((codePoint - 0x1200) / 8) * 8;
    const base = String.fromCodePoint(baseCode);
    if (/\p{L}/u.test(base)) return base;
    return character;
  }

  return "";
}

export function sortKey(word: string): string {
  return [...normalize(word)]
    .map((character) => {
      const index = ORDER.get(character);
      if (index !== undefined) return index.toString().padStart(4, "0");
      const codePoint = character.codePointAt(0) ?? 0;
      return `9${codePoint.toString(16).padStart(6, "0")}`;
    })
    .join("");
}
