"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { savePageAction } from "@/lib/actions";
import type { CopyField, CopyPage } from "@/lib/site-copy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function PageEditor({
  page,
  fields,
  initial,
}: {
  page: CopyPage;
  fields: CopyField[];
  initial: Record<string, string>;
}) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((field) => [field.key, initial[field.key] ?? field.defaultText])),
  );
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const groups: string[] = [];
  for (const field of fields) {
    if (!groups.includes(field.group)) groups.push(field.group);
  }

  function save() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await savePageAction({ slug: page.slug, values });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSaved(true);
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm tracking-[0.16em] text-[#8d6b2f] uppercase">Page text</p>
          <h1 className="mt-1 font-serif text-4xl">{page.title}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={page.href}
            className="inline-flex h-9 items-center rounded-lg border border-border bg-card px-3 text-sm"
          >
            View page
          </Link>
          <Link
            href="/admin"
            className="inline-flex h-9 items-center rounded-lg border border-border bg-card px-3 text-sm"
          >
            Back to the desk
          </Link>
        </div>
      </div>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
        A blank line starts a new paragraph. A link is written{" "}
        <span className="text-foreground">[Letters and numbers](/about#abugida)</span>. Wrap a Ge&apos;ez
        word in <span className="text-foreground">{"{g}ቅኔ{/g}"}</span> when it should use the Ge&apos;ez
        face. Saving the original wording clears the change, so a later update of that line can show
        again.
      </p>

      <div className="mt-8 space-y-8">
        {groups.map((group) => (
          <section key={group}>
            <h2 className="font-serif text-2xl">{group}</h2>
            <div className="mt-3 space-y-4">
              {fields
                .filter((field) => field.group === group)
                .map((field) => {
                  const value = values[field.key] ?? "";
                  const changed = value !== field.defaultText;
                  const long = field.rows > 1 || field.kind === "prose" || field.kind === "list";
                  return (
                    <div key={field.key} className="paper space-y-2 p-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <Label htmlFor={field.key}>{field.label}</Label>
                        {changed ? (
                          <button
                            type="button"
                            className="text-sm text-[#8d6b2f] underline decoration-[#c6a15a] underline-offset-4"
                            onClick={() =>
                              setValues((current) => ({ ...current, [field.key]: field.defaultText }))
                            }
                          >
                            Restore the original
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground">Original wording</span>
                        )}
                      </div>
                      {long ? (
                        <Textarea
                          id={field.key}
                          value={value}
                          rows={field.rows}
                          onChange={(event) =>
                            setValues((current) => ({ ...current, [field.key]: event.target.value }))
                          }
                          className="min-h-16 font-gez text-base md:text-base"
                        />
                      ) : (
                        <Input
                          id={field.key}
                          value={value}
                          onChange={(event) =>
                            setValues((current) => ({ ...current, [field.key]: event.target.value }))
                          }
                          className="h-11 md:text-base"
                        />
                      )}
                      {field.hint ? <p className="text-sm text-muted-foreground">{field.hint}</p> : null}
                    </div>
                  );
                })}
            </div>
          </section>
        ))}
      </div>

      {error ? (
        <p className="mt-4 text-sm text-primary" role="alert">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="mt-4 text-sm text-[#2f4634]" role="status">
          Saved. The public page is using this wording.
        </p>
      ) : null}
      <Button type="button" className="mt-4 h-11 px-5" disabled={pending} onClick={save}>
        {pending ? "Saving…" : "Save this page"}
      </Button>
    </div>
  );
}
