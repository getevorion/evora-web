"use client";

import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

type EyebrowTone = "blue" | "purple" | "orange" | "green" | "red" | "neutral";

const EYEBROW_DOT: Record<EyebrowTone, string> = {
  blue: "#56cdff",
  purple: "#5e6ad2",
  orange: "#ff7236",
  green: "#4cb782",
  red: "#f34f52",
  neutral: "#8a8f98",
};

export function EvEyebrow({
  label,
  tone = "purple",
}: {
  label: string;
  tone?: EyebrowTone;
}) {
  return (
    <div className="ev-eyebrow">
      <span
        className="ev-eyebrow-dot"
        style={{ background: EYEBROW_DOT[tone] }}
      />
      <span className="ev-eyebrow-label">{label}</span>
    </div>
  );
}

export function PageSection({
  id,
  eyebrow,
  eyebrowTone,
  title,
  kicker,
  children,
  action,
  className,
}: {
  id?: string;
  eyebrow?: string;
  eyebrowTone?: EyebrowTone;
  title?: ReactNode;
  kicker?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`ev-section ${className ?? ""} section-anchor`}
    >
      <div className="ev-section-inner">
        {(eyebrow || title || kicker) && (
          <header className="ev-section-header">
            <div className="ev-section-header-left">
              {eyebrow ? (
                <EvEyebrow label={eyebrow} tone={eyebrowTone} />
              ) : null}
              {title ? <h2 className="ev-section-title">{title}</h2> : null}
            </div>
            {kicker ? <div className="ev-section-kicker">{kicker}</div> : null}
          </header>
        )}
        {children}
        {action ? <div className="ev-section-action">{action}</div> : null}
      </div>
    </section>
  );
}

export function EvSeparator() {
  return <div className="ev-separator" aria-hidden />;
}

export type StatItem = {
  value: string;
  label: string;
  desc: string;
  tone?: EyebrowTone;
};

export function StatsGrid({ items }: { items: StatItem[] }) {
  return (
    <div className="ev-stats-grid">
      {items.map((s, i) => (
        <article key={i} className="ev-stat-card">
          <div className="ev-stat-top">
            <span
              className="ev-stat-dot"
              style={{ background: EYEBROW_DOT[s.tone ?? "purple"] }}
            />
            <span className="ev-stat-label">{s.label}</span>
          </div>
          <div className="ev-stat-body">
            <div className="ev-stat-value">{s.value}</div>
            <p className="ev-stat-desc">{s.desc}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function CompanyMarquee({
  logos,
}: {
  logos: { name: string; mark: ReactNode }[];
}) {
  const doubled = [...logos, ...logos];
  return (
    <div className="ev-marquee">
      <div className="ev-marquee-track">
        {doubled.map((l, i) => (
          <div key={i} className="ev-marquee-item" aria-label={l.name}>
            <div className="ev-marquee-mark">{l.mark}</div>
            <span className="ev-marquee-name">{l.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export type FeatureCard = {
  icon: ReactNode;
  title: string;
  body: string;
  meta?: string;
};

export function CardsGrid({ cards }: { cards: FeatureCard[] }) {
  return (
    <div className="ev-cards-grid">
      {cards.map((c, i) => (
        <article key={i} className="ev-feature-card">
          <div className="ev-feature-icon">{c.icon}</div>
          <h3 className="ev-feature-title">{c.title}</h3>
          <p className="ev-feature-body">{c.body}</p>
          {c.meta ? <div className="ev-feature-meta">{c.meta}</div> : null}
        </article>
      ))}
    </div>
  );
}

export function SectionAction({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a href={href} className="ev-section-action-link">
      <span>{label}</span>
      <ArrowUpRight className="size-4" strokeWidth={1.75} />
    </a>
  );
}
