<!-- Put this at the repo root as CLAUDE.md, then copy it verbatim to AGENTS.md (identical content) so Codex/Antigravity can read it too. -->

# moksite — agent instructions

## Project status (read first)

All PRD build phases (0–7) **and the Oct 2026 mobile overhaul are complete**;
the site is **live in production** (https://moksite.vercel.app, Vercel
auto-deploys pushes to `main`). The project is in **maintenance mode**: the
old one-phase-per-session workflow and the per-phase prompts in
`docs/PROMPT-PACK.md` are historical. For any non-trivial change, start in
plan mode and get approval; for small fixes, just keep the definition of done
below.

## Source of truth

- The spec is `docs/PRD.md`. Read the referenced sections before any task.
  **The PRD wins over your defaults — but owner-approved deviations in
  `docs/DECISIONS.md` (newest first) win over the PRD's literal text.** The
  mobile-overhaul entry (30 Sep 2026) supersedes §5.1's poster-only mobile
  gating, §12's two-browser test matrix, and §16's "3D tanks mobile"
  mitigation, among others — read it before touching the hero, tests, or CI.
- The PRD's codename is **NIGHTFRAME**; the project is renamed **moksite**
  (terminal prompt `moksite@cmd:~$`, boot line `MOKSITE OS v1.0 — …`).
- Site content (name, cases, metrics, bio) is real, owner-supplied data in
  `src/content/site.ts` + `content/cases/`. **Never invent or "refresh" any
  personal fact, metric, or employer detail** — if content is needed, insert a
  `[TODO-CONTENT]` marker and stop.

## Definition of done (every change)

```
pnpm typecheck && pnpm lint && pnpm build
pnpm exec playwright test        # all 4 projects must pass
```

- Playwright projects: `chromium`/`webkit` (desktop, all specs except
  `mobile.spec.ts`) + `mobile-chromium` (Pixel 7) / `mobile-webkit`
  (iPhone 13) running `tests/e2e/mobile.spec.ts`. axe gates (zero
  critical/serious) live inside the suites.
- CI (`.github/workflows/ci.yml`) additionally runs **calibrated Lighthouse
  CI** (mobile, median of 3, perf ≥ 0.85 hard gate). CI does NOT block the
  Vercel deploy — verify CI is green before calling a push done. CI failures
  publish full diagnostics (assertions, per-audit values, long-task
  attribution) as public check-run annotations; read those, not the
  auth-gated raw logs.

## Engineering rules learned the hard way (do not regress these)

- **Desktop invariance:** mobile/touch behavior is gated behind
  `max-width` / `pointer: coarse` media queries or post-mount
  `usePointerCoarse()` branches. Desktop rendering is byte-identical to the
  pre-overhaul site — keep it that way.
- **Never create a WebGL context at hydration** (~300 ms main thread on
  software Chrome). `HeroGate` probes WebGL2 only at arm time.
- **The mobile 3D arms only on human input** (`pointerdown`/`touchstart`/
  `keydown`). Never add `scroll`/`wheel`/timers — Lighthouse fires `scroll`
  with no user present and the armed scene's software-GL frames destroy the
  perf gate (runs #28–#42 forensics in DECISIONS.md).
- **Never animate `background-position`** (or other non-compositable
  properties) continuously — full-screen main-thread repaint every frame.
  Animate `transform` on an oversized layer (see `.hero-css-rain::before`).
- **Measure performance cold**: fresh Chrome `--user-data-dir` per Lighthouse
  run; warm compile caches report fantasy TBT. The lab **LCP ~3.3 s is a
  headless frame-deferral artifact** (warn-only); real LCP tracks FCP.
- Don't rebuild while a dev/`pnpm start` server is running — `.next/` swap
  corruption. Stop, build, restart.

## Tooling

- Use **Context7** MCP for current API docs before using any library (Next 15,
  React 19, Tailwind v4, `@react-three/fiber`, `three`, `gsap`/ScrollTrigger,
  `lenis`, `zod`, `resend`). Their APIs move fast; don't rely on memory.
- Use **Playwright** to verify behavior in a real browser — including the
  mobile surfaces: touch terminal (navbar `>_`, tap-row, visualViewport),
  torch hunt (arm → sweep → `data-lit` → tap), hero tier gating/arming,
  reduced-motion parity, anchor deep-links, OG cards.

## Hard rules (career-protection clauses — §0.3 + §15)

1. **No fabrication.** Never invent projects, metrics, employers, testimonials,
   quotes, names, or links. A fake metric a recruiter catches is fatal.
2. **No IP violations.** §15 is non-negotiable — original noir *genre*, never
   any franchise (no bat emblem or readable silhouette, no Gotham/Wayne/Bat-
   naming, no DC names/quotes/traced art). When in doubt, redesign.
3. **No new dependencies** beyond §7.2 without a one-line justification logged
   in `docs/DECISIONS.md`.
4. **No copied code or assets** from other portfolios. Inspiration ≠ duplication.
5. **Budgets (§8) are gates, not goals.** A feature that breaks a budget gets
   descoped — never the budget. (If the *measurement* is broken, fix the
   instrument and log it — see the CI-calibration entry in DECISIONS.md.)
6. **Design tokens (§4), copy deck (§6.4), and budgets (§8) are law.** Do not
   invent colors, fonts, copy, or libraries.
- **Never commit secrets.** Env vars are listed in §7.5; `.env.example` is
  committed, real `.env.local` is git-ignored.
- If the PRD is ambiguous or you must deviate, **stop and ask.** Log accepted
  deviations in `docs/DECISIONS.md`.
