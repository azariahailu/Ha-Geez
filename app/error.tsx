"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="content" className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-serif text-4xl">The page could not be opened</h1>
      <p className="mt-3 leading-7 text-muted-foreground">Try opening it again.</p>
      <Button type="button" className="mt-6 h-11 px-4" onClick={() => reset()}>
        Try again
      </Button>
    </main>
  );
}
