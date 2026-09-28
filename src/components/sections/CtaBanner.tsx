import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";

export function CtaBanner() {
  return (
    <section className="py-20 sm:py-24">
      <div className="shell">
        <div className="relative overflow-hidden rounded-2xl bg-surface">
          <div className="absolute inset-0 grid-bg pointer-events-none opacity-30" />
          <div className="bloom-accent" />
          <div className="relative px-8 py-14 text-center sm:py-16">
            <h2 className="mx-auto max-w-lg text-[clamp(1.65rem,3.5vw,2.25rem)] font-medium leading-[1.08] tracking-[-0.035em]">
              <span className="keynote-title-lead">Drop one header. </span>
              <span className="keynote-title-em">Ship the rest.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-[13.5px] text-text-muted">
              Sandbox keys are free. Production keys take a 24h review.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <Link
                href={SITE.links.signUp}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-medium text-black transition-colors hover:bg-accent-hover"
              >
                Apply for access
                <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href={SITE.social.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full px-4 py-2 text-[13px] text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
              >
                Join Discord
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
