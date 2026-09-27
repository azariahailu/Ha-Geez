"use client";

import { useState, useTransition, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { importSheet, logoutAction, reviewEntry } from "@/lib/actions";
import { MessageInbox } from "@/components/message-inbox";
import type { ContactMessage } from "@/lib/messages";
import type { AdminEntry } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type ImportResult = Awaited<ReturnType<typeof importSheet>>;

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function Ticket({
  entry,
  mode,
}: {
  entry: AdminEntry;
  mode: "pending" | "published" | "rejected";
}) {
  const router = useRouter();
  const [word, setWord] = useState(entry.word);
  const [origin, setOrigin] = useState(entry.origin);
  const [definition, setDefinition] = useState(entry.definition);
  const [notes, setNotes] = useState(entry.notes);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function act(intent: "publish" | "reject" | "save" | "queue") {
    setError(null);
    startTransition(async () => {
      const result = await reviewEntry({ id: entry.id, intent, word, origin, definition, notes });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  const fields = (
    <div className="mt-4 grid gap-3">
      <div className="space-y-1.5">
        <Label htmlFor={`${entry.id}-word`}>Ge&apos;ez headword</Label>
        <Input
          id={`${entry.id}-word`}
          value={word}
          onChange={(event) => setWord(event.target.value)}
          lang="gez"
          className="h-11 font-gez text-xl md:text-xl"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${entry.id}-origin`}>Origin</Label>
        <Input
          id={`${entry.id}-origin`}
          value={origin}
          onChange={(event) => setOrigin(event.target.value)}
          lang="am"
          className="h-11 md:text-base"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${entry.id}-definition`}>Amharic definition</Label>
        <Textarea
          id={`${entry.id}-definition`}
          value={definition}
          onChange={(event) => setDefinition(event.target.value)}
          lang="am"
          className="min-h-24 text-base md:text-base"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${entry.id}-notes`}>Notes</Label>
        <Textarea
          id={`${entry.id}-notes`}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className="min-h-16 md:text-base"
        />
      </div>
      {error ? (
        <p className="text-sm text-primary" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );

  if (mode === "published") {
    return (
      <details className="border-b border-border py-3">
        <summary className="cursor-pointer list-none">
          <span lang="gez" className="font-gez text-2xl">
            {entry.word}
          </span>
          <span lang="am" className="mt-1 block text-sm text-muted-foreground line-clamp-2 whitespace-pre-line">
            {entry.definition}
          </span>
        </summary>
        {fields}
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" disabled={pending} onClick={() => act("save")}>
            {pending ? "Saving…" : "Save changes"}
          </Button>
          <Button type="button" variant="outline" disabled={pending} onClick={() => act("queue")}>
            Return to queue
          </Button>
        </div>
      </details>
    );
  }

  return (
    <article className="paper p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 lang="gez" className="font-gez text-3xl">
          {entry.word}
        </h3>
        <time className="text-xs text-muted-foreground" dateTime={entry.createdAt}>
          {formatWhen(entry.createdAt)}
        </time>
      </div>
      {entry.email ? (
        <p className="mt-1 text-sm text-muted-foreground">
          From <a href={`mailto:${entry.email}`}>{entry.email}</a>
        </p>
      ) : (
        <p className="mt-1 text-sm text-muted-foreground">No email address</p>
      )}
      {fields}
      <div className="mt-4 flex flex-wrap gap-2">
        {mode === "pending" ? (
          <>
            <Button type="button" disabled={pending} onClick={() => act("publish")}>
              {pending ? "Publishing…" : "Approve and publish"}
            </Button>
            <Button type="button" variant="destructive" disabled={pending} onClick={() => act("reject")}>
              Decline
            </Button>
          </>
        ) : (
          <>
            <Button type="button" disabled={pending} onClick={() => act("publish")}>
              {pending ? "Publishing…" : "Approve and publish"}
            </Button>
            <Button type="button" variant="outline" disabled={pending} onClick={() => act("queue")}>
              Restore to queue
            </Button>
          </>
        )}
      </div>
    </article>
  );
}

function ImportPanel() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [pending, startTransition] = useTransition();

  function run(mode: "preview" | "import") {
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    data.set("mode", mode);
    startTransition(async () => {
      const next = await importSheet(data);
      setResult(next);
      if (next.ok && !next.preview) router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <div className="max-w-2xl space-y-3 text-sm leading-6 text-muted-foreground">
        <p>
          Use the first worksheet of an <strong className="font-medium text-foreground">.xlsx</strong>{" "}
          file, or a <strong className="font-medium text-foreground">.csv</strong> /{" "}
          <strong className="font-medium text-foreground">.tsv</strong> file. Three columns, in order:
        </p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Ge&apos;ez word (letters / lemma)</li>
          <li>Origin — may be empty</li>
          <li>Amharic definition</li>
        </ol>
        <p>
          A header row is optional. Names such as word, lemma, letters, ቃል, origin, መነሻ, definition,
          and ትርጉም are recognized in any order. A published headword that already exists is updated.
          Words waiting in the queue are left alone. Older .xls files should be saved as .xlsx or CSV.
        </p>
        <p>
          Try <code className="rounded bg-secondary px-1.5 py-0.5">data/sample-import.csv</code> or{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5">data/sample-import.xlsx</code>.
        </p>
      </div>

      <form ref={formRef} className="paper space-y-4 p-5" onSubmit={(event) => event.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="lexicon-file">Spreadsheet</Label>
          <Input
            id="lexicon-file"
            name="file"
            type="file"
            accept=".csv,.tsv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="h-11 md:text-base"
            required
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" variant="outline" className="h-11" disabled={pending} onClick={() => run("preview")}>
            {pending ? "Reading…" : "Preview"}
          </Button>
          <Button type="button" className="h-11" disabled={pending} onClick={() => run("import")}>
            {pending ? "Importing…" : "Import into the lexicon"}
          </Button>
        </div>
      </form>

      {result && !result.ok ? (
        <p className="text-sm text-primary" role="alert">
          {result.error}
        </p>
      ) : null}

      {result && result.ok ? (
        <div className="paper p-5" aria-live="polite">
          <p className="text-sm text-[#8d6b2f]">
            {result.preview ? "Preview only — nothing was written." : "Import finished."}
          </p>
          <p className="mt-2">
            {result.imported} readable {result.imported === 1 ? "row" : "rows"}
            {result.preview
              ? "."
              : `. ${result.created} added, ${result.updated} updated, ${result.unchanged} already the same.`}
          </p>
          {result.errors.length > 0 ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {result.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          ) : null}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="text-xs tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="py-2 pr-3 font-medium">Word</th>
                  <th className="py-2 pr-3 font-medium">Origin</th>
                  <th className="py-2 font-medium">Definition</th>
                </tr>
              </thead>
              <tbody>
                {result.sample.map((row) => (
                  <tr key={`${row.line}-${row.word}`} className="border-t border-border align-top">
                    <td lang="gez" className="font-gez py-2 pr-3 text-lg">
                      {row.word}
                    </td>
                    <td lang="am" className="py-2 pr-3">
                      {row.origin}
                    </td>
                    <td lang="am" className="py-2">
                      {row.definition}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function AdminDashboard({
  pending,
  published,
  rejected,
  counts,
  query,
  messages,
  messageTotal,
  pages,
}: {
  pending: AdminEntry[];
  published: AdminEntry[];
  rejected: AdminEntry[];
  counts: { pending: number; published: number; rejected: number };
  query: string;
  messages: ContactMessage[];
  messageTotal: number;
  pages: { slug: string; title: string; href: string }[];
}) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm tracking-[0.16em] text-[#8d6b2f] uppercase">Lexicon desk</p>
          <h1 className="mt-1 font-serif text-4xl">Words and import</h1>
        </div>
        <form action={logoutAction}>
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </div>

      <Tabs defaultValue={query ? "published" : "pending"} className="mt-6">
        <TabsList variant="line" className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent">
          <TabsTrigger value="pending" className="px-3 py-2">
            Pending <Badge variant="secondary">{counts.pending}</Badge>
          </TabsTrigger>
          <TabsTrigger value="published" className="px-3 py-2">
            Published <Badge variant="secondary">{counts.published}</Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="px-3 py-2">
            Declined <Badge variant="secondary">{counts.rejected}</Badge>
          </TabsTrigger>
          <TabsTrigger value="import" className="px-3 py-2">
            Import
          </TabsTrigger>
          <TabsTrigger value="messages" className="px-3 py-2">
            Messages <Badge variant="secondary">{messageTotal}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pages" className="px-3 py-2">
            Pages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4 space-y-4">
          {pending.length === 0 ? (
            <div className="paper px-5 py-10 text-center text-muted-foreground">
              The queue is clear. New submissions will wait here.
            </div>
          ) : (
            pending.map((entry) => (
              <Ticket key={`${entry.id}-${entry.updatedAt}`} entry={entry} mode="pending" />
            ))
          )}
        </TabsContent>

        <TabsContent value="published" className="mt-4">
          <form action="/admin" className="mb-4 flex flex-col gap-2 sm:flex-row">
            <Input
              name="q"
              defaultValue={query}
              placeholder="Filter published headwords"
              className="h-11 md:text-base"
              aria-label="Filter published headwords"
            />
            <Button type="submit" variant="outline" className="h-11">
              Filter
            </Button>
          </form>
          {published.length === 0 ? (
            <div className="paper px-5 py-10 text-center text-muted-foreground">
              No published entries match.
            </div>
          ) : (
            <div className="paper px-4 sm:px-5">
              {published.map((entry) => (
                <Ticket key={`${entry.id}-${entry.updatedAt}`} entry={entry} mode="published" />
              ))}
            </div>
          )}
          {counts.published > published.length ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Showing {published.length} of {counts.published}. Filter to narrow the list. The public
              dictionary still has every published word.
            </p>
          ) : null}
        </TabsContent>

        <TabsContent value="rejected" className="mt-4 space-y-4">
          {rejected.length === 0 ? (
            <div className="paper px-5 py-10 text-center text-muted-foreground">
              Nothing has been declined.
            </div>
          ) : (
            rejected.map((entry) => (
              <Ticket key={`${entry.id}-${entry.updatedAt}`} entry={entry} mode="rejected" />
            ))
          )}
        </TabsContent>

        <TabsContent value="import" className="mt-5">
          <ImportPanel />
        </TabsContent>

        <TabsContent value="messages" className="mt-5">
          <p className="mb-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            These are notes from Contact us. They stay apart from words sent for the dictionary.
          </p>
          <MessageInbox messages={messages} />
          {messageTotal > messages.length ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Showing {messages.length} of {messageTotal}.
            </p>
          ) : null}
        </TabsContent>

        <TabsContent value="pages" className="mt-5">
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Change the wording on any public page. Words in the lexicon stay under Published. A saved
            change replaces the original line until you restore it.
          </p>
          <ul className="mt-4 divide-y divide-border rounded-md border border-border bg-card">
            {pages.map((page) => (
              <li key={page.slug} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <span className="font-serif text-xl">{page.title}</span>
                <span className="flex gap-3 text-sm">
                  <Link href={page.href} className="underline decoration-[#c6a15a] underline-offset-4">
                    View
                  </Link>
                  <Link
                    href={`/admin/pages/${page.slug}`}
                    className="underline decoration-[#c6a15a] underline-offset-4"
                  >
                    Edit
                  </Link>
                </span>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
}
