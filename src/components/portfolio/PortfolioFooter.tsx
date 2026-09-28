import { PORTFOLIO } from "@/lib/portfolio";

const FOOTER_YEAR = 2026;

export function PortfolioFooter() {
  return (
    <footer className="pf-footer">
      <span>
        © {FOOTER_YEAR} {PORTFOLIO.name}
      </span>
      <div className="pf-footer-links">
        {PORTFOLIO.social.map(({ href, label }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="pf-footer-link"
          >
            {label}
          </a>
        ))}
      </div>
      <span className="pf-footer-meta">{PORTFOLIO.location}</span>
    </footer>
  );
}
