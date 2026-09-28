"use client";

import { useState } from "react";

export type ChartPoint = { day: string; v: number };
export type ChartVariant = "line" | "bar";

export function MetricChart({
  data,
  variant = "line",
  color = "#2b6fff",
  compact = false,
}: {
  data: readonly ChartPoint[];
  variant?: ChartVariant;
  color?: string;
  compact?: boolean;
}) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const gradId = `ev-chart-grad-${variant}-${color.replace("#", "")}`;
  const barGradId = `ev-chart-bargrad-${color.replace("#", "")}`;
  const W = 1000;
  const H = compact ? 112 : 220;
  const padX = 24;
  const padTop = compact ? 16 : 24;
  const padBottom = compact ? 8 : 12;
  const chartH = H - padTop - padBottom;

  if (data.length === 0) {
    return (
      <div className={`ev-line-wrap ${compact ? "ev-line-wrap-compact" : ""}`}>
        <div className="ev-line-chart flex items-center justify-center" style={compact ? { height: 112 } : undefined}>
          <span className="text-[12px] text-[color:var(--ev-text-quaternary)]">No chart data yet</span>
        </div>
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.v));
  const min = Math.min(...data.map((d) => d.v));
  const span = Math.max(1, max - min);
  const stepX = data.length > 1 ? (W - padX * 2) / (data.length - 1) : 0;
  const points = data.map((d, i) => ({
    x: padX + i * stepX,
    y: padTop + chartH * (1 - (d.v - min) / span),
    label: d.day,
    v: d.v,
  }));

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");
  const baseline = padTop + chartH;
  const areaPath = `M ${points[0].x} ${baseline} L ${points
    .map((p) => `${p.x} ${p.y}`)
    .join(" L ")} L ${points[points.length - 1].x} ${baseline} Z`;
  const barW = Math.max(28, (W - padX * 2) / data.length - 18);

  return (
    <div className={`ev-line-wrap ${compact ? "ev-line-wrap-compact" : ""}`}>
      <div className="ev-line-chart" style={compact ? { height: 112 } : undefined}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="ev-line-svg"
          shapeRendering="geometricPrecision"
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.42" />
              <stop offset="52%" stopColor={color} stopOpacity="0.09" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
            <linearGradient id={barGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.95" />
              <stop offset="100%" stopColor={color} stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((p) => (
            <line
              key={p}
              x1={padX}
              x2={W - padX}
              y1={padTop + chartH * p}
              y2={padTop + chartH * p}
              stroke="rgba(255,255,255,0.04)"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          <line
            x1={padX}
            x2={W - padX}
            y1={baseline}
            y2={baseline}
            stroke="rgba(255,255,255,0.10)"
            vectorEffect="non-scaling-stroke"
          />

          {variant === "bar" ? (
            points.map((p, i) => {
              const h = baseline - p.y;
              return (
                <rect
                  key={`${p.label}-${i}`}
                  x={p.x - barW / 2}
                  y={p.y}
                  width={barW}
                  height={h}
                  rx={2.5}
                  fill={`url(#${barGradId})`}
                  opacity={hoverIdx === null || hoverIdx === i ? 1 : 0.55}
                  style={{ transition: "opacity 0.15s ease-out" }}
                />
              );
            })
          ) : (
            <>
              <path d={areaPath} fill={`url(#${gradId})`} />
              <polyline
                points={polyline}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}
        </svg>

        <div className="ev-line-points">
          {points.map((p, i) => {
            const xPct = (p.x / W) * 100;
            const yPct = (p.y / H) * 100;
            const isHover = hoverIdx === i;
            return (
              <button
                key={`${p.label}-${i}`}
                type="button"
                className={`ev-line-hit ${isHover ? "ev-line-hit-hover" : ""}`}
                style={{ left: `${xPct}%`, top: `${yPct}%` }}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                aria-label={`${p.label}: ${p.v}`}
              >
                {variant === "line" ? (
                  <span
                    className={`ev-line-dot${i === points.length - 1 ? " ev-line-dot-live" : ""}`}
                    style={{
                      background: color,
                      boxShadow: `0 0 0 2px #0f1011, 0 0 0 3px ${color}`,
                    }}
                  />
                ) : null}
                <span className="ev-line-tip">{p.v.toLocaleString()}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="ev-chart-axis">
        {points.map((p, i) => (
          <span key={`${p.label}-${i}`} style={{ left: `${(p.x / W) * 100}%` }}>
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}
