// §6.2 — typed site content. Personal facts resolved from the CV
// (docs/cv-master.pdf), applying §A.6: no phone number anywhere; employer
// revenue uses relative framings (not exact figures); the candidate's own
// contribution metrics are verbatim. Remaining [TODO-CONTENT] = arsenal
// "field-use" voice lines the owner approves/writes (PRD A.4).

export const siteConfig = {
  name: "Mokshith Sanga",
  strapline: "PRODUCT MANAGER · AI-NATIVE BUILDER · UNITED KINGDOM",
  role: "Product Manager & AI-Native Builder",
  email: "mokiviral@gmail.com",
  socials: {
    github: "https://github.com/moki-s",
    linkedin: "https://www.linkedin.com/in/mokshith-s-b06ab223a",
  },
} as const;

export type ArsenalGroup = {
  group: string;
  items: { name: string; icon: string; fieldUse: string }[];
};

// Skill names are factual (from the CV). The noir "field-use" one-liners are
// drafts (PRD A.4) — seeded where drafted, [TODO-CONTENT] where the owner writes
// the voice (the agent does not improvise copy-deck voice).
export const arsenal: ArsenalGroup[] = [
  {
    group: "LANGUAGES",
    items: [
      { name: "Python", icon: "Code", fieldUse: "[TODO-CONTENT]" },
      { name: "SQL", icon: "Code", fieldUse: "SQL — gets confessions out of databases." },
      { name: "JavaScript", icon: "Code", fieldUse: "[TODO-CONTENT]" },
      { name: "PHP", icon: "Code", fieldUse: "[TODO-CONTENT]" },
      { name: "HTML / CSS", icon: "Code", fieldUse: "[TODO-CONTENT]" },
    ],
  },
  {
    group: "AI & AUTOMATION",
    items: [
      { name: "Claude Code", icon: "Bot", fieldUse: "Claude Code — the partner who works the night shift." },
      { name: "AI agents", icon: "Bot", fieldUse: "[TODO-CONTENT]" },
      { name: "Model Context Protocol", icon: "Bot", fieldUse: "MCP — wires the informants together." },
      { name: "Agent Skills", icon: "Bot", fieldUse: "[TODO-CONTENT]" },
      { name: "Prompt engineering", icon: "Bot", fieldUse: "[TODO-CONTENT]" },
      { name: "LLM integration", icon: "Bot", fieldUse: "[TODO-CONTENT]" },
    ],
  },
  {
    group: "DATA",
    items: [
      { name: "MongoDB & Charts", icon: "Database", fieldUse: "[TODO-CONTENT]" },
      { name: "Supabase (Postgres)", icon: "Database", fieldUse: "[TODO-CONTENT]" },
      { name: "MySQL", icon: "Database", fieldUse: "[TODO-CONTENT]" },
      { name: "Excel", icon: "Database", fieldUse: "Excel — old weapon. still loaded." },
    ],
  },
  {
    group: "DELIVERY & INTEGRATIONS",
    items: [
      { name: "Agile / Scrum", icon: "Workflow", fieldUse: "[TODO-CONTENT]" },
      { name: "JIRA", icon: "Workflow", fieldUse: "[TODO-CONTENT]" },
      { name: "Postman", icon: "Workflow", fieldUse: "[TODO-CONTENT]" },
      { name: "Sentry", icon: "Workflow", fieldUse: "[TODO-CONTENT]" },
      { name: "Stripe", icon: "Workflow", fieldUse: "Stripe — the money always leaves a trail." },
      { name: "Twilio", icon: "Workflow", fieldUse: "[TODO-CONTENT]" },
      { name: "Resend", icon: "Workflow", fieldUse: "[TODO-CONTENT]" },
      { name: "Zoho", icon: "Workflow", fieldUse: "[TODO-CONTENT]" },
      { name: "Figma", icon: "Workflow", fieldUse: "[TODO-CONTENT]" },
    ],
  },
];

// Origin copy resolved from PRD A.2 (owner may edit). Employer revenue is
// relative-framed per §A.6.
export const origin: string[] = [
  "The city runs on broken spreadsheets and slow software. I fix that.",
  "By day: product manager — roadmaps, PRDs, stakeholders. After hours I ship the thing myself, AI agents at my side. An LMS for 1,200 learners. A clinician tool at 93% adoption. A store scaled roughly tenfold in two months.",
  "Founding-team years in health-tech and EdTech taught me the rule: everything ships with your name on it. Currently finishing an MSc in Advanced Computer Science in Birmingham. The signal's on — I take cases.",
];

export type Testimonial = { quote: string; name: string; role: string };

// No real testimonials yet — Panel 4 is cut entirely if this stays empty (§3).
export const testimonials: Testimonial[] = [];
