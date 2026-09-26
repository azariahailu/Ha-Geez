"use client";

import { useState, useTransition, type FormEvent } from "react";
import { submitEntries } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Row = {
  key: string;
  word: string;
  origin: string;
  definition: string;
  notes: string;
};

function blankRow(): Row {
  return { key: crypto.randomUUID(), word: "", origin: "", definition: "", notes: "" };
}

export function SubmitForm() {
  const [rows, setRows] = useState<Row[]>([blankRow()]);
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ words: string[]; alreadyPublished: string[] } | null>(null);
  const [pending, startTransition] = useTransition();

  function update(key: string, field: keyof Omit<Row, "key">, value: string) {
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, [field]: value } : row)),
    );
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitEntries({
        email,
        website,
        entries: rows.map(({ word, origin, definition, notes }) => ({
          word,
          origin,
          definition,
          notes,
        })),
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setDone({ words: result.words, alreadyPublished: result.alreadyPublished });
    });
  }

  if (done) {
    return (
      <div className="paper p-6 sm:p-8" aria-live="polite">
        <p className="text-sm tracking-[0.16em] text-[#8d6b2f] uppercase">Review queue</p>
        <h2 className="mt-2 font-serif text-3xl">Received, not published yet</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          An editor will approve, edit, or decline each word. Until then it stays out of the public
          dictionary.
        </p>
        <ul className="mt-5 space-y-2">
          {done.words.map((word) => (
            <li key={word} lang="gez" className="font-gez text-2xl">
              {word}
            </li>
          ))}
        </ul>
        {done.alreadyPublished.length > 0 ? (
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Already in the lexicon, and still sent for another look: {done.alreadyPublished.join("፣ ")}.
          </p>
        ) : null}
        <Button
          type="button"
          className="mt-6 h-11 px-4"
          onClick={() => {
            setDone(null);
            setRows([blankRow()]);
            setEmail("");
          }}
        >
          Submit another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-5">
      <div className="paper space-y-2 p-5">
        <Label htmlFor="email">Email, if you want a reply</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          placeholder="optional"
          className="h-11 md:text-base"
        />
        <p className="text-sm text-muted-foreground">
          The address is visible only to editors. It is never printed on the public entry.
        </p>
      </div>

      <div className="pointer-events-none absolute h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      {rows.map((row, index) => (
        <fieldset key={row.key} className="paper space-y-4 p-5">
          <legend className="px-1 text-sm tracking-[0.14em] text-[#8d6b2f] uppercase">
            Word {index + 1}
          </legend>
          <div className="space-y-2">
            <Label htmlFor={`${row.key}-word`}>Ge&apos;ez headword</Label>
            <Input
              id={`${row.key}-word`}
              required
              value={row.word}
              onChange={(event) => update(row.key, "word", event.target.value)}
              lang="gez"
              className="h-12 font-gez text-2xl md:text-2xl"
              placeholder="ሰላም"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${row.key}-origin`}>Origin, if you know it</Label>
            <Input
              id={`${row.key}-origin`}
              value={row.origin}
              onChange={(event) => update(row.key, "origin", event.target.value)}
              lang="am"
              className="h-11 md:text-base"
              placeholder="ከግሪክ የተወሰደ"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${row.key}-definition`}>Amharic definition</Label>
            <Textarea
              id={`${row.key}-definition`}
              required
              value={row.definition}
              onChange={(event) => update(row.key, "definition", event.target.value)}
              lang="am"
              className="min-h-28 text-lg md:text-lg"
              placeholder="ሰላም፤ የሰላምታ ቃል።"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${row.key}-notes`}>Note for the editor</Label>
            <Textarea
              id={`${row.key}-notes`}
              value={row.notes}
              onChange={(event) => update(row.key, "notes", event.target.value)}
              className="min-h-20 md:text-base"
              placeholder="Where you found it, or why the gloss should change."
            />
          </div>
          {rows.length > 1 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setRows((current) => current.filter((item) => item.key !== row.key))}
            >
              Remove this word
            </Button>
          ) : null}
        </fieldset>
      ))}

      {error ? (
        <p className="text-sm text-primary" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          className="h-11"
          disabled={rows.length >= 20}
          onClick={() => setRows((current) => [...current, blankRow()])}
        >
          Add another word
        </Button>
        <Button type="submit" className="h-11 px-5" disabled={pending}>
          {pending ? "Sending…" : "Send for review"}
        </Button>
      </div>
    </form>
  );
}
