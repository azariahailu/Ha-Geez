import {
  ABUGIDA_ENTRY,
  ABUGIDA_LETTERS,
  GEEZ_NUMBERS,
  LEXICON_BOOK,
} from "@/lib/abugida-source";

function SourceTable({
  id,
  caption,
  head,
  rows,
}: {
  id: string;
  caption: string;
  head: string;
  rows: { letter: string; text: string }[];
}) {
  return (
    <div className="overflow-x-auto rounded-md border border-border bg-card">
      <table id={id} className="w-full min-w-[36rem] border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border bg-secondary/70">
            <th scope="col" lang="gez" className="font-gez px-3 py-2 text-base font-medium">
              ፊደል
            </th>
            <th scope="col" lang="am" className="px-3 py-2 text-sm font-medium">
              {head}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${id}-${row.letter}`} className="border-b border-border/80 last:border-0">
              <th
                scope="row"
                lang="gez"
                className="font-gez px-3 py-3 align-top text-2xl font-medium text-primary"
              >
                {row.letter}
              </th>
              <td lang="am" className="px-3 py-3 align-top text-base leading-7">
                {row.text}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AbugidaTables() {
  return (
    <div className="space-y-8">
      <blockquote lang="am" className="border-s-2 border-[#c6a15a] ps-4 text-lg leading-8">
        {ABUGIDA_ENTRY}
      </blockquote>
      <div>
        <h3 lang="gez" className="font-gez text-2xl text-primary">
          አበገደ
        </h3>
        <p className="mt-2 text-base leading-7 text-muted-foreground">
          The letters below are the አበገደ entries from the lexicon sheet, in the order the sheet
          gives: አ፣ በ፣ ገ፣ ደ. Each line is the book’s own sentence.
        </p>
        <div className="mt-4">
          <SourceTable
            id="abugida"
            caption="አበገደ, the Ge'ez letters as written in the lexicon"
            head="በመጽሐፉ"
            rows={ABUGIDA_LETTERS}
          />
        </div>
      </div>
      <div>
        <h3 lang="gez" className="font-gez text-2xl text-primary">
          ቍጥር
        </h3>
        <p className="mt-2 text-base leading-7 text-muted-foreground">
          The number of each letter, in the same wording. Nothing here is rewritten into another
          chart.
        </p>
        <div className="mt-4">
          <SourceTable
            id="geez-numbers"
            caption="Ge'ez letter numbers as written in the lexicon"
            head="ቍጥሩ"
            rows={GEEZ_NUMBERS}
          />
        </div>
      </div>
      <p className="text-sm leading-6 text-muted-foreground">
        From the supplied lexicon, whose entries are taken from አለቃ ኪዳነ ወልድ ክፍሌ, «
        <span lang="gez">{LEXICON_BOOK}</span>».
      </p>
    </div>
  );
}
