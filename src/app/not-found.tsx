"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { track } from "@/lib/analytics";

// §5.9 — 404. The hint is a discovery path into the Command Center (§5.7).
// (Visual polish lands in Phase 6/7.)
export default function NotFound() {
  const openTerminal = useAppStore((s) => s.openTerminal);
  return (
    <main id="main-content" tabIndex={-1} className="notfound">
      <h1 className="notfound-title">PAGE REDACTED.</h1>
      <p className="notfound-sub">
        This file never existed. Or someone wants you to think so.
      </p>
      <Link href="/" className="notfound-link">
        RETURN TO ISSUE #01 →
      </Link>
      <button
        type="button"
        className="notfound-hint"
        onClick={() => {
          track("terminal_open", { method: "404" });
          openTerminal();
        }}
      >
        ACCESS DENIED? TRY THE BACK DOOR. [ ` ]
      </button>
    </main>
  );
}
