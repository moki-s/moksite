import type { ReactNode } from "react";

// §5.7 — CRT styling: scanline overlay + subtle vignette around the content.
export function Crt({ children }: { children: ReactNode }) {
  return (
    <div className="crt">
      <div className="crt-inner">{children}</div>
      <div className="crt-scanlines" aria-hidden="true" />
      <div className="crt-vignette" aria-hidden="true" />
    </div>
  );
}
