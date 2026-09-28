import Image from "next/image";
import Link from "next/link";
import { PORTFOLIO } from "@/lib/portfolio";

export function PortfolioHero() {
  const isOpen = PORTFOLIO.availability === "open";
  const { hero } = PORTFOLIO;

  return (
    <section id="top" className="pf-hero">
      <div className="pf-hero-row pf-reveal">
        <Image
          src="/portfolio/pfp.jpg"
          alt={PORTFOLIO.name}
          width={48}
          height={48}
          priority
          className="pf-hero-pfp"
        />
        <span className="pf-hero-eyebrow">{PORTFOLIO.role}</span>
      </div>
      <h1 className="pf-hero-h1 pf-reveal pf-reveal-1">
        <span>{hero.headlineTop}</span>
        <span>{hero.headlineBottom}</span>
      </h1>
      <p className="pf-hero-intro pf-reveal pf-reveal-2">{hero.intro}</p>
      <div className="pf-hero-ctas pf-reveal pf-reveal-3">
        <Link href={hero.primaryCta.href} className="pf-btn pf-btn-primary">
          {hero.primaryCta.label}
        </Link>
        <Link href={hero.secondaryCta.href} className="pf-btn pf-btn-secondary">
          {hero.secondaryCta.label}
        </Link>
      </div>
      <p
        className="pf-hero-status pf-reveal pf-reveal-4"
        data-state={isOpen ? "open" : "busy"}
      >
        <span className="pf-hero-status-dot" aria-hidden />
        {isOpen ? hero.statusOpen : hero.statusBusy}
      </p>
    </section>
  );
}
