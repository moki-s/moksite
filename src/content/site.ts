// §6.2 — typed site content.
// Personal identifiers are seeded from PRD Appendix A.1 (resolved from the
// master CV — see §6.3, marked resolved, and docs/DECISIONS.md). Everything
// else (origin copy, arsenal field-use lines, testimonials) stays
// [TODO-CONTENT] until the owner approves it. The phone number is deliberately
// absent everywhere (PRD A.6).

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

// Arsenal: skill names are factual but the noir "field-use" one-liners are
// drafts (PRD A.4) awaiting approval — left empty/[TODO-CONTENT] for now.
export const arsenal: ArsenalGroup[] = [
  // [TODO-CONTENT] — seed groups + field-use lines from PRD Appendix A.4 after approval.
];

// Origin copy is a DRAFT needing the owner's edit/approval (PRD A.2).
export const origin: string[] = ["[TODO-CONTENT]"];

export type Testimonial = { quote: string; name: string; role: string };

// No real testimonials yet — Panel 4 is cut entirely if this stays empty (§3).
export const testimonials: Testimonial[] = [];
