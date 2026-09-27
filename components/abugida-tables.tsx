import Link from "next/link";
import { ALEFAT_PHRASE, type AlefatLetter, type FidelLine, type NumberRow } from "@/lib/abugida-source";

export function AbugidaTables({
  quote,
  numbers,
  numberHeaders,
  fidel,
  alefatTitle,
  alefatIntro,
  alefatLetters,
  glory,
}: {
  quote: string;
  numbers: NumberRow[];
  numberHeaders: string[];
  fidel: FidelLine[];
  alefatTitle: string;
  alefatIntro: string[];
  alefatLetters: AlefatLetter[];
  glory: string;
}) {
  const phraseAt = quote.indexOf(ALEFAT_PHRASE);
  return (
    <div className="space-y-8">
      <blockquote lang="am" className="border-s-2 border-[#c6a15a] ps-4 text-lg leading-8">
        {phraseAt === -1 ? (
          quote
        ) : (
          <>
            {quote.slice(0, phraseAt)}
            <Link href="#alefat" className="underline decoration-[#c6a15a] underline-offset-4">
              {ALEFAT_PHRASE}
            </Link>
            {quote.slice(phraseAt + ALEFAT_PHRASE.length)}
          </>
        )}
      </blockquote>

      <div className="overflow-x-auto rounded-md border border-border bg-card">
        <table id="geez-numbers" className="w-full min-w-[52rem] border-collapse text-left">
          <caption className="sr-only">Ge&apos;ez numbers</caption>
          <thead>
            <tr className="border-b border-border bg-secondary/70">
              {numberHeaders.map((header, index) => (
                <th key={`${header}-${index}`} scope="col" className="px-3 py-2 text-sm font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {numbers.map((row) => (
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
        {fidel.map((line) => (
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
          {alefatTitle}
        </h3>
        <div lang="am" className="mt-3 space-y-3 text-lg leading-8">
          {alefatIntro.map((line) => (
            <p key={line} className="whitespace-pre-line">
              {line}
            </p>
          ))}
        </div>
        <ol className="mt-6 space-y-4">
          {alefatLetters.map((letter) => (
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
        {glory}
      </p>
    </div>
  );
}
