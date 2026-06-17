"use client";

import { useAppStore } from "@/store/useAppStore";
import { track } from "@/lib/analytics";

// §5.7 — the faint footer hint, clickable to open the Command Center.
export function TerminalHint() {
  const openTerminal = useAppStore((s) => s.openTerminal);
  return (
    <button
      type="button"
      className="footer-psst"
      onClick={() => {
        track("terminal_open", { method: "footer" });
        openTerminal();
      }}
    >
      psst — press [ ` ]
    </button>
  );
}
