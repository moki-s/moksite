// §4.5 — CLASSIFIED-style rubber stamp: blood border, rotated −4°. Presentational
// here; its dur.stamp entrance is wired to case-folder interaction in Phase 3.
export function Stamp({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block -rotate-[4deg] border-2 border-blood px-3 py-1 font-mono text-meta font-medium uppercase tracking-[0.12em] text-blood ${className}`}
    >
      {text}
    </span>
  );
}
