"use client";

import { EVIDENCE, type EvidencePanel } from "@/components/game/evidence";
import { HiddenProp } from "@/components/game/HiddenProp";

// Overlay of hidden-object hotspots for one panel. Rendered as the LAST child of
// its panel so the skip-to-content link stays first and the props sit after that
// panel's content in tab order (§9). The layer ignores pointer events; only the
// buttons capture them.
export function EvidenceLayer({ panel }: { panel: EvidencePanel }) {
  const props = EVIDENCE.filter((p) => p.panel === panel);
  if (props.length === 0) return null;
  return (
    <div className="evidence-layer" aria-hidden="false">
      {props.map((p) => (
        <HiddenProp key={p.id} {...p} />
      ))}
    </div>
  );
}
