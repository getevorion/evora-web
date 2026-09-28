"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function EvPage({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("ev-page", className)}>{children}</div>;
}

export function EvPageHeader({
  title,
  meta,
  actions,
  eyebrow,
  className,
}: {
  title: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  eyebrow?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("ev-page-header", className)}>
      <div className="ev-page-title-row">
        <div className="min-w-0">
          {eyebrow ? (
            <div className="text-[11px] font-[510] uppercase tracking-wider text-[color:var(--dev-subtle)] mb-1">
              {eyebrow}
            </div>
          ) : null}
          <h1 className="ev-page-title">{title}</h1>
          {meta ? <p className="ev-page-meta">{meta}</p> : null}
        </div>
        {actions ? <div className="ev-view-actions">{actions}</div> : null}
      </div>
    </header>
  );
}

export function EvViewHeader({
  trail,
  actions,
}: {
  trail: string[];
  actions?: ReactNode;
}) {
  return (
    <header className="ev-view-head">
      <div className="ev-crumbs">
        {trail.map((c, i) => (
          <span key={c + i} className="inline-flex items-center gap-2">
            <span className={i === trail.length - 1 ? "ev-crumb-current" : "ev-crumb"}>{c}</span>
            {i < trail.length - 1 ? <span className="ev-crumb-sep">/</span> : null}
          </span>
        ))}
      </div>
      {actions ? <div className="ev-view-actions">{actions}</div> : null}
    </header>
  );
}

export function EvToolbar({ children }: { children: ReactNode }) {
  return <div className="ev-toolbar">{children}</div>;
}

export function EvPageBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("ev-page-body", className)}>{children}</div>;
}

export function EvCard({
  title,
  actions,
  children,
  className,
}: {
  title?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("ev-card", className)}>
      {title || actions ? (
        <div className="ev-card-head">
          {title ? <div className="ev-card-title">{title}</div> : <span />}
          {actions}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export function EvSectionCard({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <EvCard
      className={className}
      title={
        title || description ? (
          <div>
            {title}
            {description ? (
              <p className="text-[11px] font-normal text-[color:var(--dev-subtle)] mt-0.5">{description}</p>
            ) : null}
          </div>
        ) : undefined
      }
      actions={actions}
    >
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </EvCard>
  );
}

export const PageHeader = EvPageHeader;
export const SectionCard = EvSectionCard;
export const Card = EvCard;
