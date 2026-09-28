"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export function WordStaggerBlur({
  text,
  className,
  wordClassName,
  delay = 0,
  step = 90,
  duration = 900,
  whenVisible = false,
  blur = 10,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  step?: number;
  duration?: number;
  whenVisible?: boolean;
  blur?: number;
}) {
  const usesGradientText = (cls?: string) =>
    Boolean(
      cls &&
        (cls.includes("keynote-title") ||
          cls.includes("heading-gradient") ||
          cls.includes("keynote-eyebrow-gradient") ||
          cls.includes("keynote-body-gradient"))
    );

  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const lines = text.split("\n");
  let wordIndex = 0;

  useEffect(() => {
    if (!whenVisible) {
      const firstFrame = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setReady(true));
      });
      return () => window.cancelAnimationFrame(firstFrame);
    }

    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setReady(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            window.requestAnimationFrame(() => {
              window.requestAnimationFrame(() => setReady(true));
            });
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [whenVisible]);

  return (
    <span ref={ref} className={cn("inline-block", className)} data-word-blur>
      {lines.map((line, lineIdx) => {
        const words = line.split(" ").filter(Boolean);
        return (
          <Fragment key={lineIdx}>
            {words.map((word, wi) => {
              const i = wordIndex++;
              const gradient = usesGradientText(wordClassName);
              const motion = {
                opacity: ready ? 1 : 0,
                transform: ready ? "none" : `translateY(${Math.min(blur + 6, 18)}px)`,
                transitionProperty: gradient ? "opacity, transform" : "opacity, filter, transform",
                transitionDuration: `${duration}ms`,
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                transitionDelay: ready ? `${delay + i * step}ms` : "0ms",
                ...(gradient
                  ? {}
                  : {
                      filter: ready ? "none" : `blur(${blur}px)`,
                    }),
              };

              return (
                <span
                  key={`${lineIdx}-${wi}`}
                  className="inline-block whitespace-pre"
                  style={motion}
                >
                  <span className={cn(wordClassName)}>{word}</span>
                  {wi < words.length - 1 ? "\u00A0" : ""}
                </span>
              );
            })}
            {lineIdx < lines.length - 1 ? <br /> : null}
          </Fragment>
        );
      })}
    </span>
  );
}
