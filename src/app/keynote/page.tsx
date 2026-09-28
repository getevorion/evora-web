"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  IntroducingEvorionShowcase,
  LicensingShowcase,
  SessionsShowcase,
  IntegrityShowcase,
} from "@/components/sections/PanelShowcase";

const T = {
  s1: { start: 0.0,  dur: 4.0 },
  s2: { start: 3.4,  dur: 6.0 },
  s3: { start: 8.8,  dur: 6.0 },
  s4: { start: 14.2, dur: 6.0 },
  s5: { start: 19.6, dur: 6.0 },
  s6: { start: 25.0, dur: 3.0 },
};

const XFADE = 0.7;

function splitWords(el: HTMLElement | null) {
  if (!el || el.dataset.split === "1") return [];
  const text = el.textContent ?? "";
  el.textContent = "";
  el.dataset.split = "1";
  const words = text.split(/(\s+)/);
  const spans: HTMLSpanElement[] = [];
  for (const w of words) {
    if (/^\s+$/.test(w)) {
      el.appendChild(document.createTextNode(w));
      continue;
    }
    const wrap = document.createElement("span");
    wrap.style.display = "inline-block";
    wrap.style.overflow = "hidden";
    wrap.style.paddingBottom = "0.20em";
    wrap.style.marginBottom = "-0.20em";
    const inner = document.createElement("span");
    inner.className = "kn-word";
    inner.style.display = "inline-block";
    inner.style.willChange = "transform, opacity, filter";
    inner.textContent = w;
    wrap.appendChild(inner);
    el.appendChild(wrap);
    spans.push(inner);
  }
  return spans;
}

export default function KeynotePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const s1TitleRef = useRef<HTMLHeadingElement>(null);
  const s2H2Ref = useRef<HTMLHeadingElement>(null);
  const s3H2Ref = useRef<HTMLHeadingElement>(null);
  const s4H2Ref = useRef<HTMLHeadingElement>(null);
  const s5H2Ref = useRef<HTMLHeadingElement>(null);
  const s6TitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      (window as unknown as { __knReady?: boolean }).__knReady = true;
      buildTimeline();
    });
    return () => cancelAnimationFrame(id);
  }, []);

  function buildTimeline() {
    document.querySelectorAll(".ev-showcase-split, .ev-showcase-shell")
      .forEach((el) => el.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true })));

    const E = {
      gentle:  "cubic-bezier(0.32, 0, 0.16, 1)",
      drama:   "cubic-bezier(0.16, 1, 0.3, 1)",
      dolly:   "none",
      title:   "cubic-bezier(0.22, 1, 0.36, 1)",
      back:    "back.out(1.2)",
      io:      "cubic-bezier(0.65, 0, 0.35, 1)",
    };

    const tl = gsap.timeline({ paused: true });
    (window as unknown as { __knTimeline?: gsap.core.Timeline }).__knTimeline = tl;

    gsap.set("#sc1", { opacity: 0 });
    gsap.set(["#sc2", "#sc3", "#sc4", "#sc5", "#sc6"], { opacity: 0 });
    gsap.set("#sc1-underline", { scaleX: 0, transformOrigin: "left center" });
    gsap.set("#sc5-spotlight", { "--r": "0%" } as gsap.TweenVars);

    const w1 = splitWords(s1TitleRef.current);
    tl.to("#sc1", { opacity: 1, duration: XFADE, ease: E.gentle }, T.s1.start)
      .from("#sc1-eye", { opacity: 0, y: 14, duration: 1.1, ease: E.title }, T.s1.start + 0.25)
      .from(w1, {
        opacity: 0,
        y: 64,
        rotationX: -85,
        filter: "blur(18px)",
        scale: 0.93,
        transformOrigin: "50% 100% -30px",
        duration: 1.6,
        stagger: 0.10,
        ease: E.drama,
      }, T.s1.start + 0.55)
      .to("#sc1-underline", {
        scaleX: 1,
        duration: 1.4,
        ease: E.io,
      }, T.s1.start + 1.6)
      .from("#sc1-sub", { opacity: 0, y: 16, duration: 1.2, ease: E.title }, T.s1.start + 1.8);

    tl.fromTo("#sc2", { opacity: 0 }, { opacity: 1, duration: XFADE, ease: E.gentle }, T.s2.start)
      .from(s2H2Ref.current, {
        opacity: 0,
        y: 50,
        scale: 1.03,
        filter: "blur(18px)",
        duration: 1.4,
        ease: E.drama,
      }, T.s2.start + 0.2)
      .to(s2H2Ref.current, {
        opacity: 0,
        y: -260,
        scale: 0.92,
        filter: "blur(8px)",
        duration: 1.1,
        ease: E.io,
      }, T.s2.start + 2.4)
      .from("#sc2 .ev-bento", {
        opacity: 0,
        y: 80,
        scale: 0.92,
        filter: "blur(14px)",
        duration: 1.1,
        stagger: 0.22,
        ease: E.back,
      }, T.s2.start + 2.0)
      .to("#sc1", { opacity: 0, duration: XFADE, ease: E.gentle }, T.s2.start)
      .set("#sc1", { visibility: "hidden" }, T.s2.start + XFADE + 0.1);

    tl.fromTo("#sc3", { opacity: 0 }, { opacity: 1, duration: XFADE, ease: E.gentle }, T.s3.start)
      .from(s3H2Ref.current, {
        opacity: 0,
        x: -50,
        filter: "blur(14px)",
        duration: 1.3,
        ease: E.drama,
      }, T.s3.start + 0.2)
      .from("#sc3 .ev-showcase-pane:first-child", {
        opacity: 0,
        y: 90,
        filter: "blur(14px)",
        duration: 1.3,
        ease: E.drama,
      }, T.s3.start + 0.9)
      .from("#sc3 .ev-showcase-li", {
        opacity: 0,
        yPercent: 100,
        duration: 0.75,
        stagger: 0.14,
        ease: E.drama,
      }, T.s3.start + 1.4)
      .from("#sc3 .ev-showcase-pane:last-child", {
        opacity: 0,
        x: 100,
        filter: "blur(14px)",
        duration: 1.4,
        ease: E.drama,
      }, T.s3.start + 1.8)
      .from("#sc3 .ev-showcase-inspector-body > *", {
        opacity: 0,
        y: 18,
        duration: 0.7,
        stagger: 0.14,
        ease: E.title,
      }, T.s3.start + 2.4)
      .from("#sc3 .ev-gauge", {
        scale: 0.82,
        duration: 1.0,
        ease: E.back,
        transformOrigin: "center center",
      }, T.s3.start + 3.0)
      .to("#sc2", { opacity: 0, duration: XFADE, ease: E.gentle }, T.s3.start)
      .set("#sc2", { visibility: "hidden" }, T.s3.start + XFADE + 0.1);

    tl.fromTo("#sc4", { opacity: 0 }, { opacity: 1, duration: XFADE, ease: E.gentle }, T.s4.start)
      .from(s4H2Ref.current, {
        opacity: 0,
        x: 50,
        filter: "blur(14px)",
        duration: 1.3,
        ease: E.drama,
      }, T.s4.start + 0.2)
      .from("#sc4 .ev-showcase-sess-stat", {
        opacity: 0,
        scale: 0.93,
        filter: "blur(12px)",
        duration: 1.2,
        ease: E.drama,
      }, T.s4.start + 0.9)
      .from("#sc4 .ev-showcase-sess-spark", {
        clipPath: "inset(0 100% 0 0)",
        duration: 1.6,
        ease: E.io,
      }, T.s4.start + 1.2)
      .from("#sc4 .ev-showcase-sess-ping", {
        opacity: 0,
        y: -8,
        duration: 0.55,
        stagger: 0.10,
        ease: E.title,
      }, T.s4.start + 1.4)
      .from("#sc4 .ev-showcase-table-head > *", {
        opacity: 0,
        y: -8,
        duration: 0.5,
        stagger: 0.05,
        ease: E.title,
      }, T.s4.start + 1.7)
      .from("#sc4 .ev-showcase-row", {
        opacity: 0,
        x: -34,
        filter: "blur(10px)",
        duration: 0.75,
        stagger: 0.14,
        ease: E.drama,
      }, T.s4.start + 1.95)
      .to("#sc4 .ev-showcase-row-tamper", {
        boxShadow: "0 0 0 1px rgba(235,87,87,0.65), 0 0 40px rgba(235,87,87,0.30)",
        duration: 0.7,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut",
      }, T.s4.start + 3.5)
      .to("#sc3", { opacity: 0, duration: XFADE, ease: E.gentle }, T.s4.start)
      .set("#sc3", { visibility: "hidden" }, T.s4.start + XFADE + 0.1);

    tl.fromTo("#sc5", { opacity: 0 }, { opacity: 1, duration: XFADE, ease: E.gentle }, T.s5.start)
      .to("#sc5-spotlight", {
        "--r": "130%",
        duration: 1.8,
        ease: E.io,
      } as gsap.TweenVars, T.s5.start + 0.1)
      .from(s5H2Ref.current, {
        opacity: 0,
        y: 34,
        scale: 0.96,
        filter: "blur(16px)",
        duration: 1.4,
        ease: E.drama,
      }, T.s5.start + 0.4)
      .from("#sc5 .ev-showcase-toggle", {
        opacity: 0,
        y: -10,
        scale: 0.9,
        duration: 0.6,
        stagger: 0.14,
        ease: E.back,
      }, T.s5.start + 1.0)
      .from("#sc5 .ev-showcase-code", {
        opacity: 0,
        y: 50,
        filter: "blur(14px)",
        duration: 1.3,
        ease: E.drama,
      }, T.s5.start + 1.4)
      .from("#sc5 .ev-showcase-guard", {
        opacity: 0,
        x: 40,
        scale: 0.93,
        duration: 0.7,
        stagger: 0.16,
        ease: E.back,
      }, T.s5.start + 1.7)
      .to("#sc5 .ev-showcase-guard-on .ev-showcase-guard-check", {
        scale: 1.3,
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        stagger: 0.22,
        ease: "back.out(2)",
        transformOrigin: "center center",
      }, T.s5.start + 2.9)
      .from("#sc5 .ev-showcase-guard-expand", {
        opacity: 0,
        y: 14,
        duration: 0.75,
        ease: E.title,
      }, T.s5.start + 3.4)
      .to("#sc4", { opacity: 0, duration: XFADE, ease: E.gentle }, T.s5.start)
      .set("#sc4", { visibility: "hidden" }, T.s5.start + XFADE + 0.1);

    tl.fromTo("#sc6", { opacity: 0 }, { opacity: 1, duration: XFADE, ease: E.gentle }, T.s6.start)
      .from("#sc6-eye", { opacity: 0, y: 12, letterSpacing: "0.6em", duration: 1.0, ease: E.title }, T.s6.start + 0.15)
      .from(s6TitleRef.current, {
        opacity: 0,
        y: 70,
        scale: 1.04,
        filter: "blur(20px)",
        duration: 1.4,
        ease: E.drama,
      }, T.s6.start + 0.35)
      .to("#sc6-bar", { width: 260, duration: 1.0, ease: E.title }, T.s6.start + 1.35)
      .from("#sc6-row", { opacity: 0, y: 16, duration: 1.0, ease: E.title }, T.s6.start + 1.6)
      .to("#sc5", { opacity: 0, duration: XFADE, ease: E.gentle }, T.s6.start)
      .set("#sc5", { visibility: "hidden" }, T.s6.start + XFADE + 0.1);

    (window as unknown as { __knDuration?: number }).__knDuration = T.s6.start + T.s6.dur;
  }

  return (
    <div ref={rootRef} className="kn-root">
      <style>{KN_CSS}</style>

      <section id="sc1" className="kn-scene">
        <div id="sc1-camera" className="kn-camera-flex">
          <div className="kn-s1-stack">
            <div id="sc1-eye" className="kn-s1-eye">EVORION&nbsp;4</div>
            <h1 ref={s1TitleRef} className="kn-s1-title">Introducing Evorion 4.</h1>
            <div className="kn-s1-underline-wrap">
              <span id="sc1-underline" className="kn-s1-underline" />
            </div>
            <p id="sc1-sub" className="kn-s1-sub">
              A wider stack. A hardened runtime. A larger surface to build against.
            </p>
          </div>
        </div>
      </section>

      <section id="sc2" className="kn-scene">
        <div id="sc2-camera" className="kn-camera-frame">
          <h2 ref={s2H2Ref} className="kn-section-h2">A hardened runtime, in three layers.</h2>
          <div className="kn-stage">
            <div className="kn-pin" style={{ width: "1620px" }}>
              <IntroducingEvorionShowcase />
            </div>
          </div>
        </div>
      </section>

      <section id="sc3" className="kn-scene">
        <div id="sc3-camera" className="kn-camera-frame">
          <h2 ref={s3H2Ref} className="kn-section-h2 kn-h2-left">
            Per-device entitlements, hardware-bound.
          </h2>
          <div className="kn-stage">
            <div className="kn-pin" style={{ width: "1480px" }}>
              <LicensingShowcase />
            </div>
          </div>
        </div>
      </section>

      <section id="sc4" className="kn-scene">
        <div id="sc4-camera" className="kn-camera-frame">
          <h2 ref={s4H2Ref} className="kn-section-h2 kn-h2-right">
            Live sessions across regions. Terminate on tamper.
          </h2>
          <div className="kn-stage">
            <div className="kn-pin" style={{ width: "1480px" }}>
              <SessionsShowcase />
            </div>
          </div>
        </div>
      </section>

      <section id="sc5" className="kn-scene">
        <div id="sc5-spotlight" className="kn-spotlight" />
        <div id="sc5-camera" className="kn-camera-frame">
          <h2 ref={s5H2Ref} className="kn-section-h2 kn-h2-left">
            Compile-time hooks. Runtime guards.
          </h2>
          <div className="kn-stage">
            <div className="kn-pin" style={{ width: "1480px" }}>
              <IntegrityShowcase />
            </div>
          </div>
        </div>
      </section>

      <section id="sc6" className="kn-scene">
        <div className="kn-camera-flex">
          <div className="kn-s1-stack">
            <div id="sc6-eye" className="kn-lock-eye">Available now</div>
            <div ref={s6TitleRef} className="kn-lock-title">Evorion 4</div>
            <div id="sc6-bar" className="kn-lock-bar" />
            <div id="sc6-row" className="kn-lock-row">
              <span>evora.cx</span>
              <span className="sep" />
              <span>Get started</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const KN_CSS = `
  .kn-root {
    --ev-font-mono: ui-monospace, "SF Mono", "JetBrains Mono", Consolas, monospace;
    color: #f7f8f8;
    font-family: "Inter Variable", ui-sans-serif, system-ui, sans-serif;
    letter-spacing: -0.011em;
    -webkit-font-smoothing: antialiased;
    position: absolute;
    inset: 0;
    width: 1920px;
    height: 1080px;
    overflow: hidden;
    background: #08090a;
  }
  .kn-scene { position: absolute; inset: 0; }

  .kn-camera-flex {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transform-origin: center center;
    will-change: transform, opacity, filter;
  }

  .kn-camera-frame {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 0 80px;
    transform-origin: center center;
    will-change: transform, opacity, filter;
  }

  .kn-s1-stack { display: flex; flex-direction: column; align-items: center; text-align: center; }

  .kn-section-h2 {
    font-size: 64px;
    font-weight: 510;
    letter-spacing: -0.034em;
    line-height: 1.04;
    color: #f7f8f8;
    text-align: center;
    max-width: 28ch;
    margin: 0 auto 48px;
    text-wrap: balance;
    will-change: opacity, transform, filter;
  }
  .kn-h2-left { text-align: left; max-width: 30ch; margin-left: 240px; margin-right: auto; }
  .kn-h2-right { text-align: right; max-width: 30ch; margin-left: auto; margin-right: 240px; }

  .kn-s1-eye {
    font-family: ui-monospace, "JetBrains Mono", monospace;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.42em;
    color: #62666d;
    margin-bottom: 42px;
  }
  .kn-s1-title {
    font-size: 168px;
    font-weight: 510;
    letter-spacing: -0.05em;
    line-height: 0.96;
    color: #f7f8f8;
    margin: 0;
    text-align: center;
    text-wrap: balance;
  }
  .kn-s1-underline-wrap {
    margin-top: 24px;
    width: 140px;
    height: 2px;
  }
  .kn-s1-underline {
    display: block;
    width: 100%;
    height: 2px;
    background: #2563eb;
  }
  .kn-s1-sub {
    margin-top: 30px;
    font-size: 22px;
    font-weight: 500;
    color: #8a8f98;
    max-width: 56ch;
    line-height: 1.5;
  }

  .kn-stage { display: flex; justify-content: center; flex: 0 0 auto; }
  .kn-pin { will-change: transform, opacity, filter; }

  .kn-spotlight {
    position: absolute; inset: 0;
    pointer-events: none;
    background: radial-gradient(circle at 50% 55%, transparent var(--r, 0%), rgba(8,9,10,0.95) calc(var(--r, 0%) + 1%));
    z-index: 2;
  }

  .kn-lock-eye {
    font-family: ui-monospace, "JetBrains Mono", monospace;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.42em;
    color: #62666d;
    margin-bottom: 28px;
  }
  .kn-lock-title {
    font-size: 192px;
    font-weight: 510;
    letter-spacing: -0.05em;
    color: #f7f8f8;
    line-height: 0.96;
  }
  .kn-lock-bar { margin-top: 22px; width: 0; height: 2px; background: #2563eb; }
  .kn-lock-row {
    margin-top: 24px;
    display: flex; align-items: center; gap: 18px;
    font-size: 18px;
    color: #8a8f98;
    letter-spacing: 0.06em;
  }
  .kn-lock-row .sep { width: 24px; height: 1px; background: rgba(255,255,255,0.14); }

  .kn-root .ev-showcase-section { padding: 0 !important; }
  .kn-root .ev-showcase-shell { margin: 0 auto; }

  .kn-root {
    --ev-success: #00d97f;
    --ev-success-rgb: 0, 217, 127;
    --ev-danger:  #ff4d4d;
    --ev-danger-rgb:  255, 77, 77;
    --ev-warning: #ffae2e;
    --ev-warning-rgb: 255, 174, 46;
    --ev-brand:   #3b82f6;
    --ev-brand-hover: #60a5fa;
    --ev-accent:  #3b82f6;
  }

  .kn-root .ev-tag-ok {
    color: #00d97f !important;
    background: rgba(0, 217, 127, 0.20) !important;
    border-color: rgba(0, 217, 127, 0.45) !important;
  }
  .kn-root .ev-tag-err {
    color: #ff5c5c !important;
    background: rgba(255, 92, 92, 0.22) !important;
    border-color: rgba(255, 92, 92, 0.48) !important;
  }
  .kn-root .ev-tag-warn {
    color: #ffb84d !important;
    background: rgba(255, 184, 77, 0.20) !important;
    border-color: rgba(255, 184, 77, 0.45) !important;
  }
  .kn-root .ev-row-mark[data-tone="ok"]   { background: #00d97f !important; }
  .kn-root .ev-row-mark[data-tone="warn"] { background: #ffb84d !important; }
  .kn-root .ev-row-selected {
    background: rgba(59, 130, 246, 0.18) !important;
    box-shadow: inset 3px 0 0 #3b82f6 !important;
  }
  .kn-root .ev-showcase-event-ok  { background: #00d97f !important; }
  .kn-root .ev-showcase-event-err { background: #ff5c5c !important; }
  .kn-root .ev-avatar { filter: saturate(1.35) brightness(1.10); }

  .kn-root .ev-heartbeat-reject .ev-heartbeat-sig,
  .kn-root .ev-heartbeat-terminate .ev-heartbeat-sig {
    color: #ff5c5c !important;
  }
  .kn-root .ev-heartbeat-reject .ev-heartbeat-wave,
  .kn-root .ev-heartbeat-terminate .ev-heartbeat-wave {
    color: rgba(255, 92, 92, 0.95) !important;
  }
  .kn-root .ev-heartbeat-reject .ev-heartbeat-hash,
  .kn-root .ev-heartbeat-terminate .ev-heartbeat-hash {
    color: rgba(255, 92, 92, 0.55) !important;
  }

  .kn-root .ev-heartbeats {
    transform: scale(1.32);
    transform-origin: top left;
    width: 76% !important;
  }

  .kn-root .ev-heartbeat .ev-heartbeat-tick,
  .kn-root .ev-heartbeat .ev-heartbeat-wave path,
  .kn-root .ev-heartbeat {
    animation-iteration-count: 1 !important;
    animation-duration: 3500ms !important;
    animation-fill-mode: forwards !important;
  }
`;
