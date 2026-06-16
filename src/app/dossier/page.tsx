import type { Metadata } from "next";
import { siteConfig } from "@/content/site";
import { getAllCases } from "@/lib/content";
import { absoluteUrl, personJsonLd } from "@/lib/seo";

// §5.8 — deliberately plain, system-fast, fully static, printable. The
// recruiter escape hatch and the SEO text backbone. Content resolved from the
// CV (docs/cv-master.pdf) under §A.6: no phone, employer revenue relative-framed,
// own contribution metrics verbatim.
export const metadata: Metadata = {
  title: "Dossier",
  description: `The full dossier for ${siteConfig.name} — ${siteConfig.role}: experience, projects, skills, education, and contact.`,
  alternates: { canonical: absoluteUrl("/dossier") },
};

const EXPERIENCE = [
  {
    role: "Associate Product Manager",
    org: "Integer Training Ltd (EdTech) & sister e-commerce brands",
    dates: "Nov 2025 – Present · United Kingdom",
    bullets: [
      "Own the roadmap and end-to-end lifecycle of a custom LMS serving 1,200 learners (800–850 active) and 15–20 staff — authored the PRD, technical specifications and integration architecture, and shipped the MVP via AI-assisted full-stack development (Claude Code), integrating Stripe, Supabase (PostgreSQL), Twilio and Resend over REST APIs and webhooks.",
      "Replaced 5–6 spreadsheet systems with the LMS, cutting learner onboarding by 15–20 minutes each and automating instalment-payment and assessment tracking.",
      "Shipped an in-house CRM integrating Zoho (via the Model Context Protocol) with advertising-platform data, surfacing lead intelligence to 20+ daily-active sales agents; built a companion tool for configurable-deposit payment links and commission calculations.",
      "Integrated a digitally-signed application form with a third-party student-funding provider, architecting a Stripe-linked deposit flow between the two systems; built an auto-marked initial-assessment tool.",
      "Built a Moodle e-learning platform from scratch (PHP), designing the role-based access hierarchy (admin / tutor / learner) and auto-graded assessment logic.",
      "Launched and scaled an AI-generated custom-wallpaper store to roughly 10× revenue within two months, optimising AI token cost per generation across 5–7 art styles.",
      "Drove go-to-market for worldwide Shopify stores with technical SEO and A/B-tested product pages, and launched the Integer Training website with one-time and instalment payment flows — driving a launch-week pipeline of enquiries and the first direct course sales.",
    ],
  },
  {
    role: "Product & Operations Associate · Founding Team",
    org: "DeftRonin Technologies (Healthflex) — healthcare / rehabilitation technology",
    dates: "Mar 2024 – Sep 2025",
    bullets: [
      "Led full data migration from a third-party EMR (patients, SOAP notes, billing, services), owning schema validation, data-model mapping and reconciliation — zero data loss.",
      "Partnered with cross-functional engineering teams to migrate mobile apps from Flutter to React, validating 9-axis IMU sensor inputs.",
      "Proposed and piloted a voice-to-structured-form tool (Google Speech-to-Text + LLM) that cut clinical documentation from 20 to 5 minutes per note (−75%) at 93% clinician adoption.",
      "Improved data accuracy to 95% across 250+ 9-axis IMU sensors; directed QA in an Agile/Scrum cycle, surfacing 30–40% of critical bugs and delivering 200+ validated sensor-data reports used in medical decision-making.",
      "Designed rehabilitation protocols covering 79% of surgeries and 98% of OPD conditions — 2,100+ movement-correction rules and 730+ evidence-based exercise entries — and built analytics dashboards (MongoDB Charts) across 3 centres.",
      "Ran a comparative cost/quality analysis across 15+ hardware vendors, cutting unit cost 43% with zero user complaints on the chosen device.",
    ],
  },
  {
    role: "Digital Forensics Intern",
    org: "SysTools Pvt. Ltd",
    dates: "Jun 2023 – Jul 2023",
    bullets: [
      "Performed on-site forensic imaging of electronic devices (FTK Imager, MailXaminer), ensuring evidence integrity for investigative processes.",
    ],
  },
];

const SKILLS = [
  {
    group: "Product & technical delivery",
    items:
      "PRDs & technical specs, integration architecture & system design, data modelling, roadmap ownership, MVP definition, backlog prioritisation, Agile/Scrum, A/B testing, QA leadership, stakeholder management",
  },
  {
    group: "APIs & integrations",
    items:
      "REST APIs, webhooks, Stripe, Twilio, Resend, Zoho, Facebook Ads, Model Context Protocol (MCP), third-party system integration",
  },
  {
    group: "Languages & databases",
    items:
      "Python, SQL, JavaScript, PHP, HTML/CSS; MongoDB (aggregations & Charts), MySQL, Supabase (PostgreSQL)",
  },
  {
    group: "AI & automation",
    items:
      "Claude Code, AI agents, Agent Skills, prompt engineering, LLM integration, AI-assisted full-stack development",
  },
  {
    group: "Platforms & growth",
    items: "Shopify, Moodle, Hostinger, GitHub, Figma; technical & e-commerce SEO",
  },
];

const EDUCATION = [
  {
    degree: "MSc, Advanced Computer Science",
    org: "University of Birmingham, United Kingdom",
    dates: "Sep 2025 – Sep 2026",
  },
  {
    degree: "B.Tech, Computer Science & Engineering (Cyber Security)",
    org: "Dayananda Sagar University, Bangalore",
    dates: "Dec 2020 – Jun 2024 · CGPA 7.89",
  },
];

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
        <h2 className="mb-5 font-mono text-meta uppercase tracking-[0.12em] text-signal">
          Experience
        </h2>
        <div className="space-y-8">
          {EXPERIENCE.map((job) => (
            <div key={`${job.role}-${job.org}`}>
              <h3 className="font-sans text-body-lg font-semibold text-bone">
                {job.role}
              </h3>
              <p className="font-sans text-meta text-bone">{job.org}</p>
              <p className="mt-1 font-mono text-caption uppercase tracking-[0.1em] text-rain">
                {job.dates}
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 font-sans text-meta text-bone marker:text-rain">
                {job.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-5 font-mono text-meta uppercase tracking-[0.12em] text-signal">
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
        <h2 className="mb-5 font-mono text-meta uppercase tracking-[0.12em] text-signal">
          Skills
        </h2>
        <dl className="space-y-3">
          {SKILLS.map((s) => (
            <div key={s.group}>
              <dt className="font-mono text-caption uppercase tracking-[0.1em] text-rain">
                {s.group}
              </dt>
              <dd className="font-sans text-meta text-bone">{s.items}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mb-10">
        <h2 className="mb-5 font-mono text-meta uppercase tracking-[0.12em] text-signal">
          Education
        </h2>
        <div className="space-y-4">
          {EDUCATION.map((e) => (
            <div key={e.degree}>
              <h3 className="font-sans text-body-lg font-semibold text-bone">
                {e.degree}
              </h3>
              <p className="font-sans text-meta text-bone">{e.org}</p>
              <p className="mt-1 font-mono text-caption uppercase tracking-[0.1em] text-rain">
                {e.dates}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-5 font-mono text-meta uppercase tracking-[0.12em] text-signal">
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
