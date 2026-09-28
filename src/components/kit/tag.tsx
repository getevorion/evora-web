"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TagTone = "ok" | "warn" | "err" | "neutral";

const toneCls: Record<TagTone, string> = {
  ok: "ev-tag-ok",
  warn: "ev-tag-warn",
  err: "ev-tag-err",
  neutral: "ev-tag-neutral",
};

export function EvTag({
  tone = "neutral",
  children,
  dot = true,
  className,
}: {
  tone?: TagTone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("ev-tag", toneCls[tone], className)}>
      {dot ? <span className="ev-tag-dot" aria-hidden /> : null}
      {children}
    </span>
  );
}

export function EvStateDot({ tone }: { tone: "ok" | "warn" | "err" | string }) {
  const map: Record<string, TagTone> = {
    ok: "ok",
    warn: "warn",
    err: "err",
    live: "ok",
    tamper: "warn",
    active: "ok",
    expired: "warn",
    banned: "err",
  };
  const t = map[tone] ?? "neutral";
  return (
    <span
      className="inline-block size-1.5 rounded-full shrink-0"
      style={{
        background:
          t === "ok"
            ? "var(--dev-status-active)"
            : t === "warn"
              ? "var(--dev-status-warning)"
              : t === "err"
                ? "var(--dev-status-danger)"
                : "var(--dev-muted)",
      }}
      aria-hidden
    />
  );
}
