import type { Metadata } from "next";
import { absoluteUrl, personJsonLd } from "@/lib/seo";
import { HeroPoster } from "@/components/hero/HeroPoster";
import { Origin } from "@/components/sections/Origin";
import { CaseFiles } from "@/components/sections/CaseFiles";
import { Arsenal } from "@/components/sections/Arsenal";
import { Signal } from "@/components/sections/Signal";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/") },
};

// Issue #01 — the main scroll story (Panels 0–5). Hero is a static placeholder
// poster in Phase 2; the R3F cold open arrives in Phase 4.
export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />
      <HeroPoster />
      <Origin />
      <CaseFiles />
      <Arsenal />
      <Signal />
    </main>
  );
}
