import type { ReactNode } from "react";
import "./panel-showcase.css";

type Tone = "blue" | "purple" | "orange" | "green" | "red";

export function ShowcaseSection({
  id,
  eyebrow,
  eyebrowTone = "purple",
  title,
  subtitle,
  lede,
  kicker,
  layout = "text-left",
  first = false,

  dataCv,
  children,
}: {
  id?: string;
  eyebrow: string;
  eyebrowTone?: Tone;
  title: ReactNode;
  subtitle?: ReactNode;
  lede?: ReactNode;
  kicker: ReactNode;
  layout?: "text-left" | "text-right" | "stacked" | "feature";
  first?: boolean;
  dataCv?: "auto";
  children: ReactNode;
}) {

  void layout;
  void eyebrowTone;

  return (
    <section
      id={id}
      className={`ev-showcase-section ${first ? "ev-showcase-section-first" : ""}`}
      data-cv={dataCv}
    >
      <div className="ev-showcase-inner">
        <header className="ev-showcase-header">
          <div className="ev-showcase-header-title">
            <p className="ev-showcase-eyebrow">{eyebrow}</p>
            <h2 className="ev-showcase-h2">{title}</h2>
            {subtitle ? <p className="ev-showcase-subtitle">{subtitle}</p> : null}
            {lede ? <p className="ev-showcase-lede">{lede}</p> : null}
          </div>
          <div className="ev-showcase-header-desc">
            <p className="ev-showcase-kicker">{kicker}</p>
          </div>
        </header>
        <div className="ev-showcase-stage ev-showcase-illustration">{children}</div>
      </div>
    </section>
  );
}
