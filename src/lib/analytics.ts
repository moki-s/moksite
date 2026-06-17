// §11 — Plausible custom events. No-ops when Plausible isn't loaded (the script
// only mounts when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set). No cookies, no PII —
// never pass message content or args here.
type PlausibleProps = Record<string, string | number | boolean>;
type PlausibleFn = (event: string, options?: { props?: PlausibleProps }) => void;

export function track(event: string, props?: PlausibleProps): void {
  if (typeof window === "undefined") return;
  const plausible = (window as unknown as { plausible?: PlausibleFn }).plausible;
  if (typeof plausible === "function") {
    plausible(event, props ? { props } : undefined);
  }
}
