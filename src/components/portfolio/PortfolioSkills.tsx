import { BentoCard } from "@/components/portfolio/PortfolioBento";
import { PORTFOLIO } from "@/lib/portfolio";
import { SectionEyebrow } from "./SectionEyebrow";

export function PortfolioSkills() {
  const { skills } = PORTFOLIO;
  return (
    <section
      id="skills"
      className="pf-skills"
      aria-labelledby="pf-skills-heading"
      data-reveal
    >
      <header className="pf-skills-header">
        <SectionEyebrow icon="skills">{skills.eyebrow}</SectionEyebrow>
        <h2 className="pf-skills-h1" id="pf-skills-heading">
          {skills.headline}
        </h2>
      </header>
      <div className="pf-bare">
        <div className="ev-bentos">
          {PORTFOLIO.traits.map((trait, i) => (
            <BentoCard key={trait.key} skill={trait} revealDelay={i * 110} />
          ))}
        </div>
      </div>
    </section>
  );
}
