# moksite

A noir comic-book portfolio with a hidden Command Center — a 3D night-city cold
open, scroll-driven comic panels, case files, and a terminal easter egg. Built to
the spec in `docs/PRD.md` (NIGHTFRAME v2.1). Agent working rules: `CLAUDE.md` /
`AGENTS.md`; accepted deviations: `docs/DECISIONS.md`.

**Stack:** Next.js 15 (App Router, React 19, TypeScript strict) · Tailwind v4
(CSS-first `@theme`) · `@react-three/fiber` + `three` · GSAP + Lenis · Zod ·
Resend · pnpm.

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

> Don't run `pnpm build` while `pnpm dev` is running — they share `.next/` and the
> build will corrupt the dev server. Stop dev first, or use a separate checkout.

## Quality gates (definition of done)

```bash
pnpm typecheck && pnpm lint && pnpm build
```

`pnpm build` runs the `prebuild` content generator, which validates every case's
frontmatter and images and writes `docs/CONTENT-TODO.md` (launch blocks until it
shows **zero** open items).

## Content

- Cases live in `content/cases/*.mdx` (validated by `src/lib/schemas.ts`). Drafts
  awaiting a rewrite sit in `content/cases/_hidden/` — the loader only reads
  top-level `.mdx`, so they don't appear anywhere and their routes 404.
- Typed site content (name, socials, arsenal, `whoami` bio) is `src/content/site.ts`.
- Screenshots are stored pre-optimised in `public/images/` (webp, ≤200 KB each).
  Sensitive third-party PII (student/learner records, financial figures) is blurred
  at rest; some operational names are shown as-is at the owner's direction — see
  `docs/DECISIONS.md`.

## Deploy (Vercel)

This app uses a server route (`/api/contact`), so it needs a Node server host —
**Vercel** (not static hosting). Vercel auto-detects Next.js; no config file needed.

1. Import the repo at vercel.com → New Project.
2. Set environment variables (see `.env.example`):
   - `NEXT_PUBLIC_SITE_URL` — the production URL, e.g. `https://moksite.vercel.app`
     (used for canonical links, OG images, sitemap). **Required** for correct SEO.
   - `RESEND_API_KEY` + `CONTACT_TO_EMAIL` — enable the contact form's email
     delivery. Without them the form falls back to a `mailto:` link.
   - `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — optional analytics; omit to disable.
3. Deploy. Security headers + CSP are emitted from `next.config.ts` on every
   response.

CI (`.github/workflows/ci.yml`) runs typecheck · lint · build · Playwright + axe ·
Lighthouse on every push.
