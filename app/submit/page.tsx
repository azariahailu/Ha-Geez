import type { Metadata } from "next";
import { LineList, RichText } from "@/components/rich-text";
import { SubmitForm } from "@/components/submit-form";
import { loadCopy } from "@/lib/copy";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Submit",
  description: "Send a Ge'ez word and its Amharic meaning.",
};

export default async function SubmitPage() {
  const copy = await loadCopy();

  return (
    <main id="content" className="mx-auto max-w-2xl px-4 py-10">
      <p className="text-xs tracking-[0.2em] text-[#8d6b2f] uppercase">{copy["submit.eyebrow"]}</p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">{copy["submit.title"]}</h1>
      <div className="mt-4 space-y-4 leading-7 text-muted-foreground">
        <RichText text={copy["submit.intro"]} />
        <LineList text={copy["submit.steps"]} className="list-decimal space-y-2 ps-5" />
        <RichText text={copy["submit.after"]} />
      </div>
      <div className="mt-8">
        <SubmitForm copy={Object.fromEntries(Object.entries(copy).filter(([key]) => key.startsWith("submit.")))} />
      </div>
    </main>
  );
}
