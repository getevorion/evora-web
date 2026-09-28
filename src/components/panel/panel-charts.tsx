"use client";

import React, { useId } from "react";

function buildPath(data: number[], w: number, h: number, max: number, pad = 1.5): { line: string; area: string } {
  const n = data.length;
  if (n === 0) return { line: "", area: "" };
  const usable = h - pad * 2;
  const x = (i: number) => (n === 1 ? w / 2 : (i / (n - 1)) * w);
  const y = (v: number) => h - pad - (max === 0 ? 0 : (v / max) * usable);
  let line = `M${x(0).toFixed(2)} ${y(data[0]).toFixed(2)}`;
  for (let i = 1; i < n; i++) line += ` L${x(i).toFixed(2)} ${y(data[i]).toFixed(2)}`;
  const area = `${line} L${w} ${h} L0 ${h} Z`;
  return { line, area };
}

function niceMax(raw: number): number {
  if (raw <= 0) return 4;
  const exp = Math.floor(Math.log10(raw));
  const base = Math.pow(10, exp);
  for (const m of [1, 2, 2.5, 5, 10]) {
    if (raw <= m * base) return m * base;
  }
  return 10 * base;
}

function fmtTick(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(v % 1_000 === 0 ? 0 : 1)}k`;
  return String(v);
}

export function PanelSpark({ data }: { data: number[] }) {
  const gid = useId().replace(/[:]/g, "");
  const W = 100;
  const H = 30;
  const max = Math.max(...data, 1);
  const { line, area } = buildPath(data, W, H, max);
  return (
    <svg
      className="pnl-spark"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`cfsp-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--pnl-viz, var(--pnl-chart))" stopOpacity="0.34" />
          <stop offset="100%" stopColor="var(--pnl-viz, var(--pnl-chart))" stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#cfsp-${gid})`} stroke="none" />
      <path
        d={line}
        fill="none"
        stroke="var(--pnl-viz, var(--pnl-chart))"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function PanelAxisChart({ data }: { data: number[] }) {
  const gid = useId().replace(/[:]/g, "");
  const W = 100;
  const H = 40;
  const rawMax = Math.max(...data, 1);
  const max = niceMax(rawMax);
  const ticks = [max, (max * 2) / 3, max / 3, 0];
  const { line, area } = buildPath(data, W, H, max);

  return (
    <div className="pnl-axis-chart">
      <div className="pnl-axis-plot">
        {ticks.slice(0, 3).map((t, i) => (
          <span key={i} className="pnl-axis-grid" style={{ top: `${(1 - t / max) * 100}%` }} aria-hidden />
        ))}
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id={`cfax-${gid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--pnl-viz, var(--pnl-chart))" stopOpacity="0.30" />
              <stop offset="100%" stopColor="var(--pnl-viz, var(--pnl-chart))" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#cfax-${gid})`} stroke="none" />
          <path
            d={line}
            fill="none"
            stroke="var(--pnl-viz, var(--pnl-chart))"
            strokeWidth="1.6"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      <div className="pnl-axis-labels" aria-hidden>
        {ticks.map((t, i) => (
          <span key={i} style={{ top: `${(1 - t / max) * 100}%` }}>{fmtTick(Math.round(t))}</span>
        ))}
      </div>
    </div>
  );
}
