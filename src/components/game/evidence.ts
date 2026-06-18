// §11 — site-wide hover-to-spot hidden-object hunt. Original noir props only (§15).
// Each prop is an absolutely-positioned DOM hotspot overlaid on its panel (no 3D
// mesh — protects the §8 3D budget, keeps it keyboard-accessible). Positions are
// percentages within the panel.

export type EvidenceKind = "detective" | "window" | "cat" | "neon" | "figure";
export type EvidencePanel = "hero" | "cases" | "origin" | "arsenal";

export type EvidenceProp = {
  id: string;
  panel: EvidencePanel;
  label: string; // completes "Spot ___" / "Found: ___"
  kind: EvidenceKind;
  top: number;
  left: number;
};

export const EVIDENCE: EvidenceProp[] = [
  // hero (screen 1)
  { id: "detective", panel: "hero", label: "the detective on the rooftop", kind: "detective", top: 21, left: 12 },
  { id: "hero-window", panel: "hero", label: "the flickering lit window", kind: "window", top: 39, left: 85 },
  { id: "hero-cat", panel: "hero", label: "the prowling cat on the ledge", kind: "cat", top: 66, left: 27 },
  // case files (screen 2)
  { id: "cases-cat", panel: "cases", label: "the cat among the case files", kind: "cat", top: 14, left: 91 },
  { id: "neon", panel: "cases", label: "the flickering neon sign", kind: "neon", top: 12, left: 6 },
  // origin
  { id: "figure", panel: "origin", label: "the shadowy figure in the doorway", kind: "figure", top: 22, left: 87 },
  // arsenal
  { id: "arsenal-window", panel: "arsenal", label: "the hidden lit window", kind: "window", top: 14, left: 5 },
];

export const EVIDENCE_TOTAL = EVIDENCE.length; // 7
