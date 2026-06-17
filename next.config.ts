import type { NextConfig } from "next";

// §7.6 / §15 — security headers + the final Content-Security-Policy, verified
// against the built bundle in Phase 7. NOTE: a static (SSG) site can't mint
// per-request nonces, so script-src/style-src fall back to 'unsafe-inline'
// (documented trade-off — see docs/DECISIONS.md). Plausible's origin is allowed
// only when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set.
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

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
