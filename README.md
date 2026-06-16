# moksite

A noir comic-book portfolio with a hidden Command Center. Built to the spec in
`docs/PRD.md` (NIGHTFRAME v2.1). Agent working rules: `CLAUDE.md` / `AGENTS.md`.

**Stack:** Next.js 15 (App Router, React 19, TypeScript strict) · Tailwind v4
(CSS-first `@theme`) · pnpm · deployed on Vercel.

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Quality gates (definition of done)

```bash
pnpm typecheck && pnpm lint && pnpm build
```

The temporary `/dev/tokens` route is a styleguide proving the §4 design tokens
render; it is removed in Phase 7.
