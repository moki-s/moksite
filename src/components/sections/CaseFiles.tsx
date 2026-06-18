import { Panel } from "@/components/panels/Panel";
import { CaseIndex } from "@/components/cases/CaseIndex";
import { EvidenceLayerLazy } from "@/components/game/EvidenceLayerLazy";
import { getAllCases } from "@/lib/content";

// §5.4 — Panel 2. The manila-folder index; the speed-line zoom into a case lives
// in CaseIndex (so the panel's own entrance is a plain reveal).
export function CaseFiles() {
  const cases = getAllCases();

  return (
    <Panel id="cases" ariaLabel="Case files" eyebrow="PANEL 02 — CASE FILES">
      <h2 className="section-title">Case Files</h2>
      <CaseIndex cases={cases} />
      <EvidenceLayerLazy panel="cases" />
    </Panel>
  );
}
