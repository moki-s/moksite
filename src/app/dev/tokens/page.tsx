// TEMPORARY styleguide (PRD §14 Phase 0 acceptance) — proves every §4 color
// and type token renders with the correct self-hosted font. Removed in Phase 7.

const COLORS = [
  { name: "--ink", hex: "#0B0E13", className: "bg-ink", use: "Base background" },
  { name: "--midnight", hex: "#141B2D", className: "bg-midnight", use: "Panels, city silhouettes" },
  { name: "--rain", hex: "#8A93A6", className: "bg-rain", use: "Secondary text, hairlines" },
  { name: "--bone", hex: "#E8E4D8", className: "bg-bone", use: "Primary text, paper" },
  { name: "--signal", hex: "#F5A623", className: "bg-signal", use: "THE accent — amber" },
  { name: "--blood", hex: "#C0392B", className: "bg-blood", use: "Danger accent (sparse)" },
] as const;

const TYPE = [
  { token: "text-display", px: "96→48", sample: "Aa Bb" },
  { token: "text-h1", px: "56", sample: "Panel headline" },
  { token: "text-h2", px: "36", sample: "Panel headline" },
  { token: "text-h3", px: "24", sample: "Subhead" },
  { token: "text-body-lg", px: "18", sample: "Body large — the quick brown fox jumps." },
  { token: "text-body", px: "16", sample: "Body — the quick brown fox jumps over the lazy dog." },
  { token: "text-meta", px: "14", sample: "META / EYEBROW TEXT" },
  { token: "text-caption", px: "12", sample: "CAPTION TEXT" },
] as const;

export default function TokensPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 text-bone">
      <header className="mb-12 border-b border-rain/30 pb-6">
        <p className="font-mono text-caption uppercase tracking-[0.12em] text-rain">
          moksite — dev styleguide (removed in Phase 7)
        </p>
        <h1 className="mt-2 font-display text-h1 uppercase tracking-[-0.01em]">
          Design tokens — PRD §4
        </h1>
      </header>

      {/* §4.1 Colors */}
      <section className="mb-16">
        <h2 className="mb-6 font-mono text-meta uppercase tracking-[0.12em] text-signal">
          §4.1 Color tokens
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {COLORS.map((c) => (
            <div key={c.name} className="border border-rain/30">
              <div className={`${c.className} h-24 w-full`} />
              <div className="space-y-1 p-3">
                <p className="font-mono text-meta">{c.name}</p>
                <p className="font-mono text-caption uppercase tracking-[0.08em] text-rain">
                  {c.hex}
                </p>
                <p className="font-sans text-caption text-rain">{c.use}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* §4.2 Families */}
      <section className="mb-16">
        <h2 className="mb-6 font-mono text-meta uppercase tracking-[0.12em] text-signal">
          §4.2 Typography — three families
        </h2>
        <div className="space-y-8">
          <div>
            <p className="mb-2 font-mono text-caption uppercase tracking-[0.12em] text-rain">
              Display — Anton 400
            </p>
            <p className="font-display text-h1 uppercase tracking-[-0.01em]">
              The night has teeth
            </p>
          </div>
          <div>
            <p className="mb-2 font-mono text-caption uppercase tracking-[0.12em] text-rain">
              Body — IBM Plex Sans 400 / 600
            </p>
            <p className="font-sans text-body-lg">
              Regular 400 — the quick brown fox jumps over the lazy dog.
            </p>
            <p className="font-sans text-body-lg font-semibold">
              Semibold 600 — the quick brown fox jumps over the lazy dog.
            </p>
          </div>
          <div>
            <p className="mb-2 font-mono text-caption uppercase tracking-[0.12em] text-rain">
              Mono — IBM Plex Mono 400 / 500
            </p>
            <p className="font-mono text-body">moksite@cmd:~$ whoami</p>
            <p className="font-mono text-body font-medium">
              moksite@cmd:~$ ls -la /cases
            </p>
          </div>
        </div>
      </section>

      {/* §4.2 Scale */}
      <section className="mb-16">
        <h2 className="mb-6 font-mono text-meta uppercase tracking-[0.12em] text-signal">
          §4.2 Type scale
        </h2>
        <div className="space-y-4">
          {TYPE.map((t) => (
            <div
              key={t.token}
              className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-rain/20 pb-3"
            >
              <span className="w-44 shrink-0 font-mono text-caption uppercase tracking-[0.08em] text-rain">
                {t.token} · {t.px}px
              </span>
              <span className={`${t.token} font-sans`}>{t.sample}</span>
            </div>
          ))}
        </div>
      </section>

      {/* §4.3 Structure & focus */}
      <section className="mb-16">
        <h2 className="mb-6 font-mono text-meta uppercase tracking-[0.12em] text-signal">
          §4.3 Structure &amp; focus
        </h2>
        <div className="flex flex-wrap items-center gap-6">
          <div className="border-[5px] border-bone bg-midnight px-6 py-4 font-mono text-meta">
            Ink border 5px / radius 0
          </div>
          <div className="rounded-terminal border border-rain/40 bg-midnight px-6 py-4 font-mono text-meta">
            Terminal radius 6px
          </div>
          <button className="bg-signal px-6 py-3 font-mono text-meta uppercase tracking-[0.12em] text-ink">
            Focusable — Tab to me
          </button>
          <a href="#" className="font-mono text-meta uppercase tracking-[0.12em] text-signal">
            Focusable link
          </a>
        </div>
        <p className="mt-4 font-sans text-caption text-rain">
          Tab through the button/link to see the amber focus ring (2px, offset 3px).
        </p>
      </section>
    </main>
  );
}
