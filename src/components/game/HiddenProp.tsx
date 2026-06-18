"use client";

import { useAppStore } from "@/store/useAppStore";
import { useMounted } from "@/lib/useMounted";
import { track } from "@/lib/analytics";
import { Stamp } from "@/components/panels/Stamp";
import type { EvidenceKind, EvidenceProp } from "@/components/game/evidence";

// Small original-noir silhouettes (§15) drawn as inline SVG — no downloaded assets.
// Colour comes from CSS (currentColor): dim by default, --signal on hover/focus/found.
function Art({ kind }: { kind: EvidenceKind }) {
  switch (kind) {
    case "detective":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <ellipse cx="12" cy="7.4" rx="6.4" ry="1.3" />
          <path d="M8.6 7.1 Q9 3.6 12 3.6 T15.4 7.1 Z" />
          <path d="M8 9 L6.7 20 H17.3 L16 9 Q12 11 8 9 Z" />
        </svg>
      );
    case "cat":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M3 19 Q4 10 11 10 Q18 10 18 19 Z" />
          <path d="M8 10.5 L7 7 L10 9 Z" />
          <path d="M14 10.5 L15.5 7 L12.5 9 Z" />
          <path d="M18 19 Q22 18 21 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "window":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="7" y="4" width="10" height="16" />
        </svg>
      );
    case "neon":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="4" y="5" width="16" height="9" rx="1.5" />
          <path d="M12 14 V19 M9 19 H15" strokeLinecap="round" />
          <path d="M7.5 11 V8 L10 11 V8 M12.5 8 V11 M12.5 9.4 H14.4" strokeWidth="1.2" />
        </svg>
      );
    case "figure":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="6" y="2" width="12" height="20" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="12" cy="8" r="2.1" fill="currentColor" />
          <path d="M9 22 L10 12 Q12 13.5 14 12 L15 22 Z" fill="currentColor" />
        </svg>
      );
  }
}

export function HiddenProp({ id, label, kind, top, left }: EvidenceProp) {
  const mounted = useMounted();
  const storedFound = useAppStore((s) => s.foundEvidence.includes(id));
  const markFound = useAppStore((s) => s.markFound);
  const found = mounted && storedFound; // defer persisted state past hydration

  const find = () => {
    if (storedFound) return;
    markFound(id);
    track("easteregg", { id });
  };

  return (
    <button
      type="button"
      className={`evidence-prop evidence-prop--${kind}`}
      data-found={found || undefined}
      style={{ top: `${top}%`, left: `${left}%` }}
      aria-pressed={found}
      aria-label={found ? `Found: ${label}` : `Spot ${label}`}
      onPointerEnter={find}
      onFocus={find}
      onClick={find}
    >
      <span className="evidence-art">
        <Art kind={kind} />
      </span>
      {found && (
        <span className="evidence-stamp">
          <Stamp text="FOUND" />
        </span>
      )}
    </button>
  );
}
