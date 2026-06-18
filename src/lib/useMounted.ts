import { useEffect, useState } from "react";

// True only after the first client effect — used to defer rendering of state that
// comes from a persisted (localStorage) store, so SSR/first-paint stays in sync
// and we avoid hydration mismatches.
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
