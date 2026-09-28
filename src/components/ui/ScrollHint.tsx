"use client";

import React, { useEffect, useRef, useState } from 'react';

type Props = {
  target?: string;
  delay?: number;
  timeout?: number;
  window_?: number;
  label?: string;
};

const MIN_OVERFLOW = 120;
const MAX_TOP = 24;

export default function ScrollHint({
  target,
  delay = 1200,
  timeout = 9000,
  window_ = 15000,
  label = 'Scroll',
}: Props) {
  const [visible, setVisible] = useState(false);
  const retiredRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cancelled = false;
    let hideTimer: number | undefined;
    let poll: number | undefined;
    const startedAt = Date.now();

    const findScroller = (): { top: number; overflow: number; el: HTMLElement | null } | null => {
      if (target) {
        const el = document.querySelector<HTMLElement>(target);
        if (!el) return null;
        return { top: el.scrollTop, overflow: el.scrollHeight - el.clientHeight, el };
      }

      const doc = document.documentElement;
      const docOverflow = doc.scrollHeight - window.innerHeight;
      if (docOverflow >= MIN_OVERFLOW) {
        return { top: window.scrollY, overflow: docOverflow, el: null };
      }

      let best: { el: HTMLElement; overflow: number } | null = null;
      const nodes = document.querySelectorAll<HTMLElement>('div, main, section, article');
      for (let i = 0; i < nodes.length; i++) {
        const el = nodes[i];
        if (el.clientHeight < 200) continue;
        const overflow = el.scrollHeight - el.clientHeight;
        if (overflow < MIN_OVERFLOW) continue;
        const oy = getComputedStyle(el).overflowY;
        if (oy !== 'auto' && oy !== 'scroll') continue;
        if (!best || overflow > best.overflow) best = { el, overflow };
      }
      if (best) return { top: best.el.scrollTop, overflow: best.overflow, el: best.el };
      return { top: window.scrollY, overflow: docOverflow, el: null };
    };

    const measure = findScroller;

    const retire = () => {
      if (retiredRef.current) return;
      retiredRef.current = true;
      if (!cancelled) setVisible(false);
      window.clearInterval(poll);
      window.clearTimeout(hideTimer);
      detach();
    };

    const onIntent = () => retire();

    const attach = () => {
      document.addEventListener('scroll', onIntent, { capture: true, passive: true });
      window.addEventListener('wheel', onIntent, { passive: true });
      window.addEventListener('touchmove', onIntent, { passive: true });
      window.addEventListener('keydown', onIntent);
    };
    const detach = () => {
      document.removeEventListener('scroll', onIntent, { capture: true } as any);
      window.removeEventListener('wheel', onIntent);
      window.removeEventListener('touchmove', onIntent);
      window.removeEventListener('keydown', onIntent);
    };

    const tick = () => {
      if (cancelled || retiredRef.current) return;
      const elapsed = Date.now() - startedAt;

      if (elapsed > window_) {
        window.clearInterval(poll);
        return;
      }
      if (elapsed < delay) return;

      const m = measure();
      if (!m) return;
      if (m.top > MAX_TOP) { retire(); return; }
      if (m.overflow < MIN_OVERFLOW) return;

      setVisible(true);
      window.clearInterval(poll);
      hideTimer = window.setTimeout(retire, timeout);
    };

    (window as any).__evoraScrollHint = () => {
      const m = measure();
      return {
        target: target ?? '(auto)',
        resolvedScroller: m?.el ? (m.el.className || m.el.tagName) : 'window/document',
        overflow: m?.overflow ?? null,
        top: m?.top ?? null,
        needsOverflow: MIN_OVERFLOW,
        elapsedMs: Date.now() - startedAt,
        retired: retiredRef.current,
        wouldShow: !!m && m.overflow >= MIN_OVERFLOW && m.top <= MAX_TOP,
      };
    };

    attach();
    poll = window.setInterval(tick, 400);

    return () => {
      cancelled = true;
      window.clearInterval(poll);
      window.clearTimeout(hideTimer);
      detach();
    };
  }, [target, delay, timeout, window_]);

  return (
    <div className="evora-scroll-hint" data-visible={visible ? 'true' : undefined} aria-hidden>
      <span className="evora-scroll-hint-pill">
        <span className="evora-scroll-hint-label">{label}</span>
        <svg viewBox="0 0 12 14" className="evora-scroll-hint-arrow" fill="none" aria-hidden>
          <path
            d="M6 1.5v9.5M2.5 8 6 11.5 9.5 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}
