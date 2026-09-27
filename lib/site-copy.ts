import { ABUGIDA_ENTRY, GLORY } from "@/lib/abugida-source";
import { GEEZ_ARTICLE, KIDANEWOLD_BOOK } from "@/lib/credits";
import { ALEFAT_TEXT, FIDEL_TEXT, NUMBER_HEADER_TEXT, NUMBERS_TEXT } from "@/lib/structured-copy";

export const SEVEN_ORDERS = `ሰባቱ የግእዝ ሆሄያት ቅደም ተከተል (The 7 Orders)
ግዕዝ (1ኛው) — መሰረታዊው ቅርጽ (ለምሳሌ፦ ሀ)
ካዕብ (2ኛው) — "ኡ" ድምጽ የሚጨምር (ለምሳሌ፦ ሁ)
ሣልስ (3ኛው) — "ኢ" ድምጽ የሚጨምር (ለምሳሌ፦ ሂ)
ራብዕ (4ኛው) — "አ" ድምጽ የሚጨምር (ለምሳሌ፦ ሃ)
ኃምስ (5ኛው) — "ኤ" ድምጽ የሚጨምር (ለምሳሌ፦ ሄ)
ሳድስ (6ኛው) — "እ" ድምጽ የሚጨምር ወይም ፊደሉ ብቻውን የሚነበብ (ለምሳሌ፦ ህ)
ሳብዕ (7ኛው) — "ኦ" ድምጽ የሚጨምር (ለምሳሌ፦ ሆ)`;

export type CopyKind = "prose" | "plain" | "url" | "list" | "orders" | "numbers" | "fidel" | "alefat";

export type CopyField = {
  key: string;
  page: string;
  group: string;
  label: string;
  hint?: string;
  kind: CopyKind;
  defaultText: string;
  rows: number;
};

export type CopyPage = {
  slug: string;
  title: string;
  href: string;
};

export const COPY_PAGES: CopyPage[] = [
  { slug: "home", title: "Home", href: "/" },
  { slug: "dictionary", title: "Dictionary", href: "/dictionary" },
  { slug: "about", title: "About Ge'ez", href: "/about" },
  { slug: "about-ha-geez", title: "About ሀ ግእዝ", href: "/about-ha-geez" },
  { slug: "submit", title: "Submit a word", href: "/submit" },
  { slug: "contact", title: "Contact us", href: "/contact" },
  { slug: "chrome", title: "Header and footer", href: "/" },
  { slug: "not-found", title: "Missing page", href: "/dictionary" },
];

function field(
  page: string,
  key: string,
  group: string,
  label: string,
  defaultText: string,
  extra: Partial<Pick<CopyField, "kind" | "rows" | "hint">> = {},
): CopyField {
  return {
    key: `${page}.${key}`,
    page,
    group,
    label,
    defaultText,
    kind: extra.kind ?? "plain",
    rows: extra.rows ?? (extra.kind === "prose" || extra.kind === "list" ? 4 : 1),
    hint: extra.hint,
  };
}

const pipe =
  "Separate the five columns with a space, a vertical bar, and a space: Symbol | 1 | name | name | name. One row on each line.";
const fidelHint =
  "Each letter is four lines: numeral | letter, then the Ge'ez line, the Amharic line, and the English meaning. Leave a blank line between letters.";
const alefatHint =
  "The first line is the title. The introduction follows, one paragraph per line. Then a line that is only --- before each name. A name block is: number | name, then the Ge'ez line, then the meaning.";

export const COPY_FIELDS: CopyField[] = [
  field("home", "eyebrow", "Opening", "Small heading", "Dictionary"),
  field("home", "title", "Opening", "Name", "ሀ ግእዝ"),
  field("home", "lede", "Opening", "Line under the name", "A community lexicon from Ge'ez into Amharic.", {
    rows: 2,
  }),
  field(
    "home",
    "p1",
    "Opening",
    "First paragraph",
    "Ge'ez is the liturgical language of the Ethiopian and Eritrean Orthodox churches. It was spoken in the northern highlands; between the tenth and thirteenth centuries it left everyday conversation and remained the language of prayer, chant, and the church schools.",
    { kind: "prose", rows: 5 },
  ),
  field(
    "home",
    "p2",
    "Opening",
    "Second paragraph",
    "ሀ ግእዝ is a dictionary of that language, with the meaning in Amharic. Look up a word. If it is missing, send the Ge'ez word, where it comes from if you know, and the meaning in Amharic.",
    { kind: "prose", rows: 4 },
  ),
  field("home", "searchButton", "Opening", "First button", "Search the dictionary"),
  field("home", "aboutButton", "Opening", "Second button", "About Ge'ez"),
  field("home", "lettersLink", "Opening", "Letters link", "[Letters and numbers](/about#abugida).", {
    kind: "prose",
    rows: 2,
  }),
  field("home", "featuredTitle", "From the lexicon", "Heading", "From the lexicon"),
  field("home", "browse", "From the lexicon", "Link", "Browse all"),
  field("home", "howTitle", "How to use it", "Heading", "How to use it"),
  field("home", "step1.numeral", "How to use it", "First numeral", "፩"),
  field("home", "step1.title", "How to use it", "First title", "Search"),
  field(
    "home",
    "step1.body",
    "How to use it",
    "First text",
    "Type a Ge'ez word or an Amharic meaning. Filter by the first letter, in [አበገደ order](/about#abugida): አ፣ በ፣ ገ፣ ደ.",
    { kind: "prose", rows: 4 },
  ),
  field("home", "step2.numeral", "How to use it", "Second numeral", "፪"),
  field("home", "step2.title", "How to use it", "Second title", "Submit"),
  field(
    "home",
    "step2.body",
    "How to use it",
    "Second text",
    "Open Submit a word. Write the Ge'ez word, where it comes from if you know, and the meaning in Amharic. Add another row if you have more than one. An email is optional.",
    { kind: "prose", rows: 4 },
  ),
  field("home", "step3.numeral", "How to use it", "Third numeral", "፫"),
  field("home", "step3.title", "How to use it", "Third title", "What you see next"),
  field(
    "home",
    "step3.body",
    "How to use it",
    "Third text",
    "The page lists the words you sent. You can send another from the same page.",
    { kind: "prose", rows: 3 },
  ),

  field("dictionary", "eyebrow", "Introduction", "Small heading", "መዝገበ ቃላት"),
  field("dictionary", "title", "Introduction", "Title", "Dictionary"),
  field(
    "dictionary",
    "intro",
    "Introduction",
    "Introduction",
    "Ge'ez words, with origin and a meaning in Amharic. The letters run in አበገደ order: አ፣ በ፣ ገ፣ ደ. Their order and meaning are on [Letters and numbers](/about#abugida). Spacing does not matter: ቤተ ክርስቲያን and ቤተክርስቲያን are the same search.",
    { kind: "prose", rows: 5 },
  ),
  field("dictionary", "searchLabel", "Search", "Search label", "Search a Ge'ez word or an Amharic meaning", {
    rows: 2,
  }),
  field("dictionary", "placeholder", "Search", "Placeholder", "ሰላም  ·  ውሃ"),
  field("dictionary", "searchButton", "Search", "Search button", "Search"),
  field("dictionary", "searching", "Search", "While searching", "Searching…"),
  field("dictionary", "searchFailed", "Search", "If search fails", "Search failed. Check your connection and try again.", {
    rows: 2,
  }),
  field("dictionary", "noMatch", "Search", "When nothing matches", "No words match"),
  field("dictionary", "showing", "Search", "Count, before the numbers", "Showing"),
  field("dictionary", "of", "Search", "Count, between the numbers", "of"),
  field("dictionary", "forQuery", "Search", "Before the typed word", "for"),
  field("dictionary", "underLetter", "Search", "Before the letter", "under"),
  field("dictionary", "all", "Search", "All-letters button", "All"),
  field(
    "dictionary",
    "empty",
    "Search",
    "Nothing found",
    "Nothing matches that yet. You can send the word from [Submit a word](/submit).",
    { kind: "prose", rows: 3 },
  ),
  field("dictionary", "emptyNone", "Search", "If the lexicon is empty", "No words are listed yet.", { rows: 2 }),
  field(
    "dictionary",
    "preview",
    "Search",
    "Opening list note",
    "The list opens with these {n}. Search a word, or choose a letter, to see every match.",
    { kind: "prose", rows: 3, hint: "{n} is replaced by how many words are on the screen." },
  ),
  field("dictionary", "back", "A word", "Link back", "Back to the dictionary"),
  field("dictionary", "more", "A word", "More in this letter", "More under {letter}", {
    hint: "{letter} is replaced by the Fidel letter.",
  }),
  field("dictionary", "note", "A word", "Note label", "Note."),
  field("dictionary", "nearby", "A word", "Nearby heading", "Nearby"),

  field("about", "eyebrow", "Opening", "Small heading", "ስለ ግዕዝ"),
  field("about", "title", "Opening", "Title", "About Ge'ez"),
  field("about", "citeAuthor", "Opening", "Citation author", GEEZ_ARTICLE.author),
  field("about", "citeTitle", "Opening", "Citation title", GEEZ_ARTICLE.title),
  field("about", "citePublisher", "Opening", "Citation publisher", GEEZ_ARTICLE.publisher, { rows: 2 }),
  field("about", "citeDate", "Opening", "Citation date", GEEZ_ARTICLE.date),
  field("about", "citeUrl", "Opening", "Citation link", GEEZ_ARTICLE.url, { kind: "url" }),
  field("about", "sealUrl", "Opening", "Seal image address", "/eotc-seal.png", { kind: "url" }),
  field("about", "sealAlt", "Opening", "Seal description", "Seal of the Ethiopian Orthodox Tewahedo Church", {
    rows: 2,
  }),
  field(
    "about",
    "lede",
    "Opening",
    "Line under the title",
    "A South Semitic language that left the market and stayed in the church.",
    { rows: 2 },
  ),
  field("about", "s1.numeral", "A language that stayed in the church", "Numeral", "፩"),
  field("about", "s1.title", "A language that stayed in the church", "Title", "A language that stayed in the church"),
  field(
    "about",
    "s1.body",
    "A language that stayed in the church",
    "Paragraph",
    "Ge'ez is a South Semitic language of the northern highlands. It was once spoken in the lands that are now Ethiopia and Eritrea. Between the tenth and thirteenth centuries it receded from daily conversation. It did not vanish. It remains the liturgical language of the Ethiopian and Eritrean Orthodox Tewahedo churches: the language of the missal, the psalms, and the chants a congregation hears even when home speech is Amharic, Tigrinya, or something else.",
    { kind: "prose", rows: 7 },
  ),
  field("about", "s2.numeral", "አበገደ, and the numbers", "Numeral", "፪"),
  field("about", "s2.title", "አበገደ, and the numbers", "Title", "አበገደ, and the numbers"),
  field(
    "about",
    "s2.p1",
    "አበገደ, and the numbers",
    "Paragraph before the seven orders",
    "The script did not start as it is written today. It began as an abjad: consonants were written, and readers supplied the vowels. By the fourth century it had become an abugida. Each character is a consonant and a vowel together. The article on Ge'ez names those seven orders as /aa/, /oo/, /ee/, /u/, /ie/, /e/, and /o/.",
    { kind: "prose", rows: 6 },
  ),
  field("about", "orders", "አበገደ, and the numbers", "The seven orders", SEVEN_ORDERS, {
    kind: "orders",
    rows: 10,
    hint: "The first line is the heading. Each following line is one order.",
  }),
  field(
    "about",
    "s2.p2",
    "አበገደ, and the numbers",
    "Paragraph after the seven orders",
    "The dictionary is arranged in Ge'ez alphabetic order (አ፣ በ፣ ገ፣ ደ፣…). The numbers and the letters follow.",
    { kind: "prose", rows: 3 },
  ),
  field("about", "quote", "አበገደ, and the numbers", "Quote", ABUGIDA_ENTRY, {
    kind: "prose",
    rows: 5,
    hint: "The words ፳፪ቱ አሌፋት stay linked to the twenty-two names when they remain in this quote.",
  }),
  field("about", "numberHeaders", "አበገደ, and the numbers", "Number column headings", NUMBER_HEADER_TEXT, {
    rows: 2,
    hint: pipe,
  }),
  field("about", "numbers", "አበገደ, and the numbers", "Number table", NUMBERS_TEXT, {
    kind: "numbers",
    rows: 14,
    hint: pipe,
  }),
  field("about", "fidel", "አበገደ, and the numbers", "Fidel lines", FIDEL_TEXT, {
    kind: "fidel",
    rows: 16,
    hint: fidelHint,
  }),
  field("about", "alefat", "አበገደ, and the numbers", "፳፪ቱ አሌፋት", ALEFAT_TEXT, {
    kind: "alefat",
    rows: 16,
    hint: alefatHint,
  }),
  field("about", "glory", "አበገደ, and the numbers", "Closing line", GLORY, { rows: 2 }),
  field("about", "s3.numeral", "After Aksum", "Numeral", "፫"),
  field("about", "s3.title", "After Aksum", "Title", "After Aksum"),
  field(
    "about",
    "s3.body",
    "After Aksum",
    "Paragraph",
    "Ge'ez belongs with the civilization of Aksum. When the kingdom declined, around the tenth century, the language remained with the church and with scholars. Manuscripts hold prayer books, the Psalter, and lives of saints. They also hold stories and notes on the history and economy of Aksum and of the port of Adulis. The language of the liturgy was never only a language of the sanctuary.",
    { kind: "prose", rows: 6 },
  ),
  field("about", "s4.numeral", "Qene", "Numeral", "፬"),
  field("about", "s4.title", "Qene", "Title", "Qene, poetry for the voice"),
  field(
    "about",
    "s4.p1",
    "Qene",
    "First paragraph",
    "Qene ({g}ቅኔ{/g}) is the oral poetry of this tradition. The rules of composition are written down and taught. The poems themselves are made for performance and carried by memory. They are heard at the Sunday service and at festivals.",
    { kind: "prose", rows: 5 },
  ),
  field(
    "about",
    "s4.p2",
    "Qene",
    "Second paragraph",
    "Training is long: about seven years to become a poet, and about seven more before a poet teaches. There are more than sixteen kinds, each with its own form and occasion. The subjects are wider than a newcomer expects. Praise and liturgy are there. So are social critique, the natural world, justice, love, and the harvest.",
    { kind: "prose", rows: 5 },
  ),
  field("about", "s5.numeral", "Sewasew", "Numeral", "፭"),
  field("about", "s5.title", "Sewasew", "Title", "Sewasew"),
  field(
    "about",
    "s5.p1",
    "Sewasew",
    "First paragraph",
    "Students learn Sewasew ({g}ሰዋስው{/g}), the grammar, alongside Qene. Teachers still name patterns of stress and intonation in Amharic: {a}ተነሽ፣ ወዳቂ፣ ተጣይ፣ ሰያፍ፣ ተናባቢ፣ ማጥበቅ፣ ማላላት፣ ኣጎበር{/a}.",
    { kind: "prose", rows: 4 },
  ),
  field(
    "about",
    "s5.p2",
    "Sewasew",
    "Second paragraph",
    "Much recent study of Ge'ez stays with manuscripts and the script. Oral Qene has had less attention, partly because it is not written down, and partly because people assume it is only religious. It is a literature of the voice.",
    { kind: "prose", rows: 4 },
  ),

  field("about-ha-geez", "eyebrow", "Opening", "Small heading", "ስለ ሀ ግእዝ"),
  field("about-ha-geez", "titleBefore", "Opening", "Title, before the name", "About"),
  field("about-ha-geez", "titleName", "Opening", "Name in the title", "ሀ ግእዝ"),
  field(
    "about-ha-geez",
    "p1",
    "Opening",
    "First paragraph",
    "ሀ ግእዝ is a Ge'ez–Amharic dictionary built from more than 13,000 words. Search a Ge'ez word, or a word inside an Amharic meaning. The origin sits under the word.",
    { kind: "prose", rows: 4 },
  ),
  field(
    "about-ha-geez",
    "p2",
    "Opening",
    "Second paragraph",
    "If you know a word that is not here yet, open Submit a word. Write the Ge'ez word, where it comes from if you know, and the meaning in Amharic. You can send one word or several. After you send them, the page shows the words you sent, and you can send more from there.",
    { kind: "prose", rows: 5 },
  ),
  field(
    "about-ha-geez",
    "p3",
    "Opening",
    "Third paragraph",
    "The letters and the numbers are on [About Ge'ez](/about#abugida).",
    { kind: "prose", rows: 2 },
  ),
  field("about-ha-geez", "sourcesTitle", "Sources", "Heading", "Sources"),
  field(
    "about-ha-geez",
    "book",
    "Sources",
    "Book",
    `Most of the words come from [${KIDANEWOLD_BOOK.title}](${KIDANEWOLD_BOOK.url}).`,
    { kind: "prose", rows: 4 },
  ),
  field(
    "about-ha-geez",
    "otherSources",
    "Sources",
    "Other sources",
    "Others were gathered by web scraping, and from entries sent in by the public.",
    { kind: "prose", rows: 3 },
  ),
  field("about-ha-geez", "tourTitle", "Tour", "Heading", "A short tour"),
  field(
    "about-ha-geez",
    "tourCaption",
    "Tour",
    "Caption",
    "Play this to see the home page, a search, one word, and the place where a word is sent.",
    { kind: "prose", rows: 3 },
  ),
  field("about-ha-geez", "tourUrl", "Tour", "Video address", "/tour.mp4", {
    kind: "url",
    hint: "A path on this site, such as /tour.mp4, or a full https link.",
  }),
  field("about-ha-geez", "posterUrl", "Tour", "Video poster address", "/tour-poster.jpg", { kind: "url" }),
  field("about-ha-geez", "openDictionary", "Tour", "First button", "Open the dictionary"),
  field("about-ha-geez", "submitWord", "Tour", "Second button", "Submit a word"),

  field("submit", "eyebrow", "Introduction", "Small heading", "አስተዋጽኦ"),
  field("submit", "title", "Introduction", "Title", "Submit a word"),
  field("submit", "intro", "Introduction", "Opening line", "Send one Ge'ez word, or add a row for each word you have.", {
    kind: "prose",
    rows: 2,
  }),
  field(
    "submit",
    "steps",
    "Introduction",
    "Steps",
    "Write the Ge'ez word.\nAdd where it comes from, if you know. Leave that blank if you do not.\nWrite the meaning in Amharic.\nA note is optional: a book, a verse, or anything else you want remembered with the word.\nAn email is optional, and only if you want a reply. It is not shown with the word.\nPress Send the words.",
    { kind: "list", rows: 8, hint: "One step on each line." },
  ),
  field(
    "submit",
    "after",
    "Introduction",
    "Closing line",
    "The page then lists the words you sent. You can send another from the same page.",
    { kind: "prose", rows: 3 },
  ),
  field("submit", "emailLabel", "Form", "Email label", "Email, if you want a reply"),
  field("submit", "emailPlaceholder", "Form", "Email placeholder", "optional"),
  field("submit", "emailHint", "Form", "Email note", "Optional. It is not shown with the word.", { rows: 2 }),
  field("submit", "wordHeading", "Form", "Card heading", "Word"),
  field("submit", "wordLabel", "Form", "Word label", "Ge'ez word"),
  field("submit", "wordPlaceholder", "Form", "Word placeholder", "ሰላም"),
  field("submit", "originLabel", "Form", "Origin label", "Origin, if you know it"),
  field("submit", "originPlaceholder", "Form", "Origin placeholder", "ከግሪክ የተወሰደ"),
  field("submit", "definitionLabel", "Form", "Definition label", "Amharic definition"),
  field("submit", "definitionPlaceholder", "Form", "Definition placeholder", "ሰላም፤ የሰላምታ ቃል።"),
  field("submit", "noteLabel", "Form", "Note label", "Note"),
  field("submit", "notePlaceholder", "Form", "Note placeholder", "Where you found it."),
  field("submit", "remove", "Form", "Remove button", "Remove this word"),
  field("submit", "add", "Form", "Add button", "Add another word"),
  field("submit", "send", "Form", "Send button", "Send the words"),
  field("submit", "sending", "Form", "While sending", "Sending…"),
  field("submit", "savedEyebrow", "After sending", "Small heading", "Saved"),
  field("submit", "savedTitle", "After sending", "Title", "Received"),
  field("submit", "savedBody", "After sending", "Line under the title", "These are the words you sent.", { rows: 2 }),
  field("submit", "already", "After sending", "If a word is already listed", "Already here:", { rows: 2 }),
  field("submit", "another", "After sending", "Button", "Submit another"),

  field("contact", "eyebrow", "Page", "Small heading", "መልእክት"),
  field("contact", "title", "Page", "Title", "Contact us"),
  field(
    "contact",
    "intro",
    "Page",
    "Introduction",
    "Send a question, a correction, or a note. This page is for a message to the people who keep ሀ ግእዝ. A word for the dictionary still goes through [Submit a word](/submit).",
    { kind: "prose", rows: 4 },
  ),
  field("contact", "nameLabel", "Form", "Name label", "Name"),
  field("contact", "emailLabel", "Form", "Email label", "Email"),
  field("contact", "messageLabel", "Form", "Message label", "Message"),
  field("contact", "send", "Form", "Button", "Send the message"),
  field("contact", "sending", "Form", "While sending", "Sending…"),
  field("contact", "savedTitle", "After sending", "Title", "Sent"),
  field(
    "contact",
    "savedBody",
    "After sending",
    "Line under the title",
    "Your message was sent. You can write another if you need to.",
    { kind: "prose", rows: 3 },
  ),
  field("contact", "another", "After sending", "Button", "Write another"),

  field("chrome", "brand", "Header", "Name", "ሀ ግእዝ"),
  field("chrome", "subtitle", "Header", "Line under the name", "Ge'ez → Amharic Lexicon", { rows: 2 }),
  field("chrome", "home", "Header", "Home", "Home"),
  field("chrome", "dictionary", "Header", "Dictionary", "Dictionary"),
  field("chrome", "about", "Header", "About Ge'ez", "About Ge'ez"),
  field("chrome", "aboutApp", "Header", "About ሀ ግእዝ", "About ሀ ግእዝ"),
  field("chrome", "submit", "Header", "Submit", "Submit"),
  field("chrome", "admin", "Header", "Admin", "Admin"),
  field("chrome", "contact", "Header", "Contact us", "Contact us"),
  field("chrome", "footerSubmit", "Footer", "Submit link", "Submit a word"),

  field("not-found", "title", "Missing page", "Title", "This page is not in the book"),
  field("not-found", "body", "Missing page", "Paragraph", "That page is not here, or the address may be mistyped.", {
    kind: "prose",
    rows: 3,
  }),
  field("not-found", "button", "Missing page", "Button", "Back to the dictionary"),
];

const byKey = new Map(COPY_FIELDS.map((item) => [item.key, item]));
const byPage = new Map<string, CopyField[]>();
for (const item of COPY_FIELDS) {
  const list = byPage.get(item.page) ?? [];
  list.push(item);
  byPage.set(item.page, list);
}

export function pageBySlug(slug: string): CopyPage | undefined {
  return COPY_PAGES.find((page) => page.slug === slug);
}

export function fieldsFor(slug: string): CopyField[] {
  return byPage.get(slug) ?? [];
}

export function fieldByKey(key: string): CopyField | undefined {
  return byKey.get(key);
}

export function navigation(copy: Record<string, string>) {
  return {
    brand: copy["chrome.brand"],
    subtitle: copy["chrome.subtitle"],
    main: [
      { href: "/", label: copy["chrome.home"] },
      { href: "/dictionary", label: copy["chrome.dictionary"] },
      { href: "/about", label: copy["chrome.about"] },
      { href: "/about-ha-geez", label: copy["chrome.aboutApp"] },
      { href: "/submit", label: copy["chrome.submit"] },
      { href: "/admin", label: copy["chrome.admin"] },
    ],
    contact: { href: "/contact", label: copy["chrome.contact"] },
    footerSubmit: copy["chrome.footerSubmit"],
  };
}
