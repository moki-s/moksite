"use client";

import { useRef, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useMotion } from "@/components/MotionProvider";
import { dur } from "@/lib/motion";
import { CaseFolder } from "@/components/cases/CaseFolder";
import type { CaseEntry } from "@/lib/content";

// §5.2 — speed-line zoom on case entry. Motion on: play the zoom overlay, then
// navigate. Motion off / no-JS: the <Link> just navigates.
export function CaseIndex({ cases }: { cases: CaseEntry[] }) {
  const router = useRouter();
  const { motionEnabled } = useMotion();
  const overlayRef = useRef<HTMLDivElement>(null);

  const onActivate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const overlay = overlayRef.current;
    if (!motionEnabled || !overlay) return; // let the <Link> navigate
    event.preventDefault();
    gsap.fromTo(
      overlay,
      { autoAlpha: 0, scale: 1.4 },
      {
        autoAlpha: 1,
        scale: 1,
        duration: dur.wipe.duration,
        ease: dur.wipe.ease,
        onComplete: () => router.push(href),
      },
    );
  };

  return (
    <>
      <ul className="cases-list">
        {cases.map((entry) => (
          <li key={entry.slug}>
            <CaseFolder
              entry={entry}
              href={`/case/${entry.slug}`}
              onActivate={onActivate}
            />
          </li>
        ))}
      </ul>
      <div ref={overlayRef} className="speedline-overlay" aria-hidden="true" />
    </>
  );
}
