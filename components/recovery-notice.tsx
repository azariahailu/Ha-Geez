"use client";

import { useState, useTransition } from "react";
import { acknowledgeRecovery } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export function RecoveryNotice({ code }: { code: string }) {
  const [hidden, setHidden] = useState(false);
  const [pending, startTransition] = useTransition();

  if (hidden) return null;

  return (
    <section className="paper mb-8 p-6 sm:p-8" aria-live="polite">
      <h2 className="font-serif text-3xl">Save this recovery code</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        This is the only time it is shown. Write it down and keep it somewhere private. If the
        password is forgotten, open Forgot the password and enter this code. After a new password
        is set, this code stops working and a new one is shown.
      </p>
      <input
        readOnly
        value={code}
        aria-label="Recovery code"
        onFocus={(event) => event.currentTarget.select()}
        className="mt-4 w-full bg-transparent font-mono text-2xl tracking-[0.18em] text-primary outline-none sm:text-3xl"
      />
      <Button
        type="button"
        className="mt-5 h-11 px-5"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            await acknowledgeRecovery();
            setHidden(true);
          });
        }}
      >
        {pending ? "Saving…" : "I have saved it"}
      </Button>
    </section>
  );
}
