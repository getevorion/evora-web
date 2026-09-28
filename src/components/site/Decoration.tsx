import { cn } from "@/lib/cn";

export function GridBg({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 -z-10 grid-bg pointer-events-none",
        className
      )}
    />
  );
}

export function DotBg({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 -z-10 dot-bg pointer-events-none",
        className
      )}
    />
  );
}

export function AccentBloom({ className }: { className?: string }) {
  return <div aria-hidden className={cn("bloom-accent", className)} />;
}
