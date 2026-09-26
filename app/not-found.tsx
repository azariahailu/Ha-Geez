import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main id="content" className="mx-auto max-w-xl px-4 py-20 text-center">
      <p lang="gez" className="font-gez text-6xl text-primary">
        ሀ
      </p>
      <h1 className="mt-4 font-serif text-4xl">This page is not in the book</h1>
      <p className="mt-3 leading-7 text-muted-foreground">
        The entry may still be waiting for review, or the address may be mistyped.
      </p>
      <Link href="/dictionary" className={cn(buttonVariants(), "mt-6 inline-flex h-11 px-4 no-underline")}>
        Back to the dictionary
      </Link>
    </main>
  );
}
