import { FloatingPathsBackground } from "@/components/ui/floating-paths";

export function SiteBackground() {
  return (
    <FloatingPathsBackground
      position={1}
      className="floating-paths-backdrop pointer-events-none fixed inset-0 z-0"
    />
  );
}
