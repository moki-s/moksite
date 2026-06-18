# PRD — Project NIGHTFRAME (v2.1, build-ready)
## A noir comic-book portfolio with a hidden Command Center

**Status:** Approved for build · **Owner:** Mokshith Sanga · **Revision:** v2.1 — placeholders resolved from master CV (see Appendix A)
**Concept:** Cinematic comic-scroll site ("The Dark Issue") + hidden lair terminal ("The Command Center").
**This document is the single source of truth.** It is written to be executed end-to-end by an AI coding agent (Claude Code, Codex, or Antigravity) working phase by phase with a human in the loop.

---

## 0. How to use this document with a coding agent

### 0.1 Repo bootstrap (do this once, by hand)
1. Create a private GitHub repo `nightframe`.
2. Commit this file as `docs/PRD.md`.
3. Create an agent instructions file at the repo root and keep it short — it should point to the PRD, not duplicate it:
   - Claude Code reads `CLAUDE.md`; Codex and Antigravity read `AGENTS.md`. Create **both** with identical content so you can switch tools freely. (For tool-specific configuration, check each tool's current docs — e.g. https://docs.claude.com/en/docs/claude-code/overview for Claude Code — as conventions evolve.)

```md
<!-- CLAUDE.md and AGENTS.md (identical) -->
# NIGHTFRAME — agent instructions
- The spec is docs/PRD.md. Read the referenced sections before any task. The PRD always wins over your defaults.
- Work on exactly ONE phase (PRD §14) per session. Do not start the next phase.
- Definition of done for every task: `pnpm typecheck && pnpm lint && pnpm build` pass, plus the phase's acceptance criteria in PRD §14.
- Design tokens (§4), copy deck (§6.4), and budgets (§8) are law. Do not invent colors, fonts, copy, or libraries.
- Anything marked [TODO-CONTENT] is the human's job. Insert the marker, never fabricate personal facts, metrics, or testimonials.
- Never commit secrets. Env vars are listed in PRD §7.5.
- If the PRD is ambiguous or you must deviate, stop and ask. Log accepted deviations in docs/DECISIONS.md.
```

### 0.2 Working rhythm
- One phase per session/PR. Review the preview deploy yourself before merging — your eyes are the final QA gate.
- Kickoff prompt template: *"Read docs/PRD.md §0, §4, and §14 Phase N. Implement Phase N only. Stop when its acceptance criteria pass and list what you verified."*
- Keep `docs/DECISIONS.md` (deviations) and `docs/CONTENT-TODO.md` (auto-generated list of unresolved `[TODO-CONTENT]` markers — Phase 7 blocks launch until empty).

### 0.3 Hard rules for the agent (career-protection clauses)
1. **No fabrication.** Never invent projects, metrics, employers, testimonials, or quotes. Real career stakes: a fabricated metric discovered by a recruiter is fatal.
2. **No IP violations.** §15 is non-negotiable; when in doubt, redesign.
3. **No new dependencies** beyond §7.2 without flagging in DECISIONS.md with a one-line justification.
4. **No copied code/assets** from other portfolios. Inspiration ≠ duplication.
5. **Budgets are gates,** not goals (§8). A feature that breaks a budget gets descoped, not the budget.

---

## 1. Vision

The portfolio reads like the first issue of a noir graphic novel about a product builder for hire — a PM who doesn't just write the PRD, but ships the software himself with AI agents at his side. Visitors scroll through a rain-soaked night city rendered in ink and halftone; projects are **case files**, the about section is an **origin**, the CV is a **dossier**, contact is **sending a signal**. Hidden beneath the comic is a working terminal — the **Command Center** — rewarding curious visitors (especially technical recruiters) with a second way to explore everything. The terminal is not just an easter egg here: it *is* the positioning ("I build with AI agents") made tangible.

One-sentence pitch: *a portfolio you read like a comic and hack like a terminal.*

**Why it wins:** memorable enough to be shared, still scrollable like a normal site (recruiters in a hurry are never blocked), and the terminal demonstrates engineering skill without forcing it on anyone.

### Non-goals (v1)
No playable 3D world (see Project NIGHT PATROL, separate doc). No CMS/blog. No sound (v1.1 toggle at most). No i18n. No dark/light theme switch — the site *is* dark; `theme` in the terminal toggles a high-contrast accessibility mode only.

---

## 2. Audience, goals, success metrics

| Audience | Need | Success |
|---|---|---|
| Recruiters / hiring managers | Skim work + CV in < 90 s | Case file or CV reachable in ≤ 2 interactions from load |
| Freelance clients | Trust, proof, easy contact | Contact reachable from any scroll position |
| Fellow devs (secondary) | Something to admire & share | They find the terminal and share the site |

**Measurable targets:** Lighthouse Performance ≥ 85 mobile / ≥ 95 desktop; Accessibility ≥ 95; SEO = 100. LCP ≤ 2.5 s on mid-range mobile. "Skip the intro" visible ≤ 1 s after load. ≥ 3 distinct paths to contact (nav, footer, terminal). Zero console errors in production.

---

## 3. Information architecture & routes

| Route | Purpose | Rendering |
|---|---|---|
| `/` | Issue #01 — main scroll (Panels 0–5) | SSG |
| `/case/[slug]` | Case file detail | SSG from MDX |
| `/dossier` | Full CV — plain, fast, printable | SSG |
| `/not-found` (404) | "PAGE REDACTED." + terminal hint | static |
| `/api/contact` | POST — contact form handler | route handler |
| `/case/[slug]/opengraph-image` | Per-case OG image | next/og |
| `/sitemap.xml`, `/robots.txt` | SEO | `sitemap.ts`, `robots.ts` |

**Main scroll panels:**
`Panel 0` Cold open (3D city hero) → `Panel 1` Origin (short about) → `Panel 2` Case Files (project index) → `Panel 3` The Arsenal (skills) → `Panel 4` Field Reports (testimonials — **cut the panel entirely if no real ones exist**) → `Panel 5` Send a Signal (contact) → Footer.

Each panel has an `id` (`#origin`, `#cases`, `#arsenal`, `#signal`) for deep links; sticky top nav (mono, tiny) appears after Panel 0 with those four links + `DOSSIER`.
The Command Center is an overlay, not a route (§5.7).

---

## 4. Design system (law — do not improvise)

### 4.1 Color tokens
| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0B0E13` | Base background (near-black, blue undertone) |
| `--midnight` | `#141B2D` | Panel backgrounds, city silhouettes |
| `--rain` | `#8A93A6` | Secondary text, hairlines, halftone dots |
| `--bone` | `#E8E4D8` | Primary text, "paper" surfaces |
| `--signal` | `#F5A623` | THE accent — searchlight amber: CTAs, links, terminal text, focus rings |
| `--blood` | `#C0392B` | Sparse danger accent: stamps, redactions — max one element per viewport |

Rules: amber is earned — if a viewport has > 2 amber elements, cut one. No gradients anywhere. No other hues, ever.

### 4.2 Typography (exactly three families, self-hosted via `next/font/google`)
- **Display:** `Anton` (400 only) — caps, tracking `-0.01em`, used for panel headlines, hero name, big metrics. Poster lettering, not "comic font". Never use for body text.
- **Body:** `IBM Plex Sans` (400, 600) — 16–18 px, `--bone` on `--ink`, line-height 1.6, max measure 68ch.
- **Utility/terminal:** `IBM Plex Mono` (400, 500) — caption boxes, metadata, eyebrows, the entire Command Center. Eyebrow style: 12px, uppercase, tracking `0.12em`, `--rain`.
- Subset to `latin`, `display: swap`, preload display + body. Type scale (px): 12 / 14 / 16 / 18 / 24 / 36 / 56 / 96(clamp on mobile to 48).

### 4.3 Structure tokens
- Radius: `0` everywhere except terminal window `6px`. Borders: panel ink border `5px solid var(--bone)` with SVG `stroke` irregularity filter (subtle, ±1px wobble); hairlines `1px solid color-mix(in srgb, var(--rain) 35%, transparent)`.
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 40 / 64 / 96 / 144. Panel gutters: `24px` mobile / `48px` desktop of pure `--ink`.
- Z-index scale: content `0` · stamps `10` · sticky nav `40` · terminal `50` · lightning flash `60` · skip-intro `70`.
- Focus style (global): `outline: 2px solid var(--signal); outline-offset: 3px;` — visible on every interactive element, no exceptions.

### 4.4 Motion tokens (single source: `src/lib/motion.ts`)
| Token | Value | Use |
|---|---|---|
| `dur.flash` | 0.12s linear | lightning |
| `dur.micro` | 0.2s `power2.out` | hovers, links |
| `dur.stamp` | 0.3s `back.out(2)` | CLASSIFIED stamp |
| `dur.enter` | 0.6s `power3.out` | panel content reveals |
| `dur.wipe` | 0.45s `power4.inOut` | gutter wipes |
All GSAP timelines must consume these tokens. `prefers-reduced-motion` ⇒ every duration becomes 0.15s fade max and all pinning/parallax is removed (§9).

### 4.5 Signature components
- **`<Panel>`** — full-viewport comic panel: ink border, `--midnight` fill, halftone overlay (SVG dot pattern, 6% opacity max), eyebrow slot (`PANEL 02 — CASE FILES`), children.
- **`<CaptionBox>`** — mono caps in a `--bone`-bordered box on `--ink`, used for narration ("ISSUE #01 — SCROLL TO BEGIN").
- **`<Stamp text="CLASSIFIED">`** — `--blood` bordered rubber-stamp, rotated −4°, `dur.stamp` entrance.
- **Onomatopoeia** — used at most **twice** on the whole site (one `KRAK—` with hero lightning, one optional elsewhere). Hard cap; noir restraint is the brand.
- Texture: one full-viewport film-grain overlay, 3% opacity, `pointer-events:none`. Rain particles exist only in the hero.
- Icons: `lucide-react`, 1.5px stroke, `--rain` default.

---

## 5. Feature specifications

### 5.1 Panel 0 — Cold open (3D hero)
**Scene (R3F), in one sentence:** a low-poly night city skyline in `--midnight` silhouettes under fog, rain falling, one amber searchlight cone sweeping the sky, one lit window glowing amber.
- **Build the city procedurally — no Blender required:** 3 depth rows of instanced box buildings (~60 instances total) with slight height/width jitter (seeded random — same skyline every visit); emissive "windows" via a tiny generated canvas texture (random lit windows, ~8% lit, amber tint); `fog(--ink, 8, 30)`; ground plane with faint reflection (cheap: planar mesh, 0.06 opacity copy — skip real reflections).
- **Rain:** GPU-instanced ≤ 400 short line segments cycling downward; opacity 0.25.
- **Searchlight:** nested additive cones (a solid-reading shaft falling off through the fog), slow **eased** sweep (~14 s loop, lingers at the arc edges), pointing at empty sky. It projects **one original mark only — the owner's stylised "M" monogram** as a faint negative-space stencil, brightest where the beam crests; **never a franchise emblem** (§15, owner-approved amendment).
- **Lightning:** on first load only — a 120 ms `--bone` full-screen flash (z-60) that silhouettes the city, with a small `KRAK—` caption; never repeats in-session (Zustand flag).
- **The lit window** is a clickable/focusable hotspot (`aria-label="A lit window. Something hums inside."`) → opens the Command Center (§5.7 discovery path 2).
- **Camera:** static framing; pointer parallax ±3° (lerped); on mobile no gyroscope in v1 (avoid permission prompts).
- **Overlay:** `MOKSHITH SANGA` in Anton 96/48px with an ink-stamp entrance (scale 1.06→1, opacity, `dur.enter`), strapline below in mono: `PRODUCT MANAGER · AI-NATIVE BUILDER · UNITED KINGDOM` (resolved — Appendix A.1), then `<CaptionBox>ISSUE #01 — SCROLL TO BEGIN</CaptionBox>` with a slow pulse.
- **Skip:** `SKIP THE INTRO →` button, top-right, z-70, rendered in initial HTML (visible ≤ 1 s), smooth-scrolls to `#cases`, focusable first in tab order after the skip-to-content link.
- **Loading/gating (`<HeroGate>`):** render order = poster image (the LCP) → if `prefers-reduced-motion` or `navigator.deviceMemory < 4` or no WebGL2 → stay on poster + CSS rain (animated SVG, same art direction); else lazy-load the 3D chunk and crossfade in. Poster: a 1600w AVIF/WebP screenshot of the finished scene (produced in Phase 4), `priority`, `fetchpriority=high`.

### 5.2 Scroll engine
- Lenis smooth scroll + GSAP ScrollTrigger, mounted once in `<MotionProvider>` (registers plugin, drives Lenis via `gsap.ticker`, cleans up on unmount; one `gsap.context` per panel component).
- Panels pin **briefly** (max 0.5 viewport of scroll distance) during transitions; rotation of exactly three devices: (1) gutter wipe — black bars close/open like a page turn, (2) halftone dissolve (animated mask), (3) speed-line zoom (entering a case only).
- Anchor/deep-link scrolls (`#cases` etc.) must bypass pinning math correctly — test this explicitly.
- Reduced motion ⇒ Lenis disabled (native scroll), no pins, fades only (§9). This is a first-class mode: same content, same order.

### 5.3 Panel 1 — Origin
80–120 words, first person, noir caption voice, set in 2–3 `<CaptionBox>` blocks over a faint city-silhouette backdrop. Ends with name + role sign-off and a small portrait: a high-contrast ink-style treatment of a real photo (original artwork — duotone `--ink`/`--bone`, halftone; never traced from any comic). `[TODO-CONTENT: origin copy + photo]`.

### 5.4 Panel 2 — Case Files (index) and `/case/[slug]` (detail)
**Index:** a vertical stack of manila folders (`--bone` paper, ink edges). Each folder: mono metadata line `CASE 003 · 2025 · STACK: NEXT/POSTGRES · STATUS: SHIPPED`, title in Anton, and a `<Stamp>CLASSIFIED</Stamp>`. Hover/focus/touch: folder lifts 4px, stamp rotates to −1° and fades to 25%, revealing a one-line summary. Click/Enter → speed-line zoom transition → route.
**Detail template:**
1. **Splash page** — full-bleed cover image inside one giant panel; title; mono metadata strip.
2. **THE BRIEF** — the problem, ≤ 80 words.
3. **THE OPERATION** — what you built; 2–4 screenshots in panel frames with mono captions; stack chips.
4. **THE OUTCOME** — 1–3 real metrics as Anton numerals with mono labels. *(No real metric → say something honest and concrete instead: "shipped to production, used daily by N-person team." Never invent numbers.)*
5. **EVIDENCE** — live link + repo as amber buttons (omit gracefully if private; label `SOURCE SEALED — NDA`).
6. Footer: `NEXT CASE →` (loops) + `RETURN TO ISSUE`.
v1 ships with 3–5 cases; every case needs `[TODO-CONTENT]` resolved before launch.

### 5.5 Panel 3 — The Arsenal
Equipment grid (2-col mobile / 4-col desktop): each item = lucide icon, name in mono, one-line "field use" (e.g. `TYPESCRIPT — primary sidearm. every project since 2021.`). Grouped: LANGUAGES / FRAMEWORKS / INFRA / TOOLS. **No skill bars or percentages.** `[TODO-CONTENT: real list + field-use lines]`.

### 5.6 Panel 5 — Send a Signal (contact)
- Searchlight motif: section starts dim; a soft amber radial spotlight follows the cursor (desktop) or fixes on the form (touch/reduced-motion). Form always ≥ AA contrast even "unlit".
- Fields: name (required, ≤ 100), email (required, valid), message (required, 20–2000 chars). Client + server validation with shared zod schema. Anti-spam: honeypot field (`company`, visually hidden, must be empty) + time-trap (reject < 3 s after mount) — no CAPTCHA in v1.
- Submit → `POST /api/contact` → Resend email to `CONTACT_TO_EMAIL`, reply-to = sender. States: loading (`TRANSMITTING…`), success (`SIGNAL RECEIVED. RESPONSE WITHIN 48 HOURS.`), failure (`SIGNAL LOST. USE THE DIRECT LINE BELOW.` — and the mailto link is right there).
- Below the form, always plain and ungimmicked: `mailto:` link, GitHub, LinkedIn, `DOWNLOAD CV (PDF)`. Footer repeats these site-wide.

### 5.7 The Command Center (terminal overlay)
**Discovery paths:** (1) backtick `` ` `` or Konami code anywhere; (2) the lit hero window (§5.1); (3) the 404 hint. A faint mono `psst — press [ ` ]` also sits in the footer, so it's findable without being loud.
**Presentation:** overlay slides up (z-50, `role="dialog" aria-modal="true" aria-label="Command Center"`), CRT styling — scanline overlay, very subtle vignette, `--signal` mono text on `--ink`, blinking block cursor. Boot text ≤ 1.5 s, skippable with any key. `Esc` always closes; focus trapped while open, restored on close. Body scroll locked.
**Prompt:** `nightframe@cmd:~$`
**Architecture:** pure-TS command registry — `type Command = { name: string; description: string; run: (args: string[], ctx: TerminalCtx) => Output | Promise<Output> }` in `src/components/terminal/commands/`, one file per command, registered in `registry.ts`. Output = array of typed lines (text / link / ascii). History (↑/↓), tab completion, `clear` supported. No fake latency beyond boot.
**Commands (v1, exact set):**
| Command | Output |
|---|---|
| `help` | Lists all commands with descriptions |
| `whoami` | 3-line bio `[TODO-CONTENT]` |
| `cases` | Table of case files: id, title, year |
| `open <id\|slug>` | Closes terminal, navigates to the case |
| `stack` | Arsenal as a tree |
| `cv` | Triggers `/cv.pdf` download + prints confirmation |
| `contact` | Prints email + closes terminal scrolled to `#signal` |
| `socials` | GitHub / LinkedIn links |
| `theme` | Toggles high-contrast mode (pure `--bone`/`#000`, motion off) — persists in `localStorage` |
| `sudo hire-me` | Prints a playful offer-letter template with `[CANDIDATE: your name]` pre-filled |
| `coffee` | Small ASCII coffee cup + `fuel acquired.` |
| `exit` / `Esc` | Close |
| unknown | `command not found — try 'help'. even vigilantes read the manual.` |
**Mobile:** opens full-screen with a horizontal tap-row of common commands above the keyboard (`help · cases · cv · contact · exit`) since typing is painful.

### 5.8 `/dossier` — the fast lane
Deliberately plain: no 3D, no scroll effects, system-fast. Full CV content in semantic HTML (h2 sections: Experience, Projects, Skills, Education, Contact), print stylesheet (`@media print`: black on white, no nav), `DOWNLOAD PDF` button → `/cv.pdf` (a real, designed PDF you supply — `[TODO-CONTENT]`). This page is the recruiter escape hatch and the SEO text backbone; link it from nav, footer, and terminal.

### 5.9 404
Centered: `PAGE REDACTED.` (Anton) / `This file never existed. Or someone wants you to think so.` (mono) / `RETURN TO ISSUE #01 →` / faint hint: `ACCESS DENIED? TRY THE BACK DOOR. [ ` ]`.

---

## 6. Content model, schemas, copy deck

### 6.1 Case frontmatter schema (zod, in `src/lib/schemas.ts`)
```ts
export const caseSchema = z.object({
  title: z.string().max(60),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  order: z.number().int(),          // display order
  year: z.number().int(),
  role: z.string(),                  // e.g. "Solo build" | "Lead frontend"
  status: z.enum(["shipped", "ongoing", "archived"]),
  stack: z.array(z.string()).min(1).max(8),
  summary: z.string().max(140),      // folder hover line
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).max(3),
  links: z.object({ live: z.string().url().optional(), repo: z.string().url().optional() }),
  cover: z.string(),                 // /images/cases/<slug>/cover.avif
  images: z.array(z.object({ src: z.string(), alt: z.string(), caption: z.string().optional() })).min(1).max(4),
});
```
MDX body = THE BRIEF / THE OPERATION prose. Pipeline: `gray-matter` + `next-mdx-remote/rsc`; `src/lib/content.ts` exposes `getAllCases()` / `getCase(slug)`, validates with zod at build time, **fails the build** on invalid frontmatter or a missing image file.

### 6.2 Other typed content (plain TS in `src/content/site.ts`)
`siteConfig` (name, strapline, email, socials, siteUrl), `arsenal: { group, items: {name, icon, fieldUse}[] }[]`, `origin: string[]`, `testimonials?: {quote, name, role}[]`. Seed all of these from **Appendix A** (resolved values from the master CV); remaining gaps stay `[TODO-CONTENT]`.

### 6.3 Content checklist (human homework — blocks launch)
- [~] 3–5 cases — **drafted in Appendix A.3 from the master CV**; still needed: 2–4 screenshots per case (AVIF, ≤ 200 KB, real alt text) and the disclosure check (A.6)
- [~] Origin copy — **drafted in A.2, needs Mokshith's edit/approval**; ink-treated portrait still needed
- [~] Arsenal — **seeded in A.4**; approve/adjust field-use one-liners
- [~] Dossier — source = master CV (public-safe version per A.6); designed `/cv.pdf` still needed
- [x] Name, strapline, email, socials — resolved (A.1); domain still needed
- [ ] Testimonials (2–3, real, with permission) — or delete Panel 4

### 6.4 Copy deck (use verbatim; agent never improvises voice)
Nav: `ORIGIN · CASES · ARSENAL · SIGNAL · DOSSIER` · Skip: `SKIP THE INTRO →` · Scroll cue: `ISSUE #01 — SCROLL TO BEGIN` · Panel eyebrows: `PANEL 01 — ORIGIN`, `PANEL 02 — CASE FILES`, `PANEL 03 — THE ARSENAL`, `PANEL 04 — FIELD REPORTS`, `PANEL 05 — SEND A SIGNAL` · Case sections: `THE BRIEF / THE OPERATION / THE OUTCOME / EVIDENCE` · Buttons: `OPEN CASE FILE`, `VIEW EVIDENCE`, `SOURCE SEALED — NDA`, `DOWNLOAD CV (PDF)`, `SEND THE SIGNAL` · Form states: §5.6 verbatim · Footer: `© [CURRENT YEAR] MOKSHITH SANGA. ALL CASES REAL. NO SIDEKICKS WERE HARMED.` + `psst — press [ ` ]` · Terminal boot: `NIGHTFRAME OS v1.0 — UNAUTHORIZED ACCESS DETECTED… just kidding. welcome, detective. type 'help' to begin.` · 404: §5.9 verbatim.
Voice rules: lowercase noir-wry in terminal; caps mono for captions; never exclamation marks; humor dry and sparse.

---

## 7. Technical architecture

### 7.1 Platform
Next.js 15 (App Router, React 19, TypeScript `strict`), static-first (SSG everywhere; only `/api/contact` is dynamic). Package manager: `pnpm`. Node 22 LTS. Deployed on Vercel.

### 7.2 Dependencies (complete list — anything else needs a DECISIONS.md entry)
`next react react-dom` · `three @react-three/fiber @react-three/drei` · `gsap` (GSAP and all its plugins are free since 2025 — use core + ScrollTrigger only) · `lenis` · `zustand` · `zod` · `gray-matter next-mdx-remote` · `resend` · `lucide-react` · `clsx tailwind-merge` · `tailwindcss` (v4, CSS-first `@theme` config carrying §4 tokens). Dev: `typescript eslint prettier @playwright/test @axe-core/playwright @lhci/cli`.

### 7.3 Repository layout
```
nightframe/
├─ CLAUDE.md  AGENTS.md  docs/{PRD.md,DECISIONS.md,CONTENT-TODO.md}
├─ content/cases/*.mdx
├─ public/{poster/,images/cases/<slug>/,cv.pdf,favicons/,og-default.png}
├─ src/
│  ├─ app/ layout.tsx page.tsx not-found.tsx sitemap.ts robots.ts
│  │   case/[slug]/{page.tsx,opengraph-image.tsx}  dossier/page.tsx  api/contact/route.ts
│  ├─ components/
│  │   panels/{Panel,CaptionBox,Stamp,Eyebrow}.tsx
│  │   hero/{HeroGate,CityScene,Rain,Searchlight,HeroPoster,Lightning}.tsx
│  │   cases/{CaseIndex,CaseFolder,Splash,Metric,Evidence}.tsx
│  │   terminal/{Terminal,Crt,registry.ts,commands/*.ts}
│  │   contact/{SignalForm,Spotlight}.tsx
│  │   ui/{Button,NavBar,Footer,SkipIntro,Grain}.tsx
│  │   MotionProvider.tsx
│  ├─ lib/{content,schemas,motion,seo,analytics,device}.ts
│  ├─ store/useAppStore.ts        # terminal open, lightning fired, high-contrast, reduced-motion override
│  └─ styles/globals.css          # @theme tokens from §4
├─ tests/e2e/*.spec.ts  lighthouserc.json  .github/workflows/ci.yml
```

### 7.4 `/api/contact` contract
`POST { name, email, message, company /*honeypot*/, t /*mount timestamp*/ }` → zod-validate; reject if `company` non-empty or `Date.now()-t < 3000` (return 200 silently — don't tip off bots); per-IP in-memory throttle 5/hour (best-effort; acceptable v1); send via Resend (verified domain, SPF/DKIM configured) → `202 {ok:true}` | `400 {ok:false, errors}` | `500 {ok:false}`. Never echo message content into logs.

### 7.5 Environment variables
| Var | Where | Purpose |
|---|---|---|
| `RESEND_API_KEY` | Vercel (secret) | email sending |
| `CONTACT_TO_EMAIL` | Vercel | your inbox |
| `NEXT_PUBLIC_SITE_URL` | all | canonical/OG/sitemap |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | all | analytics (omit locally) |
`.env.example` committed; real `.env.local` git-ignored.

### 7.6 Security headers (in `next.config.ts`)
`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` · `X-Content-Type-Options: nosniff` · `Referrer-Policy: strict-origin-when-cross-origin` · `Permissions-Policy: camera=(), microphone=(), geolocation=()` · `Content-Security-Policy: frame-ancestors 'none'` plus `default-src 'self'` with allowances only for Plausible's script/connect — verify the exact CSP against the deployed bundle in Phase 7 (Next inline runtime needs care; document final policy in DECISIONS.md).

---

## 8. Performance engineering (hard gates)

| Budget | Limit | Enforced by |
|---|---|---|
| Initial JS (before 3D chunk) | ≤ 180 KB gz | `next build` output reviewed each phase; CI fails on +20% regression |
| 3D chunk (three+fiber+scene) | ≤ 450 KB gz | dynamic import, `ssr:false`; bundle check |
| LCP (poster) | ≤ 2.5 s mobile | Lighthouse CI |
| CLS | < 0.05 | explicit dimensions on every image |
| Per screenshot | ≤ 200 KB AVIF (WebP fallback via `next/image`) | content lint in `content.ts` |
| Fonts | 3 families, latin subset, swap | next/font config |
| Hero frame rate | ≥ 50 fps mid-laptop, ≥ 30 fps mid-phone | manual Phase 4 gate |
Tactics: everything below the fold lazy via dynamic import; terminal chunk loads on first discovery trigger only; rain/searchlight pause via `IntersectionObserver` when hero off-screen and on `document.hidden`; `useGLTF`-free (procedural scene = no model downloads); static export of all case pages.

---

## 9. Accessibility spec (WCAG 2.2 AA)

- Skip-to-content link first in DOM. Semantic landmarks: `header/nav/main/section[aria-label]/footer`. Heading hierarchy: one `h1` (hero name), `h2` per panel, `h3` inside cases.
- Full keyboard parity: folders, lit window, nav, form, terminal — all operable; visible focus everywhere (§4.3).
- Contrast: `--bone`/`--ink` ≈ 14:1; `--signal` on `--ink` ≥ 4.5:1 (verify; it passes for text ≥ 16px — re-test if hex changes); `--rain` only for ≥ 14px secondary text.
- `prefers-reduced-motion`: native scroll, no pins/parallax/rain/searchlight sweep; lightning replaced by static lit skyline; crossfades ≤ 150 ms; **identical content and order**. A manual toggle in the footer (`MOTION: ON/OFF`) overrides, persisted.
- Terminal: dialog semantics, focus trap, Esc, `aria-live="polite"` log region; tap-row on mobile.
- All images real alt text (decorative ⇒ `alt=""`); form errors announced via `aria-describedby`; high-contrast `theme` mode (§5.7).
- Gate: `@axe-core/playwright` — zero critical/serious violations on `/`, one case page, `/dossier`, terminal open.

---

## 10. SEO & social

- Per-route metadata via `generateMetadata`: title pattern `Mokshith Sanga — Product Manager & AI-Native Builder` / `CASE: <title> — Mokshith Sanga`; descriptions from summaries; canonical from `NEXT_PUBLIC_SITE_URL`.
- JSON-LD: `Person` on `/` and `/dossier` (name, jobTitle, sameAs socials, url); `CreativeWork` per case.
- OG images: branded template via `opengraph-image.tsx` — ink background, Anton title, mono case metadata, amber rule; default card for `/`.
- `sitemap.ts` (all static routes + cases), `robots.ts` (allow all; reference sitemap). Descriptive `<title>` even on 404.
- The site must be fully readable with JS disabled except hero animation and terminal (SSG HTML carries all content) — this is also the SEO guarantee.

## 11. Analytics events (Plausible custom events)
`skip_intro` · `terminal_open {method: key|window|404|footer}` · `terminal_command {name}` (name only — never log args) · `case_open {slug}` · `cv_download {source: dossier|terminal|footer}` · `contact_submit {ok}` · `easteregg {id}` · `motion_toggle {state}`. Wrapper in `lib/analytics.ts`; no-ops when env var absent; no cookies, no PII.

## 12. Testing & QA

**Playwright e2e (CI-blocking):** home renders + skip-intro jumps to `#cases` · nav deep links land correctly with scroll engine active · case folder → detail → `RETURN TO ISSUE` · terminal: open via backtick, `help`, `cases`, `open 1` navigates, Esc restores focus · contact: validation errors, honeypot silently accepted, success path with mocked Resend · `/dossier` renders + PDF link 200 · 404 renders · reduced-motion emulation: no pinning, content order intact · axe suite (§9).
**Manual matrix (Phase 7):** Chrome/Edge/Firefox latest (Win+mac), **Safari macOS and iOS (top scroll-bug risk — test Lenis + pinned panels + anchor jumps hard)**, Android Chrome mid-range device; print preview of `/dossier`; keyboard-only full pass; 3G throttle first load.
**CI (`ci.yml`):** pnpm install → typecheck → lint → build → Playwright (chromium + webkit) → Lighthouse CI on preview URL with §2 thresholds as assertions. All green = mergeable.

## 13. Deployment & ops
Vercel project linked to repo; preview per PR; production on `main`. Custom domain + HTTPS; `www` → apex redirect. Resend domain verification (SPF/DKIM) before launch; send a real test email. Favicons/touch icons/`site.webmanifest` from the stamp motif. Post-launch: submit sitemap to Google Search Console; uptime check (e.g. free tier monitor) on `/` and `/api/contact` (GET health 405-check); Plausible dashboard bookmarked.

---

## 14. Build plan — phases with acceptance criteria & agent prompts

> One phase per session. The kickoff prompt for each phase is: *"Read docs/PRD.md §0, §4, and §14 Phase N (plus the §§ listed). Implement Phase N only. Stop when acceptance criteria pass and report what you verified."*

**Phase 0 — Foundations** *(§§3, 7, 13)*
Scaffold Next 15 + TS strict + Tailwind v4 tokens + fonts; repo layout; CI skeleton; deploy hello-world to Vercel; security headers; `.env.example`.
✓ CI green; preview deploy live; tokens visible on a styleguide page (`/dev/tokens`, removed in Phase 7).

**Phase 1 — Content backbone** *(§§5.8, 6, 10)*
Schemas + content pipeline with build-time validation; seed 3 placeholder cases full of `[TODO-CONTENT]`; `/dossier` complete with print CSS; sitemap/robots/metadata/JSON-LD; CONTENT-TODO.md generator.
✓ Build fails on bad frontmatter (prove it); `/dossier` prints clean; Lighthouse ≥ 95 across the board (no heavy UI yet).

**Phase 2 — Comic shell & scroll engine** *(§§4.5, 5.2, 5.3, 5.5, 9)*
Panel/CaptionBox/Stamp/Grain; MotionProvider (Lenis+GSAP); all panels laid out with origin + arsenal; transitions (3 devices); nav + footer; reduced-motion parity + footer toggle.
✓ Full scroll story with static hero image; reduced-motion mode verified in Playwright; anchor deep-links land correctly; zero console errors.

**Phase 3 — Case files** *(§5.4, §10 OG)*
Folder index with stamp interaction; detail template (splash/brief/operation/outcome/evidence); speed-line transition; per-case OG images.
✓ All cases navigable both directions; OG cards validate in a card debugger; CLS < 0.05 on detail pages.

**Phase 4 — 3D cold open** *(§5.1, §8)*
Procedural city, rain, searchlight, lightning, lit-window hotspot; HeroGate with poster + device gating; produce the poster asset from the finished scene; pause-when-hidden.
✓ Budgets hold (bundle sizes printed in PR); ≥ 30 fps on a real mid-range phone; poster-only path verified with WebGL disabled; skip-intro ≤ 1 s.

**Phase 5 — Command Center** *(§5.7)*
Terminal overlay + CRT styling; registry + all commands incl. jokes; three discovery paths wired; history/tab-complete; mobile tap-row; high-contrast `theme` persistence.
✓ Every command verified; keyboard-only pass; Esc never fails; focus restored; terminal chunk lazy (network tab proof).

**Phase 6 — Contact & instrumentation** *(§§5.6, 5.9, 7.4, 11)*
SignalForm + spotlight; `/api/contact` with anti-spam; 404 page; analytics events; favicon set.
✓ Real email received end-to-end on preview; honeypot/time-trap proven; events visible in Plausible; 404 hint opens terminal.

**Phase 7 — Hardening & launch** *(§§12, 13 + checklist below)*
Full manual matrix esp. Safari; axe + Lighthouse CI gates locked; replace every `[TODO-CONTENT]` (CONTENT-TODO.md must be empty); final CSP; remove `/dev/tokens`; the Chanel pass — remove one effect.
✓ Launch checklist 100%:
- [ ] All content real, proofread, no placeholder text anywhere (`grep -r "TODO-CONTENT"` returns nothing)
- [ ] All §2 metrics met on production URL (not preview)
- [ ] Safari iOS scroll + anchors flawless · keyboard-only pass · print pass
- [ ] Contact tested from production; CV downloads; socials correct
- [ ] OG cards verified on LinkedIn (your audience lives there)
- [ ] Search Console sitemap submitted; uptime monitor on; DECISIONS.md current
- [ ] You have shown it to 2 real humans (1 technical, 1 not) and fixed their top confusion each

---

## 15. IP guardrails (non-negotiable)
Original noir-vigilante aesthetic — genre, not franchise. ❌ No bat emblem or any silhouette readable as one; no "Gotham/Wayne/Batcave/Bat-" naming; no DC names, quotes, traced artwork, or franchise-associated logotypes. The searchlight may project **only an original mark — the owner's stylised "M" monogram** (a bare letterform; no shield, circle, or enclosure that could read as a logo lockup), and **never** a franchise emblem or any silhouette readable as one (owner-approved amendment, 2026-06 — see DECISIONS.md). ✅ Generic noir devices: rain, rooftops, searchlights, case files, dossiers, an original lair terminal. Codename **NIGHTFRAME** is a placeholder — rename freely, keep it original, and run a quick trademark search if you'll freelance under it.

## 16. Risks
| Risk | Mitigation |
|---|---|
| 3D tanks mobile | HeroGate poster path (§5.1); hero is Phase 4 — site is shippable without it |
| Scroll-jacking annoys recruiters | short pins, skip intro, `/dossier`, reduced-motion parity, Safari QA gate |
| Theming reads gimmicky to corporate clients | restraint caps (§4.5), conventional `/dossier`, dry copy deck |
| Agent fabricates content | §0.3 rule 1 + `[TODO-CONTENT]` convention + Phase 7 grep gate |
| Lenis/Safari bugs | Phase 7 gate; fallback = drop Lenis, keep native scroll + ScrollTrigger |
| Scope creep | §1 non-goals; NIGHT PATROL is a separate doc |

## 17. Roadmap (post-launch)
v1.1: optional sound design behind a toggle (rain ambience, terminal keys) · v1.2: case-study deep dives as long-form "issues" · v2: link Project NIGHT PATROL as its own case file once built.

---

# Appendix A — Seed content (resolved from master CV, 12 Jun 2026)

> Source of truth for personal facts: `Mokshith_Sanga_CV_MASTER_Full.pdf` (attach it to the repo as `docs/cv-master.pdf`, **git-ignored if the repo ever goes public** — it contains a phone number). The agent copies facts from here verbatim; it may polish phrasing but never alters a number, date, or claim. Anything not in the CV stays `[TODO-CONTENT]`.

## A.1 siteConfig (resolved)
```ts
export const siteConfig = {
  name: "Mokshith Sanga",
  strapline: "PRODUCT MANAGER · AI-NATIVE BUILDER · UNITED KINGDOM",
  role: "Product Manager & AI-Native Builder",
  email: "mokiviral@gmail.com",
  socials: {
    github: "https://github.com/moki-s",
    linkedin: "https://www.linkedin.com/in/mokshith-s-b06ab223a",
  },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL!, // [TODO-CONTENT: domain]
};
// Deliberately NO phone number anywhere on the public site — see A.6.
```
**Positioning note (drives all copy):** the differentiator is *PM who ships*: roadmaps, PRDs and stakeholder work **plus** AI-assisted full-stack delivery (Claude Code, agents, MCP). Target roles: APM / PM / technical PM; secondary: freelance product-build clients. Education line for dossier + JSON-LD: MSc Advanced Computer Science, University of Birmingham (Sep 2025 – Sep 2026); B.Tech CSE (Cyber Security), Dayananda Sagar University (2020–2024).

## A.2 Origin copy — DRAFT (needs Mokshith's edit & approval before launch)
> The city runs on broken spreadsheets and slow software. I fix that.
> By day: product manager — roadmaps, PRDs, stakeholders, the paperwork of progress. After hours: I ship the thing myself, AI agents at my side.
> An LMS serving 800-plus learners. A clinician tool at 93% adoption. A store scaled from $100 to $1,000 a day.
> Founding-team years in health-tech and EdTech taught me the rule: everything ships with your name on it.
> Currently finishing an MSc in Advanced Computer Science in Birmingham. The signal's on. I take cases.

## A.3 Case files — frontmatter drafts (5 cases, ordered)
Every metric below is verbatim from the master CV. Pass each case through the A.6 disclosure check before it goes live. Screenshots: `[TODO-CONTENT]` for all five.

**CASE 001 — `the-learning-machine` (Integer Training LMS)** · 2026 · role "Product owner & builder" · status shipped · stack [Claude Code, Supabase, Stripe, Twilio, Resend, REST/webhooks]
summary: "The LMS that retired 5–6 spreadsheet systems for 1,200 learners."
metrics: `800–850 / active learners` · `25–35 min / saved per learner onboarding + tracking` · `5–6 / manual systems replaced`
brief: a training company running enrolment, instalments and assessment tracking across half a dozen spreadsheets. operation: authored the PRD and technical spec, designed the integration architecture, shipped the MVP via AI-assisted full-stack development; Stripe payments, Supabase (Postgres), Twilio SMS, Resend email. evidence: internal — `SOURCE SEALED — NDA` unless founder approves a demo link.

**CASE 002 — `the-dictation-job` (Healthflex voice-to-form)** · 2024–2025 · role "Proposed & piloted (founding team)" · status shipped · stack [Google Cloud Speech-to-Text, LLM integration]
summary: "Clinicians spoke. The forms filled themselves."
metrics: `93% / clinician adoption` · `20 → 5 min / per note` · `−75% / documentation time`
brief: clinicians losing 20 minutes per note to manual data entry. operation: proposed and piloted a voice-to-structured-form tool (STT + LLM) end to end. evidence: internal — `SOURCE SEALED — NDA`.

**CASE 003 — `vibrant-lane` (AI commerce store)** · 2025–2026 · role "Launched & scaled" · status ongoing · stack [Shopify, generative image AI, prompt engineering, Stripe]
summary: "An AI wallpaper store scaled 10x in two months."
metrics: `$100 → $800–1,000 / day in 2 months` · `5–7 / engineered art styles` · token cost-per-generation optimised
⚠ **A.6 check required**: revenue figures belong to the employer's business — get written/email OK to publish, or degrade gracefully to "scaled ~10x in two months."

**CASE 004 — `the-conversion-engine` (in-house CRM via MCP)** · 2025–2026 · role "Product owner & builder" · status shipped · stack [Model Context Protocol, Zoho, Facebook Ads data]
summary: "One screen with everything an agent needs to close."
metrics: `20+ / sales agents daily` · `23+ / monthly sales target supported`
operation: integrated Zoho via MCP with Facebook Ads data; companion "Deal Generator" issues payment links with configurable deposits and auto-calculates commissions. evidence: internal — `SOURCE SEALED — NDA`.

**CASE 005 — `stance` (B2B clinic-ops dashboard)** · 2025 · role "End-to-end launch lead" · status shipped · stack [MongoDB aggregations, MongoDB Charts, Postman, JIRA, Figma]
summary: "Scheduling, rosters and billing for 3 clinics on one dashboard."
metrics: `3 / centres` · `1,700+ / patients served` · QA + data validation across scheduling, rosters, billing

Bench (rotate in later if stronger screenshots exist): Moodle platform (3 role-based dashboards, PHP), Enrol Smart, Shopify stores (glogummy / mamabub), IoT smart parking. **Excluded from the portfolio: the Windows malware-analysis lab project** — the CV itself flags it security-roles-only, and it's the wrong signal next to PM positioning on a public site.

## A.4 Arsenal (seeded; field-use lines are drafts in the §6.4 voice — approve or rewrite)
- **LANGUAGES:** Python · SQL · JavaScript · HTML/CSS · PHP — e.g. `SQL — gets confessions out of databases.`
- **AI & AUTOMATION:** Claude Code · AI agents · MCP · Agent Skills · prompt engineering · LLM integration · token/cost optimisation — e.g. `CLAUDE CODE — the partner who works the night shift.` · `MCP — wires the informants together.`
- **DATA:** MongoDB + Charts · Supabase (Postgres) · MySQL · Excel — e.g. `EXCEL — old weapon. still loaded.`
- **DELIVERY & INTEGRATIONS:** Agile/Scrum · JIRA · Postman · Sentry · Stripe · Twilio · Resend · Zoho · Figma — e.g. `STRIPE — the money always leaves a trail.`

## A.5 Terminal `whoami` (resolved)
```
mokshith sanga — product manager. ai-native builder.
roadmaps by day. shipping by night. agents in between.
currently: msc advanced computer science, university of birmingham.
open to cases. type 'contact' to send a signal.
```

## A.6 Disclosure & privacy gate (blocks launch — added to Phase 7 checklist)
- [ ] **No phone number** anywhere on the site or in the public `/cv.pdf`; the public PDF is a tailored export (email + LinkedIn only), not the master CV.
- [ ] **Employer-metric permission:** written OK (email is fine) to publish Vibrant Lane revenue and Integer launch figures (~£1,300 courses, 300+ enquiries) publicly. No OK → use relative framings ("10x in two months", "launch-week pipeline") which are pre-approved fallbacks in this PRD.
- [ ] **Internal tool names** (Deal Generator, Enrol Smart, CRM) — confirm naming them publicly is fine; otherwise describe generically.
- [ ] **Healthflex/DeftRonin** metrics (93%, 75%) are framed as your contributions per the CV — keep wording identical to the CV to stay defensible.
- [ ] Footer claims `ALL CASES REAL.` — therefore numbers stay verbatim-from-CV forever; any future update to a metric updates the CV first, site second.
