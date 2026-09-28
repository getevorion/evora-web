import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SITE } from "@/lib/site";

const EVORION_4_HIGHLIGHTS: [string, string][] = [
  ["Stricter defaults on auth, transport,", "and signed upgrades."],
  ["Hardware-derived keys: proofs stay", "on the host that earned them."],
  ["Suicide execution: server policy", "can revoke in-process capability."],
  ["Tighter attestation and clearer failures", "on the same API surface as 3.x."],
];

export function ProductSection() {
  return (
    <section
      id="evorion"
      className="section-anchor relative overflow-hidden py-20 sm:py-24"
    >
      <div className="shell">
        <Reveal>
          <div id="evorion-4" className="scroll-mt-[96px]">
            <div className="keynote-deck mx-auto max-w-3xl text-center">
              <p className="keynote-eyebrow text-[10px] font-semibold uppercase tracking-[0.22em]">
                Introducing
              </p>
              <h2
                id="evorion-4-title"
                className="mt-3 text-[clamp(1.85rem,4.5vw,3.1rem)] font-medium leading-[1.05] tracking-[-0.042em]"
              >
                <span className="keynote-title-lead">Evorion </span>
                <em className="keynote-title-em not-italic">4</em>
              </h2>
              <p className="mx-auto mt-1 max-w-lg text-[clamp(0.92rem,1.75vw,1.06rem)] leading-snug sm:mt-1.5">
                <span className="keynote-title-lead">Major hardening across auth, transport, </span>
                <span className="keynote-title-em not-italic">and runtime policy.</span>
              </p>
              <p className="keynote-body-gradient mx-auto mt-3 max-w-2xl text-[clamp(0.9rem,1.75vw,1.05rem)] leading-relaxed sm:mt-3.5">
                One C++ surface routes every protected action through license enforcement, device binding, policy,
                integrity checks, memory guards, telemetry, and signed updates.
              </p>
            </div>

            <div className="mt-10 flex justify-center sm:mt-11">
              <ul className="inline-grid max-w-full grid-cols-1 gap-x-14 gap-y-10 text-left sm:grid-cols-2 sm:gap-x-16 sm:gap-y-10 md:gap-x-20">
                {EVORION_4_HIGHLIGHTS.map(([a, b], i) => (
                  <li key={i} className="min-w-0">
                    <p className="min-w-0 text-[12.5px] leading-tight text-text-muted sm:text-[13px]">
                      <span className="block">{a}</span>
                      <span className="block">{b}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:mt-9">
              <Link
                href={SITE.links.signUp}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-semibold text-black transition-colors hover:bg-accent-hover"
              >
                Get access <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center rounded-full px-4 py-2 text-[13px] text-text-muted transition-colors hover:bg-surface hover:text-text"
              >
                View integration
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
