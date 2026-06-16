# moksite — Claude Code prompt pack

Companion to `docs/PRD.md`. Keep this in `docs/`. The standing rules (plan-first,
Context7, no-fabrication, definition-of-done, stop-at-phase-boundary) live in `CLAUDE.md`,
so the per-phase prompts below stay short and just say *what* to build.

---

## Before Phase 0 (one-time, by hand)

1. Commit the PRD to `docs/PRD.md`. Add `CLAUDE.md` at the repo root and copy it verbatim to `AGENTS.md`.
2. Create empty `docs/DECISIONS.md` and `docs/CONTENT-TODO.md` (Phase 1 auto-fills the latter).
3. Install **Node 22 LTS** and **pnpm**. Install Claude Code and `cd` into the `moksite` repo.
4. Add the two MCP servers, then restart Claude Code (it only reads MCP config at startup):
   ```bash
   claude mcp add --transport http context7 https://mcp.context7.com/mcp
   claude mcp add playwright -- npx -y @playwright/mcp@latest
   ```
   Confirm both show connected with `/mcp` inside Claude Code. (Run `claude mcp add --help`
   if a flag differs on your version; check Context7's page if it asks for an API key.)
5. Create a **Vercel** account, run `vercel login`, and link this repo — Phase 0 deploys to it.

### Service setup timeline (since none are set up yet)
- **Vercel** — before Phase 0 (deploy step).
- **Resend** + a domain you can verify (SPF/DKIM) — before Phase 6. For preview testing you can
  send from Resend's sandbox sender; production needs the verified domain.
- **Plausible** — optional, any time. Analytics no-ops when its env var is absent, so you can defer it.
- **Custom domain** + Google Search Console — Phase 7.

---

## How to run each phase

Paste the phase prompt → the agent plans and waits → you approve (or correct) the plan →
it builds → it reports what it verified → **you open the Vercel preview and review it yourself**
before merging. One phase per PR. If it ever tries to roll into the next phase, stop it.

---

## Phase 0 — Foundations  · read §§3, 7, 13, 14·Phase 0

```
Read docs/PRD.md §0, §3, §4, §7, §13, and §14 Phase 0. Plan first and wait for my approval.
Then scaffold: Next 15 (App Router, React 19, TypeScript strict) + Tailwind v4 with the §4
tokens in globals.css @theme + the three self-hosted fonts via next/font (§4.2); the §7.3
repo layout; security headers (§7.6); .env.example (§7.5); a CI skeleton (.github/workflows/ci.yml).
Add a temporary /dev/tokens styleguide page proving every color and type token renders.
Deploy a hello-world to Vercel (I've linked the repo). Use Context7 for current Next 15 +
Tailwind v4 setup. Done = CI green, preview deploy live, tokens visible on /dev/tokens. Stop —
do not touch Phase 1.
```

## Phase 1 — Content backbone  · read §§5.8, 6, 10, 14·Phase 1

```
Read docs/PRD.md §0, §4, §5.8, §6, §10, and §14 Phase 1. Plan first and wait for approval.
Build the content pipeline: zod schemas (§6.1) + gray-matter/next-mdx-remote loaders in
lib/content.ts that VALIDATE at build time and FAIL the build on bad frontmatter or a missing
image. Seed 3 placeholder cases full of [TODO-CONTENT]. Build /dossier in semantic HTML with a
print stylesheet. Add sitemap.ts, robots.ts, generateMetadata, and JSON-LD (§10). Add a
CONTENT-TODO.md generator that lists every unresolved [TODO-CONTENT]. Done = the build
demonstrably fails on bad frontmatter (show me), /dossier prints clean, Lighthouse ≥ 95 across
the board. Stop.
```

## Phase 2 — Comic shell & scroll engine  · read §§4.5, 5.2, 5.3, 5.5, 9, 14·Phase 2

```
Read docs/PRD.md §0, §4, §4.5, §5.2, §5.3, §5.5, §9, and §14 Phase 2. Plan first and wait.
Build the signature components (Panel, CaptionBox, Stamp, Eyebrow, Grain) and the MotionProvider
(Lenis + GSAP ScrollTrigger, mounted once, consuming the §4.4 motion tokens). Lay out all panels
including Origin (§5.3) and Arsenal (§5.5), the three transition devices (§5.2), nav, and footer.
For the hero slot, use a STATIC placeholder poster image for now — the real 3D scene and final
poster come in Phase 4. Implement reduced-motion parity (§9) plus the footer MOTION: ON/OFF toggle.
Use Context7 for current GSAP ScrollTrigger + Lenis APIs, and Playwright to verify scroll, anchor
deep-links, and reduced-motion mode. Done = full scroll story with the placeholder hero, reduced-
motion verified in Playwright, #origin/#cases/#arsenal/#signal deep-links land correctly, zero
console errors. Stop.
```

## Phase 3 — Case files  · read §§5.4, 10(OG), 14·Phase 3

```
Read docs/PRD.md §0, §4, §5.4, §10, and §14 Phase 3. Plan first and wait.
Build the manila-folder case index with the stamp interaction (§5.4) and the case detail template
(Splash / THE BRIEF / THE OPERATION / THE OUTCOME / EVIDENCE, with NEXT CASE and RETURN TO ISSUE),
the speed-line zoom transition into a case, and per-case OG images via opengraph-image.tsx (next/og).
Keep all real content as [TODO-CONTENT]. Use Playwright to verify navigation both directions and to
validate OG cards. Done = every case navigable both ways, OG cards validate in a card debugger,
CLS < 0.05 on detail pages. Stop.
```

## Phase 4 — 3D cold open  (REQUIRED — riskiest phase)  · read §§5.1, 8, 14·Phase 4

```
Read docs/PRD.md §0, §4, §5.1, §8, and §14 Phase 4. Plan first and wait — and in the plan, call out
how you'll stay under the §8 bundle budgets BEFORE writing the scene.
Build the procedural R3F night-city hero per §5.1: 3 depth rows of instanced box buildings (~60
total, seeded jitter), canvas-texture lit windows, fog, cheap planar reflection, GPU-instanced rain
(≤400 segments), a slow amber searchlight cone that projects NO logo/emblem (§15), a one-time
lightning flash with a KRAK— caption, pointer parallax ±3°, the focusable lit-window hotspot that
opens the Command Center, and the [YOUR NAME] + strapline overlay. Wrap it in <HeroGate>: poster
image is the LCP; fall back to the CSS-rain poster on prefers-reduced-motion / low deviceMemory /
no WebGL2; otherwise lazy-load the 3D chunk (dynamic import, ssr:false) and crossfade in. Pause
animation when the hero is off-screen or document.hidden. Then PRODUCE the real 1600w AVIF/WebP
poster from the finished scene and wire it in (replacing the Phase 2 placeholder). Lean on Context7
for current three / @react-three/fiber / @react-three/drei APIs. Done = §8 budgets hold (print the
bundle sizes in the PR), the 3D chunk is ≤ 450 KB gz and dynamically imported, ≥ 30 fps on a real
mid-range phone, the poster-only path works with WebGL disabled, and SKIP THE INTRO is usable ≤ 1 s.
Stop.
```

## Phase 5 — Command Center  · read §§5.7, 14·Phase 5

```
Read docs/PRD.md §0, §4, §5.7, §6.4, and §14 Phase 5. Plan first and wait.
Build the terminal overlay (role="dialog", aria-modal, CRT scanlines/vignette, --signal mono on
--ink, blinking cursor, skippable boot ≤ 1.5 s) with the pure-TS command registry (one file per
command in components/terminal/commands/, registered in registry.ts). Implement the exact v1 command
set from §5.7 including the jokes (sudo hire-me, coffee, unknown-command line), history (↑/↓), tab
completion, and clear. Wire all three discovery paths (backtick/Konami, lit hero window, 404 hint)
plus the footer hint. Add the mobile full-screen tap-row and the high-contrast `theme` toggle
persisted in localStorage. RENAME per CLAUDE.md: prompt is `moksite@cmd:~$`, boot line is
`MOKSITE OS v1.0 — …`. Bio/socials/etc. stay [TODO-CONTENT]. Esc must always close and restore
focus; the terminal chunk must load lazily on first discovery only. Use Playwright for a keyboard-
only pass. Done = every command verified, keyboard-only pass clean, Esc never fails, focus restored,
terminal chunk lazy (network-tab proof). Stop.
```

## Phase 6 — Contact & instrumentation  · read §§5.6, 5.9, 7.4, 11, 14·Phase 6

```
Read docs/PRD.md §0, §4, §5.6, §5.9, §7.4, §11, and §14 Phase 6. Plan first and wait.
Build the SignalForm with the cursor-following amber spotlight (§5.6), a shared zod schema for
client + server validation, and the /api/contact route handler (§7.4): honeypot `company`, time-trap
< 3 s (return 200 silently), per-IP throttle, Resend send, never logging message content. Build the
404 page (§5.9) whose hint opens the terminal. Add the Plausible analytics wrapper (§11) that no-ops
when its env var is absent. Add the favicon/touch-icon set from the stamp motif. Use Context7 for the
current Resend API. NOTE: this phase needs my RESEND_API_KEY + CONTACT_TO_EMAIL — I'll add them to
Vercel/.env.local before you run the end-to-end email test (sandbox sender is fine for preview). Done
= a real email arrives end-to-end on preview, honeypot + time-trap proven, the analytics wrapper
fires (visible in Plausible only if I've set it up), 404 hint opens the terminal. Stop.
```

## Phase 7 — Hardening & launch  · read §§12, 13, 15, 14·Phase 7

```
Read docs/PRD.md §0, §12, §13, §15, and §14 Phase 7 (the launch checklist). Plan first and wait.
Lock the gates: full Playwright e2e + @axe-core/playwright (zero critical/serious) + Lighthouse CI
asserting the §2 thresholds, all CI-blocking. Run the manual matrix emphasis on Safari macOS/iOS
(Lenis + pinned panels + anchor jumps). Finalize the CSP against the deployed bundle and document it
in DECISIONS.md. Remove /dev/tokens. Do the "Chanel pass" — remove one effect. Then verify the launch
checklist: `grep -r "TODO-CONTENT"` returns nothing (I'll have replaced all content first), §2 metrics
met on the PRODUCTION url, Safari iOS scroll/anchors flawless, keyboard-only + print passes, contact
tested from production, CV downloads, socials correct, OG cards verified on LinkedIn, sitemap submitted
to Search Console, uptime monitor on, DECISIONS.md current. Report the checklist status item by item.
Do not launch until every box is real.
```

---

## Notes

- **Why a placeholder hero until Phase 4:** it keeps the site shippable at every step, so a stall in
  the 3D phase never blocks the rest. Phase 4 is still required and replaces the placeholder with the
  real scene + a poster generated from it.
- **Content is your homework (§6.3):** cases, origin copy + ink portrait, arsenal list, the designed
  `/cv.pdf`, strapline/email/socials, and testimonials (or delete Panel 4). Phase 7 won't pass until
  `CONTENT-TODO.md` is empty. The agent will never write these for you.
- **If a phase gets long:** use `/context` to watch usage and `/compact` between sessions; let the
  Explore subagent do heavy reading so the main thread stays focused.
- **Per-phase review is your QA gate** — the preview deploy is where you catch what the acceptance
  criteria miss.
