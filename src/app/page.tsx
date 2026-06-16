// Phase 0 hello-world — temporary noir placeholder. Replaced by the real
// scroll story in Phase 2. No personal facts in the visible copy.
import type { Metadata } from "next";
import { absoluteUrl, personJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/") },
};

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-ink px-6 text-center text-bone">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />
      <p className="font-mono text-caption uppercase tracking-[0.12em] text-rain">
        moksite os v1.0 — issue #01
      </p>
      <h1 className="font-display text-display uppercase leading-none tracking-[-0.01em]">
        moksite
      </h1>
      <p className="font-mono text-meta uppercase tracking-[0.12em] text-signal">
        phase 0 — foundations
      </p>
      <a
        href="/dev/tokens"
        className="font-mono text-meta uppercase tracking-[0.12em] underline decoration-signal decoration-2 underline-offset-4 transition-colors hover:text-signal"
      >
        view design tokens →
      </a>
    </main>
  );
}
