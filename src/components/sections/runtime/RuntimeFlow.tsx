import {
  Fingerprint,
  KeyRound,
  LockKeyhole,
  MemoryStick,
  RotateCcw,
  ScrollText,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

type Module = {
  icon: LucideIcon;
  label: string;
  detail: string;
};

const MODULES: Module[] = [
  {
    icon: KeyRound,
    label: "License enforcement",
    detail:
      "Entitlement state, seat counts, expiry, and a hard revoke path. Fails closed on any verification gap.",
  },
  {
    icon: LockKeyhole,
    label: "Session control",
    detail:
      "Short-lived tokens with DPoP chaining and replay protection. Sessions are scoped and non-transferable.",
  },
  {
    icon: Fingerprint,
    label: "Hardware binding",
    detail:
      "Device fingerprint tied to every active session — board, disk, network, and CPU.",
  },
  {
    icon: SlidersHorizontal,
    label: "Policy engine",
    detail:
      "Server-side rules resolved before any protected logic runs, enforced at every gate.",
  },
  {
    icon: ShieldCheck,
    label: "Runtime integrity",
    detail:
      "Anti-debug, anti-VM, polling, and trip latches. Detections surface as live telemetry events.",
  },
  {
    icon: MemoryStick,
    label: "Memory protection",
    detail:
      "Shielded sections restored across guarded paths with continuous CRC verification.",
  },
  {
    icon: ScrollText,
    label: "Telemetry",
    detail:
      "Decision log, trip events, and session trail — full audit history per device.",
  },
  {
    icon: RotateCcw,
    label: "Secure updates",
    detail:
      "Version policy, revocation, and signed config distribution. No unsigned payloads accepted.",
  },
];

export function RuntimeFlow({ delayBase = 0.2 }: { delayBase?: number }) {
  return (
    <div className="mx-auto w-[94%] max-w-6xl sm:w-[92%]">
      <div className="grid grid-cols-2 items-stretch gap-2.5 sm:gap-3 lg:grid-cols-4">
      {MODULES.map((m, i) => (
        <Reveal key={m.label} delay={delayBase + i * 0.065} duration={560} fade className="h-full">
          <article className="evorion-module-card flex h-full min-h-[5.5rem] flex-col rounded-lg px-3.5 py-4 sm:min-h-[5.75rem]">
            <m.icon className="size-[17px] shrink-0 text-accent" strokeWidth={1.5} />
            <h3 className="mt-2 text-[11px] font-light leading-tight tracking-[-0.01em] text-text-muted">
              {m.label}
            </h3>
            <p className="mt-1.5 flex-1 text-[10.5px] font-light leading-relaxed text-text-muted">
              {m.detail}
            </p>
          </article>
        </Reveal>
      ))}
      </div>
    </div>
  );
}
