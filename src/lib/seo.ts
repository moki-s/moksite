import { siteConfig } from "@/content/site";

/** Canonical base URL — from NEXT_PUBLIC_SITE_URL, with a localhost fallback so
 *  local builds and previews still produce valid absolute URLs. */
export function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function absoluteUrl(pathname = "/"): string {
  const base = getBaseUrl();
  return pathname.startsWith("/") ? `${base}${pathname}` : `${base}/${pathname}`;
}

/** §10 — JSON-LD `Person` for `/` and `/dossier`. */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    url: getBaseUrl(),
    sameAs: Object.values(siteConfig.socials).filter((url) => url.startsWith("http")),
  };
}
