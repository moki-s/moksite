// §4.5 — one full-viewport film-grain overlay, ~3% opacity, non-interactive.
export function Grain() {
  return (
    <div className="grain" aria-hidden="true">
      <svg className="grain-svg" xmlns="http://www.w3.org/2000/svg">
        <filter id="moksite-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.82"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#moksite-grain)" />
      </svg>
    </div>
  );
}
