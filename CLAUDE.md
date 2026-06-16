<!-- Put this at the repo root as CLAUDE.md, then copy it verbatim to AGENTS.md (identical content) so Codex/Antigravity can read it too. -->

# moksite — agent instructions

## Source of truth
- The spec is `docs/PRD.md`. Read the referenced sections before any task. **The PRD always wins over your defaults.**
- The PRD's codename is **NIGHTFRAME**. This project is renamed to **moksite**. Wherever the PRD uses NIGHTFRAME — repo name, terminal OS name, terminal prompt, boot text, the footer `psst` hint — use **moksite** instead:
  - terminal prompt: `moksite@cmd:~$`
  - boot line: `MOKSITE OS v1.0 — UNAUTHORIZED ACCESS DETECTED… just kidding. welcome, detective. type 'help' to begin.`
- The hero name and all personal facts are `[TODO-CONTENT]` — never fill them in yourself.

## Workflow — one phase at a time
- Work on exactly ONE phase (PRD §14) per session. **Do not start the next phase.**
- **Begin every phase in PLAN MODE**: propose your approach and WAIT for my approval before editing any files.
- **Definition of done** for every task: `pnpm typecheck && pnpm lint && pnpm build` all pass, plus that phase's acceptance criteria in PRD §14. Then stop and list exactly what you verified.

## Tooling
- Use the **Context7** MCP to fetch current API docs before using any library — especially Next 15, React 19, Tailwind v4, `@react-three/fiber`, `three`, `@react-three/drei`, `gsap`/ScrollTrigger, `lenis`, `zod`, `resend`. Do not rely on memory for these; their APIs move fast and getting them wrong wastes a whole session.
- Use the **Playwright** MCP to verify behavior in a real browser (scroll, anchor deep-links, terminal, reduced-motion, OG cards) rather than assuming it works.

## Hard rules (career-protection clauses — §0.3 + §15)
1. **No fabrication.** Never invent projects, metrics, employers, testimonials, quotes, names, or links. Insert a `[TODO-CONTENT]` marker; that content is the human's job. A fake metric a recruiter catches is fatal.
2. **No IP violations.** §15 is non-negotiable — original noir *genre*, never any franchise (no bat emblem or readable silhouette, no Gotham/Wayne/Bat- naming, no DC names/quotes/traced art). When in doubt, redesign.
3. **No new dependencies** beyond §7.2 without a one-line justification logged in `docs/DECISIONS.md`.
4. **No copied code or assets** from other portfolios. Inspiration ≠ duplication.
5. **Budgets (§8) are gates, not goals.** A feature that breaks a budget gets descoped — never the budget.
6. **Design tokens (§4), copy deck (§6.4), and budgets (§8) are law.** Do not invent colors, fonts, copy, or libraries.
- **Never commit secrets.** Env vars are listed in §7.5; `.env.example` is committed, real `.env.local` is git-ignored.
- If the PRD is ambiguous or you must deviate, **stop and ask.** Log accepted deviations in `docs/DECISIONS.md`.
