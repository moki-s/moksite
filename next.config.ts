import type { NextConfig } from "next";

// GitHub Pages / static-host build:
//   STATIC_EXPORT=true NEXT_PUBLIC_BASE_PATH=/moksite pnpm build
// emits a fully static site into ./out. basePath is required when the site is
// served from a project subpath, e.g. https://<user>.github.io/<repo>/. Normal
// (server) builds — local dev, CI, Vercel — leave STATIC_EXPORT unset and keep
// the full Next server feature set, including the §7.6 security headers below.
const isStaticExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// §7.6 / §15 — security headers + the final Content-Security-Policy, verified
// against the built bundle in Phase 7. NOTE: a static (SSG) site can't mint
// per-request nonces, so script-src/style-src fall back to 'unsafe-inline'
// (documented trade-off — see docs/DECISIONS.md). Plausible's origin is allowed
// only when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set. These headers are emitted by the
// Next server, so they only apply to server/edge deploys — a static export served
// by GitHub Pages cannot send per-response headers and omits them.
const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ? " https://plausible.io" : "";

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${plausible}`,
  `connect-src 'self'${plausible}`,
].join("; ");

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = isStaticExport
  ? {
      output: "export",
      basePath: basePath || undefined,
      // GitHub Pages has no image optimizer; serve the source files as-is.
      images: { unoptimized: true },
      // Emit each route as a directory + index.html so Pages resolves them cleanly.
      trailingSlash: true,
    }
  : {
      async headers() {
        return [{ source: "/:path*", headers: securityHeaders }];
      },
    };

export default nextConfig;
