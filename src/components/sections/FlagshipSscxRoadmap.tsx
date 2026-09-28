"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/cn";

type RoadmapStep = {
  id: string;
  title: string;
  body: string;
  tag: string;
};

const STEPS: RoadmapStep[] = [
  {
    id: "link",
    title: "Decide what runs remotely",
    body: "You choose which parts of your app should execute on Evora instead of in the shipped client.",
    tag: "your build",
  },
  {
    id: "channel",
    title: "Use the live session",
    body: "When the app is connected, those calls travel over the same session surface you already use for Evora.",
    tag: "in session",
  },
  {
    id: "gates",
    title: "Checks along the way",
    body: "The usual integrity and auth gates apply before anything sensitive is allowed to run.",
    tag: "before run",
  },
  {
    id: "runtime",
    title: "Run on Evora",
    body: "The platform runs the lifted workload and returns an answer tied to that request.",
    tag: "hosted",
  },
  {
    id: "outcomes",
    title: "Use the result",
    body: "Your integration gets bytes back in a consistent shape so you can branch or store them like any other API outcome.",
    tag: "back in app",
  },
];

const DURATION_S = 4;
const GRID_GAP_X = "gap-x-3 sm:gap-x-5 md:gap-x-8 lg:gap-x-10";
const GRID_GAP_Y = "gap-y-3 md:gap-y-3.5 lg:gap-y-1";

function roadmapLayout(compact: boolean) {
  if (compact) {
    return {
      gapX: "gap-x-0.5 sm:gap-x-1 md:gap-x-1.5 lg:gap-x-2",
      gapY: "gap-y-1.5 md:gap-y-2 lg:gap-y-2",
      rg: "[--rg:0.38rem] sm:[--rg:0.48rem] md:[--rg:0.58rem] lg:[--rg:0.68rem]",
      trackH: "h-6 md:h-7",
      innerMin: "min-w-0",
      titleClass:
        "heading-gradient text-[0.6875rem] font-medium leading-snug tracking-[-0.02em] sm:text-[0.75rem] md:text-[0.8125rem]",
      bodyClass:
        "mx-auto text-[0.6875rem] font-light leading-snug text-text-muted sm:text-[0.75rem] md:text-[0.8125rem]",
      tagClass:
        "font-mono text-[7px] uppercase leading-none tracking-[0.14em] text-text-faint/85 sm:text-[8px] md:text-[9px]",
    };
  }
  return {
    gapX: GRID_GAP_X,
    gapY: GRID_GAP_Y,
    rg: "[--rg:0.75rem] sm:[--rg:1.25rem] md:[--rg:2rem] lg:[--rg:2.5rem]",
    trackH: "h-7 md:h-9",
    innerMin: "min-w-[38rem] sm:min-w-0",
    titleClass:
      "heading-gradient text-[0.8125rem] font-medium leading-snug tracking-[-0.02em] sm:text-[0.9375rem] md:text-base lg:text-lg lg:leading-tight",
    bodyClass:
      "mx-auto text-[0.8125rem] font-light leading-relaxed text-text-muted sm:text-sm md:text-[0.9375rem] md:leading-relaxed lg:text-[0.9375rem] lg:leading-relaxed",
    tagClass:
      "font-mono text-[9px] uppercase leading-none tracking-[0.16em] text-text-faint/85 sm:text-[10px] md:text-[11px] md:tracking-[0.18em]",
  };
}

function stepThreshold(i: number, n: number) {
  if (n <= 1) return 0;
  return i / (n - 1);
}

export function FlagshipSscxRoadmap({ compact = false }: { compact?: boolean }) {
  const layout = roadmapLayout(compact);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [finished, setFinished] = useState(false);
  const progress = useMotionValue(0);
  const playedRef = useRef(false);

  const inView = useInView(wrapRef, { amount: 0.28, once: true });

  useMotionValueEvent(progress, "change", (v) => {
    const draw = Math.min(1, Math.max(0, v));
    const n = STEPS.length;

    if (draw >= 0.997) {
      setFinished((prev) => (prev ? prev : true));
      setActive((prev) => (prev === n - 1 ? prev : n - 1));
      return;
    }

    setFinished((prev) => (prev ? false : prev));

    let next = 0;
    for (let i = n - 1; i >= 0; i--) {
      if (draw >= stepThreshold(i, n) - 1e-6) {
        next = i;
        break;
      }
    }
    setActive((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    if (!inView || playedRef.current) return;
    playedRef.current = true;

    progress.set(0);
    setActive(0);
    setFinished(false);

    let linearEase = false;
    if (typeof window !== "undefined") {
      linearEase = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    const ctrl = animate(progress, 1, {
      duration: DURATION_S,
      ease: linearEase ? "linear" : [0.22, 1, 0.36, 1],
    });
    return () => {
      ctrl.stop();
    };
  }, [inView, progress]);

  const n = STEPS.length;

  return (
    <div
      ref={wrapRef}
      className="relative w-full"
      aria-label="horizontal roadmap"
    >
      <div
        className="sr-only"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round((finished ? 1 : active / Math.max(1, n - 1)) * 100)}
        aria-label="roadmap progress"
      />

      <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:overflow-visible [&::-webkit-scrollbar]:hidden">
        <div className={cn("relative w-full max-w-none px-0", layout.innerMin)}>
          <div className={cn("relative grid grid-cols-5", layout.gapX, layout.gapY)}>
            <div className={cn("relative col-span-5", layout.trackH, layout.rg)}>
              <div
                className="pointer-events-none absolute top-1/2 z-0 h-px -translate-y-1/2 bg-hairline md:h-[2px]"
                style={{
                  left: "calc((100% - 4 * var(--rg)) / 10)",
                  width: "calc((100% - 4 * var(--rg)) * 4 / 5 + 4 * var(--rg))",
                }}
                aria-hidden
              />
              <motion.div
                className="pointer-events-none absolute top-1/2 z-[1] h-[2px] origin-left -translate-y-1/2 rounded-full bg-accent md:h-[3px]"
                style={{
                  left: "calc((100% - 4 * var(--rg)) / 10)",
                  width: "calc((100% - 4 * var(--rg)) * 4 / 5 + 4 * var(--rg))",
                  scaleX: progress,
                }}
                aria-hidden
              />
              <div className={cn("relative z-10 grid h-full grid-cols-5", layout.gapX)}>
                {STEPS.map((step, i) => {
                  const unlocked = i <= active;
                  return (
                    <div key={`dot-${step.id}`} className="flex items-center justify-center">
                      <span
                        className={cn(
                          "relative flex shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ease-out",
                          compact ? "size-3.5 md:size-4" : "size-4 md:size-[18px]",
                          unlocked
                            ? "border-accent/80 bg-accent/90"
                            : "border-hairline-strong bg-bg"
                        )}
                        aria-hidden
                      >
                        {unlocked ? (
                          <span className="size-[3.5px] rounded-full bg-white/90 md:size-1.5" />
                        ) : null}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {STEPS.map((step, i) => {
              const t = stepThreshold(i, n);
              const reached = i <= active;
              const isCurrent = i === active && !finished;
              const titleOpacity = !reached ? 0.28 : finished ? 1 : isCurrent ? 1 : 0.88;
              const bodyOpacity = !reached ? 0 : finished ? 1 : isCurrent ? 1 : 0.82;

              return (
                <div
                  key={`title-${step.id}`}
                  className="relative z-10 flex min-w-0 flex-col items-center text-center px-0.5 md:px-1"
                >
                  <div
                    className="w-full min-w-0 max-w-[15rem] text-balance md:max-w-[18rem] lg:max-w-none"
                    style={{
                      transition: "opacity 280ms ease-out, transform 280ms ease-out, color 280ms ease-out",
                      opacity: titleOpacity,
                      transform: reached ? "translateY(0)" : "translateY(6px)",
                    }}
                  >
                    <h3 className={layout.titleClass}>
                      {step.title}
                    </h3>
                  </div>
                </div>
              );
            })}

            {STEPS.map((step, i) => {
              const t = stepThreshold(i, n);
              const reached = i <= active;
              const isCurrent = i === active && !finished;
              const bodyOpacity = !reached ? 0 : finished ? 1 : isCurrent ? 1 : 0.82;

              return (
                <div
                  key={`body-${step.id}`}
                  className="relative z-10 flex min-w-0 flex-col items-center text-center px-0.5 md:px-1"
                >
                  <div
                    className="mt-1.5 w-full min-w-0 max-w-[15rem] text-balance md:mt-2 md:max-w-[18rem] lg:max-w-none"
                    style={{
                      transition: "opacity 320ms ease-out, transform 320ms ease-out",
                      opacity: bodyOpacity,
                      transform: reached ? "translateY(0)" : "translateY(8px)",
                    }}
                  >
                    <p className={layout.bodyClass}>
                      {step.body}
                    </p>
                  </div>
                </div>
              );
            })}

            {STEPS.map((step, i) => {
              const t = stepThreshold(i, n);
              const reached = i <= active;
              const isCurrent = i === active && !finished;
              const tagOpacity = !reached ? 0 : finished ? 1 : isCurrent ? 1 : 0.82;

              return (
                <div
                  key={`tag-${step.id}`}
                  className="relative z-10 flex min-w-0 items-end justify-center px-0.5 pt-3 text-center md:px-1 md:pt-3.5"
                >
                  <p
                    className={layout.tagClass}
                    style={{
                      transition: "opacity 320ms ease-out, transform 320ms ease-out",
                      opacity: tagOpacity,
                      transform: reached ? "translateY(0)" : "translateY(8px)",
                    }}
                  >
                    {step.tag}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
