import type { CaseEntry } from "@/lib/content";

// §5.4 — EVIDENCE: amber live/repo buttons, or "SOURCE SEALED — NDA" when no
// links are present (omit gracefully).
export function Evidence({ links }: { links: CaseEntry["links"] }) {
  const hasLinks = Boolean(links.live || links.repo);

  if (!hasLinks) {
    return <p className="case-nda">SOURCE SEALED — NDA</p>;
  }

  return (
    <div className="case-evidence">
      {links.live && (
        <a className="case-evidence-btn" href={links.live} target="_blank" rel="noreferrer">
          VIEW LIVE
        </a>
      )}
      {links.repo && (
        <a className="case-evidence-btn" href={links.repo} target="_blank" rel="noreferrer">
          SOURCE
        </a>
      )}
    </div>
  );
}
