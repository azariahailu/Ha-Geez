import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { RichText } from "@/components/rich-text";
import { loadCopy } from "@/lib/copy";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Send a question or a note to the people who keep ሀ ግእዝ.",
};

export default async function ContactPage() {
  const copy = await loadCopy();

  return (
    <main id="content" className="mx-auto max-w-2xl px-4 py-10">
      <p className="text-xs tracking-[0.2em] text-[#8d6b2f] uppercase">{copy["contact.eyebrow"]}</p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">{copy["contact.title"]}</h1>
      <div className="mt-4 max-w-xl space-y-4 leading-7 text-muted-foreground">
        <RichText text={copy["contact.intro"]} />
      </div>
      <div className="mt-8">
        <ContactForm copy={Object.fromEntries(Object.entries(copy).filter(([key]) => key.startsWith("contact.")))} />
      </div>
    </main>
  );
}
