/**
 * አበገደ note kept from the lexicon’s own wording.
 * The number table and the fidel lines below are the user’s text, unchanged.
 */

export const ABUGIDA_ENTRY =
  "የፊደላተ ሴም የ፳፪ቱ አሌፋት ስምና አርእስት የግእዝና የዕብራይስጥ የሱርስት የዐረብ ሥርና ምንጭ ዘሩን እንደዚህ መጽሐፍ አካኼድ በእልፍ ዠምሮ ቦታው የሚጨርስ፡፡ ፪ኛም የግእዙ ተራ ሳይፋለስ ከካዕብ እስከ ሳብዕ ያሉት ፮፤ ፮ቱ እየተዛነቁ ሲጣፉ ስሙ አቡጊዳ ይባላል፡፡";

export const GLORY = "ወስብሐት ለእግዚአብሔር (Glory be to God!)";

export type NumberRow = {
  symbol: string;
  englishNumber: string;
  geezName: string;
  amharicName: string;
  englishName: string;
};

export const GEEZ_NUMBERS: NumberRow[] = [
  { symbol: "፩", englishNumber: "1", geezName: "አሐዱ (Ahadu)", amharicName: "አንድ (And)", englishName: "One" },
  { symbol: "፪", englishNumber: "2", geezName: "ክልኤቱ (Kili'etu)", amharicName: "ሁለት (Hulet)", englishName: "Two" },
  { symbol: "፫", englishNumber: "3", geezName: "ሠለስቱ (Selesitu)", amharicName: "ሦስት (Sost)", englishName: "Three" },
  { symbol: "፬", englishNumber: "4", geezName: "አርባዕቱ (Arba'etu)", amharicName: "አራት (Arat)", englishName: "Four" },
  { symbol: "፭", englishNumber: "5", geezName: "ኃምስቱ (Hamisitu)", amharicName: "አምስት (Amist)", englishName: "Five" },
  { symbol: "፮", englishNumber: "6", geezName: "ስድስቱ (Sidisitu)", amharicName: "ስድስት (Sidist)", englishName: "Six" },
  { symbol: "፯", englishNumber: "7", geezName: "ሰብዐቱ (Seb'atu)", amharicName: "ሰባት (Sebat)", englishName: "Seven" },
  { symbol: "፰", englishNumber: "8", geezName: "ሰመንቱ (Sementu)", amharicName: "ስምንት (Simint)", englishName: "Eight" },
  { symbol: "፱", englishNumber: "9", geezName: "ተሰዐቱ (Tese'atu)", amharicName: "ዘጠኝ (Zetegn)", englishName: "Nine" },
  { symbol: "፲", englishNumber: "10", geezName: "ዐሠርቱ (Asertu)", amharicName: "አሥር (Asir)", englishName: "Ten" },
  { symbol: "፳", englishNumber: "20", geezName: "ዕሥራ (Esra)", amharicName: "ሀያ (Haya)", englishName: "Twenty" },
  { symbol: "፴", englishNumber: "30", geezName: "ሠላሳ (Selasa)", amharicName: "ሠላሳ (Selasa)", englishName: "Thirty" },
  { symbol: "፵", englishNumber: "40", geezName: "አርብዓ (Arb'a)", amharicName: "አርባ (Arba)", englishName: "Forty" },
  { symbol: "፶", englishNumber: "50", geezName: "ኃምሳ (Hamsa)", amharicName: "ኃምሳ (Hamsa)", englishName: "Fifty" },
  { symbol: "፷", englishNumber: "60", geezName: "ስድሳ (Sidsa)", amharicName: "ስድሳ (Sids)", englishName: "Sixty" },
  { symbol: "፸", englishNumber: "70", geezName: "ሰብዓ (Seb'a)", amharicName: "ሰባ (Seba)", englishName: "Seventy" },
  { symbol: "፹", englishNumber: "80", geezName: "ሰማንያ (Semanya)", amharicName: "ሰማንያ (Semanya)", englishName: "Eighty" },
  { symbol: "፺", englishNumber: "90", geezName: "ተስዓ (Tes'a)", amharicName: "ዘጠኝ (Zetena)", englishName: "Ninety" },
  { symbol: "፻", englishNumber: "100", geezName: "ምዕት (Mi'et)", amharicName: "መቶ (Meto)", englishName: "One Hundred" },
  { symbol: "፼", englishNumber: "10,000", geezName: "እልፍ (Ilf)", amharicName: "እልፍ (አሥር ሺ)", englishName: "Ten Thousand" },
];

export type FidelLine = {
  numeral: string;
  letter: string;
  geez: string;
  amharic: string;
  english: string;
};

export const FIDEL_LINES: FidelLine[] = [
  {
    numeral: "፩",
    letter: "ሀ",
    geez: "ብሂል ሀልዎቱ ለአብ እም ቅድመ ዓለም፡፡",
    amharic: "ማለት የአብ አኗኗሩ ከዓለም በፊት ነው፡፡",
    english: "The existence and state of being of the Father is from before the creation of the world.",
  },
  {
    numeral: "፪",
    letter: "ለ",
    geez: "ብሂል- ለብሰ ሥጋ እምድንግል፡፡",
    amharic: "ማለት- ክርስቶስ ከድንግል ማርያም ሥጋን ለበሰ፡፡",
    english: "Christ put on human flesh from the Virgin Mary.",
  },
  {
    numeral: "፫",
    letter: "ሐ",
    geez: "ብሂል ሐመ ወሞተ ወተቀብረ፡፡",
    amharic: "ማለት ክርስቶስ ታመመ፣ ሞተ፣ ተቀበረ፡፡",
    english: "Christ suffered, died, and was buried.",
  },
  {
    numeral: "፬",
    letter: "መ",
    geez: "ብሂል መንክር ግብሩ ለእግዚአብሔር፡፡",
    amharic: "ማለት የእግዚአብሔር ሥራው ድንቅ ነው፡፡",
    english: "Wondrous and miraculous is the work of God.",
  },
  {
    numeral: "፭",
    letter: "ሠ",
    geez: "ብሂል ሠረቀ በሥጋ፡፡",
    amharic: "ማለት ጌታ በሥጋ ተወለደ (ተገለጠ)፡፡",
    english: "The Lord was manifested (born) in the flesh.",
  },
  {
    numeral: "፮",
    letter: "ረ",
    geez: "ብሂል ረግዓት ምድር በቃሉ፡፡",
    amharic: "ማለት ምድር በቃሉ ረጋች (ጸናች)፡፡",
    english: "The earth became stable and established by His word.",
  },
  {
    numeral: "፯",
    letter: "ሰ",
    geez: "ብሂል ሰብአ ኮነ እግዚእነ፡፡",
    amharic: "ማለት ጌታችን ሰው ሆነ፡፡",
    english: "Our Lord became human.",
  },
  {
    numeral: "፰",
    letter: "ቀ",
    geez: "ብሂል ቀዳሚሁ ቃል፡፡",
    amharic: "ማለት በመጀመሪያ ቃል ነበር፡፡",
    english: "In the beginning was the Word.",
  },
  {
    numeral: "፱",
    letter: "በ",
    geez: "ብሂል በትኅትናሁ ወረደ እግዚእነ፡፡",
    amharic: "ማለት ጌታችን በትሕትናው ወደኛ ወረደ (ተወለደ)፡፡",
    english: "In His absolute humility, our Lord descended to us (and was born).",
  },
  {
    numeral: "፲",
    letter: "ተ",
    geez: "ብሂል ተሰብአ ወተሰገወ፡፡",
    amharic: "ማለት ጌታችን ሰው ሆነ፡፡",
    english: "Our Lord became man and took on human flesh.",
  },
  {
    numeral: "፲፩",
    letter: "ኀ",
    geez: "ብሂል ኀያል እግዚአብሔር፡፡",
    amharic: "ማለት እግዚአብሔር ኀያል ነው፡፡",
    english: "God is Almighty and All-Powerful.",
  },
  {
    numeral: "፲፪",
    letter: "ነ",
    geez: "ብሂል ነሥአ ደዌነ ወፆረ ሕማመነ፡፡",
    amharic: "ማለት ጌታችን ደዌያችንን ያዘልን ሕመማችንን ተሸከመልን፡፡",
    english: "Our Lord took away our infirmities and carried our sicknesses.",
  },
  {
    numeral: "፲፫",
    letter: "አ",
    geez: "ብሂል አአኲቶ ወእሴብሖ ለእግዚአበሔር አቀድም (አእኲቶቶ ለእግዚአብሔር)",
    amharic: "ማለት እግዚአብሔርን በፍጹም ልቤ አመሰግነዋለሁ (እግዚአብሔርን ማመስገንን አስቀድማለሁ)፡፡",
    english: "I prioritize thanking God (I thank and praise God with all my heart).",
  },
  {
    numeral: "፲፬",
    letter: "ከ",
    geez: "ብሂል- ከሃሊ እግዚአብሔር፡፡",
    amharic: "ማለት – እግዚአብሔር ሁሉን ቻይ ነው፡፡",
    english: "God is All-Powerful and capable of doing all things.",
  },
  {
    numeral: "፲፭",
    letter: "ወ",
    geez: "ብሂል – ወረደ እም ሰማይ እግዚእነ",
    amharic: "ወ ማለት -ጌታችን ከሰማይ ወረደ፡፡",
    english: "Our Lord descended from heaven.",
  },
  {
    numeral: "፲፮",
    letter: "ዐ",
    geez: "ብሂል – ዐርገ ሰማያተ እግዚእነ፡፡",
    amharic: "ዐ ማለት – ጌታችን ወደሰማይ ወጣ /ዐረገ/፡፡",
    english: "Our Lord ascended into the heavens.",
  },
  {
    numeral: "፲፯",
    letter: "ዘ",
    geez: "ብሂል – ዘኲሎ ይእኅዝ እግዚአብሔር፡፡",
    amharic: "ዘ ማለት -እግዚአብሔር ይይዛል /ሁሉን የሚይዝ ነው/፡፡",
    english: "God sustains all (He is the Sovereign Ruler who holds all creation).",
  },
  {
    numeral: "፲፰",
    letter: "የ",
    geez: "ብሂል – የማነ እግዚአብሔር ገብረት ኀይለ፡፡",
    amharic: "የ ማለት – የእግዚአብሔር ቀኝ ኀይልን አደረገች፡፡",
    english: "The right hand of God has performed acts of power.",
  },
  {
    numeral: "፲፱",
    letter: "ደ",
    geez: "ብሂል – ደመረ ሥጋነ ምስለ መለኮቱ፡፡",
    amharic: "ደ ማለት – ሥጋችንን ከመለኮት ጋር አንድ አደረገልን፡፡",
    english: "He united our human flesh with His divine Godhead.",
  },
  {
    numeral: "፳",
    letter: "ገ",
    geez: "ብሂል – ገብረ ሰማያተ በጥበቡ፡፡",
    amharic: "ገ ማለት – ሰማያትን በጥበቡ ሠራ፡፡",
    english: "He fashioned the heavens by His wisdom.",
  },
  {
    numeral: "፳፩",
    letter: "ጠ",
    geez: "ብሂል – ጠዐሙ ወታእምሩ ከመ ኄር እግዚአብሔር፡፡",
    amharic: "ጠ ማለት – የእግዚአብሔርን ቸርነት ታውቁ ዘንድ ቅመሱ፡፡",
    english: "Taste and see that the Lord is good and kind.",
  },
  {
    numeral: "፳፪",
    letter: "ጰ",
    geez: "ብሂል – ጰራቅሊጦስ መንፈሰ ጽድቅ፡፡",
    amharic: "ጰ ማለት – ጰራቅሊጦስ የእውነት መንፈስ ነው፡፡",
    english: "The Paraclete is the Spirit of Righteousness and Truth.",
  },
  {
    numeral: "፳፫",
    letter: "ፀ",
    geez: "ብሂል – ፀሐይ ጸልመ በጊዜ ስቅለቱ ለእግዚእነ፡፡",
    amharic: "ፀ ማለት – ጌታ በተሰቀለ ጊዜ ፀሐይ ጨለመ፡፡",
    english: "The sun was darkened at the time of the crucifixion of our Lord.",
  },
  {
    numeral: "፳፬",
    letter: "ጸ",
    geez: "ብሂል – ጸጋ ወክብር ተውህበ ለነ፡፡",
    amharic: "ጸ ማለት – ጸጋ እና ክብር ለእኛ ተሰጠን፡፡",
    english: "Grace and honor have been bestowed upon us.",
  },
  {
    numeral: "፳፭",
    letter: "ፈ",
    geez: "ብሂል – ፈጠረ ሰማየ ወምድረ፡፡",
    amharic: "ፈ ማለት እግዚአብሔር ሰማይና ምድርን ፈጠረ፡፡",
    english: "God created the heavens and the earth.",
  },
  {
    numeral: "፳፮",
    letter: "ፐ",
    geez: "ብሂል – ፓፓኤል ሥሙ ለአምላክ፡፡",
    amharic: "ፐ ማለት – ፓፓኤል የአምላክ ስም ነው፡፡",
    english: "Papael is the hidden, divine name of God.",
  },
];

/** Phrase inside ABUGIDA_ENTRY that opens the twenty-two names. */
export const ALEFAT_PHRASE = "፳፪ቱ አሌፋት";

export const ALEFAT_TITLE = "፳፪ቱ አሌፋት";

export const ALEFAT_INTRO = [
  "በጸፍጸፈ ሰማይ ለሄኖስ ተጽፈው የተገለጹ ናቸው።",
  "በኋላም መዝሙረኛው ዳዊት ጸልዮባቸዋል።",
  "ነቢዩ ኤርምያስም እንደ ዳዊት አመስግኖባቸዋል ።",
  "22ቱ የአሌፋት ፊደላት የእግዚአብሔር ህቡዕ ስሞች ሲሆኑ ከግእዙ ፊደላት ጋር የተጣመሩ ናቸው።",
] as const;

export type AlefatLetter = {
  n: string;
  name: string;
  line: string;
  meaning: string;
};

export const ALEFAT_LETTERS: AlefatLetter[] = [
  {
    n: "1",
    name: "አሌፍ ፡",
    line: "አሌፍ ብሂል አብ ፈጣሬ ኩሉ ዓለም",
    meaning: "ዓለምን ከነጓዟ ካለመኖር ወደ መኖር አምጥቶ የፈጠረ እግዚአብሔር ነው ማለት ነው።",
  },
  {
    n: "2",
    name: "ቤት፡",
    line: "ቤት ብሂል ባዕል እግዚአብሔር",
    meaning: "እግዚአብሔር ሁሉን መስጠት የሚችል ቸር ለጋስ ባለጸጋ ነው ማለት ነው።",
  },
  {
    n: "3",
    name: "ጋሜል ፡",
    line: "ጋሜል ብሂል ግሩም እግዚአብሔር",
    meaning: "እግዚአብሔር ሊመረመር የማይችል ግሩም ድንቅ ነው ማለት ነው።",
  },
  {
    n: "4",
    name: "ዳሌጥ",
    line: "ዳሌጥ ብሂል ድልው እግዚአብሔር",
    meaning: "እግዚአብሔር ፍጥረታትን ሁሉ ፈጥሮ ያዘጋጀ ነው ማለት ነው።",
  },
  {
    n: "5",
    name: "ሄ፡",
    line: "ሄ ብሂል ህልው እግዚአብሔር",
    meaning: "እግዚአብሔር በአንድነቱ በሦስትነቱ ለዘለዓለም ይኖራል ማለት ነው።",
  },
  {
    n: "6",
    name: "ዋው ፡",
    line: "ዋው ብሂል ዋህድ እግዚአብሔር",
    meaning: "እግዚአብሔር በመንግሥት በሥልጣን በአገዛዝ በባህርይ አንድ አምላክ የሆነ ማለት ነው።",
  },
  {
    n: "7",
    name: "ዛይ ፡",
    line: "ዛይ ብሂል ዝኩር እግዚአብሔር",
    meaning: "እግዚአብሔር በሥራው ሁሉ እየታሰበ ሲመሰገን የሚኖር ፈጣሪ ነው ማለት ነው።",
  },
  {
    n: "8",
    name: "ሔት",
    line: "ሔት ብሂል ሕያው እግዚአብሔር",
    meaning: "እግዚአብሔር በመንግሥቱ ሽረት በባሕርዩ ኅልፈት የሌለበት ለዘለዓለም ሕያው የሆነ ነው ማለት ነው።",
  },
  {
    n: "9",
    name: "ጤት ፡",
    line: "ጤት ብሂል ጠቢብ እግዚአብሔር",
    meaning: "እግዚአብሔር ጥበብን የሚገልጽ ከጥበበኞች ይልቅ ጥበበኛ የሆነ አምላክ ነው ማለት ነው።",
  },
  {
    n: "10",
    name: "ዮድ፡",
    line: "ዮድ ብሂል የማነ እግዚአብሔር ገብረት ኃይለ",
    meaning: "በእግዚአብሔር ቀኝ ያለ እሱ ኃያልና ጽኑዕ የሆነ  ነው ማለት ነው።",
  },
  {
    n: "11",
    name: "ካፍ ፡",
    line: "ከሀሊ እግዚአብሔር",
    meaning: "ለእግዚአብሔር የሚሳነው ነገር የሌለ ሁሉን ማድረግ የሚቻለው አምላክ ነው ማለት ነው።",
  },
  {
    n: "12",
    name: "ላሜድ ፡",
    line: "ላሜድ ብሂል ልዑል እግዚአብሔር",
    meaning: "እግዚአብሔር ልዑለ ባሕርይ የሆነ  አምላክ ነው ማለት ነው።",
  },
  {
    n: "13",
    name: "ሜም ፡",
    line: "ሜም ብሂል ምዑዝ እግዚአብሔር",
    meaning: "እግዚአብሔር ንጹሕ ባሕርይ የሆነ አምላክ ነው ማለት ነው።",
  },
  {
    n: "14",
    name: "ኖን፡",
    line: "ኖን ብሂል ንጉሥ እግዚአብሔር",
    meaning: "እግዚአብሔር የነገሥታት ንጉሥ የገዥዎች ገዥ የሆነ አምላክ ነው ማለት ነው።",
  },
  {
    n: "15",
    name: "ሳምኬት ፡",
    line: "ሳምኬት ብሂል ሰፋኒ እግዚአብሔር",
    meaning: "እግዚአብሔር ሁሉን የሚገዛ አምላክ  ነው ማለት ነው።",
  },
  {
    n: "16",
    name: "ዔ፡",
    line: "ዔ ብሂል ዓቢይ እግዚአብሔር",
    meaning: "እግዚአብሔር ታላቅና ገናና የሆነ አምላክ  ነው ማለት ነው።",
  },
  {
    n: "17",
    name: "ፌ፡",
    line: "ፌ ብሂል ፍቁር እግዚአብሔር",
    meaning: "እግዚአብሔር ተወዳጅ የሆነ አምላክ ነው ማለት ነው።",
  },
  {
    n: "18",
    name: "ጻዴ፡",
    line: "ጻዴ ብሂል ጻድቅ እግዚአብሔር",
    meaning: "እግዚአብሔር ሐሰት የሌለበት እውነተኛ አምላክ  ነው ማለት ነው።",
  },
  {
    n: "19",
    name: "ቆፍ፡",
    line: "ቆፍ ብሂል ቅሩብ እግዚአብሔር",
    meaning: "እግዚአብሔር ለልበ ቅኖችና ለየዋሃኖች ቅርብ የሆነ አምላክ ነው  ማለት ነው።",
  },
  {
    n: "20",
    name: "ሬስ፡",
    line: "ሬስ ብሂል ርኡስ እግዚአብሔር",
    meaning: "እግዚአብሔር ክብሩ ከእርሱ ለእርሱ የተገኘ የሁሉ ጌታ  በሁሉ የሰለጠነ ነው  ማለት ነው።",
  },
  {
    n: "21",
    name: "ሳን፡",
    line: "ሳን ብሂል ስቡሕ እግዚአብሔር",
    meaning: "እግዚአብሔር በሥራው ሁሉ የተመሠገነ ነው ማለት ነው።",
  },
  {
    n: "22",
    name: "ታው፡",
    line: "ታው ብሂል ትጉህ እግዚአብሔር",
    meaning: "እግዚአብሔር እንቅልፍ የሌለበት ትጉህ፤ ድካም የማይሰማው ጽኑዕ የሆነ ፈጣሪ ነው ማለት ነው።",
  },
];
