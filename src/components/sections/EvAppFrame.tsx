"use client";

import { SITE } from "@/lib/site";
import { useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight } from "lucide-react";
import { EvPanelHome } from "./EvPanelHome";

export function EvAppFrame({
  forceReveal = false,
  heroEntry = true,
}: { forceReveal?: boolean; heroEntry?: boolean } = {}) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(stageRef, { once: true, amount: 0.3 });
  const shouldReveal = inView || forceReveal;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !shouldReveal) return;

    let disposed = false;
    const reveal = () => {
      if (disposed) return;
      stage.classList.add("ev-frame-entry--run");
      if (heroEntry) document.documentElement.classList.add("ev-hero-entry--run");
    };

    const delay = forceReveal ? 1900 : 1300;
    const t = window.setTimeout(reveal, delay);
    return () => {
      disposed = true;
      window.clearTimeout(t);
    };
  }, [shouldReveal, forceReveal, heroEntry]);

  return (
    <div ref={stageRef} className="ev-frame-stage ev-frame-entry">
      <a href={SITE.links.signUp} className="hero-demo-callout">
        Try free, no charge
        <ArrowRight className="hero-demo-callout-arrow" strokeWidth={1.5} aria-hidden />
      </a>
      <div className="ev-frame-fade-wrap">
        <div className="ev-frame-fade-surface">
          <div className="ev-frame-shadow" aria-hidden />
          <div className="ev-frame-shell">
            <div className="ev-frame">
              <div className="ev-frame-body ev-frame-body-cf">
                <div className="ev-frame-bg" aria-hidden />
                <div className="ev-frame-glow" aria-hidden />
                <EvPanelHome />
              </div>

              <motion.div
                className="ev-frame-shine-group"
                aria-hidden
                initial={{ opacity: 0 }}
                animate={shouldReveal ? { opacity: [0, 1, 0] } : { opacity: 0 }}
                transition={{ duration: 1.7, delay: 0.6 }}
              >
                <motion.div
                  className="ev-frame-shine"
                  style={{ "--mask-x": "0%", "--mask-y": "25%" } as React.CSSProperties}
                  animate={shouldReveal ? { "--mask-x": ["0%", "3%", "8%"], "--mask-y": ["25%", "4%", "0%"] } : undefined}
                  transition={{ duration: 0.75, delay: 0.45, ease: [0.455, 0.03, 0.515, 0.955], times: [0, 0.5, 1] }}
                />
                <motion.div
                  className="ev-frame-shine ev-frame-shine-inner"
                  style={{ "--mask-x": "0%", "--mask-y": "25%" } as React.CSSProperties}
                  animate={shouldReveal ? { "--mask-x": ["0%", "3%", "8%"], "--mask-y": ["25%", "4%", "0%"] } : undefined}
                  transition={{ duration: 0.75, delay: 0.7, ease: [0.455, 0.03, 0.515, 0.955], times: [0, 0.5, 1] }}
                />
              </motion.div>
              <motion.div
                className="ev-frame-shine-group"
                aria-hidden
                initial={{ opacity: 0 }}
                animate={shouldReveal ? { opacity: [0, 0.6, 0] } : { opacity: 0 }}
                transition={{ duration: 1.7, delay: 1.4, ease: "easeInOut" }}
              >
                <div
                  className="ev-frame-shine"
                  style={{ "--mask-x": "8%", "--mask-y": "0%" } as React.CSSProperties}
                />
                <div
                  className="ev-frame-shine ev-frame-shine-inner"
                  style={{ "--mask-x": "8%", "--mask-y": "0%" } as React.CSSProperties}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
