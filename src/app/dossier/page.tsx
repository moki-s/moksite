import type { Metadata } from "next";
import { siteConfig } from "@/content/site";
import { getAllCases } from "@/lib/content";
import { absoluteUrl, personJsonLd } from "@/lib/seo";

// §5.8 — deliberately plain, system-fast, fully static, printable. The
// recruiter escape hatch and the SEO text backbone.
export const metadata: Metadata = {
  title: "Dossier",
  description: `The full dossier for ${siteConfig.name} — ${siteConfig.role}: experience, projects, skills, education, and contact.`,
  alternates: { canonical: absoluteUrl("/dossier") },
};

export default function DossierPage() {
  const cases = getAllCases();

  return (
    <main id="main-content" tabIndex={-1} className="dossier mx-auto max-w-3xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />

      <header className="mb-10 border-b border-bone/30 pb-6">
        <h1 className="font-display text-h1 uppercase tracking-[-0.01em]">
          {siteConfig.name}
        </h1>
        <p className="mt-2 font-mono text-meta uppercase tracking-[0.12em] text-signal">
          {siteConfig.strapline}
        </p>
        <a
          href="/cv.pdf"
          className="no-print mt-5 inline-block bg-signal px-5 py-2 font-mono text-meta uppercase tracking-[0.12em] text-ink"
        >
          Download CV (PDF)
        </a>
      </header>

      <section className="mb-10">
        <h2 className="mb-3 font-mono text-meta uppercase tracking-[0.12em] text-signal">
          Experience
        </h2>
        <p className="font-sans text-body text-bone">
          [TODO-CONTENT] — roles, employers, dates, and what shipped. Verbatim from the master CV.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 font-mono text-meta uppercase tracking-[0.12em] text-signal">
          Projects
        </h2>
        <ul className="space-y-4">
          {cases.map((entry) => (
            <li key={entry.slug}>
              <p className="font-sans text-body-lg text-bone">{entry.title}</p>
              <p className="font-sans text-meta text-rain">{entry.summary}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 font-mono text-meta uppercase tracking-[0.12em] text-signal">
          Skills
        </h2>
        <p className="font-sans text-body text-bone">
          [TODO-CONTENT] — the arsenal (languages, AI &amp; automation, data, delivery). Draft in PRD Appendix A.4.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 font-mono text-meta uppercase tracking-[0.12em] text-signal">
          Education
        </h2>
        <p className="font-sans text-body text-bone">
          [TODO-CONTENT] — degrees, institutions, and dates.
        </p>
      </section>

      <section>
        <h2 className="mb-3 font-mono text-meta uppercase tracking-[0.12em] text-signal">
          Contact
        </h2>
        <ul className="space-y-1 font-sans text-body text-bone">
          <li>
            Email:{" "}
            <a className="text-signal underline" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
          </li>
          <li>
            GitHub:{" "}
            <a className="text-signal underline" href={siteConfig.socials.github}>
              {siteConfig.socials.github}
            </a>
          </li>
          <li>
            LinkedIn:{" "}
            <a className="text-signal underline" href={siteConfig.socials.linkedin}>
              {siteConfig.socials.linkedin}
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
