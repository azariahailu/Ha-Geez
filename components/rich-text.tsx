import type { ReactNode } from "react";

function safeHref(value: string): string | null {
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return value;
  } catch {
    return null;
  }
  return null;
}

function hasEthiopic(value: string): boolean {
  return /[\u1200-\u137F\u1380-\u139F\u2D80-\u2DDF\uAB00-\uAB2F]/.test(value);
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let index = 0;
  const token = /\{g\}([\s\S]*?)\{\/g\}|\{a\}([\s\S]*?)\{\/a\}|\[([^\]\n]+)\]\(([^)\s]+)\)|\n/g;
  for (const match of text.matchAll(token)) {
    const start = match.index ?? 0;
    if (start > cursor) nodes.push(text.slice(cursor, start));
    if (match[1] != null) {
      nodes.push(
        <span key={`${keyPrefix}-g-${index}`} lang="gez" className="font-gez">
          {match[1]}
        </span>,
      );
    } else if (match[2] != null) {
      nodes.push(
        <span key={`${keyPrefix}-a-${index}`} lang="am">
          {match[2]}
        </span>,
      );
    } else if (match[3] != null && match[4] != null) {
      const href = safeHref(match[4]);
      const gez = hasEthiopic(match[3]);
      if (href) {
        nodes.push(
          <a
            key={`${keyPrefix}-l-${index}`}
            href={href}
            lang={gez ? "gez" : undefined}
            className={
              gez
                ? "font-gez text-primary underline decoration-[#c6a15a] underline-offset-4"
                : "underline decoration-[#c6a15a] underline-offset-4"
            }
          >
            {match[3]}
          </a>,
        );
      } else {
        nodes.push(match[3]);
      }
    } else {
      nodes.push(<br key={`${keyPrefix}-br-${index}`} />);
    }
    cursor = start + match[0].length;
    index += 1;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

export function RichText({
  text,
  inline = false,
  className,
}: {
  text: string;
  inline?: boolean;
  className?: string;
}) {
  if (inline) return <>{renderInline(text, "in")}</>;
  const paragraphs = text.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={className}>
          {renderInline(paragraph, `p${index}`)}
        </p>
      ))}
    </>
  );
}

export function LineList({ text, className }: { text: string; className?: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n").filter((line) => line.trim() !== "");
  return (
    <ol className={className}>
      {lines.map((line, index) => (
        <li key={index}>{line}</li>
      ))}
    </ol>
  );
}

export function SevenOrders({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n").filter((line) => line.trim() !== "");
  const [title, ...orders] = lines;
  if (!title) return null;
  return (
    <div>
      <h3 className="font-serif text-2xl leading-snug">{title}</h3>
      <ul className="mt-3 space-y-1.5 text-lg leading-8">
        {orders.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
