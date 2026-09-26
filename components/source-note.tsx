import { GEEZ_ARTICLE } from "@/lib/credits";

export function SourceNote({ compact = false }: { compact?: boolean }) {
  return (
    <p className="text-sm leading-6 text-muted-foreground">
      Language background paraphrased from{" "}
      <a
        href={GEEZ_ARTICLE.url}
        className="text-foreground underline decoration-[#c6a15a] underline-offset-4"
      >
        {GEEZ_ARTICLE.author}, “{GEEZ_ARTICLE.title}”
      </a>
      , {GEEZ_ARTICLE.publisher}, {GEEZ_ARTICLE.date}.
      {compact ? null : " This page is a paraphrase, not a reproduction of the article."}
    </p>
  );
}
