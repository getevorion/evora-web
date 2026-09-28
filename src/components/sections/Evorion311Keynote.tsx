import { Reveal } from "@/components/site/Reveal";

const HIGHLIGHTS: string[] = [
  "Stronger defaults across auth, transport, and signed upgrade paths so fewer sharp edges ship enabled by mistake.",
  "Hardware-derived key material ties session proofs to the machine that earned them — a lifted token does not transplant.",
  "Suicide code execution: policy on the server can revoke in-process capability without a cooperating client.",
  "Tighter attestation checks and clearer failure surfaces on the same API shape as 3.x.",
];

export function Evorion311Keynote() {
  return (
    <section
      id="evorion-4"
      className="section-anchor relative flex min-h-[min(92svh,880px)] flex-col justify-center py-24 sm:py-32"
      aria-labelledby="evorion-4-title"
    >
      <div className="shell">
        <div className="keynote-deck mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="keynote-eyebrow text-[10px] font-semibold uppercase tracking-[0.22em]">
              Introducing
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              id="evorion-4-title"
              className="mt-3 text-[clamp(1.85rem,4.4vw,2.85rem)] font-medium leading-[1.05] tracking-[-0.042em]"
            >
              <span className="keynote-title-lead">Evorion </span>
              <em className="keynote-title-em not-italic">4</em>
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mx-auto mt-4 max-w-lg text-[clamp(0.92rem,1.85vw,1.08rem)] leading-snug">
              <span className="keynote-lede font-semibold">Major hardening across auth, transport, and runtime policy.</span>
              <span className="mt-2 block font-normal leading-relaxed text-text-muted">
                Same integration surface, stricter proofs, and runtime controls you can enforce from the server when the
                session stops looking like yours.
              </span>
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <ul className="mx-auto mt-14 max-w-2xl space-y-4 text-left sm:mt-16">
            {HIGHLIGHTS.map((line, i) => (
              <li
                key={i}
                className="text-[13px] leading-relaxed text-text-muted sm:text-[13.5px]"
              >
                {line}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
