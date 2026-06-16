import type { ReactNode } from "react";

// §4.5 — narration box: mono caps in a bone-bordered box on ink.
export function CaptionBox({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`inline-block border border-bone bg-ink px-4 py-2 font-mono text-meta uppercase tracking-[0.08em] text-bone ${className}`}
    >
      {children}
    </p>
  );
}
