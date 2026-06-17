"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useAppStore } from "@/store/useAppStore";
import { track } from "@/lib/analytics";
import type { CaseMeta } from "@/components/terminal/registry";

// The terminal chunk loads lazily on first discovery only (§8): Terminal is
// dynamic(ssr:false) and only rendered once terminalOpen flips true.
const Terminal = dynamic(() => import("@/components/terminal/Terminal"), {
  ssr: false,
});

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function TerminalLauncher({ cases }: { cases: CaseMeta[] }) {
  const terminalOpen = useAppStore((s) => s.terminalOpen);
  const openTerminal = useAppStore((s) => s.openTerminal);
  const highContrast = useAppStore((s) => s.highContrast);
  const konami = useRef(0);

  // §5.7 theme — reflect high-contrast on <html> (persisted in the store)
  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  // discovery paths: backtick + Konami code, anywhere (not while typing)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing =
        el instanceof HTMLElement &&
        (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);

      if (e.key === "`" && !typing) {
        e.preventDefault();
        track("terminal_open", { method: "key" });
        openTerminal();
        return;
      }

      const expected = KONAMI[konami.current];
      if (e.key === expected || e.key.toLowerCase() === expected) {
        konami.current += 1;
        if (konami.current === KONAMI.length) {
          konami.current = 0;
          track("terminal_open", { method: "konami" });
          openTerminal();
        }
      } else {
        konami.current = e.key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openTerminal]);

  if (!terminalOpen) return null;
  return <Terminal cases={cases} />;
}
