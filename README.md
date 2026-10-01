# moksite

A noir comic-book portfolio with a hidden Command Center — a 3D night-city cold
open, scroll-driven comic panels, case files, and a terminal easter egg. Built to
the spec in `docs/PRD.md` (NIGHTFRAME v2.1). Agent working rules: `CLAUDE.md` /
`AGENTS.md`; accepted deviations + the full decision log: `docs/DECISIONS.md`.

**Live:** https://moksite.vercel.app · **Status:** all build phases (0–7) and the
Oct 2026 mobile overhaul are complete — the project is in maintenance mode.

**Stack:** Next.js 15 (App Router, React 19, TypeScript strict) · Tailwind v4
(CSS-first `@theme`) · `@react-three/fiber` + `three` · GSAP + Lenis · Zod ·
Resend · pnpm.

## Mobile & touch (Oct 2026 overhaul)

Mobile gets the **full cinematic experience**, not a fallback — see the
"Mobile overhaul" entry in `docs/DECISIONS.md` for every decision:

- **Tiered 3D hero** (`src/components/hero/HeroGate.tsx` + `src/lib/heroCamera.ts`):
  `full` (desktop, mounts immediately) · `mobile` (phones/tablets — quality-tiered
  scene with a portrait camera, mounted **only on first human input**:
  `pointerdown`/`touchstart`/`keydown`; WebGL2 is probed at arm time, never at
  hydration) · `poster` (reduced-motion / true low-end: art-directed portrait
  poster + compositor-driven CSS rain). Lightning fires for every motion-enabled
  visitor.
- **Touch-torch hunt**: hidden props are inert until the `TORCH` chip arms a
  finger-swept light pool; lit props are tappable. Keyboard/AT collect via
  focus/click without the torch.
- **Touch terminal**: `>_` navbar opener, visualViewport-sized overlay (the
  keyboard never covers the input), tap-row, 16px input, tap-to-skip boot.
- **Responsive foundation**: `100svh`, mobile-only fluid type re-declarations,
  overflow guards (zero horizontal scroll at 320px), always-revealed case
  summaries on coarse pointers.
- **Desktop is intentionally byte-identical** to the pre-overhaul rendering —
  all mobile/touch changes are gated behind `max-width`/`pointer: coarse` media
  queries or post-mount coarse-pointer branches (`src/lib/usePointerCoarse.ts`).

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

> Don't run `pnpm build` while a dev or `pnpm start` server is running — they
> share `.next/` and the running server serves a corrupted mix. Stop the server
> first, rebuild, then restart.

## Quality gates (definition of done)

```bash
pnpm typecheck && pnpm lint && pnpm build
pnpm exec playwright test        # 78 tests × 4 projects (see below)
```

- **Playwright projects** (`playwright.config.ts`): `chromium` + `webkit`
  (desktop) run every spec except `mobile.spec.ts`; `mobile-chromium` (Pixel 7)
  + `mobile-webkit` (iPhone 13) run `tests/e2e/mobile.spec.ts` (touch terminal,
  torch hunt, 3D arming, overflow, axe on the mobile UI). CI adds `retries: 1`
  and the `github` reporter (failures become public check-run annotations).
- `pnpm build` runs the `prebuild` content generator, which validates every
  case's frontmatter and images and writes `docs/CONTENT-TODO.md`.

### Performance testing — read before trusting numbers

Hard-won rules (full forensics in `docs/DECISIONS.md`, "Mobile overhaul" entry):

- **Measure cold.** A long-lived Chrome caches compiled JS and will report
  near-zero TBT for a page whose real cold hydration is 10× worse. Use a fresh
  `--user-data-dir` per Lighthouse run.
- The lab **LCP ~3.3 s is a headless-Chrome frame-deferral artifact** (even a
  plain `<li>` records ~2.2 s); it is asserted warn-only. Real-device LCP
  tracks FCP (~1.1 s).
- Never create a WebGL context at hydration (~300 ms main thread on software
  Chrome). Never animate `background-position` (full-screen main-thread repaint
  every frame) — animate `transform` on an oversized layer.
- CI's Lighthouse step probes the runner's `benchmarkIndex` and calibrates
  lantern's CPU multiplier (official Lighthouse formula), then asserts on the
  **median of 3 runs**. On failure it publishes the assertion output, per-audit
  values, and long-task attribution as public annotations — read them from the
  checks API; raw job logs are auth-gated.

## Content

- Cases live in `content/cases/*.mdx` (validated by `src/lib/schemas.ts`). Drafts
  awaiting a rewrite sit in `content/cases/_hidden/` — the loader only reads
  top-level `.mdx`, so they don't appear anywhere and their routes 404.
- Typed site content (name, socials, arsenal, `whoami` bio) is `src/content/site.ts`.
- Screenshots are stored pre-optimised in `public/images/` (webp, ≤200 KB each).
  Sensitive third-party PII (student/learner records, financial figures) is blurred
  at rest; some operational names are shown as-is at the owner's direction — see
  `docs/DECISIONS.md`.
- Hero posters are generated from the live scene: `node scripts/generate-poster.mjs`
  (server must be running) emits the landscape `public/poster/hero.avif` **and**
  the portrait `public/poster/hero-portrait.avif`.

## Deploy (Vercel)

Production deploys automatically from pushes to `main` via Vercel's git
integration (no deploy workflow in-repo). The app needs a Node server host for
`/api/contact` — **not** static hosting.

1. Environment variables (see `.env.example`):
   - `NEXT_PUBLIC_SITE_URL` — the production URL (canonical links, OG images,
     sitemap). **Required** for correct SEO.
   - `RESEND_API_KEY` + `CONTACT_TO_EMAIL` — contact-form email delivery.
     Without them the form falls back to a `mailto:` link.
   - `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — optional analytics; omit to disable.
2. Security headers + CSP are emitted from `next.config.ts` on every response.
3. The `STATIC_EXPORT=true` path in `next.config.ts` is a **legacy, unused**
   GitHub-Pages escape hatch (it deletes the API route and degrades the form) —
   kept for reference only; do not use it for production.

CI (`.github/workflows/ci.yml`) runs typecheck · lint · build · Playwright
(4 projects) + axe · calibrated Lighthouse CI on every push. Note: a red CI run
does **not** block the Vercel deploy — check CI before considering a push done.
