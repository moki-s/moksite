import Image from "next/image";
import { Panel } from "@/components/panels/Panel";
import { CaptionBox } from "@/components/panels/CaptionBox";
import { EvidenceLayerLazy } from "@/components/game/EvidenceLayerLazy";
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
        <figure className="origin-portrait">
          <Image
            src="/images/portrait.webp"
            alt={`${siteConfig.name} — ${siteConfig.role}`}
            fill
            sizes="(max-width: 760px) 100vw, 360px"
            className="origin-portrait-img"
          />
          {/* §5.3 — ink/bone duotone treatment of a real photo (original artwork,
              not traced). Maps grayscale shadows→--ink, highlights→--bone. */}
          <svg className="origin-duotone-def" aria-hidden="true" focusable="false">
            <filter id="ink-duotone" colorInterpolationFilters="sRGB">
              <feColorMatrix
                type="matrix"
                values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0"
              />
              <feComponentTransfer>
                <feFuncR type="table" tableValues="0.043 0.910" />
                <feFuncG type="table" tableValues="0.055 0.894" />
                <feFuncB type="table" tableValues="0.075 0.847" />
              </feComponentTransfer>
            </filter>
          </svg>
        </figure>
      </div>
      <EvidenceLayerLazy panel="origin" />
    </Panel>
  );
}
