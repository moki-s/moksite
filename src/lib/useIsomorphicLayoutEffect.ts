import { useEffect, useLayoutEffect } from "react";

// useLayoutEffect on the client (flash-free GSAP setup), useEffect on the server
// (avoids React's SSR layout-effect warning).
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
