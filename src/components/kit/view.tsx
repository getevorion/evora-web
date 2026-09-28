"use client";

import React from "react";
import { cn } from "@/lib/cn";

export function ViewCrumbs({
  trail,
  className,
}: {
  trail: string[];
  className?: string;
}) {
  return (
    <div className={cn("pnl-page-eyebrow", className)}>
      {trail.map((label, i) => (
        <span key={`${label}-${i}`} className="inline-flex items-center gap-1.5 min-w-0">
          {i > 0 ? <span aria-hidden>/</span> : null}
          <span className="truncate">{label}</span>
        </span>
      ))}
    </div>
  );
}

export function ViewHeader({
  trail,
  children,
  className,
}: {
  trail: string[];
  children?: React.ReactNode;
  className?: string;
}) {
  const title = trail[trail.length - 1] ?? "";
  const eyebrow = trail.slice(0, -1);
  return (
    <header className={cn("pnl-page-head shrink-0", className)}>
      <div className="pnl-page-head-main">
        {eyebrow.length > 0 && <ViewCrumbs trail={eyebrow} />}
        <h1 className="pnl-page-title">{title}</h1>
      </div>
      {children ? <div className="pnl-page-actions">{children}</div> : null}
    </header>
  );
}

export function ViewToolbar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("pnl-toolbar shrink-0", className)}>{children}</div>;
}

export function ViewBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("ev-dash-body flex-1 min-h-0", className)}>
      <div className="pnl-page">{children}</div>
    </div>
  );
}
