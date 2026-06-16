"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotion } from "@/components/MotionProvider";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { dur } from "@/lib/motion";
import { Eyebrow } from "@/components/panels/Eyebrow";

// §5.2 — the three transition devices. "speedlines" previews here on the Cases
// panel; its real trigger (entering a case) is wired in Phase 3.
type Transition = "gutter" | "halftone" | "speedlines" | "none";

type PanelProps = {
  id?: string;
  ariaLabel: string;
  eyebrow?: string;
  transition?: Transition;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
};

// §4.5 — full-viewport comic panel: ink border, --midnight fill, halftone
// overlay, eyebrow slot. Content reveals on scroll (dur.enter) only when motion
// is enabled; otherwise it is visible by default (works with JS off too).
export function Panel({
  id,
  ariaLabel,
  eyebrow,
  transition = "none",
  className = "",
  contentClassName = "",
  children,
}: PanelProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { motionEnabled } = useMotion();

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!motionEnabled || !section || !content) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 82%", once: true },
      });

      if (transition === "gutter") {
        tl.set(".gutter-bar", { scaleY: 1 }, 0).to(
          ".gutter-bar",
          { scaleY: 0, duration: dur.wipe.duration, ease: dur.wipe.ease },
          0,
        );
      } else if (transition === "halftone") {
        tl.set(".panel-fx", { autoAlpha: 1 }, 0).to(
          ".panel-fx",
          { autoAlpha: 0, duration: dur.wipe.duration, ease: dur.wipe.ease },
          0,
        );
      } else if (transition === "speedlines") {
        tl.set(".panel-fx", { autoAlpha: 1, scale: 1.25 }, 0).to(
          ".panel-fx",
          {
            autoAlpha: 0,
            scale: 1,
            duration: dur.wipe.duration,
            ease: dur.wipe.ease,
          },
          0,
        );
      }

      tl.from(
        content,
        {
          autoAlpha: 0,
          y: 24,
          duration: dur.enter.duration,
          ease: dur.enter.ease,
        },
        transition === "none" ? 0 : 0.12,
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [motionEnabled, transition]);

  return (
    <section ref={sectionRef} id={id} aria-label={ariaLabel} className={`panel ${className}`}>
      {transition === "gutter" && (
        <div className="panel-fx panel-fx--gutter" aria-hidden="true">
          <span className="gutter-bar gutter-bar--top" />
          <span className="gutter-bar gutter-bar--bottom" />
        </div>
      )}
      {transition === "halftone" && (
        <div className="panel-fx panel-fx--halftone" aria-hidden="true" />
      )}
      {transition === "speedlines" && (
        <div className="panel-fx panel-fx--speedlines" aria-hidden="true" />
      )}

      <div ref={contentRef} className={`panel-content ${contentClassName}`}>
        {eyebrow && <Eyebrow className="mb-6">{eyebrow}</Eyebrow>}
        {children}
      </div>
    </section>
  );
}
