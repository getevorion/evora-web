"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PORTFOLIO } from "@/lib/portfolio";

const THEME_STORAGE_KEY = "pf-theme";

type Theme = "light" | "dark";

function readInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {}
  const root = document.getElementById("portfolio-root");
  const attr = root?.getAttribute("data-theme");
  return attr === "light" ? "light" : "dark";
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}

type TrackedSection = NonNullable<(typeof PORTFOLIO.nav)[number]["section"]>;

const TRACKED_SECTIONS: readonly TrackedSection[] = PORTFOLIO.nav
  .map((item) => item.section)
  .filter((s): s is TrackedSection => s !== null);

export function PortfolioNav() {
  const [active, setActive] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const initial = readInitialTheme();
    setTheme(initial);
    const root = document.getElementById("portfolio-root");
    if (root) root.setAttribute("data-theme", initial);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const elements: HTMLElement[] = [];
    for (const id of TRACKED_SECTIONS) {
      const el = document.getElementById(id);
      if (el) elements.push(el);
    }
    if (!elements.length) return;

    const visibility = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.intersectionRatio);
        }
        let bestId: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of visibility) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        setActive(bestRatio > 0 ? bestId : null);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const applyTheme = useCallback((next: Theme) => {
    setTheme(next);
    const root = document.getElementById("portfolio-root");
    if (root) root.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
  }, []);

  function isActive(section: string | null): boolean {
    if (section === null) return active === null;
    return active === section;
  }

  return (
    <div className="pf-nav-wrap">
      <nav className="pf-nav" aria-label="Portfolio">
        <span className="pf-nav-spacer" aria-hidden />
        {PORTFOLIO.nav.map((item) => {
          if (item.cta) {
            return (
              <Link key={item.href} href={item.href} className="pf-nav-cta">
                {item.label}
              </Link>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className="pf-nav-link"
              data-active={isActive(item.section) ? "true" : "false"}
            >
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          className="pf-nav-theme"
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </nav>
    </div>
  );
}
