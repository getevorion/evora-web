export type BentoEntry = {
  key: string;
  eyebrow: string;
  title: string;
  sub?: string;
  kicker: string;
  stat: string;
  statSub: string;
  visual: string;
};

export function BentoCard({
  skill,
  revealDelay,
}: {
  skill: BentoEntry;
  revealDelay?: number;
}) {
  const parts = skill.kicker.split(/(?<=\.)\s+/);
  const lede = parts[0];
  const rest = parts.slice(1).join(" ");
  const style =
    typeof revealDelay === "number"
      ? ({ ["--pf-reveal-delay" as string]: `${revealDelay}ms` } as React.CSSProperties)
      : undefined;
  return (
    <article
      className="ev-bento"
      data-has-visual={skill.visual ? "true" : "false"}
      data-reveal={typeof revealDelay === "number" ? "" : undefined}
      style={style}
    >
      <header className="ev-bento-header">
        <div className="ev-bento-header-title">
          <p className="ev-bento-eyebrow">
            <span className="ev-bento-eyebrow-dot" aria-hidden />
            {skill.eyebrow}
          </p>
          <h3 className="ev-bento-title">{skill.title}</h3>
          {skill.sub && (
            <p className="ev-bento-subtitle">{skill.sub}</p>
          )}
        </div>
        <div className="ev-bento-header-desc">
          <p className="ev-bento-kicker">
            <span className="ev-bento-kicker-lede">{lede}</span>
            {rest && (
              <>
                {" "}
                <span className="ev-bento-kicker-body">{rest}</span>
              </>
            )}
          </p>
        </div>
      </header>
      {skill.visual && (
        <div className="ev-bento-visual" aria-hidden>
          <BentoVisual kind={skill.visual} />
        </div>
      )}
    </article>
  );
}

export function BentoGrid({ skills }: { skills: readonly BentoEntry[] }) {
  return (
    <div className="pf-bare pf-reveal">
      <div className="ev-bentos">
        {skills.map((skill) => (
          <BentoCard key={skill.key} skill={skill} />
        ))}
      </div>
    </div>
  );
}

export function BentoVisual({ kind }: { kind: string }) {
  switch (kind) {
    case "hv":
      return <VizHypervisor />;
    case "vmp":
      return <VizVmProtector />;
    case "sdk":
      return <VizSdkShield />;
    case "re":
      return <VizReverseEngineer />;
    case "game":
      return <VizGameInternals />;
    case "web":
      return <VizWebPentest />;
    case "agent":
      return <VizAgent />;
    case "trait-pattern":
      return <VizTraitPattern />;
    case "trait-craft":
      return <VizTraitCraft />;
    case "trait-reason":
      return <VizTraitReason />;
    default:
      return null;
  }
}

function VizTraitPattern() {

  const noise = [
    [22, 104], [38, 88], [54, 110], [68, 72], [82, 96],
    [196, 38], [214, 22], [228, 60], [180, 100], [202, 112],
    [16, 56], [30, 38], [50, 30], [70, 50],
  ];
  const cluster = [
    [120, 56], [132, 50], [126, 64], [140, 58], [134, 70],
  ];
  return (
    <div className="pf-viz pf-viz-trait">
      <svg viewBox="0 0 240 130" aria-hidden>
        <g className="pf-tp-noise">
          {noise.map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="1.6" />
          ))}
        </g>
        <g className="pf-tp-cluster">
          {cluster.map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="2.2" />
          ))}
        </g>
        <g className="pf-tp-bracket">
          <path d="M 108 38 L 108 30 L 116 30" />
          <path d="M 152 30 L 160 30 L 160 38" />
          <path d="M 160 80 L 160 88 L 152 88" />
          <path d="M 116 88 L 108 88 L 108 80" />
        </g>
        <text x="166" y="35" className="pf-tp-tag">pattern</text>
        <line className="pf-tp-axis" x1="14" y1="124" x2="226" y2="124" />
        <text x="14" y="120" className="pf-tp-axis-label">noise</text>
        <text x="226" y="120" className="pf-tp-axis-label" textAnchor="end">signal</text>
      </svg>
    </div>
  );
}

function VizTraitCraft() {

  const drafts = [
    { d: "M 16 78 C 56 50, 92 96, 132 64 S 200 88, 226 56", o: 0.06 },
    { d: "M 16 76 C 58 48, 96 90, 132 60 S 198 80, 226 52", o: 0.1 },
    { d: "M 16 72 C 60 46, 96 86, 134 56 S 196 74, 226 46", o: 0.18 },
    { d: "M 16 70 C 62 44, 100 80, 136 52 S 198 66, 226 42", o: 0.32 },
    { d: "M 16 68 C 64 42, 104 76, 138 48 S 200 58, 226 38", o: 0.6 },
  ];
  const finalPath =
    "M 16 64 C 66 40, 108 72, 140 44 S 202 52, 226 34";
  return (
    <div className="pf-viz pf-viz-trait">
      <svg viewBox="0 0 240 130" aria-hidden>
        {drafts.map((p, i) => (
          <path
            key={i}
            d={p.d}
            className="pf-tc-draft"
            style={{ opacity: p.o }}
          />
        ))}
        <path d={finalPath} className="pf-tc-final" />
        <g className="pf-tc-marks">
          {[16, 226].map((x) => (
            <line key={x} x1={x} y1="100" x2={x} y2="108" />
          ))}
        </g>
        <text x="16" y="120" className="pf-tp-axis-label">draft</text>
        <text x="226" y="120" className="pf-tp-axis-label" textAnchor="end">ship</text>
      </svg>
    </div>
  );
}

function VizTraitReason() {

  const layers = [
    { y: 28, label: "boot" },
    { y: 56, label: "kernel" },
    { y: 84, label: "runtime" },
    { y: 112, label: "failure" },
  ];
  const focusX = 168;
  return (
    <div className="pf-viz pf-viz-trait">
      <svg viewBox="0 0 240 130" aria-hidden>
        {layers.map((row) => (
          <g key={row.label}>
            <text x="14" y={row.y - 6} className="pf-tr-label">
              {row.label}
            </text>
            <line
              x1="14"
              y1={row.y}
              x2="226"
              y2={row.y}
              className="pf-tr-row"
            />
          </g>
        ))}
        <line
          x1={focusX}
          y1="20"
          x2={focusX}
          y2="120"
          className="pf-tr-focus"
        />
        {layers.map((row) => (
          <circle
            key={`d-${row.label}`}
            cx={focusX}
            cy={row.y}
            r="2.4"
            className="pf-tr-node"
          />
        ))}
      </svg>
    </div>
  );
}

function VizHypervisor() {
  return (
    <div className="pf-viz pf-viz-hv">
      <svg viewBox="0 0 220 140" aria-hidden>
        <defs>
          <radialGradient id="hvCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(37,99,235,0.55)" />
            <stop offset="80%" stopColor="rgba(37,99,235,0)" />
          </radialGradient>
        </defs>
        <circle cx="110" cy="70" r="62" fill="none" stroke="rgba(255,255,255,0.06)" />
        <circle cx="110" cy="70" r="46" fill="none" stroke="rgba(255,255,255,0.08)" />
        <circle cx="110" cy="70" r="30" fill="none" stroke="rgba(255,255,255,0.10)" />
        <circle cx="110" cy="70" r="14" fill="url(#hvCore)" />
        <text x="110" y="73" textAnchor="middle" fontSize="8" fill="#fff" fontFamily="ui-monospace, monospace">
          L0
        </text>

        <g className="pf-orbit">
          <circle className="pf-tick" cx="110" cy="8" r="3" />
          <circle className="pf-tick" cx="172" cy="70" r="3" style={{ animationDelay: "0.2s" }} />
          <circle className="pf-tick" cx="110" cy="132" r="3" style={{ animationDelay: "0.4s" }} />
          <circle className="pf-tick" cx="48" cy="70" r="3" style={{ animationDelay: "0.6s" }} />
        </g>
        <g className="pf-orbit pf-orbit-fast">
          <circle className="pf-tick" cx="156" cy="24" r="2" style={{ animationDelay: "0.1s" }} />
          <circle className="pf-tick" cx="156" cy="116" r="2" style={{ animationDelay: "0.3s" }} />
          <circle className="pf-tick" cx="64" cy="116" r="2" style={{ animationDelay: "0.5s" }} />
          <circle className="pf-tick" cx="64" cy="24" r="2" style={{ animationDelay: "0.7s" }} />
        </g>
        <text x="110" y="14" textAnchor="middle" fontSize="6" fill="#62666d" fontFamily="ui-monospace, monospace">VMCALL</text>
        <text x="180" y="74" textAnchor="middle" fontSize="6" fill="#62666d" fontFamily="ui-monospace, monospace">EPT</text>
        <text x="110" y="142" textAnchor="middle" fontSize="6" fill="#62666d" fontFamily="ui-monospace, monospace">CR3</text>
        <text x="40" y="74" textAnchor="middle" fontSize="6" fill="#62666d" fontFamily="ui-monospace, monospace">MSR</text>
      </svg>
    </div>
  );
}

function VizVmProtector() {
  const lines = [
    { op: "0x01", text: "PUSHIMM 0x4a1e02b9" },
    { op: "0x07", text: "XOR R0, R3" },
    { op: "0x12", text: "LOADCTX [seg+0x18]" },
    { op: "0x1A", text: "JMP_OPAQUE +0x142" },
    { op: "0x23", text: "ROLLKEY 0xDEADBEEF" },
    { op: "0x2C", text: "ENC_DISPATCH" },
  ];
  return (
    <div className="pf-viz pf-viz-vmp">
      {lines.map((line, i) => (
        <div
          className="pf-viz-vmp-line"
          key={line.op}
          style={{ animationDelay: `${i * 320}ms` }}
        >
          <span>{line.op}</span>
          <span>{line.text}</span>
        </div>
      ))}
    </div>
  );
}

function VizSdkShield() {
  return (
    <div className="pf-viz pf-viz-sdk">
      <pre style={{ margin: 0, fontFamily: "inherit" }}>
        <span className="pf-viz-sdk-line">
          <span className="pf-viz-sdk-cm">{`// guarded entry`}</span>
        </span>
        <span className="pf-viz-sdk-line">
          <span className="pf-viz-sdk-mac">EVORION_PROTECT</span>
        </span>
        <span className="pf-viz-sdk-line">
          <span className="pf-viz-sdk-mac">SSCX_FN</span>{" "}
          <span className="pf-viz-sdk-ty">auto</span> Verify(){`{`}
        </span>
        <span className="pf-viz-sdk-line">
          {`  `}
          <span className="pf-viz-sdk-mac">EVORION_ENCRYPT_BEGIN</span>
        </span>
        <span className="pf-viz-sdk-line">
          {`    `}
          <span className="pf-viz-sdk-kw">if</span> (!Hwid().bind(s))
        </span>
        <span className="pf-viz-sdk-line">
          {`      `}
          <span className="pf-viz-sdk-kw">return</span> Err::Mismatch;
        </span>
        <span className="pf-viz-sdk-line">
          {`  `}
          <span className="pf-viz-sdk-mac">EVORION_ENCRYPT_END</span>
        </span>
        <span className="pf-viz-sdk-line">{`}`}</span>
      </pre>
    </div>
  );
}

function VizReverseEngineer() {
  return (
    <div className="pf-viz pf-viz-re">
      <svg viewBox="0 0 240 130" aria-hidden>
        <path className="pf-edge" d="M 30 30 C 60 30, 60 70, 90 70" />
        <path className="pf-edge" d="M 30 30 C 70 30, 70 100, 110 100" />
        <path className="pf-edge" data-hot="true" d="M 90 70 C 130 70, 130 40, 170 40" />
        <path className="pf-edge" d="M 90 70 C 130 70, 130 100, 170 100" />
        <path className="pf-edge" data-hot="true" d="M 170 40 C 200 40, 200 70, 220 70" />
        <path className="pf-edge" d="M 170 100 C 200 100, 200 70, 220 70" />

        <rect className="pf-node" x="10" y="20" rx="3" width="40" height="20" />
        <text x="30" y="33" textAnchor="middle">main</text>

        <rect className="pf-node" x="70" y="60" rx="3" width="40" height="20" />
        <text x="90" y="73" textAnchor="middle">decode</text>

        <rect className="pf-node" x="90" y="90" rx="3" width="40" height="20" />
        <text x="110" y="103" textAnchor="middle">crc32</text>

        <rect className="pf-node" data-hot="true" x="150" y="30" rx="3" width="40" height="20" />
        <text x="170" y="43" textAnchor="middle">vmh_18</text>

        <rect className="pf-node" x="150" y="90" rx="3" width="40" height="20" />
        <text x="170" y="103" textAnchor="middle">jit</text>

        <rect className="pf-node" data-hot="true" x="200" y="60" rx="3" width="36" height="20" />
        <text x="218" y="73" textAnchor="middle">sink</text>
      </svg>
    </div>
  );
}

function VizGameInternals() {
  return (
    <div className="pf-viz pf-viz-game">
      <svg viewBox="0 0 92 92" aria-hidden>
        <circle className="pf-cross-ring" cx="46" cy="46" r="18" />
        <circle className="pf-cross-ring" cx="46" cy="46" r="18" style={{ animationDelay: "0.8s" }} />
        <circle className="pf-cross-ring" cx="46" cy="46" r="18" style={{ animationDelay: "1.6s" }} />
        <circle cx="46" cy="46" r="34" fill="none" stroke="rgba(255,255,255,0.08)" />
        <line className="pf-cross" x1="46" y1="6" x2="46" y2="32" />
        <line className="pf-cross" x1="46" y1="60" x2="46" y2="86" />
        <line className="pf-cross" x1="6" y1="46" x2="32" y2="46" />
        <line className="pf-cross" x1="60" y1="46" x2="86" y2="46" />
        <circle className="pf-cross-dot" cx="46" cy="46" r="2.4" />
      </svg>
      <dl className="pf-viz-game-readout">
        <dt>uworld</dt>
        <dd>0x144AC0118</dd>
        <dt>localpawn</dt>
        <dd>0x0298</dd>
        <dt>yaw → δ</dt>
        <dd>+0.46°</dd>
      </dl>
    </div>
  );
}

function VizWebPentest() {
  const rows: { method: string; path: string; tone: "ok" | "err" | "warn"; bar: number }[] = [
    { method: "GET", path: "/api/user/me", tone: "ok", bar: 78 },
    { method: "POST", path: "/api/auth/login", tone: "warn", bar: 42 },
    { method: "GET", path: "/api/admin/users", tone: "err", bar: 96 },
    { method: "PUT", path: "/api/keys/rotate", tone: "ok", bar: 30 },
  ];
  const statusFor: Record<string, string> = { ok: "200", warn: "302", err: "403" };
  return (
    <div className="pf-viz pf-viz-web">
      {rows.map((row, i) => (
        <div className="pf-viz-web-row" key={row.path}>
          <span>{row.method}</span>
          <div className="pf-viz-web-bar" data-tone={row.tone}>
            <span
              style={{
                width: `${row.bar}%`,
                animationDelay: `${i * 140}ms`,
                animationDuration: `${1100 + i * 240}ms`,
              }}
            />
          </div>
          <span className="pf-viz-web-status" data-tone={row.tone}>
            {statusFor[row.tone]}
          </span>
        </div>
      ))}
    </div>
  );
}

function VizAgent() {

  const steps = [
    { label: "Agent",       w: 52, hot: true  },
    { label: "kernel.read", w: 74, hot: false },
    { label: "ida.lift",    w: 52, hot: false },
    { label: "unicorn.emu", w: 76, hot: false },
    { label: "sig.gen",     w: 56, hot: false },
    { label: "Reasoning",   w: 76, hot: true  },
  ];
  const H = 22;
  const gap = 14;
  const y = 14;
  const pad = 6;
  const positions: { x: number; cx: number; w: number }[] = [];
  let cursor = pad;
  for (const s of steps) {
    positions.push({ x: cursor, cx: cursor + s.w / 2, w: s.w });
    cursor += s.w + gap;
  }
  const vbW = cursor - gap + pad;
  const vbH = y + H + y;
  const midY = y + H / 2;

  return (
    <div className="pf-viz pf-viz-graph">
      <svg viewBox={`0 0 ${vbW} ${vbH}`} aria-hidden>
        <defs>
          <marker
            id="pf-gr-arrow"
            viewBox="0 0 6 6"
            refX="5"
            refY="3"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 z" className="pf-gr-arrow" />
          </marker>
        </defs>

        {positions.slice(0, -1).map((p, i) => {
          const next = positions[i + 1];
          return (
            <line
              key={`edge-${i}`}
              className="pf-gr-edge"
              x1={p.x + p.w + 1}
              y1={midY}
              x2={next.x - 2}
              y2={midY}
              markerEnd="url(#pf-gr-arrow)"
            />
          );
        })}

        {steps.map((s, i) => {
          const p = positions[i];
          return (
            <g
              key={s.label}
              className={s.hot ? "pf-gr-node pf-gr-node-hot" : "pf-gr-node"}
            >
              <rect x={p.x} y={y} width={s.w} height={H} rx="3" />
              <text x={p.cx} y={y + 14} textAnchor="middle">
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
