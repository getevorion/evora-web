import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative pt-32 sm:pt-36 pb-10 overflow-hidden">
      <div className="bloom-accent" />
      <div className="shell relative">
        <Reveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
            level={1}
            align="left"
            className="max-w-2xl"
            titleClassName="text-[28px] leading-[1.1] tracking-[-0.025em] sm:text-[36px]"
            descriptionClassName="max-w-xl text-[14px]"
          />
          {children && <div className="mt-6">{children}</div>}
        </Reveal>
      </div>
    </section>
  );
}
