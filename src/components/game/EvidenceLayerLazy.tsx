"use client";

import dynamic from "next/dynamic";
import type { EvidencePanel } from "@/components/game/evidence";

// The hidden-object hunt is a non-critical enhancement, so it loads as a lazy
// chunk (ssr:false) — kept off the initial/critical path to protect the §8/§2
// perf budget. Props appear right after hydration; tab order/skip-link unaffected.
const EvidenceLayer = dynamic(
  () => import("@/components/game/EvidenceLayer").then((m) => m.EvidenceLayer),
  { ssr: false },
);

export function EvidenceLayerLazy({ panel }: { panel: EvidencePanel }) {
  return <EvidenceLayer panel={panel} />;
}
