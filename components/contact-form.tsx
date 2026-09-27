"use client";

import { useState, useTransition, type FormEvent } from "react";
import { sendMessage } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichText } from "@/components/rich-text";

export function ContactForm({ copy }: { copy: Record<string, string> }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await sendMessage({ name, email, message, website });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSent(true);
    });
  }

  if (sent) {
    return (
      <div className="paper p-6 sm:p-8" aria-live="polite">
        <h2 className="font-serif text-3xl">{copy["contact.savedTitle"]}</h2>
        <div className="mt-3 leading-7 text-muted-foreground">
          <RichText text={copy["contact.savedBody"]} />
        </div>
        <Button
          type="button"
          className="mt-6 h-11 px-4"
          onClick={() => {
            setSent(false);
            setName("");
            setEmail("");
            setMessage("");
          }}
        >
          {copy["contact.another"]}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative paper space-y-4 p-5 sm:p-6">
      <div className="pointer-events-none absolute h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-name">{copy["contact.nameLabel"]}</Label>
        <Input id="contact-name" required value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className="h-11 md:text-base" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-email">{copy["contact.emailLabel"]}</Label>
        <Input id="contact-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className="h-11 md:text-base" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-message">{copy["contact.messageLabel"]}</Label>
        <Textarea id="contact-message" required value={message} onChange={(event) => setMessage(event.target.value)} className="min-h-36 text-base md:text-base" />
      </div>
      {error ? (
        <p className="text-sm text-primary" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="h-11 px-5" disabled={pending}>
        {pending ? copy["contact.sending"] : copy["contact.send"]}
      </Button>
    </form>
  );
}
