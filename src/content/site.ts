// §6.2 — typed site content. Personal facts resolved from the CV
// (docs/cv-master.pdf), applying §A.6: no phone number anywhere; employer
// revenue uses relative framings (not exact figures); the candidate's own
// contribution metrics are verbatim. Arsenal "field-use" one-liners drafted in
// the noir voice at the owner's request (15 Sep 2026) — owner to review/tweak.

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

// Skill names are factual (from the CV). The noir "field-use" one-liners were
// drafted in-voice at the owner's explicit request (PRD A.4) — owner to review.
export const arsenal: ArsenalGroup[] = [
  {
    group: "LANGUAGES",
    items: [
      { name: "Python", icon: "Code", fieldUse: "Python — the everyday sidearm. quiet, reliable, always in reach." },
      { name: "SQL", icon: "Code", fieldUse: "SQL — gets confessions out of databases." },
      { name: "JavaScript", icon: "Code", fieldUse: "JavaScript — works every corner of town, in every browser." },
      { name: "PHP", icon: "Code", fieldUse: "PHP — the old workhorse. still walking the beat, still closing cases." },
      { name: "HTML / CSS", icon: "Code", fieldUse: "HTML / CSS — the face every operation wears in public." },
    ],
  },
  {
    group: "AI & AUTOMATION",
    items: [
      { name: "Claude Code", icon: "Bot", fieldUse: "Claude Code — the partner who works the night shift." },
      { name: "AI agents", icon: "Bot", fieldUse: "AI agents — the crew I deputize to chase leads while the city sleeps." },
      { name: "Model Context Protocol", icon: "Bot", fieldUse: "MCP — wires the informants together." },
      { name: "Agent Skills", icon: "Bot", fieldUse: "Agent Skills — new tricks for the crew, one playbook at a time." },
      { name: "Prompt engineering", icon: "Bot", fieldUse: "Prompt engineering — ask the right way, and the machine talks." },
      { name: "LLM integration", icon: "Bot", fieldUse: "LLM integration — intelligence wired straight into the case file." },
    ],
  },
  {
    group: "DATA",
    items: [
      { name: "MongoDB & Charts", icon: "Database", fieldUse: "MongoDB & Charts — a mountain of evidence, laid out until it confesses." },
      { name: "Supabase (Postgres)", icon: "Database", fieldUse: "Supabase — the case files. locked tight, always in order." },
      { name: "MySQL", icon: "Database", fieldUse: "MySQL — the records room. every fact right where I left it." },
      { name: "Excel", icon: "Database", fieldUse: "Excel — old weapon. still loaded." },
    ],
  },
  {
    group: "DELIVERY & INTEGRATIONS",
    items: [
      { name: "Agile / Scrum", icon: "Workflow", fieldUse: "Agile / Scrum — the case worked in short stakeouts, never losing the thread." },
      { name: "JIRA", icon: "Workflow", fieldUse: "JIRA — the board where every lead gets tracked to the end." },
      { name: "Postman", icon: "Workflow", fieldUse: "Postman — I knock on every endpoint before I trust it." },
      { name: "Sentry", icon: "Workflow", fieldUse: "Sentry — the informant who rings the second something breaks." },
      { name: "Stripe", icon: "Workflow", fieldUse: "Stripe — the money always leaves a trail." },
      { name: "Twilio", icon: "Workflow", fieldUse: "Twilio — gets word out to anyone, any hour." },
      { name: "Resend", icon: "Workflow", fieldUse: "Resend — the message that always makes it to the doorstep." },
      { name: "Zoho", icon: "Workflow", fieldUse: "Zoho — keeps the whole outfit's paperwork straight." },
      { name: "Figma", icon: "Workflow", fieldUse: "Figma — where the plan gets drawn before the raid." },
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

// §5.7 — terminal `whoami` bio (3 lines). Drafted in-voice at the owner's request
// (15 Sep 2026), from facts already in the origin copy / CV — owner to review.
export const terminalBio: string[] = [
  "Mokshith Sanga — product manager by day, builder after dark.",
  "I turn broken spreadsheets and slow software into things that ship: an LMS for 1,200 learners, a clinician tool at 93% adoption, a store scaled ~10× in two months.",
  "Founding-team years in health-tech and EdTech; now finishing an MSc in Birmingham. The signal's on — I take cases.",
];

export type Testimonial = { quote: string; name: string; role: string };

// No real testimonials yet — Panel 4 is cut entirely if this stays empty (§3).
export const testimonials: Testimonial[] = [];
