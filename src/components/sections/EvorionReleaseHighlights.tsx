"use client";

import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/cn";

const RELEASE_POINTS = [
  "Stricter defaults on auth, transport, and signed upgrades.",
  "Hardware-derived keys: proofs stay on the host that earned them.",
  "Suicide execution: server policy can revoke in-process capability.",
  "Tighter attestation and clearer failures on the same API surface as 3.x.",
] as const;

type EvorionReleaseHighlightsProps = {
  className?: string;
  baseDelay?: number;
};

export function EvorionReleaseHighlights({
  className,
  baseDelay = 1.4,
}: EvorionReleaseHighlightsProps) {
  return (
    <div className={cn("mx-auto w-full max-w-2xl px-1 sm:max-w-3xl", className)}>
      <ul className="grid grid-cols-1 gap-y-5 sm:grid-cols-2 sm:gap-x-16 sm:gap-y-6">
        {RELEASE_POINTS.map((text, i) => (
          <li key={text} className="text-center sm:text-left">
            <Reveal delay={baseDelay + i * 0.12} duration={620} fade>
              <p className="text-[13px] font-normal leading-[1.65] text-text-muted sm:text-[13.5px]">
                {text}
              </p>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}
