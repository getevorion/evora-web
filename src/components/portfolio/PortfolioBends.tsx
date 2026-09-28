"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import "./portfolio-bends.css";

const ColorBends = dynamic(() => import("@/components/ColorBends"), { ssr: false });

const UNMOUNT_DELAY_MS = 1500;

export function PortfolioBends() {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    let inView = false;
    let visible = !document.hidden;
    let leaveTimer: number | null = null;

    const sync = () => {
      if (inView && visible) {
        if (leaveTimer !== null) {
          window.clearTimeout(leaveTimer);
          leaveTimer = null;
        }
        setActive(true);
      } else if (leaveTimer === null) {
        leaveTimer = window.setTimeout(() => {
          leaveTimer = null;
          setActive(false);
        }, UNMOUNT_DELAY_MS);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) inView = e.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    io.observe(layer);

    const onVisibility = () => {
      visible = !document.hidden;
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (leaveTimer !== null) window.clearTimeout(leaveTimer);
    };
  }, []);

  return (
    <div ref={layerRef} className="pf-bends" aria-hidden>
      <div className="pf-bends-canvas">
        {active && (
          <ColorBends
            rotation={160}
            speed={0.15}
            colors={["#000000", "#002fff", "#4e09ff"]}
            transparent
            autoRotate={0.8}
            scale={1.3}
            frequency={1}
            warpStrength={1}
            mouseInfluence={0}
            parallax={0.5}
            noise={0}
            iterations={1}
            intensity={1.5}
            bandWidth={13}
          />
        )}
      </div>
    </div>
  );
}
