"use client";

import dynamic from "next/dynamic";

// Lazy (ssr:false) — see EvidenceLayerLazy. Coarse-pointer-only UI; renders
// null everywhere else, so deferring it keeps it off the critical path.
const TorchToggle = dynamic(
  () => import("@/components/game/TorchToggle").then((m) => m.TorchToggle),
  { ssr: false },
);

export function TorchToggleLazy() {
  return <TorchToggle />;
}
