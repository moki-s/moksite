// §5.4 — THE OUTCOME metric: Anton numeral + mono label. Never invents numbers;
// values come verbatim from the case frontmatter.
export function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="case-metric">
      <p className="case-metric-value">{value}</p>
      <p className="case-metric-label">{label}</p>
    </div>
  );
}
