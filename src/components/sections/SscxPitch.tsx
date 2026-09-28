import Link from "next/link";
import { CloudArrowUp, ShieldCheck, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/site/Reveal";

export function SscxPitch() {
  return (
    <div>
      <div className="flex flex-col gap-3.5 lg:flex-row">

        <Reveal className="lg:flex-[1.7]">
          <article
            className="relative flex h-full min-h-[420px] flex-col justify-between overflow-hidden rounded-[12px] p-7 text-[#0a0b0f] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)] sm:min-h-[460px] sm:p-10"
            style={{
              background:
                "radial-gradient(120% 130% at 100% 0%, rgba(43,111,255,0.14) 0%, rgba(43,111,255,0) 55%), linear-gradient(140deg, #dbe3f3 0%, #e8ebf4 52%, #f1eef6 100%)",
            }}
          >

            <span
              aria-hidden
              className="pointer-events-none absolute -right-[8%] -top-[14%] z-0 select-none text-[clamp(16rem,26vw,24rem)] font-semibold leading-none text-[#2b6fff] opacity-[0.05]"
            >
              ⌘
            </span>

            <p className="relative z-[1] max-w-[19ch] text-[clamp(1.5rem,2.5vw,2.2rem)] font-medium leading-[1.12] tracking-[-0.028em] text-balance">
              Your client logic, lifted off the device and run inside
              Evorion&rsquo;s server space.
            </p>

            <div className="relative z-[1] mt-8 flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-[8px] bg-[#0a0b0f]/[0.06]">
                <CloudArrowUp weight="bold" className="size-[18px] text-[#0a0b0f]" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-semibold">Server-side code execution</span>
                <span className="text-[0.8125rem] text-[#0a0b0f]/60">Evorion 4</span>
              </span>
            </div>
          </article>
        </Reveal>

        <Reveal delay={0.08} className="lg:flex-1">
          <article
            className="relative flex h-full min-h-[420px] flex-col justify-between overflow-hidden rounded-[12px] p-7 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] sm:min-h-[460px] sm:p-10"
            style={{
              background:
                "linear-gradient(150deg, #1a6bff 0%, #0057ff 58%, #0046d4 100%)",
            }}
          >
            <p className="relative z-[1] max-w-[13ch] text-[clamp(1.5rem,2.5vw,2.2rem)] font-medium leading-[1.12] tracking-[-0.028em] text-balance">
              Code that never ships can&rsquo;t be cracked.
            </p>

            <div className="relative z-[1] mt-8 flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-[8px] bg-white/[0.16]">
                <ShieldCheck weight="bold" className="size-[18px] text-white" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-semibold">SSCX</span>
                <span className="text-[0.8125rem] text-white/70">The new integrity layer</span>
              </span>
            </div>
          </article>
        </Reveal>
      </div>

      <Reveal delay={0.12}>
        <div className="mt-6 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center md:gap-8">
          <p className="max-w-[48rem] text-[0.9375rem] leading-relaxed text-text-muted">
            Sensitive workloads run on Evora over your{" "}
            <strong className="font-semibold text-text">live session</strong>, clear the
            same integrity and auth checks, and hand back a result like any other
            API call.
          </p>
          <Link
            href="/docs"
            className="group inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[0.9375rem] font-medium text-text transition-colors hover:text-accent"
          >
            See how it works
            <ArrowRight
              weight="bold"
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
