import Link from "next/link";
import { RichText } from "@/components/rich-text";
import { buttonVariants } from "@/components/ui/button";
import { loadCopy } from "@/lib/copy";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function NotFound() {
  const copy = await loadCopy();

  return (
    <main id="content" className="mx-auto max-w-xl px-4 py-20 text-center">
      <p lang="gez" className="font-gez text-6xl text-primary">
        ሀ
      </p>
      <h1 className="mt-4 font-serif text-4xl">{copy["not-found.title"]}</h1>
      <div className="mt-3 leading-7 text-muted-foreground">
        <RichText text={copy["not-found.body"]} />
      </div>
      <Link href="/dictionary" className={cn(buttonVariants(), "mt-6 inline-flex h-11 px-4 no-underline")}>
        {copy["not-found.button"]}
      </Link>
    </main>
  );
}
