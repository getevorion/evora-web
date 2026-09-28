"use client";

import { cn } from "@/lib/cn";

export type StackedBarPoint = {
  white: number;
  purple: number;
  yellow: number;
  label?: string;
};

export function StackedBarChart({
  data,
  max,
  hoverIndex,
  onHover,
  className,
}: {
  data: readonly StackedBarPoint[];
  max?: number;
  hoverIndex?: number | null;
  onHover?: (index: number | null) => void;
  className?: string;
}) {
  const chartMax =
    max ??
    Math.max(
      1,
      ...data.map((d) => d.white + d.purple + d.yellow),
    );

  const gridSteps = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180].filter((v) => v <= chartMax);
  if (gridSteps[gridSteps.length - 1] !== chartMax) {
    gridSteps.push(chartMax);
  }

  return (
    <div className={cn("ev-dash-chart", className)} style={{ ["--ev-chart-max" as string]: chartMax }}>
      <div className="ev-dash-chart-area">
        {gridSteps.map((step) => (
          <div
            key={step}
            className={cn("ev-dash-grid-line", step === 0 && "ev-dash-grid-line-base")}
            style={{ bottom: `${(step / chartMax) * 100}%` }}
          />
        ))}

        <div className="ev-dash-bars">
          {data.map((point, i) => {
            const h = (v: number) => `${(v / chartMax) * 100}%`;
            const dim = hoverIndex != null && hoverIndex !== i;
            return (
              <div
                key={i}
                className="ev-dash-bar-col"
                data-dim={dim ? "true" : undefined}
                onMouseEnter={() => onHover?.(i)}
                onMouseLeave={() => onHover?.(null)}
              >
                <span className="ev-dash-seg-yellow" style={{ height: h(point.yellow) }} />
                <span className="ev-dash-seg-purple" style={{ height: h(point.purple) }} />
                <span className="ev-dash-seg-white" style={{ height: h(point.white) }} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="ev-dash-avatars">
        {data.map((_, i) => (
          <div key={i} className="ev-dash-avatar-slot">
            <span
              className="ev-dash-avatar"
              style={{ opacity: hoverIndex != null && hoverIndex !== i ? 0.45 : 1 }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
