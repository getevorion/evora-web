"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export function Reveal({
  children,
  delay = 0,
  duration = 700,
  rootMargin = "-40px",
  fade = false,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  rootMargin?: string;
  fade?: boolean;
  className?: string;
}) {
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin, threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] ease-[cubic-bezier(0.16,1,0.3,1)]",
        shown
          ? "opacity-100 translate-y-0"
          : fade
            ? "opacity-0"
            : "opacity-0 translate-y-2",
        className
      )}
      style={
        shown
          ? {
              transitionDelay: `${delay * 1000}ms`,
              transitionDuration: `${duration}ms`,
            }
          : { transitionDuration: `${duration}ms` }
      }
    >
      {children}
    </div>
  );
}
