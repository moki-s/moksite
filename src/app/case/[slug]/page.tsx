import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getAllCases,
  getCase,
  getCaseFrontmatter,
  getAdjacentCase,
  isPlaceholder,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/content/site";
import { Splash } from "@/components/cases/Splash";
import { Metric } from "@/components/cases/Metric";
import { Evidence } from "@/components/cases/Evidence";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCases().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const entry = getCaseFrontmatter(slug);
  if (!entry) return {};
  const title = `CASE: ${entry.title}`;
  const url = absoluteUrl(`/case/${slug}`);
  return {
    title,
    description: entry.summary,
    alternates: { canonical: url },
    openGraph: { title, description: entry.summary, url, type: "article" },
    twitter: { card: "summary_large_image", title, description: entry.summary },
  };
}

// §5.4 — Splash / THE BRIEF / THE OPERATION (MDX) / screenshots / THE OUTCOME /
// EVIDENCE / NEXT CASE + RETURN TO ISSUE. §10 — per-case CreativeWork JSON-LD.
export default async function CasePage({ params }: Params) {
  const { slug } = await params;
  const entry = await getCase(slug);
  if (!entry) notFound();
  const next = getAdjacentCase(slug, 1);

  const creativeWork = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: entry.title,
    abstract: entry.summary,
    dateCreated: String(entry.year),
    keywords: entry.stack.join(", "),
    creator: { "@type": "Person", name: siteConfig.name },
    url: absoluteUrl(`/case/${slug}`),
  };

  return (
    <main id="main-content" tabIndex={-1} className="case-detail">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWork) }}
      />

      <Splash entry={entry} />

      <article className="case-prose">{entry.content}</article>

      <section className="case-screens" aria-label="Operation screenshots">
        {entry.images.map((image, i) => (
          <figure key={i} className="case-screen">
            <div className="case-screen-frame">
              {isPlaceholder(image.src) ? (
                <span className="case-screen-label">{image.alt}</span>
              ) : (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="case-screen-img"
                />
              )}
            </div>
            {image.caption && <figcaption>{image.caption}</figcaption>}
          </figure>
        ))}
      </section>

      <section className="case-outcome" aria-labelledby="outcome-heading">
        <h2 id="outcome-heading" className="case-section-title">
          THE OUTCOME
        </h2>
        <div className="case-metrics">
          {entry.metrics.map((metric, i) => (
            <Metric key={i} value={metric.value} label={metric.label} />
          ))}
        </div>
      </section>

      <section className="case-evidence-section" aria-labelledby="evidence-heading">
        <h2 id="evidence-heading" className="case-section-title">
          EVIDENCE
        </h2>
        <Evidence links={entry.links} />
      </section>

      <nav className="case-footer-nav" aria-label="Case navigation">
        {next && (
          <Link className="case-next" href={`/case/${next.slug}`}>
            NEXT CASE →
          </Link>
        )}
        <Link className="case-return" href="/#cases">
          RETURN TO ISSUE
        </Link>
      </nav>
    </main>
  );
}
