"use client";

import { useAppStore } from "@/store/useAppStore";
import { useMounted } from "@/lib/useMounted";
import { EVIDENCE_TOTAL } from "@/components/game/evidence";

// Corner tally, revealed after the first find (so it doesn't spoil the hunt).
// Fixed below the sticky-nav z-index (§4.3). On completion it flashes a one-line
// amber message announcing the unlocked terminal command.
export function EvidenceTally() {
  const mounted = useMounted();
  const count = useAppStore((s) => s.foundEvidence.length);
  if (!mounted || count === 0) return null;
  const complete = count >= EVIDENCE_TOTAL;
  return (
    <div className="evidence-tally" role="status" aria-live="polite">
      <span className="evidence-tally-count">
        EVIDENCE: {count} / {EVIDENCE_TOTAL}
      </span>
      {complete && (
        <span className="evidence-tally-flash">CASE CRACKED — new command online: vigilante</span>
      )}
    </div>
  );
}
