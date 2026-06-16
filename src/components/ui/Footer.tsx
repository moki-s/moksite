import { siteConfig } from "@/content/site";
import { MotionToggle } from "@/components/ui/MotionToggle";

// §6.4 — footer copy verbatim + the always-plain contact lines + MOTION toggle.
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <ul className="footer-links">
          <li>
            <a href={`mailto:${siteConfig.email}`}>EMAIL</a>
          </li>
          <li>
            <a href={siteConfig.socials.github}>GITHUB</a>
          </li>
          <li>
            <a href={siteConfig.socials.linkedin}>LINKEDIN</a>
          </li>
          <li>
            <a href="/cv.pdf">DOWNLOAD CV (PDF)</a>
          </li>
        </ul>

        <div className="footer-meta">
          <p className="footer-copy">
            © {year} {siteConfig.name.toUpperCase()}. ALL CASES REAL. NO
            SIDEKICKS WERE HARMED.
          </p>
          <div className="footer-controls">
            <span className="footer-psst">psst — press [ ` ]</span>
            <MotionToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
