"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { FILTER_LETTERS } from "@/lib/fidel";
import type { PublicEntry } from "@/lib/types";
import { EntryLink } from "@/components/entry-link";
import { RichText } from "@/components/rich-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  initialQuery: string;
  initialLetter: string;
  initialEntries: PublicEntry[];
  initialTotal: number;
  copy: Record<string, string>;
};

export function DictionaryBrowser({
  initialQuery,
  initialLetter,
  initialEntries,
  initialTotal,
  copy,
}: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [letter, setLetter] = useState(initialLetter);
  const [entries, setEntries] = useState(initialEntries);
  const [total, setTotal] = useState(initialTotal);
  const [settledQuery, setSettledQuery] = useState(initialQuery);
  const [settledLetter, setSettledLetter] = useState(initialLetter);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const skipFirst = useRef(true);
  const waiting = status === "loading" || query !== settledQuery || letter !== settledLetter;

  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query);
      if (letter) params.set("letter", letter);
      const qs = params.toString();
      const path = qs ? `/dictionary?${qs}` : "/dictionary";
      if (`${window.location.pathname}${window.location.search}` !== path) {
        window.history.replaceState(null, "", path);
      }

      setStatus("loading");
      try {
        const response = await fetch(`/api/search?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("search failed");
        const data = (await response.json()) as { entries: PublicEntry[]; total: number };
        setEntries(data.entries);
        setTotal(data.total);
        setSettledQuery(query);
        setSettledLetter(letter);
        setStatus("idle");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setSettledQuery(query);
        setSettledLetter(letter);
        setStatus("error");
      }
    }, 220);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, letter]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  const trimmed = query.trim();

  return (
    <div>
      <form action="/dictionary" method="get" onSubmit={onSubmit} className="paper p-4 sm:p-5">
        <label htmlFor="lexicon-search" className="text-sm text-muted-foreground">
          {copy["dictionary.searchLabel"]}
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Input
            id="lexicon-search"
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy["dictionary.placeholder"]}
            autoComplete="off"
            spellCheck={false}
            className="h-12 font-gez text-xl md:text-xl"
          />
          {letter ? <input type="hidden" name="letter" value={letter} /> : null}
          <Button type="submit" className="h-12 px-5 sm:w-28">
            {copy["dictionary.searchButton"]}
          </Button>
        </div>
        <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
          {waiting
            ? copy["dictionary.searching"]
            : status === "error"
              ? copy["dictionary.searchFailed"]
              : `${total === 0 ? copy["dictionary.noMatch"] : `${copy["dictionary.showing"]} ${entries.length} ${copy["dictionary.of"]} ${total}`}${settledQuery.trim() ? ` ${copy["dictionary.forQuery"]} “${settledQuery.trim()}”` : ""}${settledLetter ? ` ${copy["dictionary.underLetter"]} ${settledLetter}` : ""}.`}
        </p>
      </form>

      <div className="relative mt-5">
        <div
          className="flex gap-1 overflow-x-auto pb-2"
          role="toolbar"
          aria-label="Filter by first letter, in አበገደ order"
        >
          <button
            type="button"
            aria-pressed={letter === ""}
            onClick={() => setLetter("")}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-sm",
              letter === "" ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-card",
            )}
          >
            {copy["dictionary.all"]}
          </button>
          {FILTER_LETTERS.map((character) => (
            <button
              key={character}
              type="button"
              lang="gez"
              aria-pressed={letter === character}
              aria-label={`Words beginning with ${character}`}
              onClick={() => setLetter(character)}
              className={cn(
                "font-gez shrink-0 rounded-full px-2.5 py-1 text-lg leading-none",
                letter === character
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-card",
              )}
            >
              {character}
            </button>
          ))}
        </div>
        <div
          className="pointer-events-none absolute top-0 right-0 h-9 w-8 bg-gradient-to-l from-background to-transparent"
          aria-hidden="true"
        />
      </div>

      {entries.length === 0 ? (
        <div className="paper mt-4 px-5 py-10 text-center">
          <p className="font-gez text-3xl text-primary" lang="gez">
            {letter || "አ"}
          </p>
          <p className="mt-3 text-muted-foreground">
            {trimmed || letter ? (
              <RichText inline text={copy["dictionary.empty"]} />
            ) : (
              copy["dictionary.emptyNone"]
            )}
          </p>
        </div>
      ) : (
        <div className="mt-2">
          {entries.map((entry) => (
            <EntryLink key={entry.id} entry={entry} />
          ))}
          {entries.length < total ? (
            <p className="py-4 text-sm text-muted-foreground">
              <RichText
                inline
                text={copy["dictionary.preview"].replace("{n}", entries.length.toLocaleString("en-US"))}
              />
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
