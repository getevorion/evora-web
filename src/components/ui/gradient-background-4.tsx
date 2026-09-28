import { cn } from "@/lib/cn";

export function GradientBackground4({ className }: { className?: string }) {
  return (
    <div
      className={cn("absolute inset-0 h-full w-full bg-bg", className)}
      aria-hidden
      style={{
        background: [
          "radial-gradient(125% 125% at 50% -35%, color-mix(in srgb, var(--accent) 18%, transparent) 0%, transparent 58%)",
          "radial-gradient(90% 70% at 100% 100%, color-mix(in srgb, var(--accent) 6%, transparent) 0%, transparent 50%)",
          "var(--bg)",
        ].join(", "),
      }}
    />
  );
}
