"use client";

import { useAppStore } from "@/store/useAppStore";
import { useMounted } from "@/lib/useMounted";
import { usePointerCoarse } from "@/lib/usePointerCoarse";
import { track } from "@/lib/analytics";

// §5.7 — the faint footer hint, clickable to open the Command Center. Touch has
// no backtick key, so coarse pointers get key-free copy (post-mount swap; the
// SSR/desktop line is unchanged §6.4 copy).
export function TerminalHint() {
  const openTerminal = useAppStore((s) => s.openTerminal);
  const mounted = useMounted();
  const coarse = usePointerCoarse();
  return (
    <button
      type="button"
      className="footer-psst"
      onClick={() => {
        track("terminal_open", { method: "footer" });
        openTerminal();
      }}
    >
      {mounted && coarse ? "psst — the command center is open" : "psst — press [ ` ]"}
    </button>
  );
}
