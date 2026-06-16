"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { useMotion } from "@/components/MotionProvider";

// §3 / §6.4 — sticky top nav, appears after Panel 0 on the home scroll story.
const LINKS = [
  { label: "ORIGIN", hash: "#origin" },
  { label: "CASES", hash: "#cases" },
  { label: "ARSENAL", hash: "#arsenal" },
  { label: "SIGNAL", hash: "#signal" },
];

export function NavBar() {
  const pathname = usePathname();
  const { scrollTo } = useMotion();
  const isHome = pathname === "/";
  const [visible, setVisible] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setVisible(true);
      return;
    }
    const hero = document.getElementById("hero");
    if (!hero) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "-30% 0px 0px 0px" },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [isHome]);

  const onAnchor = (e: MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (!isHome) return; // navigate to "/#…" on other routes
    e.preventDefault();
    scrollTo(hash);
    history.replaceState(null, "", hash);
  };

  return (
    <nav aria-label="Primary" data-visible={visible} className="navbar">
      <ul className="navbar-list">
        {LINKS.map((l) => (
          <li key={l.hash}>
            <Link
              href={`/${l.hash}`}
              onClick={(e) => onAnchor(e, l.hash)}
              className="navbar-link"
            >
              {l.label}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/dossier" className="navbar-link">
            DOSSIER
          </Link>
        </li>
      </ul>
    </nav>
  );
}
