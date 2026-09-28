import type { CSSProperties } from "react";

const BASE = "#3E3E44";
const MID = "#62666D";
const EDGE = "#D0D6E0";
const FACE = "#08090A";

const MONO =
  'ui-monospace, "SF Mono", "SFMono-Regular", Menlo, Consolas, "Liberation Mono", monospace';

const SW = 0.7;
const SWI = 0.42;

type P = [number, number];
const pt = (x: number, y: number): P => [x, y];
const f1 = (n: number) => n.toFixed(1);
const S = (q: P) => `${f1(q[0])} ${f1(q[1])}`;
const seg = (a: P, b: P) => `M${S(a)} L${S(b)}`;
const poly = (...q: P[]) => `M${q.map(S).join(" L")} Z`;
const add = (a: P, b: P): P => [a[0] + b[0], a[1] + b[1]];

function tile(cx: number, cy: number, w: number) {
  const h = w / 2;
  return {
    T: pt(cx, cy - h),
    R: pt(cx + w, cy),
    B: pt(cx, cy + h),
    L: pt(cx - w, cy),
    cx,
    cy,
    w,
    h,
  };
}
type Tile = ReturnType<typeof tile>;

function face(tl: Tile, u: number, v: number): P {
  const { L, B, T } = tl;
  return [
    L[0] + u * (B[0] - L[0]) + v * (T[0] - L[0]),
    L[1] + u * (B[1] - L[1]) + v * (T[1] - L[1]),
  ];
}

type CubeSpec = {
  key: string;
  cx: number;
  frontBottom: number;
  W: number;
  depth: number;
  hero: boolean;
  tag: string;
};

function scramble(n: number): number {
  let x = (n ^ 0x9e3779b9) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b) >>> 0;
  return (x ^ (x >>> 16)) >>> 0;
}

export function FigLift() {

  const OCC = "var(--bg)";

  const HERO_RIM = "#5E636B";
  const HERO_FOCAL = "#7C818A";
  const HERO_SEAM = "#2A2D33";
  const FLK_RIM = "#43474D";
  const FLK_FOCAL = "#565B62";
  const FLK_SEAM = "#25272C";

  const CELL = "#4E535A";
  const LBL = "#565A61";
  const LBL_HERO = "#7C818A";

  const GRID = 6;

  const cubes: CubeSpec[] = [
    { key: "M", cx: 160, frontBottom: 201, W: 72, depth: 76, hero: true, tag: "0x7f2a" },
    { key: "L", cx: 96, frontBottom: 221, W: 56, depth: 56, hero: false, tag: "0x1c4a" },
    { key: "R", cx: 224, frontBottom: 221, W: 56, depth: 56, hero: false, tag: "0x9f22" },
  ];

  const renderCube = (cb: CubeSpec, ci: number) => {
    const h = cb.W / 2;
    const cy = cb.frontBottom - h - cb.depth;
    const t = tile(cb.cx, cy, cb.W);
    const dn: P = [0, cb.depth];
    const Lb = add(t.L, dn);
    const Bb = add(t.B, dn);
    const Rb = add(t.R, dn);

    const RIM = cb.hero ? HERO_RIM : FLK_RIM;
    const FOCAL = cb.hero ? HERO_FOCAL : FLK_FOCAL;
    const SEAM = cb.hero ? HERO_SEAM : FLK_SEAM;
    const sw = cb.hero ? SW : 0.6;
    const gridOp = cb.hero ? "0.5" : "0.34";

    return (
      <g key={cb.key}>

        <path d={poly(t.B, t.R, Rb, Bb)} fill={OCC} stroke={RIM} strokeWidth={sw} strokeLinejoin="round" />
        <path d={poly(t.L, t.B, Bb, Lb)} fill={OCC} stroke={RIM} strokeWidth={sw} strokeLinejoin="round" />
        <path d={poly(t.T, t.R, t.B, t.L)} fill={OCC} stroke={RIM} strokeWidth={sw} strokeLinejoin="round" />

        <path d={seg(t.B, Bb)} stroke={FOCAL} strokeWidth={sw} strokeLinecap="round" />

        <path d={`${seg(t.L, Lb)} ${seg(t.R, Rb)}`} stroke={SEAM} strokeWidth={sw} strokeLinecap="round" />

        {Array.from({ length: GRID * GRID }, (_, idx) => {
          const col = idx % GRID;
          const row = Math.floor(idx / GRID);

          const hv = scramble(idx + ci * 137);
          if (hv % 6 !== 0) return null;
          const q0 = face(t, col / GRID, row / GRID);
          const q1 = face(t, (col + 1) / GRID, row / GRID);
          const q2 = face(t, (col + 1) / GRID, (row + 1) / GRID);
          const q3 = face(t, col / GRID, (row + 1) / GRID);

          const delay = ((((hv >>> 3) % 460) / 100)).toFixed(2);
          const dur = (3.2 + ((hv >>> 11) % 5) * 0.5).toFixed(2);
          return (
            <path
              key={idx}
              className="figvm-cell"
              d={poly(q0, q1, q2, q3)}
              fill={CELL}
              style={{ animationDelay: `${delay}s`, animationDuration: `${dur}s` } as CSSProperties}
            />
          );
        })}

        {Array.from({ length: GRID - 1 }, (_, k) => {
          const g = (k + 1) / GRID;
          return (
            <g key={k}>
              <path d={seg(face(t, g, 0), face(t, g, 1))} stroke={SEAM} strokeWidth={SWI} strokeOpacity={gridOp} />
              <path d={seg(face(t, 0, g), face(t, 1, g))} stroke={SEAM} strokeWidth={SWI} strokeOpacity={gridOp} />
            </g>
          );
        })}
      </g>
    );
  };

  const heroApexY = 201 - 36 - 76 - 36;

  return (
    <svg width="320" height="260" viewBox="0 0 320 260" fill="none" aria-hidden>

      <path
        d={`M${f1(40)} ${f1(223)} L${f1(280)} ${f1(223)}`}
        stroke={FLK_SEAM}
        strokeWidth={SWI}
        strokeOpacity="0.55"
        strokeLinecap="round"
      />

      {cubes.map(renderCube)}

      <path d={`M160 ${f1(heroApexY - 2)} L160 20`} stroke={LBL} strokeWidth={SWI} strokeLinecap="round" strokeOpacity="0.8" />
      <text x={160} y={14} fontSize="8" fill={LBL_HERO} fontFamily={MONO} letterSpacing="0.3" textAnchor="middle">
        vmid {cubes[0].tag}
      </text>

      <text x={96} y={239} fontSize="6.5" fill={LBL} fontFamily={MONO} letterSpacing="0.3" textAnchor="middle">
        {cubes[1].tag}
      </text>
      <text x={224} y={239} fontSize="6.5" fill={LBL} fontFamily={MONO} letterSpacing="0.3" textAnchor="middle">
        {cubes[2].tag}
      </text>

      <text x={160} y={253} fontSize="7.5" fill={LBL} fontFamily={MONO} letterSpacing="0.4" textAnchor="middle" opacity="0.85">
        sealed · no view
      </text>
    </svg>
  );
}

export function FigSigned() {
  const SLAB = "#7d8188";

  const cx = 160;
  const W = 100;
  const body = 90;
  const t = tile(cx, 88, W);
  const dn: P = [0, body];
  const Lb = add(t.L, dn);
  const Bb = add(t.B, dn);
  const Rb = add(t.R, dn);

  const face2 = (u: number, k: number): P => [
    t.B[0] + u * (t.R[0] - t.B[0]),
    t.B[1] + u * (t.R[1] - t.B[1]) + k * body,
  ];
  const BK = 0.6;

  const beat = (u0: number): P[] => [
    [u0, BK],
    [u0 + 0.02, BK],
    [u0 + 0.045, 0.5],
    [u0 + 0.065, BK],
    [u0 + 0.08, 0.67],
    [u0 + 0.095, 0.17],
    [u0 + 0.11, 0.71],
    [u0 + 0.125, BK],
    [u0 + 0.155, 0.52],
    [u0 + 0.175, BK],
  ];
  const tracePts: P[] = [[0.05, BK]];
  [0.075, 0.26, 0.445].forEach((u0) => beat(u0).forEach((p) => tracePts.push(p)));
  tracePts.push([0.68, BK]);
  const traceD = "M" + tracePts.map((p) => S(face2(p[0], p[1]))).join(" L");
  const termU = 0.68;

  const seal = face2(0.14, 0.25);
  const sr = 5;

  return (
    <svg width="320" height="260" viewBox="0 0 320 260" fill="none" aria-hidden>

      <path d={seg([cx - W - 6, Bb[1] + 5], [cx + W + 6, Bb[1] + 5])} stroke={BASE} strokeWidth={SWI} strokeOpacity="0.5" strokeLinecap="round" />

      <path
        d={`${seg(t.L, Lb)} ${seg(t.R, Rb)} M${S(Lb)} L${S(Bb)} L${S(Rb)}`}
        stroke={BASE}
        strokeWidth={SWI}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      <path d={poly(t.L, t.B, Bb, Lb)} fill={FACE} stroke={MID} strokeWidth={SWI} strokeLinejoin="round" />

      <path d={poly(t.B, t.R, Rb, Bb)} fill={FACE} stroke={BASE} strokeWidth={SWI} strokeLinejoin="round" />

      <path d={seg(t.B, Bb)} stroke={SLAB} strokeWidth={SW} strokeLinecap="round" />

      <path d={poly(t.T, t.R, t.B, t.L)} fill={FACE} stroke={SLAB} strokeWidth={SW} strokeLinejoin="round" />

      {[0.4, 0.52, 0.64].map((v, i) => (
        <path key={`vent${i}`} d={seg(face(t, 0.32, v), face(t, 0.7, v))} stroke={BASE} strokeWidth={SWI} strokeOpacity="0.5" strokeLinecap="round" />
      ))}

      <path
        d={poly(face2(0.05, 0.12), face2(0.95, 0.12), face2(0.95, 0.9), face2(0.05, 0.9))}
        fill="none"
        stroke={MID}
        strokeWidth={SWI}
        strokeLinejoin="round"
        strokeOpacity="0.9"
      />

      <g className="fighb-pulse">
        <path d={traceD} stroke={SLAB} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>

      <g className="fighb-terminate">
        <path d={seg(face2(termU, 0.42), face2(termU, 0.78))} stroke={MID} strokeWidth={SWI} strokeOpacity="0.7" strokeLinecap="round" />
        <path d={`M${S(face2(0.72, BK))} L${S(face2(0.9, BK))}`} stroke={BASE} strokeWidth={SWI} strokeDasharray="1.5 3" strokeLinecap="round" />
      </g>

      <path
        d={poly([seal[0], seal[1] - sr], [seal[0] + sr, seal[1]], [seal[0], seal[1] + sr], [seal[0] - sr, seal[1]])}
        fill={FACE}
        stroke={SLAB}
        strokeWidth={SWI}
        strokeLinejoin="round"
      />
      <path
        d={`M${f1(seal[0] - 2.2)} ${f1(seal[1])} L${f1(seal[0] - 0.5)} ${f1(seal[1] + 2)} L${f1(seal[0] + 2.4)} ${f1(seal[1] - 2.4)}`}
        stroke={SLAB}
        strokeWidth="0.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      <path d={`M${f1(t.T[0])} ${f1(t.T[1] - 2)} L${f1(t.T[0])} 34`} stroke={MID} strokeWidth={SWI} strokeOpacity="0.8" strokeLinecap="round" />
      <text x={t.T[0]} y={28} fontSize="8" fill={MID} fontFamily={MONO} letterSpacing="0.3" textAnchor="middle">
        ssn 8f3c
      </text>
      <text x={face2(0.84, 0.22)[0]} y={face2(0.84, 0.22)[1]} fontSize="6.5" fill={MID} fontFamily={MONO} letterSpacing="0.3" textAnchor="middle">
        terminated
      </text>
      <text x={cx} y={246} fontSize="7.5" fill={MID} fontFamily={MONO} letterSpacing="0.4" textAnchor="middle" opacity="0.85">
        signed heartbeats
      </text>
    </svg>
  );
}

export function FigLayers() {
  const cx = 160;
  const W = 80;

  const body = 16;
  const yC = [55, 91, 127, 163];
  const labels = ["Signed Calls", "Runtime Guards", "Integrity Mesh", "Hardware Bind"];

  const SLAB = "#7d8188";

  const slab = (i: number) => {
    const y = yC[i];
    const t = tile(cx, y, W);
    const dn: P = [0, body];
    const Lb = add(t.L, dn);
    const Bb = add(t.B, dn);
    const Rb = add(t.R, dn);
    return (
      <g key={`sl${i}`}>

        <path
          d={`${seg(t.L, Lb)} ${seg(t.R, Rb)} M${S(Lb)} L${S(Bb)} L${S(Rb)}`}
          stroke={BASE}
          strokeWidth={SWI}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        <path d={poly(t.L, t.B, Bb, Lb)} fill={FACE} stroke={MID} strokeWidth={SWI} strokeLinejoin="round" />
        <path d={poly(t.B, t.R, Rb, Bb)} fill={FACE} stroke={BASE} strokeWidth={SWI} strokeLinejoin="round" />

        <path d={seg(t.B, Bb)} stroke={SLAB} strokeWidth={SW} strokeLinecap="round" />

        <path d={poly(t.T, t.R, t.B, t.L)} fill={FACE} stroke={SLAB} strokeWidth={SW} strokeLinejoin="round" />

        {(() => {
          const onLeft = i % 2 === 0;
          const v = onLeft ? t.L : t.R;
          const size = 3.2;
          const ax = onLeft ? v[0] - 7 : v[0] + 7;
          const ay = v[1];

          const chevron = onLeft
            ? `M${f1(ax - size)} ${f1(ay - size)} L${f1(ax)} ${f1(ay)} L${f1(ax - size)} ${f1(ay + size)}`
            : `M${f1(ax + size)} ${f1(ay - size)} L${f1(ax)} ${f1(ay)} L${f1(ax + size)} ${f1(ay + size)}`;
          return (
            <>
              <path
                d={chevron}
                stroke={SLAB}
                strokeWidth={SWI}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <text
                x={onLeft ? v[0] - 15 : v[0] + 15}
                y={v[1]}
                fontSize="8.5"
                fill={SLAB}
                textAnchor={onLeft ? "end" : "start"}
                dominantBaseline="middle"
                letterSpacing="-0.005em"
                fontWeight={500}
              >
                {labels[i]}
              </text>
            </>
          );
        })()}
      </g>
    );
  };

  return (
    <svg width="320" height="260" viewBox="0 0 320 260" fill="none" aria-hidden>

      {[3, 2, 1, 0].map(slab)}
    </svg>
  );
}
