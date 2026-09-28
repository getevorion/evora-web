import { PORTFOLIO } from "@/lib/portfolio";

export function PortfolioStats() {
  return (
    <section className="pf-stats" aria-label="By the numbers" data-reveal>
      <div className="pf-stats-grid">
        {PORTFOLIO.stats.map((stat) => (
          <div key={stat.label}>
            <p className="pf-stat-value">{stat.value}</p>
            <p className="pf-stat-label">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
