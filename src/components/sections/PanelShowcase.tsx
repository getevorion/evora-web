"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";

function useVisibilityTicker(
  callback: () => void,
  intervalMs: number,
  enabled: boolean,
) {
  const cbRef = useRef(callback);
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => { cbRef.current = callback; }, [callback]);

  useEffect(() => {
    if (!enabled) return;
    let timer: number | null = null;
    let visible = false;
    let docVisible = !document.hidden;

    const start = () => {
      if (timer != null) return;
      timer = window.setInterval(() => cbRef.current(), intervalMs);
    };
    const stop = () => {
      if (timer != null) {
        window.clearInterval(timer);
        timer = null;
      }
    };
    const tick = () => {
      if (visible && docVisible) start();
      else stop();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible = e.isIntersecting;
          if (rootRef.current) {
            if (visible) rootRef.current.setAttribute("data-inview", "");
            else rootRef.current.removeAttribute("data-inview");
          }
        }
        tick();
      },
      { rootMargin: "200px" },
    );
    if (rootRef.current) observer.observe(rootRef.current);

    const onVis = () => {
      docVisible = !document.hidden;
      tick();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [enabled, intervalMs]);

  return rootRef;
}

function useInViewAttr<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) el.setAttribute("data-inview", "");
          else el.removeAttribute("data-inview");
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}
import {
  Check,
  Fingerprint,
  Lock,
  RefreshCw,
  Send,
  Server,
  ShieldOff,
  X,
} from "lucide-react";

import "./panel-showcase.css";
import { FigLift, FigSigned, FigLayers } from "./bento-figures";

export { ShowcaseSection } from "./ShowcaseSection";

function ShowcaseFrame({
  children,
  height = 480,
}: {
  children: ReactNode;
  height?: number;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    lastPosRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const pos = lastPosRef.current;
      const node = wrapRef.current;
      if (!pos || !node) return;
      node.style.setProperty("--mask-x", `${pos.x}%`);
      node.style.setProperty("--mask-y", `${pos.y}%`);
    });
  };

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  return (
    <div className="ev-showcase-shell" data-height style={{ height }}>
      <div
        ref={wrapRef}
        className="ev-showcase-frame"
        onMouseMove={onMove}
        style={{ "--mask-x": "50%", "--mask-y": "50%" } as CSSProperties}
      >
        <div className="ev-showcase-panel">
          <div className="ev-showcase-glow" aria-hidden />
          <div className="ev-showcase-body">{children}</div>
        </div>
        <div className="ev-showcase-shine" aria-hidden />
      </div>
    </div>
  );
}

function RadialGauge({
  pct,
  label,
  sub,
}: {
  pct: number;
  label: string;
  sub: string;
}) {
  const clamped = Math.max(0, Math.min(100, pct));
  const radius = 38;
  const circ = Math.PI * radius;
  const offset = circ * (1 - clamped / 100);
  return (
    <div className="ev-gauge">
      <svg viewBox="0 0 100 60" className="ev-gauge-svg" aria-hidden>
        <path
          d={`M 12 50 A ${radius} ${radius} 0 0 1 88 50`}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M 12 50 A ${radius} ${radius} 0 0 1 88 50`}
          stroke="var(--ev-accent)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 520ms cubic-bezier(.22,1,.36,1)",
          }}
        />
      </svg>
      <div className="ev-gauge-label">{label}</div>
      <div className="ev-gauge-sub">{sub}</div>
    </div>
  );
}

type LicRow = {
  id: string;
  customer: string;
  plan: "Free" | "Pro" | "Ultra";
  seats: string;
  hwid: "Locked" | "Bound" | "Unbound";
  days: number;
  state: "ok" | "warn" | "expired";
  region: string;
};

type LicEvent = { tone: "ok" | "warn" | "err" | "muted"; label: string; time: string };

const LIC_EVENTS: Record<string, LicEvent[]> = {
  "LIC-9821": [
    { tone: "ok",    label: "Auth verified · 23 ips",            time: "9m"  },
    { tone: "muted", label: "Seat added · @priya",                time: "2h"  },
    { tone: "muted", label: "Issued · 120/200 seats",             time: "11d" },
  ],
  "LIC-9823": [
    { tone: "warn",  label: "Expiring · 2 days remaining",        time: "now" },
    { tone: "ok",    label: "Auth verified · 4 ips",              time: "27m" },
    { tone: "muted", label: "HWID locked · 0x71BA…CC04",          time: "9d"  },
  ],
  "LIC-9822": [
    { tone: "ok",    label: "Auth verified · ap-sg",              time: "12m" },
    { tone: "muted", label: "HWID bound · awaiting confirmation", time: "3h"  },
    { tone: "muted", label: "Issued · 8/10 seats",                time: "47d" },
  ],
  "LIC-9824": [
    { tone: "err",   label: "Auth rejected · seat expired",       time: "now" },
    { tone: "muted", label: "Seat consumed · 1/1",                time: "62d" },
    { tone: "muted", label: "Issued · trial",                     time: "92d" },
  ],
};

const LIC_ROWS: LicRow[] = [
  { id: "LIC-9821", customer: "Northwind AI", plan: "Ultra", seats: "120 / 200", hwid: "Locked",  days: 187, state: "ok",      region: "us-east" },
  { id: "LIC-9823", customer: "Raze Systems", plan: "Pro",   seats: "12 / 12",   hwid: "Locked",  days: 2,   state: "warn",    region: "eu-fra"  },
  { id: "LIC-9822", customer: "Axiom Labs",   plan: "Pro",   seats: "8 / 10",    hwid: "Bound",   days: 47,  state: "ok",      region: "ap-sg"   },
  { id: "LIC-9824", customer: "Synthwave",    plan: "Free",  seats: "1 / 1",     hwid: "Unbound", days: 0,   state: "expired", region: "us-west" },
];

type LicAction = {
  id: "rotate" | "addseat" | "extend" | "transfer" | "revoke";
  label: string;
  icon: typeof RefreshCw;
  tone: LicEvent["tone"];
  result: string;
};

const LIC_ACTIONS: LicAction[] = [
  { id: "rotate", label: "Rotate key", icon: RefreshCw, tone: "ok",  result: "Key rotated · new fingerprint issued" },
  { id: "extend", label: "Extend",     icon: Send,      tone: "ok",  result: "Extended · +30 days applied" },
  { id: "revoke", label: "Revoke",     icon: ShieldOff, tone: "err", result: "Revoked · seats released" },
];

export function LicensingShowcase() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [actionLog, setActionLog] = useState<Record<string, LicEvent[]>>({});
  const [fired, setFired] = useState<Set<string>>(new Set());
  const current = LIC_ROWS[idx];

  const cycleRef = useVisibilityTicker(
    () => setIdx((i) => (i + 1) % LIC_ROWS.length),
    3400,
    !paused,
  ) as React.RefObject<HTMLDivElement>;

  const pct =
    current.state === "expired"
      ? 0
      : Math.min(100, Math.round((current.days / 365) * 100));

  const handleAction = (action: LicAction) => {
    const key = `${current.id}:${action.id}`;
    if (fired.has(key)) return;
    setFired((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
    setActionLog((prev) => {
      const existing = prev[current.id] ?? [];
      const next: LicEvent = { tone: action.tone, label: action.result, time: "now" };
      return { ...prev, [current.id]: [next, ...existing].slice(0, 4) };
    });
  };

  const events = [
    ...(actionLog[current.id] ?? []),
    ...LIC_EVENTS[current.id],
  ].slice(0, 5);

  return (
    <ShowcaseFrame height={640}>
      <div
        ref={cycleRef}
        className="ev-showcase-split ev-showcase-split--wide"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="ev-showcase-pane">
          <div className="ev-lin-cmdk-input" role="presentation">
            <Fingerprint
              className="ev-lin-cmdk-icon size-4"
              strokeWidth={1.75}
            />
            <span className="ev-lin-cmdk-blink" aria-hidden />
            <span className="ev-lin-cmdk-placeholder">
              Find license…
            </span>
            <span className="ev-lin-cmdk-meta">
              {LIC_ROWS.length}
            </span>
          </div>
          <ul className="ev-lin-list">
            {LIC_ROWS.map((row, i) => {
              const tone =
                row.state === "ok"
                  ? "ok"
                  : row.state === "warn"
                    ? "warn"
                    : row.state === "expired"
                      ? "err"
                      : "mute";
              return (
                <li
                  key={row.id}
                  className="ev-lin-item"
                  data-selected={i === idx}
                  onClick={() => setIdx(i)}
                >
                  <span
                    className="ev-lin-item-avatar"
                    data-tone={tone === "ok" ? undefined : tone}
                    aria-hidden
                  >
                    {row.customer.charAt(0)}
                  </span>
                  <span className="ev-lin-item-body">
                    <span className="ev-lin-item-title">{row.customer}</span>
                    <span className="ev-lin-item-sub">
                      {row.id} · {row.seats}
                    </span>
                  </span>
                  <span
                    className={`ev-lin-badge ev-lin-badge-${row.plan.toLowerCase()}`}
                  >
                    {row.plan}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="ev-showcase-pane">
          <div className="ev-showcase-pane-head">
            <span className="ev-showcase-pane-title">Inspector</span>
            <span className="ev-showcase-pane-meta">{current.id}</span>
          </div>
          <div className="ev-showcase-inspector-body">
            <div className="ev-showcase-inspector-head">
              <div className="ev-showcase-avatar">
                {current.customer.charAt(0)}
              </div>
              <div className="ev-showcase-name-stack">
                <span className="ev-showcase-name">{current.customer}</span>
                <span className="ev-showcase-name-sub">
                  {current.plan} · {current.seats}
                </span>
              </div>
            </div>

            <RadialGauge
              pct={pct}
              label={current.state === "expired" ? "—" : `${current.days}d`}
              sub={current.state === "expired" ? "Expired" : "Remaining"}
            />

            <div className="ev-showcase-prop-grid">
              <div className="ev-showcase-prop">
                <Fingerprint className="size-3.5" strokeWidth={1.75} />
                <span className="ev-showcase-prop-label">HWID</span>
                <span className="ev-showcase-prop-value">{current.hwid}</span>
              </div>
              <div className="ev-showcase-prop">
                <Server className="size-3.5" strokeWidth={1.75} />
                <span className="ev-showcase-prop-label">Region</span>
                <span className="ev-showcase-prop-value">{current.region}</span>
              </div>
            </div>

            <ul className="ev-showcase-events">
              {events.map((e, i) => (
                <li key={i} className="ev-showcase-event">
                  <span className={`ev-showcase-event-dot ev-showcase-event-${e.tone}`} />
                  <span className="ev-showcase-event-label">{e.label}</span>
                  <span className="ev-showcase-event-time">{e.time}</span>
                </li>
              ))}
            </ul>

            <div className="ev-showcase-actions" role="group" aria-label="License actions">
              {LIC_ACTIONS.map((action) => {
                const Icon = action.icon;
                const isDanger = action.id === "revoke";
                const isFired = fired.has(`${current.id}:${action.id}`);
                return (
                  <button
                    type="button"
                    key={action.id}
                    className={`ev-showcase-action ${isDanger ? "ev-showcase-action-danger" : ""} ${isFired ? "ev-showcase-action--fired" : ""}`}
                    onClick={() => handleAction(action)}
                    disabled={isFired}
                    aria-pressed={isFired || undefined}
                  >
                    {isFired ? (
                      <Check className="size-3.5" strokeWidth={2} />
                    ) : (
                      <Icon className="size-3.5" strokeWidth={1.75} />
                    )}
                    <span>{isFired ? "Done" : action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ShowcaseFrame>
  );
}

type Sess = {
  id: string;
  user: string;
  app: string;
  region: string;
  hwid: string;
  since: string;
  status: "live" | "tamper";
};

const SESS_INIT: Sess[] = [
  { id: "S-22119", user: "@arvin",   app: "Evorion",      region: "us-east", hwid: "0xA3F8…2C71", since: "8m",  status: "live"   },
  { id: "S-22118", user: "@nikolai", app: "Vorashield",   region: "eu-fra",  hwid: "0x71BA…CC04", since: "32m", status: "live"   },
  { id: "S-22117", user: "@misha",   app: "Evorion",      region: "ap-sg",   hwid: "0xFFE3…8801", since: "1h",  status: "tamper" },
  { id: "S-22116", user: "@hannah",  app: "Sentinel Mac", region: "us-west", hwid: "0x4421…99AA", since: "2h",  status: "live"   },
];

const SESS_BAR_HEIGHTS = [
  22, 28, 30, 26, 24, 32, 30, 38, 42, 34, 30, 44,
  58, 62, 70, 80, 92, 88, 74, 66, 54, 42, 32, 26,
];

const SESS_STREAM: Sess[] = [
  { id: "S-22120", user: "@kiri",  app: "Gatewall",   region: "ap-tok", hwid: "0x9912…00FF", since: "now", status: "live"   },
  { id: "S-22121", user: "@finn",  app: "Cipherpack", region: "eu-lon", hwid: "0x4400…AA22", since: "now", status: "live"   },
  { id: "S-22122", user: "@zara",  app: "Binarykeep", region: "us-east", hwid: "0x1A22…7733", since: "now", status: "tamper" },
  { id: "S-22123", user: "@oksana",app: "Evorion",    region: "eu-fra", hwid: "0xBA01…0E22", since: "now", status: "live"   },
];

export function SessionsShowcase() {
  const [rows, setRows] = useState<Sess[]>(SESS_INIT);
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const counterBase = 241;

  const cycleRef = useVisibilityTicker(
    () => setTick((n) => n + 1),
    3400,
    !paused,
  ) as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    if (tick === 0) return;
    setRows((prev) => {
      const incoming = SESS_STREAM[(tick - 1) % SESS_STREAM.length];
      const incomingId = `${incoming.id}-${tick}`;
      const next = [{ ...incoming, id: incomingId }, ...prev];
      return next.slice(0, 5);
    });
  }, [tick]);

  const liveCount = rows.filter((r) => r.status === "live").length;
  const tamperCount = rows.filter((r) => r.status === "tamper").length;
  const regions = new Set(rows.map((r) => r.region)).size;
  const hwidLocks = counterBase + tick;

  return (
    <ShowcaseFrame height={580}>
      <div
        ref={cycleRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}
      >
        <div className="ev-lin-monitor" aria-hidden>
          <div className="ev-lin-cell">
            <div className="ev-lin-cell-head">
              <span className="ev-lin-cell-title">Sessions per hour</span>
              <span className="ev-lin-badge ev-lin-badge-strong">
                {hwidLocks.toLocaleString()} total
              </span>
            </div>
            <div className="ev-lin-cell-body">
              <div className="ev-lin-bars">
                {SESS_BAR_HEIGHTS.map((h, i) => {
                  const top = Math.round(h * 0.32);
                  const bot = h - top;
                  return (
                    <div key={i} className="ev-lin-bar">
                      <div className="ev-lin-bar-top"    style={{ height: top }} />
                      <div className="ev-lin-bar-bottom" style={{ height: bot }} />
                    </div>
                  );
                })}
              </div>
              <div className="ev-lin-bars-axis">
                <span>00</span><span>04</span><span>08</span>
                <span>12</span><span>16</span><span>20</span>
              </div>
            </div>
          </div>
          <div className="ev-lin-cell">
            <div className="ev-lin-cell-head">
              <span className="ev-lin-cell-title">Sessions by region</span>
              <span className="ev-lin-badge">
                {liveCount} live · {tamperCount} tamper
              </span>
            </div>
            <div className="ev-lin-cell-body">
              <div className="ev-lin-grid-dashes">
                <div className="ev-lin-grid-dash" />
                <div className="ev-lin-grid-dash" />
                <div className="ev-lin-grid-dash" />
                <div className="ev-lin-grid-dash" />
              </div>
              <div className="ev-lin-vert-dashes">
                <div className="ev-lin-vert-dash" />
                <div className="ev-lin-vert-dash" />
              </div>
              <div className="ev-lin-thresh ev-lin-thresh-orange" style={{ bottom: 60 }} />
              <div className="ev-lin-thresh ev-lin-thresh-purple" style={{ bottom: 92 }} />
              <div className="ev-lin-agent-grid">
                <div className="ev-lin-agent-name">
                  <span>us-east</span>
                  <span>eu-fra</span>
                  <span>ap-sg</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ev-showcase-table-head">
          <span>User</span>
          <span>App</span>
          <span>Region</span>
          <span>HWID</span>
          <span>Since</span>
          <span>Status</span>
          <span className="ev-cell-actions-head">Actions</span>
        </div>

        <ul className="ev-showcase-table">
          {rows.map((r) => {
            const allow = () =>
              setRows((prev) =>
                prev.map((p) => (p.id === r.id ? { ...p, status: "live" } : p)),
              );
            const reject = () =>
              setRows((prev) => prev.filter((p) => p.id !== r.id));
            return (
              <li
                key={r.id}
                className={`ev-showcase-row ev-showcase-row-actionable ${
                  r.status === "tamper" ? "ev-showcase-row-tamper" : ""
                }`}
              >
                <span className="ev-cell ev-cell-name">
                  <span className="ev-avatar">
                    {r.user.slice(1, 3).toUpperCase()}
                  </span>
                  {r.user}
                </span>
                <span className="ev-cell ev-cell-mono">{r.app}</span>
                <span className="ev-cell ev-cell-mono">{r.region}</span>
                <span className="ev-cell ev-cell-mono">{r.hwid}</span>
                <span className="ev-cell ev-cell-mono">{r.since}</span>
                <span
                  className={`ev-tag ev-tag-${r.status === "live" ? "ok" : "err"}`}
                >
                  <span className="ev-tag-dot" />
                  {r.status === "live" ? "Live" : "Tamper"}
                </span>
                <span className="ev-cell ev-cell-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="ev-row-act ev-row-act-allow"
                    onClick={allow}
                    title="Allow session"
                    aria-label={`Allow session ${r.id}`}
                  >
                    <Check className="size-3.5" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    className="ev-row-act ev-row-act-reject"
                    onClick={reject}
                    title="Reject and terminate"
                    aria-label={`Reject session ${r.id}`}
                  >
                    <X className="size-3.5" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    className="ev-row-act"
                    onClick={reject}
                    title="Quarantine"
                    aria-label={`Quarantine session ${r.id}`}
                  >
                    <ShieldOff className="size-3.5" strokeWidth={1.75} />
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </ShowcaseFrame>
  );
}

function SessKpi({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "ok" | "err" | "neutral";
}) {
  return (
    <div className="ev-showcase-kpi">
      <span className="ev-showcase-kpi-label">
        <span className={`ev-showcase-kpi-dot ev-tag-${accent}`} />
        {label}
      </span>
      <span className="ev-showcase-kpi-value">{value}</span>
    </div>
  );
}

type Guard = {
  id: "protect" | "encrypt" | "seh" | "sscx";
  label: string;
  macro: string;
  desc: string;
};

const GUARDS: Guard[] = [
  {
    id: "protect",
    label: "CFF",
    macro: "EVORION_PROTECT",
    desc: "Function is restructured into a 64-slot encrypted dispatch table with ghost blocks. Real control flow disappears from static disassembly.",
  },
  {
    id: "encrypt",
    label: "Encrypt",
    macro: "EVORION_ENCRYPT",
    desc: "Section is AES-256-GCM encrypted at rest. Keys live on Evora servers, fetched and decrypted in memory on entry — revocable per build.",
  },
  {
    id: "seh",
    label: "SEH guard",
    macro: "EVORION_PROTECT_SEH",
    desc: "CFF with block transitions via int3 exceptions. Static disassemblers see a dead end at every hop; attached debuggers steal the exception and stall the dispatcher.",
  },
  {
    id: "sscx",
    label: "SSCX",
    macro: "SSCX_FN",
    desc: "Function is stripped from the client binary and executes server-side on Evora infrastructure (Ultra only).",
  },
];

export function IntegrityShowcase() {
  const [enabled, setEnabled] = useState<Record<Guard["id"], boolean>>({
    protect: true,
    encrypt: true,
    seh: false,
    sscx: false,
  });

  const toggle = (id: Guard["id"]) =>
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));

  const expandStats = {
    hooks:
      (enabled.protect ? 7 : 0) +
      (enabled.sscx ? 3 : 0) +
      (enabled.encrypt ? 2 : 0),
    inline:
      (enabled.encrypt ? 4 : 0) + (enabled.protect ? 2 : 0),
    seh: enabled.seh ? 2 : 0,
  };

  return (
    <ShowcaseFrame height={580}>
      <div className="ev-showcase-toggles">
        {GUARDS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => toggle(g.id)}
            className={`ev-showcase-toggle ${
              enabled[g.id] ? "ev-showcase-toggle-on" : ""
            }`}
            aria-pressed={enabled[g.id]}
          >
            <span className="ev-showcase-toggle-dot" />
            {g.label}
          </button>
        ))}
      </div>

      <div className="ev-showcase-integrity">
        <div className="ev-showcase-code">
          <div className="ev-showcase-code-head">
            <span>auth.cpp</span>
          </div>
          <pre className="ev-showcase-code-body">
            <code>
              <span className="ev-showcase-code-comment">{`// licensing entry — guarded at compile time`}</span>
              {"\n"}
              <span className="ev-showcase-code-keyword">{`#include`}</span>{" "}
              <span className="ev-showcase-code-string">{`"Evorion.h"`}</span>
              {"\n\n"}
              <span
                className={`ev-showcase-code-macro ${
                  enabled.protect ? "" : "ev-showcase-code-off"
                }`}
              >{`EVORION_PROTECT`}</span>
              {"\n"}
              <span
                className={`ev-showcase-code-macro ${
                  enabled.sscx ? "" : "ev-showcase-code-off"
                }`}
              >{`SSCX_FN`}</span>{" "}
              <span className="ev-showcase-code-type">{`auto`}</span>
              {` ValidateLicense(`}
              <span className="ev-showcase-code-type">{`const char*`}</span>
              {` key) {`}
              {"\n"}
              {`  `}
              <span className="ev-showcase-code-type">{`auto`}</span>
              {` s = evorion::License(key);`}
              {"\n"}
              {`  `}
              <span className="ev-showcase-code-keyword">{`if`}</span>
              {` (!s.ok()) `}
              <span className="ev-showcase-code-keyword">{`return`}</span>
              {` Err::AuthFailed;`}
              {"\n\n"}
              {`  `}
              <span
                className={`ev-showcase-code-macro ${
                  enabled.encrypt ? "" : "ev-showcase-code-off"
                }`}
              >{`EVORION_ENCRYPT_BEGIN`}</span>
              {"\n"}
              {`    `}
              <span className="ev-showcase-code-type">{`auto`}</span>
              {` hw = evorion::hwid::Generate();`}
              {"\n"}
              {`    `}
              <span className="ev-showcase-code-keyword">{`if`}</span>
              {` (!s.bind(hw)) `}
              <span className="ev-showcase-code-keyword">{`return`}</span>
              {` Err::HwidMismatch;`}
              {"\n"}
              {`  `}
              <span
                className={`ev-showcase-code-macro ${
                  enabled.encrypt ? "" : "ev-showcase-code-off"
                }`}
              >{`EVORION_ENCRYPT_END`}</span>
              {"\n\n"}
              {`  `}
              <span
                className={`ev-showcase-code-macro ${
                  enabled.seh ? "" : "ev-showcase-code-off"
                }`}
              >{`EVORION_PROTECT_SEH(`}</span>
              {`s`}
              <span
                className={`ev-showcase-code-macro ${
                  enabled.seh ? "" : "ev-showcase-code-off"
                }`}
              >{`)`}</span>
              {";\n"}
              {`  `}
              <span className="ev-showcase-code-keyword">{`return`}</span>
              {` Ok{s};`}
              {"\n"}
              {`}`}
            </code>
          </pre>
        </div>

        <div className="ev-showcase-guard-list">
          <div className="ev-lin-timeline">
            {GUARDS.map((g, i) => {
              const on = enabled[g.id];
              const coverage = on ? [82, 74, 66, 58][i] : 0;
              return (
                <div
                  key={g.id}
                  className="ev-lin-timeline-row"
                  data-active={on}
                >
                  <span className="ev-lin-timeline-label">{g.label}</span>
                  <div className="ev-lin-timeline-track">
                    <div
                      className="ev-lin-timeline-fill"
                      data-tone={on ? undefined : "off"}
                      style={{ width: `${coverage}%` }}
                    />
                  </div>
                  <span
                    className={`ev-lin-badge${on ? " ev-lin-badge-strong" : " ev-lin-badge-free"}`}
                  >
                    {g.macro}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="ev-showcase-guard-expand">
            <span className="ev-showcase-guard-expand-label">Expands to</span>
            <span className="ev-showcase-guard-expand-stat">
              <strong>{expandStats.hooks}</strong> hooks
            </span>
            <span className="ev-showcase-guard-expand-sep" />
            <span className="ev-showcase-guard-expand-stat">
              <strong>{expandStats.inline}</strong> inline checks
            </span>
            <span className="ev-showcase-guard-expand-sep" />
            <span className="ev-showcase-guard-expand-stat">
              <strong>{expandStats.seh}</strong> SEH wraps
            </span>
          </div>
        </div>
      </div>
    </ShowcaseFrame>
  );
}

export function IntroducingEvorionShowcase() {
  const inViewRef = useInViewAttr<HTMLDivElement>();
  return (
    <div className="ev-bentos-bare" ref={inViewRef}>
      <div className="ev-bentos">
        <div className="ev-bento ev-bento-1">
          <div className="ev-bento-figure">
            <div className="ev-bento-illustration">
              <FigLift />
            </div>
          </div>
          <div className="ev-bento-content">
            <h3 className="ev-bento-title">Code runs on a VM no one&apos;s seen.</h3>
            <p className="ev-bento-desc">
              Protected branches lift into a per-build bytecode VM. The opcode
              cipher rolls with every build, and no native x64 ever ships.
            </p>
          </div>
        </div>

        <div className="ev-bento ev-bento-2">
          <div className="ev-bento-figure">
            <div className="ev-bento-illustration">
              <FigSigned />
            </div>
          </div>
          <div className="ev-bento-content">
            <h3 className="ev-bento-title">Signed heartbeats.</h3>
            <p className="ev-bento-desc">
              Sessions heartbeat to Evora carrying their tamper state. A
              mismatch ends the session and shows up in your panel as it
              happens.
            </p>
          </div>
        </div>

        <div className="ev-bento ev-bento-3">
          <div className="ev-bento-figure">
            <div className="ev-bento-illustration">
              <FigLayers />
            </div>
          </div>
          <div className="ev-bento-content">
            <h3 className="ev-bento-title">Every layer, one SDK.</h3>
            <p className="ev-bento-desc">
              Hardware binding, integrity mesh, runtime guards and signed
              calls, wired together at install.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Virtualization() {
  const ops = [
    { native: "mov rax, rbx",   handler: "HND_MOV_RR",   bytes: "4F·1A·2B" },
    { native: "push rcx",       handler: "HND_PUSH_R",   bytes: "21·3C"    },
    { native: "call [rsi+8]",   handler: "HND_CALL_MEM", bytes: "77·15·B2" },
    { native: "xor edx, edx",   handler: "HND_XOR_RR",   bytes: "2D·E0"    },
  ];
  return (
    <div className="ev-vmx" aria-hidden>
      <div className="ev-vmx-rows">
        {ops.map((op) => (
          <div key={op.handler} className="ev-vmx-row">
            <span className="ev-vmx-native">{op.native}</span>
            <span className="ev-vmx-arrow">→</span>
            <span className="ev-vmx-vm">
              <span className="ev-vmx-handler">{op.handler}</span>
              <span className="ev-vmx-bytes">{op.bytes}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DotMatrix({ rows, cols }: { rows: number; cols: number }) {
  const total = rows * cols;
  return (
    <div
      className="ev-dot-matrix"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
      aria-hidden
    >
      {Array.from({ length: total }).map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const delay = (col * 70 + row * 35) % 2400;
        return (
          <span
            key={i}
            className="ev-dot"
            style={{ animationDelay: `${delay}ms` }}
          />
        );
      })}
    </div>
  );
}

type SessionState = 'verify' | 'reject';
function SessionsPulse() {
  const sessions: Array<{
    id: string;
    hash: string;
    state: SessionState;
    wave: string;
  }> = [
    { id: "ssn:8f3c", hash: "0xa1·92", state: 'verify',
      wave: "M0,8 L28,8 L34,2 L40,14 L46,4 L52,12 L58,8 L120,8" },
    { id: "ssn:b740", hash: "—",       state: 'reject',
      wave: "M0,8 L18,8 L22,1 L25,15 L29,2 L33,14 L37,1 L41,15 L45,8 L120,8" },
    { id: "ssn:21d9", hash: "0x77·15", state: 'verify',
      wave: "M0,8 L28,8 L34,2 L40,14 L46,4 L52,12 L58,8 L120,8" },
    { id: "ssn:e6a5", hash: "0xbd·08", state: 'verify',
      wave: "M0,8 L28,8 L34,2 L40,14 L46,4 L52,12 L58,8 L120,8" },
    { id: "ssn:9f02", hash: "—",       state: 'reject',
      wave: "M0,8 L20,8 L24,2 L28,14 L32,3 L36,13 L40,2 L44,14 L48,8 L120,8" },
  ];
  return (
    <div className="ev-heartbeats" aria-hidden>
      {sessions.map((s) => (
        <div key={s.id} className={`ev-heartbeat ev-heartbeat-${s.state}`}>
          <span className="ev-heartbeat-tick" />
          <span className="ev-heartbeat-id">{s.id}</span>
          <svg
            className="ev-heartbeat-wave"
            viewBox="0 0 120 16"
            preserveAspectRatio="none"
          >
            <path
              d={s.wave}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={120}
            />
          </svg>
          <span className="ev-heartbeat-hash">{s.hash}</span>
          {s.state === 'verify' && (
            <svg className="ev-heartbeat-sig" viewBox="0 0 14 14" aria-hidden>
              <path
                d="M3 7.5 L5.8 10.2 L11 4.6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.85"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {s.state === 'reject' && (
            <svg className="ev-heartbeat-sig" viewBox="0 0 14 14" aria-hidden>
              <path
                d="M3.5 3.5 L10.5 10.5 M10.5 3.5 L3.5 10.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.85"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

function CapabilityMatrix() {
  const items: Array<{ name: string; status: string }> = [
    { name: "HWID Bind",      status: "Locked"   },
    { name: "Integrity Mesh", status: "0x4A·CRC" },
    { name: "Runtime Guards", status: "Armed"    },
    { name: "Server Sign",    status: "Signed"   },
  ];
  return (
    <div className="ev-caplist" aria-hidden>
      {items.map((t) => (
        <div key={t.name} className="ev-caplist-row">
          <span className="ev-caplist-name">{t.name}</span>
          <span className="ev-caplist-status">{t.status}</span>
        </div>
      ))}
    </div>
  );
}
