import type { Icon } from "@phosphor-icons/react";
import { GridFour } from "@phosphor-icons/react/dist/ssr/GridFour";
import { Compass } from "@phosphor-icons/react/dist/ssr/Compass";
import { UserCircle } from "@phosphor-icons/react/dist/ssr/UserCircle";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";

export const SectionIcon = {
  work: GridFour,
  skills: Compass,
  about: UserCircle,
  contact: EnvelopeSimple,
} as const satisfies Record<string, Icon>;

export type SectionIconKey = keyof typeof SectionIcon;

export function SectionEyebrow({
  icon,
  id,
  children,
}: {
  icon: SectionIconKey;
  id?: string;
  children: React.ReactNode;
}) {
  const Icon = SectionIcon[icon];
  return (
    <p className="pf-section-eyebrow" id={id}>
      <Icon size={15} weight="regular" aria-hidden />
      <span>{children}</span>
    </p>
  );
}
