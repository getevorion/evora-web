"use client";

import React, { useMemo, useRef, useLayoutEffect, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

function buildPaths(position: number) {
  return Array.from({ length: 48 }, (_, i) => {
    const duration = 24 + (i % 11) * 2.4;
    const startOffset = i / 48;
    return {
      id: i,
      d: `M-${460 - i * 6 * position} -${220 + i * 7}C-${
        460 - i * 6 * position
      } -${220 + i * 7} -${370 - i * 6 * position} ${240 - i * 7} ${
        180 - i * 6 * position
      } ${390 - i * 7}C${680 - i * 6 * position} ${530 - i * 7} ${
        760 - i * 6 * position
      } ${960 - i * 7} ${760 - i * 6 * position} ${960 - i * 7}`,
      width: 0.6 + i * 0.025,
      strokeOpacity: Math.min(0.28, 0.06 + i * 0.005),
      duration,
      startOffset,
    };
  });
}

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function FloatingPathsBackground({
  position,
  children,
  className,
}: {
  position: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const paths = useMemo(() => buildPaths(position), [position]);
  const svgRef = useRef<SVGSVGElement>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const nodes = Array.from(svg.querySelectorAll<SVGPathElement>(".fp-path"));
    const n = paths.length;
    if (nodes.length !== n * 2) return;

    for (let i = 0; i < n; i++) {
      const primary = nodes[i * 2];
      const secondary = nodes[i * 2 + 1];
      const meta = paths[i];
      const L = primary.getTotalLength();

      if (reducedMotion || L <= 0) {
        primary.style.strokeDasharray = "";
        primary.style.strokeDashoffset = "";
        primary.style.animation = "";
        secondary.style.strokeDasharray = "";
        secondary.style.strokeDashoffset = "";
        secondary.style.animation = "";
        continue;
      }

      const dash = `${L} ${L}`;
      primary.style.strokeDasharray = dash;
      secondary.style.strokeDasharray = dash;
      primary.style.setProperty("--evora-fp-len", String(L));
      secondary.style.setProperty("--evora-fp-len", String(L));
      primary.style.setProperty("--evora-fp-duration", `${meta.duration}s`);
      secondary.style.setProperty("--evora-fp-duration", `${meta.duration}s`);
      primary.style.animationDelay = `${-meta.startOffset * meta.duration}s`;
      secondary.style.animationDelay = `${(-meta.startOffset - 0.5) * meta.duration}s`;
      primary.classList.add("evora-floating-path");
      secondary.classList.add("evora-floating-path");
    }
  }, [paths, reducedMotion]);

  return (
    <div className={cn("relative size-full min-h-full overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-0">
        <svg
          ref={svgRef}
          className="block size-full min-h-full min-w-full"
          viewBox="0 0 696 316"
          fill="none"
          preserveAspectRatio="none"
          shapeRendering="geometricPrecision"
          aria-hidden
        >
          {paths.map((path) => {
            const op = reducedMotion ? path.strokeOpacity : path.strokeOpacity * 0.52;
            return (
              <React.Fragment key={path.id}>
                <path
                  className="fp-path"
                  d={path.d}
                  stroke="currentColor"
                  strokeWidth={path.width}
                  strokeOpacity={op}
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  className="fp-path"
                  d={path.d}
                  stroke="currentColor"
                  strokeWidth={path.width}
                  strokeOpacity={op}
                  vectorEffect="non-scaling-stroke"
                  visibility={reducedMotion ? "hidden" : "visible"}
                />
              </React.Fragment>
            );
          })}
        </svg>
      </div>
      {children}
    </div>
  );
}
