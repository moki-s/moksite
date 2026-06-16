import { Panel } from "@/components/panels/Panel";
import { siteConfig } from "@/content/site";

// §5.6 (Phase-2 layout) — the panel + the always-plain direct lines so #signal
// lands. The searchlight contact form + /api/contact are built in Phase 6.
export function Signal() {
  return (
    <Panel
      id="signal"
      ariaLabel="Send a signal"
      eyebrow="PANEL 05 — SEND A SIGNAL"
      transition="gutter"
    >
      <h2 className="section-title">Send a Signal</h2>
      <p className="signal-lead">The direct lines:</p>
      <ul className="signal-links">
        <li>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        </li>
        <li>
          <a href={siteConfig.socials.github}>GitHub</a>
        </li>
        <li>
          <a href={siteConfig.socials.linkedin}>LinkedIn</a>
        </li>
        <li>
          <a href="/cv.pdf">Download CV (PDF)</a>
        </li>
      </ul>
    </Panel>
  );
}
