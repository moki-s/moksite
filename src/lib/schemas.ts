import { z } from "zod";

// §6.1 — case frontmatter schema. Adapted to Zod 4: the top-level `z.url()`
// replaces the now-deprecated `z.string().url()` (same validation). See
// docs/DECISIONS.md.
export const caseSchema = z.object({
  title: z.string().max(60),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  order: z.number().int(), // display order
  year: z.number().int(),
  role: z.string(), // e.g. "Solo build" | "Lead frontend"
  status: z.enum(["shipped", "ongoing", "archived"]),
  stack: z.array(z.string()).min(1).max(8),
  summary: z.string().max(140), // folder hover line
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).max(3),
  links: z.object({
    live: z.url().optional(),
    repo: z.url().optional(),
  }),
  cover: z.string(), // /images/cases/<slug>/cover.avif
  images: z
    .array(
      z.object({
        src: z.string(),
        alt: z.string(),
        caption: z.string().optional(),
      }),
    )
    .min(1)
    .max(4),
});

export type CaseFrontmatter = z.infer<typeof caseSchema>;
