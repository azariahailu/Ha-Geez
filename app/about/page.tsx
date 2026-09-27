import type { ReactNode } from "react";
import type { Metadata } from "next";
import { AbugidaTables } from "@/components/abugida-tables";
import { Rule } from "@/components/rule";
import { GEEZ_ARTICLE } from "@/lib/credits";

export const metadata: Metadata = {
  title: "About Ge'ez",
  description:
    "A short introduction to Ge'ez, the liturgical language of the Ethiopian and Eritrean Orthodox churches, with the letters and the numbers.",
};

function Section({
  numeral,
  title,
  children,
  id,
}: {
  numeral: string;
  title: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="mt-10 scroll-mt-24">
      <p lang="gez" className="font-gez text-2xl text-primary">
        {numeral}
      </p>
      <h2 className="mt-1 font-serif text-3xl">{title}</h2>
      <div className="mt-3 space-y-4 text-lg leading-8">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <main id="content" className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <img
        src="/eotc-seal.png"
        alt="Seal of the Ethiopian Orthodox Tewahedo Church"
        width={720}
        height={857}
        className="mx-auto mb-8 h-auto w-52 sm:w-64"
      />
      <p className="text-xs tracking-[0.2em] text-[#8d6b2f] uppercase">ስለ ግዕዝ</p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">About Ge&apos;ez</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        (
        <a
          href={GEEZ_ARTICLE.url}
          className="text-foreground underline decoration-[#c6a15a] underline-offset-4"
        >
          {GEEZ_ARTICLE.author}, “{GEEZ_ARTICLE.title},”
        </a>{" "}
        {GEEZ_ARTICLE.publisher}, {GEEZ_ARTICLE.date}.)
      </p>
      <p className="mt-4 font-serif text-2xl leading-snug text-foreground/90">
        A South Semitic language that left the market and stayed in the church.
      </p>
      <div className="mt-6">
        <Rule />
      </div>

      <Section numeral="፩" title="A language that stayed in the church">
        <p>
          Ge&apos;ez is a South Semitic language of the northern highlands. It was once spoken in the
          lands that are now Ethiopia and Eritrea. Between the tenth and thirteenth centuries it
          receded from daily conversation. It did not vanish. It remains the liturgical language of
          the Ethiopian and Eritrean Orthodox Tewahedo churches: the language of the missal, the
          psalms, and the chants a congregation hears even when home speech is Amharic, Tigrinya, or
          something else.
        </p>
      </Section>

      <Section id="abugida" numeral="፪" title="አበገደ, and the numbers">
        <p>
          The script did not start as it is written today. It began as an abjad: consonants were
          written, and readers supplied the vowels. By the fourth century it had become an abugida.
          Each character is a consonant and a vowel together. The article on Ge&apos;ez names those
          seven orders as /aa/, /oo/, /ee/, /u/, /ie/, /e/, and /o/.
        </p>
        <p>
          The dictionary is arranged in Ge&apos;ez alphabetic order (አ፣ በ፣ ገ፣ ደ፣…). The numbers and
          the letters follow.
        </p>
        <AbugidaTables />
      </Section>

      <Section numeral="፫" title="After Aksum">
        <p>
          Ge&apos;ez belongs with the civilization of Aksum. When the kingdom declined, around the
          tenth century, the language remained with the church and with scholars. Manuscripts hold
          prayer books, the Psalter, and lives of saints. They also hold stories and notes on the
          history and economy of Aksum and of the port of Adulis. The language of the liturgy was
          never only a language of the sanctuary.
        </p>
      </Section>

      <Section numeral="፬" title="Qene, poetry for the voice">
        <p>
          Qene (<span lang="gez">ቅኔ</span>) is the oral poetry of this tradition. The rules of
          composition are written down and taught. The poems themselves are made for performance and
          carried by memory. They are heard at the Sunday service and at festivals.
        </p>
        <p>
          Training is long: about seven years to become a poet, and about seven more before a poet
          teaches. There are more than sixteen kinds, each with its own form and occasion. The
          subjects are wider than a newcomer expects. Praise and liturgy are there. So are social
          critique, the natural world, justice, love, and the harvest.
        </p>
      </Section>

      <Section numeral="፭" title="Sewasew">
        <p>
          Students learn Sewasew (<span lang="gez">ሰዋስው</span>), the grammar, alongside Qene.
          Teachers still name patterns of stress and intonation in Amharic:{" "}
          <span lang="am">ተነሽ፣ ወዳቂ፣ ተጣይ፣ ሰያፍ፣ ተናባቢ፣ ማጥበቅ፣ ማላላት፣ ኣጎበር</span>.
        </p>
        <p>
          Much recent study of Ge&apos;ez stays with manuscripts and the script. Oral Qene has had
          less attention, partly because it is not written down, and partly because people assume it
          is only religious. It is a literature of the voice.
        </p>
      </Section>

    </main>
  );
}
