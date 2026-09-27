"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { removeMessage } from "@/lib/actions";
import type { ContactMessage } from "@/lib/messages";
import { Button } from "@/components/ui/button";

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function MessageInbox({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (messages.length === 0) {
    return (
      <div className="paper px-5 py-10 text-center text-muted-foreground">
        No messages yet. Notes from Contact us wait here, apart from words sent for the dictionary.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error ? (
        <p className="text-sm text-primary" role="alert">
          {error}
        </p>
      ) : null}
      {messages.map((message) => (
        <article key={message.id} className="paper p-4 sm:p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-serif text-2xl">{message.name}</h3>
            <time className="text-xs text-muted-foreground" dateTime={message.createdAt}>
              {formatWhen(message.createdAt)}
            </time>
          </div>
          <p className="mt-1 text-sm">
            <a href={`mailto:${message.email}`} className="underline decoration-[#c6a15a] underline-offset-4">
              {message.email}
            </a>
          </p>
          <p className="mt-3 leading-7 whitespace-pre-line">{message.body}</p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            disabled={pending}
            onClick={() => {
              setError(null);
              startTransition(async () => {
                const result = await removeMessage(message.id);
                if (!result.ok) {
                  setError(result.error);
                  return;
                }
                router.refresh();
              });
            }}
          >
            Remove
          </Button>
        </article>
      ))}
    </div>
  );
}
