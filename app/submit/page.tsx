import type { Metadata } from "next";
import { SubmitForm } from "@/components/submit-form";

export const metadata: Metadata = {
  title: "Submit",
  description: "Send a Ge'ez headword and an Amharic definition to ሀ ግእዝ.",
};

export default function SubmitPage() {
  return (
    <main id="content" className="mx-auto max-w-2xl px-4 py-10">
      <p className="text-xs tracking-[0.2em] text-[#8d6b2f] uppercase">አስተዋጽኦ</p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Submit a word</h1>
      <div className="mt-4 space-y-4 leading-7 text-muted-foreground">
        <p>
          If you know a Ge&apos;ez word that should be in the lexicon, send it here. One word is
          enough. If you have several, add a row for each.
        </p>
        <ol className="list-decimal space-y-2 ps-5">
          <li>Write the Ge&apos;ez headword.</li>
          <li>Add the origin if you know where the word comes from. Leave it blank if you do not.</li>
          <li>Write the meaning in Amharic.</li>
          <li>A note is optional: the book, the verse, or why the meaning should change.</li>
          <li>
            An email is optional, and only if you want a reply. It is never printed on the public
            entry.
          </li>
          <li>Press Send the words.</li>
        </ol>
        <p>
          What happens next: the page lists the words you sent. They are saved, and they are not in
          the public dictionary yet. When a word is added, it shows up in search like the others. If
          that headword is already there, your note is still kept so the meaning can be corrected.
          You can send another word from the same page.
        </p>
      </div>
      <div className="mt-8">
        <SubmitForm />
      </div>
    </main>
  );
}
