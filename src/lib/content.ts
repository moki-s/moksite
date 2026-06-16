import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { caseSchema, type CaseFrontmatter } from "@/lib/schemas";

const CASES_DIR = path.join(process.cwd(), "content", "cases");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const TODO_MARKER = "[TODO-CONTENT]";

export type CaseEntry = CaseFrontmatter & { body: string };

/** Placeholder values aren't real paths — skip existence checks for them; the
 *  CONTENT-TODO generator tracks unresolved markers instead. */
function isUnresolved(value: string): boolean {
  return value.trim() === "" || value.includes(TODO_MARKER);
}

function assertImageExists(imagePath: string, slug: string, field: string): void {
  if (isUnresolved(imagePath)) return;
  const relative = imagePath.replace(/^\/+/, "");
  const absolute = path.join(PUBLIC_DIR, relative);
  if (!fs.existsSync(absolute)) {
    throw new Error(
      `[content] case "${slug}": ${field} references a missing image "${imagePath}" (expected at public/${relative})`,
    );
  }
}

function parseCaseFile(fileName: string): CaseEntry {
  const fileSlug = fileName.replace(/\.mdx$/, "");
  const source = fs.readFileSync(path.join(CASES_DIR, fileName), "utf8");
  const { data, content } = matter(source);

  const parsed = caseSchema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `[content] invalid frontmatter in content/cases/${fileName}:\n${issues}`,
    );
  }

  const frontmatter = parsed.data;
  if (frontmatter.slug !== fileSlug) {
    throw new Error(
      `[content] case "${fileName}": frontmatter slug "${frontmatter.slug}" must match the filename "${fileSlug}"`,
    );
  }

  assertImageExists(frontmatter.cover, frontmatter.slug, "cover");
  frontmatter.images.forEach((image, index) =>
    assertImageExists(image.src, frontmatter.slug, `images[${index}].src`),
  );

  return { ...frontmatter, body: content };
}

/** All cases, validated at build time. Throws — and therefore FAILS the build —
 *  on invalid frontmatter, a slug/filename mismatch, a duplicate slug, or a
 *  missing image file. Consumed by sitemap.ts and /dossier, so it runs during
 *  `next build`. */
export function getAllCases(): CaseEntry[] {
  if (!fs.existsSync(CASES_DIR)) return [];
  const files = fs.readdirSync(CASES_DIR).filter((file) => file.endsWith(".mdx"));
  const cases = files.map(parseCaseFile);

  const seen = new Set<string>();
  for (const entry of cases) {
    if (seen.has(entry.slug)) {
      throw new Error(`[content] duplicate case slug "${entry.slug}"`);
    }
    seen.add(entry.slug);
  }

  return cases.sort((a, b) => a.order - b.order);
}

/** A single case with its MDX body compiled to a React node (for the Phase 3
 *  detail page). Uses next-mdx-remote/rsc, imported lazily so the MDX runtime
 *  only loads when a case is actually rendered. */
export async function getCase(slug: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const fileName = `${slug}.mdx`;
  if (!fs.existsSync(path.join(CASES_DIR, fileName))) return null;

  const entry = parseCaseFile(fileName);
  const { compileMDX } = await import("next-mdx-remote/rsc");
  const { content } = await compileMDX({
    source: entry.body,
    options: { parseFrontmatter: false },
  });
  return { ...entry, content };
}
