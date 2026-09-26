import type { Metadata } from "next";
import { SubmitForm } from "@/components/submit-form";

export const metadata: Metadata = {
  title: "Submit",
  description: "Propose a Ge'ez headword and an Amharic definition for review in ሀ ግእዝ.",
};

export default function SubmitPage() {
  return (
    <main id="content" className="mx-auto max-w-2xl px-4 py-10">
      <p className="text-xs tracking-[0.2em] text-[#8d6b2f] uppercase">አስተዋጽኦ</p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Submit a word</h1>
      <p className="mt-4 leading-7 text-muted-foreground">
        Send one headword or several. Each one becomes a ticket in the review queue. It is not part
        of the public dictionary until an editor approves it. If the word is already published, the
        note still goes to the queue so the gloss can be corrected.
      </p>
      <div className="mt-8">
        <SubmitForm />
      </div>
    </main>
  );
}
