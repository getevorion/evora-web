import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  level = 2,
  align = "center",
  className,
  titleClassName,
  descriptionClassName,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  level?: 1 | 2;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}) {
  const Title = level === 1 ? "h1" : "h2";

  return (
    <div
      className={cn(
        align === "center" && "mx-auto text-center",
        align === "left" && "text-left",
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "inline-flex items-center rounded-full border border-accent/20 bg-accent-soft px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-accent",
            align === "center" && "mx-auto"
          )}
        >
          {eyebrow}
        </div>
      )}
      <Title
        className={cn(
          "heading-gradient mt-3 text-2xl font-medium leading-[1.04] tracking-[-0.035em] sm:text-3xl",
          titleClassName
        )}
      >
        {title}
      </Title>
      {description && (
        <p
          className={cn(
            "mt-3 text-[13.5px] leading-relaxed text-text-muted",
            align === "center" && "mx-auto",
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
