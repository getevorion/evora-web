import Image from "next/image";
import { cn } from "@/lib/cn";

export function Logo({
  size = 22,
  withWordmark = true,
  wordmarkFirst = false,
  className,
  wordmarkClassName,
  tint,
}: {
  size?: number;
  withWordmark?: boolean;
  wordmarkFirst?: boolean;
  className?: string;
  wordmarkClassName?: string;

  tint?: "accent";
}) {
  const wordmark = withWordmark ? (
    <span
      className={cn(
        "text-[15px] font-medium tracking-tight",
        wordmarkClassName
      )}
    >
      Evora
    </span>
  ) : null;

  const mark =
    tint === "accent" ? (
      <span
        aria-hidden
        className="select-none inline-block"
        style={{
          width: size,
          height: size,
          background:
            "rgb(var(--evora-accent-r, 235) var(--evora-accent-g, 235) var(--evora-accent-b, 235))",
          WebkitMaskImage: "url(/evora-white.png)",
          maskImage: "url(/evora-white.png)",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
    ) : (
      <Image
        src="/evora-white.png"
        alt=""
        width={Math.round(size)}
        height={Math.round(size)}
        priority
        className="select-none object-contain"
        style={{ width: size, height: size }}
      />
    );

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {wordmarkFirst ? (
        <>
          {wordmark}
          {mark}
        </>
      ) : (
        <>
          {mark}
          {wordmark}
        </>
      )}
    </span>
  );
}
