import Image from "next/image";
import { isPlaceholder, type CaseEntry } from "@/lib/content";

// §5.4 — splash: full-bleed cover (or a placeholder panel until supplied), title
// (the page h1), and a mono metadata strip.
export function Splash({ entry }: { entry: CaseEntry }) {
  const coverResolved = !isPlaceholder(entry.cover);

  return (
    <header className="case-splash">
      <div className="case-cover">
        {coverResolved ? (
          <Image
            src={entry.cover}
            alt={`${entry.title} — cover`}
            fill
            sizes="100vw"
            className="case-cover-img"
            priority
          />
        ) : (
          <div className="case-cover-placeholder" aria-hidden="true">
            <span>COVER — {entry.cover}</span>
          </div>
        )}
      </div>
      <p className="case-meta case-splash-meta">
        CASE {String(entry.order).padStart(3, "0")} · {entry.year} · {entry.role}{" "}
        · STATUS: {entry.status.toUpperCase()}
      </p>
      <h1 className="case-title-lg">{entry.title}</h1>
      <p className="case-stack">{entry.stack.join(" · ")}</p>
    </header>
  );
}
