# Decisions log

Accepted deviations from the PRD and one-line justifications for anything that
needs explaining (per CLAUDE.md / PRD §0.3). Newest first.

## Phase 6 — Contact & instrumentation

- **Real email end-to-end is deferred** until the owner sets `RESEND_API_KEY` +
  `CONTACT_TO_EMAIL` (their timeline). The route is complete; without the key it
  fails closed (**500** → the form shows the mailto fallback). Sandbox sender
  `onboarding@resend.dev` is used until a domain is verified.
- **Anti-spam returns 200 silently** for the honeypot (`company`) and the < 3 s
  time-trap, so bots aren't tipped off (§7.4). Per-IP throttle is in-memory
  (5/hr, best-effort, resets on cold start). **Message content is never logged.**
- **`contactSchema` is shared** (client + server) in `lib/schemas.ts`.
- **Analytics wrapper no-ops** unless Plausible is loaded; the script mounts only
  when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set. Wired: skip_intro,
  terminal_open{method}, terminal_command{name}, case_open{slug},
  cv_download{source}, contact_submit{ok}, motion_toggle{state}, easteregg{id}.
- **Favicons from the stamp motif** — `app/icon.svg` (ink · blood rotated frame ·
  amber lit-window square) + `app/apple-icon.png` (via sharp) + `app/manifest.ts`;
  the create-next-app `favicon.ico` is removed.
- **404** (`not-found.tsx`) finalized with the §5.9 copy + the terminal hint.

## Phase 5 — Command Center

- **Terminal chunk loads lazily on first discovery.** `TerminalLauncher` (main
  bundle, in layout) holds the global `` ` ``/Konami listener + high-contrast
  sync and only `dynamic(ssr:false)`-renders `Terminal` once `terminalOpen`
  flips true, so the terminal + command registry are a lazy chunk (§8).
- **Real socials/contact; only the bio is `[TODO-CONTENT]`.** `socials` /
  `contact` / `cv` / `cases` / `stack` read resolved data (siteConfig,
  layout-passed cases, arsenal) so people can reach out (owner's CV ask). Only
  the `whoami` 3-line bio stays `[TODO-CONTENT]` (`site.ts` `terminalBio`; PRD
  A.5 has a draft). `sudo hire-me` uses the resolved name. This deviates from the
  Phase-5 prompt's literal "socials `[TODO-CONTENT]`" — owner-confirmed.
- **Renames (CLAUDE.md):** prompt `moksite@cmd:~$`, boot `MOKSITE OS v1.0 — …`.
- **Cases passed from the server layout** to the client terminal (`getAllCases`
  is fs-bound and can't run client-side).
- **`sudo hire-me`** is the `sudo` command with arg dispatch (`registry` keys by
  the first token).
- **Minimal `not-found.tsx`** added now to wire the 404 discovery hint; full 404
  visual polish is Phase 6/7.
- **Initial JS on `/` is 181 KB gz — 1 KB over the 180 target** (the shared
  terminal launcher in the root layout). The terminal itself is a correctly-lazy
  3 KB chunk. 181 is within the enforced +20%-regression gate (216 KB). The clean
  fix — lazy-load gsap/lenis so they leave the shared bundle (~30 KB headroom) —
  is deferred to the Phase 7 perf pass rather than risk a motion-layer refactor
  late in Phase 5.

## Phase 4 — 3D cold open

- **three/@react-three/fiber are code-split into a lazy chunk** imported only via
  `dynamic(() => import("CityScene"), { ssr: false })` inside HeroGate, so they
  never enter the initial bundle (§8 ≤ 180 KB gz initial). **No `@react-three/drei`**
  (keeps the 3D chunk ≤ 450 KB gz; drei is listed in §7.2 but using it is optional).
  `@types/three` added (dev-only type defs).
- **Hero consolidated into `HeroGate`** (poster + overlay + skip + hotspot +
  CSS-rain fallback + 3D mount + lightning); `HeroPoster` removed.
- **Lightning + the lit-window hotspot are DOM, not WebGL** — accessibility
  (focusable `<button>` + aria-label) and keeps the GL scene minimal. The hotspot
  calls the store `openTerminal()` (terminal UI lands in Phase 5).
- **Pause = `<Canvas frameloop="never">`** when the hero is off-screen
  (IntersectionObserver) or `document.hidden` (§8).
- **`deviceMemory` undefined is treated as capable** — only an explicit `< 4`
  gates the 3D scene out.
- **Poster** is generated headlessly from the finished scene (Chromium +
  SwiftShader) → 1600w AVIF/WebP at `public/poster/hero.avif`, wired via
  `next/image` (replaces the Phase-2 SVG placeholder). Conversion uses `sharp`
  (added as a devDep — already a transitive Next dependency).

## Content pass — real CV content (16 Jun 2026)

Resolved the site content from the owner's final CV (Technical Product Manager;
`docs/cv-master.pdf`, git-ignored per §A.6). §A.6 applied throughout:

- **No phone number** anywhere on the site.
- **Employer revenue is relative-framed, not exact:** Vibrant Lane → "roughly
  10× in two months"; the Integer launch → "a launch-week pipeline of enquiries
  and the first direct course sales" (no £ figure / enquiry counts).
- **The candidate's own contribution metrics are verbatim** from the CV (93%
  adoption, 20→5 min / −75%, zero data loss, 95% accuracy, 1,200 learners,
  3 centres / 1,700+ patients, 43% cost reduction).
- **Internal employer tools are described functionally, not named** (e.g. the
  "Deal Generator" → "a companion tool for configurable-deposit payment links").
- The 3 placeholder cases were replaced by the **5 real cases**; origin (PRD A.2
  draft) and the arsenal skill names were seeded; the dossier
  experience/skills/education were filled.
- **Still [TODO-CONTENT]:** case covers/screenshots, the origin portrait, the
  public `/cv.pdf` (a phone-free designed export the owner supplies), and most
  arsenal "field-use" voice lines (the agent does not improvise copy-deck voice).

## Phase 3 — Case files

- **OG fonts bundled (OFL).** `src/og-fonts/{Anton-Regular,IBMPlexMono-Regular}.ttf`
  are committed and read via `fs.readFile(process.cwd()/…)` in the next/og routes
  (no build-time network). Both are Open Font License — embedding is permitted.

- **Speed-line zoom = case entry.** Moved from the Phase-2 Cases-panel-enter
  preview to the folder click (`CaseIndex` overlay). Motion off / no-JS → the
  `<Link>` navigates directly; the Cases panel entrance is now a plain reveal.

- **Per-case `CreativeWork` JSON-LD** added on `/case/[slug]` (the §10 item
  deferred from Phase 1). A **default OG card** is added at
  `src/app/opengraph-image.tsx` (§10).

- **Placeholder covers/screenshots render placeholder frames** in fixed
  aspect-ratio boxes (CLS-safe); real images use `next/image` once supplied.
  `isPlaceholder()` is exported from `content.ts` so no literal `[TODO-CONTENT]`
  string appears in scanned `src/app` source.

## Phase 2 — Comic shell & scroll engine

- **Transition devices are not scroll-pinned (owner-approved).** §5.2 allows brief
  panel pinning, but pinning is the documented Safari/anchor-bug risk and directly
  threatens two acceptance criteria (deep-links land + zero console errors). The
  three devices are implemented as scroll-/enter-driven overlays instead: gutter
  wipe (Origin, Signal), halftone dissolve (Arsenal), speed-line zoom (Cases
  preview). Speed-line's real trigger — entering a case — is wired in Phase 3.

- **Panel reveal is visible-by-default.** Content renders visible in SSR HTML;
  GSAP only hides+reveals it when motion is enabled (works with JS off and under
  reduced motion). One `gsap.context` per panel, reverted on cleanup/toggle.

- **New component dirs `sections/` and (implicit) reveal logic.** §7.3 lists
  `hero/`, `cases/`, `contact/`, `panels/`, `ui/`, `terminal/`; the page sections
  (Origin/CaseFiles/Arsenal/Signal) live in a new `src/components/sections/` dir.

- **Placeholder content stays in `site.ts` / cases, not in components**, so the
  CONTENT-TODO generator keeps tracking it (origin = 3× [TODO-CONTENT]; arsenal =
  4 groups × [TODO-CONTENT] item). Hero poster is an original noir SVG
  (`public/poster/hero-placeholder.svg`); the real AVIF poster + R3F scene = Phase 4.

- **Deps added (all §7.2):** `gsap`, `lenis`, `zustand`, `lucide-react`, dev
  `@playwright/test`.

## Phase 1 — Content backbone

- **siteConfig seeded from Appendix A.1 (owner-approved, 16 Jun 2026).** Personal
  identifiers (name, role, strapline, email, GitHub, LinkedIn) are seeded from the
  PRD's resolved Appendix A.1 / §6.3, since JSON-LD `Person` and SEO metadata
  require a real name + valid social URLs. This copies facts already in the
  committed PRD — not fabrication. All other content (case metrics/copy, origin,
  arsenal field-use lines, dossier body, cv.pdf) stays `[TODO-CONTENT]`.

- **Zod 4 url validator.** `caseSchema` uses top-level `z.url()` (Zod 4) in place
  of the deprecated `z.string().url()` from the §6.1 snippet — identical
  validation, current API (verified via Context7).

- **Image-existence check skips placeholders.** `cover`/`images[].src` values that
  are empty or contain `[TODO-CONTENT]` are not existence-checked (the CONTENT-TODO
  generator tracks them). Concrete-but-missing image paths still fail the build, as
  §6.1 requires.

- **CONTENT-TODO generator scope.** Scans only `content/`, `src/content/`, and
  `src/app/`, so the marker-handling code in `src/lib`, the generator script, and
  the literal marker inside `docs/` are not falsely listed.

- **Per-case `CreativeWork` JSON-LD deferred to Phase 3.** Phase 1 ships the
  `Person` JSON-LD on `/` and `/dossier`; per-case `CreativeWork` (§10) lands with
  the case-detail pages in Phase 3.

## Phase 0 — Foundations

- **Deployment deferred to the end of the project (owner direction, 16 Jun 2026).**
  PRD §14 Phase 0 calls for a hello-world preview deploy. Per the owner's
  instruction, all hosting/deploy work — host selection, the preview deploy, and
  production — is deferred until the entire site is built and verified locally.
  All other Phase 0 acceptance criteria are met and verified on localhost; the
  preview deploy and the GitHub Actions "CI green" check will be completed in the
  final hosting step. Host must support Next server functions for `/api/contact`.

- **Design-token naming bridge.** §4 tokens are declared in `@theme` under the
  `--color-*` namespace (so Tailwind v4 generates `bg-ink`, `text-signal`, …).
  Short aliases (`--ink: var(--color-ink)`, etc.) are added in `:root` so the
  PRD's literal `var(--signal)`/`var(--bone)` spellings (§4.1, §4.3) also
  resolve. Values are unchanged; both spellings point to the same color.

- **CSP deferred to Phase 7.** `next.config.ts` ships the static §7.6 security
  headers plus `Content-Security-Policy: frame-ancestors 'none'`. The full
  `default-src 'self'` policy is deliberately deferred — §7.6 itself says to
  verify the exact CSP against the deployed bundle in Phase 7 (Next's inline
  runtime needs care).

- **CI runs on Node 22; local dev currently Node 20.** CI pins Node 22 LTS per
  §7.1. The developer machine is on Node 20.18 at time of scaffolding — Next 15
  builds fine on it, but upgrading to Node 22 locally is recommended.

- **Type scale uses semantic token names.** §4.2's px scale is implemented as
  named Tailwind text tokens (`text-caption`/`text-meta`/`text-body`/
  `text-body-lg`/`text-h3`/`text-h2`/`text-h1`/`text-display`) rather than
  overriding Tailwind's default `text-xs…` keys, to avoid silently changing
  default sizes. `text-display` clamps 96→48px on mobile per §4.2.

- **No new dependencies beyond §7.2.** Phase 0 installs only the scaffold deps
  (next/react/tailwind/eslint/typescript) plus `prettier` (listed in §7.2 dev
  deps). Other §7.2 libraries are added in the phases that use them.

- **Build script uses Turbopack** (`next build --turbopack`) as emitted by
  `create-next-app` for Next 15.5. Revisit if any later-phase library (e.g.
  three.js bundling in Phase 4) misbehaves under Turbopack.
