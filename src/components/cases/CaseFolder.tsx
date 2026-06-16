"use client";

import Link from "next/link";
import { type MouseEvent } from "react";
import { Stamp } from "@/components/panels/Stamp";
import type { CaseEntry } from "@/lib/content";

// §5.4 — a manila folder. Hover/focus lifts it, fades+rotates the stamp, and
// reveals the summary (CSS). Click runs the speed-line zoom via onActivate.
export function CaseFolder({
  entry,
  href,
  onActivate,
}: {
  entry: CaseEntry;
  href: string;
  onActivate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  return (
    <Link href={href} className="case-folder" onClick={(e) => onActivate(e, href)}>
      <span className="case-folder-body">
        <span className="case-meta">
          CASE {String(entry.order).padStart(3, "0")} · {entry.year} · STACK:{" "}
          {entry.stack.join("/")} · STATUS: {entry.status.toUpperCase()}
        </span>
        <span className="case-title">{entry.title}</span>
        <span className="case-summary">{entry.summary}</span>
      </span>
      <Stamp
        text={entry.status === "shipped" ? "CLASSIFIED" : "ON FILE"}
        className="case-stamp"
      />
    </Link>
  );
}
