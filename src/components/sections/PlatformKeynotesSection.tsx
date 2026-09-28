import { Reveal } from "@/components/site/Reveal";
import { ChangelogRail } from "@/components/sections/ChangelogRail";
import { FlagshipSscxRoadmap } from "@/components/sections/FlagshipSscxRoadmap";

export function PlatformKeynotesSection() {
  return (
    <section
      id="platform-keynotes"
      className="section-anchor"
      aria-label="server-side execution"
    >
      <div className="shell relative z-[1] py-16 sm:py-20 md:py-24">
        <div id="server-side-execution" className="scroll-mt-[96px] w-full">
          <div className="keynote-deck mx-auto w-full max-w-3xl text-center">
            <Reveal>
              <p className="keynote-eyebrow text-[10px] font-semibold uppercase tracking-[0.22em]">
                Coming in Evorion 4
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <h2
                id="flagship-sse-title"
                className="mt-3 text-[clamp(1.85rem,4.4vw,2.85rem)] font-medium leading-[1.05] tracking-[-0.042em] text-balance"
              >
                <span className="keynote-title-lead">Server-side </span>
                <em className="keynote-title-em not-italic">code execution</em>
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mx-auto mt-4 max-w-lg text-[clamp(0.9rem,1.75vw,1.05rem)] leading-relaxed text-balance">
                <span className="text-text-muted">
                  Attestation, enforcement, and response on one surface the client cannot patch away.
                </span>
              </p>
            </Reveal>
          </div>

          <div className="relative mt-10 w-full md:mt-12">
            <FlagshipSscxRoadmap />
          </div>
        </div>

        <ChangelogRail className="mt-16 md:mt-20 lg:mt-24" />
      </div>
    </section>
  );
}
