import { Panel } from "@/components/panels/Panel";
import { siteConfig } from "@/content/site";
import { SignalForm } from "@/components/contact/SignalForm";

// §5.6 — Panel 5. The SignalForm (cursor-following spotlight) + the always-plain
// direct lines below it.
export function Signal() {
  return (
    <Panel
      id="signal"
      ariaLabel="Send a signal"
      eyebrow="PANEL 05 — SEND A SIGNAL"
      transition="gutter"
    >
      <h2 className="section-title">Send a Signal</h2>
      <SignalForm />
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
