import type { ReactNode } from "react";

// §4.5 — eyebrow label: mono 12px caps, tracking 0.12em, rain.
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`font-mono text-caption uppercase tracking-[0.12em] text-rain ${className}`}
    >
      {children}
    </p>
  );
}
