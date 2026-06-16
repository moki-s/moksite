import type { NextConfig } from "next";

// §7.6 Security headers. NOTE: the full `default-src 'self'` Content-Security-
// Policy is intentionally deferred to Phase 7 (it must be verified against the
// deployed bundle — Next's inline runtime needs care). For now we ship the
// static headers plus `frame-ancestors 'none'`. See docs/DECISIONS.md.
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
