import Image from "next/image";
import { PORTFOLIO } from "@/lib/portfolio";
import { SectionEyebrow } from "./SectionEyebrow";

export function PortfolioAbout() {
  const { about } = PORTFOLIO;
  return (
    <section
      id="about"
      className="pf-about"
      aria-labelledby="pf-about-heading"
      data-reveal
    >
      <div className="pf-about-inner">
        <SectionEyebrow icon="about">{about.eyebrow}</SectionEyebrow>
        <h2 className="pf-about-h2" id="pf-about-heading">
          {about.headline}
        </h2>
        <div className="pf-about-body">
          {about.paragraphs.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
        <figure className="pf-about-figure">
          <a
            className="pf-about-figure-link"
            href="https://evora.cx"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="See the Evora frontend"
          >
            <Image
              src="/portfolio/frontend.png"
              alt="Evora landing page — Be prepared for the AI frontier, over a preview of the Evorion dashboard."
              width={1918}
              height={896}
              sizes="(max-width: 900px) 100vw, 640px"
              quality={95}
              priority={false}
            />
          </a>
          <figcaption className="pf-about-figure-caption">
            evora.cx, one of the frontends I own end to end. Near-black
            ground, Inter, one accent, low chrome.
          </figcaption>
        </figure>
        <dl className="pf-about-facts">
          {about.facts.map((fact) => (
            <div key={fact.label} style={{ display: "contents" }}>
              <dt className="pf-about-fact-label">{fact.label}</dt>
              <dd className="pf-about-fact-value" style={{ margin: 0 }}>
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
