import { Panel } from "@/components/panels/Panel";
import { CaptionBox } from "@/components/panels/CaptionBox";
import { origin, siteConfig } from "@/content/site";

// §5.3 — Panel 1, Origin. Copy lives in site.ts (origin = [TODO-CONTENT]); the
// ink-treated portrait is a placeholder until supplied.
export function Origin() {
  return (
    <Panel
      id="origin"
      ariaLabel="Origin"
      eyebrow="PANEL 01 — ORIGIN"
      transition="gutter"
    >
      <div className="origin-grid">
        <div className="origin-copy">
          {origin.map((line, i) => (
            <CaptionBox key={i} className="origin-line">
              {line}
            </CaptionBox>
          ))}
          <p className="origin-signoff">{siteConfig.name}</p>
          <p className="origin-role">{siteConfig.role}</p>
        </div>
        <div
          className="origin-portrait"
          role="img"
          aria-label="Portrait placeholder — an ink-treated photo is supplied before launch."
        >
          <span>PORTRAIT</span>
        </div>
      </div>
    </Panel>
  );
}
