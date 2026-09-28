"use client";

import React from 'react';

export function Sparkline({ data, id }: { data: number[]; id?: string }) {
  if (!data || data.length < 2) return null;
  const W = 100, H = 40, Pv = 4;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = W / (data.length - 1);
  const pts = data.map((v, i) => ({
    x: i * stepX,
    y: H - Pv - ((v - min) / range) * (H - 2 * Pv),
  }));

  const linePath = pts.reduce(
    (acc, p, i) => acc + (i === 0 ? `M ${p.x.toFixed(2)} ${p.y.toFixed(2)}` : ` L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`),
    '',
  );
  const areaPath = `${linePath} L ${pts[pts.length - 1].x.toFixed(2)} ${H} L ${pts[0].x.toFixed(2)} ${H} Z`;

  const gradId = React.useId();
  const stableId = id ?? gradId;

  const last = pts[pts.length - 1];

  return (
    <svg
      className="ev-kpi-spark"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`spark-${stableId}`} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="rgb(var(--evora-accent-r, 220) var(--evora-accent-g, 220) var(--evora-accent-b, 220))"
            stopOpacity="0.24"
          />
          <stop
            offset="100%"
            stopColor="rgb(var(--evora-accent-r, 220) var(--evora-accent-g, 220) var(--evora-accent-b, 220))"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>
      <path
        className="ev-kpi-spark-area"
        d={areaPath}
        fill={`url(#spark-${stableId})`}
        stroke="none"
      />
      <path
        className="ev-kpi-spark-line"
        d={linePath}
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        className="ev-kpi-spark-dot"
        cx={last.x}
        cy={last.y}
        r="1.6"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
