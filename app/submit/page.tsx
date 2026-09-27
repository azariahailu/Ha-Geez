import type { Metadata } from "next";
import { SubmitForm } from "@/components/submit-form";

export const metadata: Metadata = {
  title: "Submit",
  description: "Send a Ge'ez word and its Amharic meaning.",
};

export default function SubmitPage() {
  return (
    <main id="content" className="mx-auto max-w-2xl px-4 py-10">
      <p className="text-xs tracking-[0.2em] text-[#8d6b2f] uppercase">አስተዋጽኦ</p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Submit a word</h1>
      <div className="mt-4 space-y-4 leading-7 text-muted-foreground">
        <p>Send one Ge&apos;ez word, or add a row for each word you have.</p>
        <ol className="list-decimal space-y-2 ps-5">
          <li>Write the Ge&apos;ez word.</li>
          <li>Add where it comes from, if you know. Leave that blank if you do not.</li>
          <li>Write the meaning in Amharic.</li>
          <li>A note is optional: a book, a verse, or anything else you want remembered with the word.</li>
          <li>An email is optional, and only if you want a reply. It is not shown with the word.</li>
          <li>Press Send the words.</li>
        </ol>
        <p>
          The page then lists the words you sent. You can send another from the same page.
        </p>
      </div>
      <div className="mt-8">
        <SubmitForm />
      </div>
    </main>
  );
}
