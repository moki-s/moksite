import { Panel } from "@/components/panels/Panel";
import { Stamp } from "@/components/panels/Stamp";
import { getAllCases } from "@/lib/content";

// §5.4 (Phase-2 layout) — the panel + a plain case list so #cases lands and the
// story reads. The full manila-folder interaction, stamp animation, and
// /case/[slug] detail pages are built in Phase 3.
export function CaseFiles() {
  const cases = getAllCases();

  return (
    <Panel
      id="cases"
      ariaLabel="Case files"
      eyebrow="PANEL 02 — CASE FILES"
      transition="speedlines"
    >
      <h2 className="section-title">Case Files</h2>
      <ul className="cases-list">
        {cases.map((entry) => (
          <li key={entry.slug} className="case-folder">
            <div className="case-folder-body">
              <p className="case-meta">
                CASE {String(entry.order).padStart(3, "0")} · {entry.year} ·
                STATUS: {entry.status.toUpperCase()}
              </p>
              <p className="case-title">{entry.title}</p>
              <p className="case-summary">{entry.summary}</p>
            </div>
            <Stamp text={entry.status === "shipped" ? "CLASSIFIED" : "ON FILE"} />
          </li>
        ))}
      </ul>
    </Panel>
  );
}
