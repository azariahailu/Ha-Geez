import Link from "next/link";
import {
  ABUGIDA_ENTRY,
  ALEFAT_INTRO,
  ALEFAT_LETTERS,
  ALEFAT_PHRASE,
  ALEFAT_TITLE,
  FIDEL_LINES,
  GEEZ_NUMBERS,
  GLORY,
} from "@/lib/abugida-source";

export function AbugidaTables() {
  return (
    <div className="space-y-8">
      <blockquote lang="am" className="border-s-2 border-[#c6a15a] ps-4 text-lg leading-8">
        {ABUGIDA_ENTRY.slice(0, ABUGIDA_ENTRY.indexOf(ALEFAT_PHRASE))}
        <Link href="#alefat" className="underline decoration-[#c6a15a] underline-offset-4">
          {ALEFAT_PHRASE}
        </Link>
        {ABUGIDA_ENTRY.slice(ABUGIDA_ENTRY.indexOf(ALEFAT_PHRASE) + ALEFAT_PHRASE.length)}
      </blockquote>

      <div className="overflow-x-auto rounded-md border border-border bg-card">
        <table id="geez-numbers" className="w-full min-w-[52rem] border-collapse text-left">
          <caption className="sr-only">Ge&apos;ez numbers</caption>
          <thead>
            <tr className="border-b border-border bg-secondary/70">
              <th scope="col" className="px-3 py-2 text-sm font-medium">
                Symbol
              </th>
              <th scope="col" className="px-3 py-2 text-sm font-medium">
                English Number
              </th>
              <th scope="col" className="px-3 py-2 text-sm font-medium">
                Ge&apos;ez Name
              </th>
              <th scope="col" className="px-3 py-2 text-sm font-medium">
                Amharic Name
              </th>
              <th scope="col" className="px-3 py-2 text-sm font-medium">
                English Name
              </th>
            </tr>
          </thead>
          <tbody>
            {GEEZ_NUMBERS.map((row) => (
              <tr key={row.symbol} className="border-b border-border/80 last:border-0">
                <th
                  scope="row"
                  lang="gez"
                  className="font-gez px-3 py-3 text-2xl font-medium text-primary"
                >
                  {row.symbol}
                </th>
                <td className="px-3 py-3 align-top">{row.englishNumber}</td>
                <td lang="gez" className="font-gez px-3 py-3 align-top text-lg">
                  {row.geezName}
                </td>
                <td lang="am" className="px-3 py-3 align-top text-lg">
                  {row.amharicName}
                </td>
                <td className="px-3 py-3 align-top">{row.englishName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ol id="fidel" className="space-y-4">
        {FIDEL_LINES.map((line) => (
          <li key={line.numeral} className="paper p-5">
            <p className="font-gez text-2xl text-primary">
              <span lang="gez">{line.numeral}.</span>{" "}
              <span lang="gez">{line.letter}</span>
            </p>
            <p lang="gez" className="font-gez mt-3 text-lg leading-8">
              <span className="text-sm tracking-[0.14em] text-[#8d6b2f] uppercase">Ge&apos;ez: </span>
              {line.geez}
            </p>
            <p lang="am" className="mt-2 text-lg leading-8">
              <span className="text-sm tracking-[0.14em] text-[#8d6b2f] uppercase">Amharic: </span>
              {line.amharic}
            </p>
            <p className="mt-2 leading-7">
              <span className="text-sm tracking-[0.14em] text-[#8d6b2f] uppercase">
                English Meaning:{" "}
              </span>
              {line.english}
            </p>
          </li>
        ))}
      </ol>

      <section id="alefat" className="scroll-mt-24">
        <h3 lang="gez" className="font-gez text-3xl text-primary">
          {ALEFAT_TITLE}
        </h3>
        <div lang="am" className="mt-3 space-y-3 text-lg leading-8">
          {ALEFAT_INTRO.map((line) => (
            <p key={line} className="whitespace-pre-line">
              {line}
            </p>
          ))}
        </div>
        <ol className="mt-6 space-y-4">
          {ALEFAT_LETTERS.map((letter) => (
            <li key={letter.n} className="paper p-5">
              <p className="font-gez text-2xl text-primary">
                <span>{letter.n}.</span> <span lang="gez">{letter.name}</span>
              </p>
              <p lang="gez" className="font-gez mt-3 text-lg leading-8 whitespace-pre-line">
                {letter.line}
              </p>
              <p lang="am" className="mt-2 text-lg leading-8 whitespace-pre-line">
                {letter.meaning}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <p lang="gez" className="font-gez text-2xl leading-9 text-primary">
        {GLORY}
      </p>
    </div>
  );
}
