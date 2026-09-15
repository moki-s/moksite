# Decisions log

Accepted deviations from the PRD and one-line justifications for anything that
needs explaining (per CLAUDE.md / PRD §0.3). Newest first.

## Finalisation — Vercel target, CV, case order, owner-shown data (16 Sep 2026)

- **Deploy target is Vercel (supersedes the Phase 0 "deploy deferred" + the GitHub
  Pages workflow).** The app has a server route (`/api/contact`), which static Pages
  can't run — the Pages workflow deleted `src/app/api` and degraded the form to
  `mailto`. Removed `.github/workflows/deploy.yml`; the full server feature set
  (contact email, §7.6 headers + CSP) now ships. `NEXT_PUBLIC_SITE_URL` must be set
  in Vercel env or OG/sitemap/canonical fall back to `localhost` (see README).
- **CV supplied (interim).** `public/cv.pdf` added so the `cv` command, footer,
  `/dossier` and contact CTA resolve. Owner will replace with a final CV later.
- **Visible cases renumbered 1–3.** `order` set to 1 (Learning Machine), 2
  (Conversion Engine), 3 (Stance) after the two hidden cases were pulled, so the
  splash reads CASE 001/002/003 with no gaps.
- **Conversion Engine evidence shown un-redacted (owner-directed).** At the owner's
  explicit instruction ("show as is… they are only names"), the Reports and Pipeline
  shots display real lead + agent names. The CRM dashboard keeps its revenue figure
  blurred (§A.6). ⚠️ These are real third-party names (the employer's leads); the
  owner accepted this before public deploy — GDPR/consent is the owner's call. The
  Pipeline shot also shows the internal `crm.integertraining.com` URL in the browser
  chrome (offered to crop; owner chose to keep as-is).

## Content pass — portrait, case imagery, hidden cases (15 Sep 2026)

- **Origin portrait supplied.** A real photo, treated to the §5.3 spec — ink/bone
  **duotone** via an inline SVG filter (grayscale → shadows=`--ink`, highlights=
  `--bone`), pre-desaturated and compressed to 157 KB webp (§8 ≤200 KB), with a
  theatrical inset-`--ink` vignette (a shadow, not a gradient). Replaces the
  `PORTRAIT` placeholder in `Origin.tsx`.
- **Case imagery = real product screenshots, redacted.** Cases 1, 4 and 5 now ship
  real cover + evidence shots (Pearl LMS, Pearl CRM, Stance Health). All PII —
  learner/lead/patient names, emails, phone numbers, staff/consultant names — is
  **blurred** (sharp: extract region → gaussian blur σ18–26 → composite at full
  res, then downscale). Employer aggregate financials are blurred too, per §A.6
  (relative-framed revenue). Images are webp, 14–67 KB each (well under §8). No
  fabricated UI: where a screen was confidential the case would run copy-only —
  none needed that here.
- **webp, not avif.** §6.1's comment shows `cover.avif`; shots ship as `.webp`
  (schema is `z.string()`, only existence is enforced). webp is smaller here and
  universally supported; avif conversion can happen in the final asset pass.
- **Two cases hidden pending replacement (owner direction).** `the-dictation-job`
  and `vibrant-lane` moved to `content/cases/_hidden/` — the loader only reads
  top-level `.mdx`, so they vanish from the index, sitemap, dossier and their
  detail routes 404. Files are preserved for the owner's replacements. The
  CONTENT-TODO generator now skips `_hidden/` so drafts don't block the launch
  gate. Remaining `[TODO-CONTENT]`: arsenal field-use lines + `whoami` bio only.
- **Arsenal one-liners + `whoami` bio drafted by the agent (owner-directed).** §A.4
  and the `site.ts` note reserve the noir "field-use" voice for the owner ("the
  agent does not improvise copy-deck voice"). The owner explicitly directed the
  agent to draft them "humanised and nice" (15 Sep 2026), which overrides that
  default. Lines match the seeded voice ("SQL — gets confessions out of
  databases."); the `whoami` bio uses only facts already in the origin copy / CV —
  no fabrication. Owner to review/tweak. `CONTENT-TODO.md` now shows **zero** items.
- **Case covers refreshed.** Case 1 (LMS) and Case 4 (CRM) covers swapped to the
  cropped brand hero panels the owner supplied (cleaner than the full login
  screenshots). Case 4's leads-table evidence shot replaced with the Reports &
  Analytics screen (agent names redacted) at the owner's request.
- **Stance dashboard shows a demo tenant (0 patients / ₹0).** The unified-dashboard
  evidence shot is from a sandbox instance; the case's 1,700+ patients / 3 centres
  live in the OUTCOME copy (real deployment). Flagged to owner — swap for the
  branded sign-in shot if the empty state reads as inconsistent.

## Noir mood pass (within §4 tokens)

- **Deepened mood, zero new hues.** Static theatrical **vignettes** on the hero and
  panels (inset translucent `--ink` `box-shadow` — a *shadow*, not a gradient),
  **rain intensity** up (length 0.55→0.68, opacity 0.25→0.30; segment count stays
  at the **400 cap**, §8), **grain** trimmed 0.035→0.03 (to the §4.5 3% cap). Panel
  halftone was already at the §4.5 **6% cap** (unchanged).
- **Held the brief's fog-densening + further window-dimming.** The city is
  geometrically identical to the original (`h = 1.6 + rng()*5.4`, fog 8–30, camera
  unchanged) but *reads* compressed because the windows were already dimmed and the
  central beam dominates — thickening fog / dimming further would worsen that.
  Deferred to the dedicated buildings pass.
- **Reduced-motion (§9):** no new motion — vignettes/grain are static. **Amber
  audit:** hero stays ≤ 2 prominent amber (searchlight beam+M + strapline); this
  pass added no amber. Vignette = a deliberate, owner-approved use of translucent
  `--ink` as a shadow (consistent with the CRT vignette already in the codebase).

## Hidden-object hunt + `vigilante` command

- **Site-wide hover-to-spot game (§11).** 7 original-noir DOM hotspots (detective,
  lit windows, cats, a neon sign, a doorway figure) overlaid per panel as focusable
  `<button>`s drawn in inline SVG — **not 3D meshes**, to protect the §8 3D budget
  and keep them keyboard-accessible. The found set persists in localStorage so it
  survives navigating into a case and back. Each find fires `easteregg{id}` (§11,
  id only, no PII).
- **`vigilante` extends §5.7's "exact (v1)" command set.** It is registered in the
  terminal registry but **hidden from `help` + tab-complete and treated as an
  unknown command until all 7 props are found**; on unlock it prints an original
  noir ASCII + a dry one-liner. Intentional, owner-requested deviation from §5.7.
- **A11y (§9, §4.3):** hotspots are the last child of each panel, so the
  skip-to-content link stays first and they sit after each panel's content in tab
  order; each has a descriptive `aria-label` + `aria-pressed` + the global focus
  ring. Reduced-motion → instant found state (no glow / flicker / stamp animation).
  The tally is `role="status" aria-live="polite"`, revealed after the first find,
  fixed below the sticky-nav z-index.
- **No new deps; persisted state guarded by a `useMounted()` hook** so SSR/first
  paint render the unfound state and there's no hydration mismatch.
- **Props are genuinely hidden (flashlight reveal).** On desktop + motion, props
  are invisible until a cursor-tracked **bone light pool** sweeps near them (props
  fade in by distance; hovering collects). The torch is a soft radial light pool
  (`mix-blend: screen`, GPU transform, rAF-throttled) active only while the hunt is
  unfinished. Touch / reduced-motion / no-JS fall back to *camouflaged-visible*
  props (faint, ~0.4) so they stay findable. The torch + per-prop reveal are a
  deliberate **§4.1 "no gradients" deviation** (a light effect, not a UI gradient);
  **cool bone** keeps §4 "amber is earned" intact (owner-approved).

## Searchlight polish — cinematic beam + projected "M"

- **§15 / §5.1 amended (owner-approved).** The original rule was "searchlight
  projects nothing / no logo or emblem." The owner directed it to project an
  **original "M" monogram** (their initial). IP-safe (no franchise asset), rendered
  as a **bare letterform — no shield, circle, or enclosure** — so it reads as a
  projected letter, not a logo lockup or bat-signal-style emblem.
- **Cinematic beam, no new deps.** Nested additive `MeshBasicMaterial` cones
  (core + volumetric falloff through the fog) + an eased ~14 s edge-dwell sweep;
  the city's lit-window emissive is dimmed so the beam dominates (§4). **No
  postprocessing** — `@react-three/postprocessing`/`drei` would be new deps; the
  bloom/gobo is faked with core `three` only.
- **The "M" is a gobo, not a bright glyph.** A runtime `CanvasTexture` (a soft
  vertical light band with the bare "M" carved out via `destination-out`) on an
  additive billboarded `Sprite`, peaking in opacity at the crest. `SpotLight.map`
  (a true gobo) needs lit materials + a shadow camera, but the scene is unlit
  `MeshBasicMaterial` and drei is a new dep — so the gobo-sprite is the no-dep path
  (confirmed via Context7). The band texture is a **light glow, not a UI gradient**
  — §4.1's no-gradient rule governs flat comic surfaces, not the 3D light source.
- **Poster regenerated** from the upgraded scene via `scripts/generate-poster.mjs`
  (playwright + sharp — existing devDeps). A `?poster=1` hook (`HeroGate`) forces
  the scene on and freezes the beam at its crest with the M centred for a
  deterministic 1600w AVIF capture (the LCP + mobile/no-WebGL fallback).
- **Reduced-motion (§9):** the 3D never runs under reduced-motion (→ poster), so
  the "static lit cone with the M" is the regenerated poster — no sweep.

## Phase 7 — Hardening & launch

- **3D cold-open gated to desktop-class devices.** Phones, tablets, touch and
  low-power devices, and viewports < 1024 px now keep the poster (the LCP element
  and the §16 fallback). A continuously-animating WebGL hero saturates a
  CPU-throttled mobile main thread: measured mobile **TBT 4.8 s → 90 ms** and
  **perf 0.48 → 0.94** after gating. The 3D remains the desktop experience
  (gate: motion on · ≥4 GB · ≥4 cores · `pointer: fine` · ≥1024 px · WebGL2).
  (§5.1, §16, §2)
- **Final CSP shipped** (`next.config.ts`): `default-src 'self'`; `img-src 'self'
  data:`; `font-src 'self'`; `connect-src 'self'`; `object-src/frame-ancestors
  'none'`; `base-uri/form-action 'self'`. A statically-rendered site can't mint
  per-request nonces, so `script-src`/`style-src` use `'unsafe-inline'` —
  accepted trade-off. Plausible's origin is appended only when
  `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set. (§7.6)
- **Chanel pass — removed the 3D planar reflection** (one effect cut for noir
  restraint + a small perf win). (§14)
- **Hero `<h1>` entrance is scale-only (no opacity gate)** so the LCP text paints
  at first paint instead of waiting for the JS-driven fade.
- **Blood-as-text now uses `--blood-bright` (#e35345, ≥4.5:1 on ink)** for
  `case-nda`, terminal error tone, and form errors; `--blood` stays for
  fills/borders. The footer "psst" hint moved to rain @ 90%. Fixes the only axe
  color-contrast violations; the suite is now zero critical/serious. (§9)
- **`/dev/tokens` removed.** (§14)
- **CI gates locked & blocking** (`ci.yml`): Playwright **chromium + webkit** +
  `@axe-core/playwright` (zero critical/serious) + **Lighthouse CI** asserting §2
  (perf ≥ 0.85 mobile, a11y ≥ 0.95, SEO = 1.0; LCP ≤ 2.5 s as a *warn*). New dev
  deps `@axe-core/playwright`, `@lhci/cli` recorded per §0.3. (§12)
- **LCP note:** the local `simulate`-throttled lab LCP is 2.7–3.0 s (the model is
  deliberately pessimistic; perf *score* is 0.93–0.97). §2's "LCP ≤ 2.5 s on
  mid-range mobile" is to be confirmed on the **production URL** (real device +
  CDN) per the launch checklist, not on localhost.

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
