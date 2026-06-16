# Decisions log

Accepted deviations from the PRD and one-line justifications for anything that
needs explaining (per CLAUDE.md / PRD §0.3). Newest first.

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
