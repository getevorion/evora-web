import { Reveal } from "@/components/site/Reveal";
import { FlagshipSscxRoadmap } from "@/components/sections/FlagshipSscxRoadmap";

export function FlagshipSseReveal() {
  return (
    <section
      id="server-side-execution"
      className="section-anchor py-16 sm:py-20"
      aria-labelledby="flagship-sse-title"
    >
      <div className="shell">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-faint">
              Coming in Evorion 4
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              id="flagship-sse-title"
              className="mt-3 text-[clamp(1.75rem,4.2vw,2.65rem)] font-medium leading-[1.06] tracking-[-0.038em]"
            >
              <span className="flagship-sse-lead">Server-side </span>
              <em className="flagship-sse-em not-italic">code execution</em>
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mx-auto mt-4 max-w-lg text-[clamp(0.9rem,1.8vw,1.05rem)] leading-snug">
              <span className="font-semibold text-text">Rules that run before your binary does.</span>
              <span className="mt-2 block font-normal leading-relaxed text-text-muted">
                Attestation, enforcement, and response on one surface the client cannot patch away.
              </span>
            </p>
          </Reveal>
        </div>

        <FlagshipSscxRoadmap />
      </div>
    </section>
  );
}
