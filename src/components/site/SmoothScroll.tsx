"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { NAV } from "@/lib/site";

const NAV_OFFSET = 84;

const HASH_TO_ID: Record<string, string> = Object.fromEntries(
  NAV.filter((n) => n.href.startsWith("/#")).map((n) => [
    n.href.slice(2),
    n.section,
  ]),
);

function resolveSectionId(hashKey: string) {
  return HASH_TO_ID[hashKey] ?? hashKey;
}

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.5,
      wheelMultiplier: 1,
      lerp: 0.1,
      anchors: false,
    });

    (window as unknown as { __lenis?: unknown }).__lenis = lenis;

    const hasHash = !!window.location.hash;
    const hasPending = !!sessionStorage.getItem("evora_pending_section");
    if (!hasHash && !hasPending) {
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {

      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    }

    function scrollToSection(hashKey: string) {
      const id = resolveSectionId(hashKey);
      const target = document.getElementById(id);
      if (!target) return;
      window.history.pushState(
        null,
        "",
        window.location.pathname + `#${hashKey}`,
      );
      lenis.scrollTo(target, {
        offset: -NAV_OFFSET,
        duration: 1.1,
        easing: easeOutExpo,
      });
    }

    const pending = sessionStorage.getItem("evora_pending_section");
    if (pending) {
      sessionStorage.removeItem("evora_pending_section");
      lenis.scrollTo(0, { immediate: true });
      window.setTimeout(() => scrollToSection(pending), 80);
    }

    function onClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(
        "a[href]",
      );
      if (!link) return;

      const rawHref = link.getAttribute("href");
      if (!rawHref) return;

      const url = new URL(rawHref, window.location.href);
      if (url.origin !== window.location.origin || !url.hash) return;

      const hashKey = url.hash.slice(1);
      if (!hashKey) return;

      if (url.pathname !== "/" && url.pathname !== window.location.pathname) {
        return;
      }

      const targetId = resolveSectionId(hashKey);

      if (
        window.location.pathname !== "/" &&
        url.pathname === window.location.pathname
      ) {
        if (!document.getElementById(targetId)) return;
        event.preventDefault();
        scrollToSection(hashKey);
        return;
      }

      if (window.location.pathname !== "/") {
        event.preventDefault();
        sessionStorage.setItem("evora_pending_section", hashKey);
        window.location.assign("/");
        return;
      }

      if (!document.getElementById(targetId)) return;

      event.preventDefault();
      if (link.closest("[role='dialog']")) {
        window.setTimeout(() => scrollToSection(hashKey), 220);
        return;
      }
      scrollToSection(hashKey);
    }

    document.addEventListener("click", onClick, { capture: true });

    function onPageShow(e: PageTransitionEvent) {
      if (!e.persisted) return;
      lenis.resize();
      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    }
    window.addEventListener("pageshow", onPageShow);

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("pageshow", onPageShow);
      lenis.destroy();
    };
  }, []);

  return null;
}
