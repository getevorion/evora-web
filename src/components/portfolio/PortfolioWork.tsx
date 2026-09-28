import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { PORTFOLIO } from "@/lib/portfolio";
import { SectionEyebrow } from "./SectionEyebrow";

export function PortfolioWork() {
  return (
    <section
      id="work"
      className="pf-work"
      aria-labelledby="pf-work-heading"
      data-reveal
    >
      <SectionEyebrow icon="work" id="pf-work-heading">
        Selected work
      </SectionEyebrow>
      {PORTFOLIO.selectedWork.map((item, i) => (
        <div
          className="pf-work-row"
          key={item.key}
          data-reveal
          style={{ ["--pf-reveal-delay" as string]: `${i * 90}ms` } as CSSProperties}
        >
          <p className="pf-work-index">{item.index}</p>
          <div className="pf-work-head">
            <h2 className="pf-work-title">{item.title}</h2>
            <p className="pf-work-meta">{item.meta}</p>
          </div>
          <div className="pf-work-body">
            <p className="pf-work-desc">{item.body}</p>
            {item.href ? (
              <Link href={item.href} className="pf-work-link">
                {item.caseLabel}
                <ArrowRight size={15} weight="regular" aria-hidden />
              </Link>
            ) : (
              <span className="pf-work-link" data-disabled="true">
                {item.caseLabel}
              </span>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
