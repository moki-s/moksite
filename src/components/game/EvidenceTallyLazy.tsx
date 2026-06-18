"use client";

import dynamic from "next/dynamic";

// Lazy (ssr:false) — see EvidenceLayerLazy. The tally is empty until the first
// find anyway, so deferring it costs nothing and keeps it off the critical path.
const EvidenceTally = dynamic(
  () => import("@/components/game/EvidenceTally").then((m) => m.EvidenceTally),
  { ssr: false },
);

export function EvidenceTallyLazy() {
  return <EvidenceTally />;
}
