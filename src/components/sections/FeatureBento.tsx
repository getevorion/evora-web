import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/cn";

export function FeatureBento() {
  return (
    <section id="features" className="section-anchor py-20 sm:py-28">
      <div className="shell">
        <div className="grid grid-cols-12 gap-px bg-hairline overflow-hidden rounded-xl border border-hairline">
          <Reveal className="col-span-12 lg:col-span-7 lg:row-span-2">
            <SscxCell />
          </Reveal>

          <Reveal delay={0.05} className="col-span-12 lg:col-span-5">
            <GatesCell />
          </Reveal>

          <Reveal delay={0.1} className="col-span-12 sm:col-span-6 lg:col-span-5">
            <SealCell />
          </Reveal>

          <Reveal delay={0.14} className="col-span-12 sm:col-span-6 lg:col-span-4">
            <HwidCell />
          </Reveal>

          <Reveal delay={0.18} className="col-span-12 lg:col-span-8">
            <DecoyCell />
          </Reveal>

          <Reveal delay={0.22} className="col-span-12 sm:col-span-6 lg:col-span-4">
            <TransportCell />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Cell({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("h-full bg-bg p-6 sm:p-8", className)}>{children}</div>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-text-faint">
      {children}
    </div>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[18px] sm:text-[19px] font-medium tracking-[-0.012em] text-text">
      {children}
    </h3>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13.5px] leading-relaxed text-text-muted max-w-md">
      {children}
    </p>
  );
}

function SscxCell() {
  const fields: Array<[string, string, number]> = [
    ["SSCX", "magic", 1],
    ["v1", "version", 1],
    ["build", "16", 1],
    ["bundle", "16", 1],
    ["fn_id", "8", 1],
    ["call_id", "8", 1],
    ["ctr", "8", 1],
    ["beacon", "32", 1],
    ["args", "≤16k", 2],
  ];
  return (
    <Cell className="flex flex-col justify-between min-h-[320px] lg:min-h-[440px]">
      <div className="space-y-3">
        <Eyebrow>Server-side execution</Eyebrow>
        <h3
          className="font-medium tracking-[-0.04em] leading-[1] text-text"
          style={{ fontSize: "clamp(2rem, 4.4vw, 3.25rem)" }}
        >
          Code that never <br /> ships to the client.
        </h3>
        <Body>
          Sensitive logic runs in a sandboxed runtime on our edge. The wire only
          carries a sealed binary frame — no field names, no source, no symbols.
        </Body>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <Eyebrow>Request frame</Eyebrow>
          <span className="font-mono text-[10.5px] text-text-faint">v1</span>
        </div>
        <div className="flex w-full overflow-hidden rounded-md border border-hairline">
          {fields.map(([name, size, grow]) => {
            const isAccent = name === "beacon";
            return (
              <div
                key={name}
                className={cn(
                  "px-2.5 py-2 border-r border-hairline last:border-r-0",
                  isAccent && "bg-accent-soft"
                )}
                style={{ flex: grow }}
              >
                <div
                  className={cn(
                    "font-mono text-[10.5px] truncate",
                    isAccent ? "text-accent" : "text-text"
                  )}
                >
                  {name}
                </div>
                <div className="font-mono text-[9.5px] text-text-faint mt-0.5">
                  {size}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Cell>
  );
}

function GatesCell() {
  const gates = [
    "auth",
    "spki pin",
    "v2 ctr",
    "dpop",
    "capability",
    "heartbeat",
    "schema",
    "bundle",
    "graph ctr",
    "beacon",
    "fuel",
    "memory",
    "rate",
  ];
  return (
    <Cell className="flex flex-col justify-between min-h-[200px] lg:min-h-[218px]">
      <div className="flex items-start justify-between">
        <Eyebrow>Pre-execution gates</Eyebrow>
        <span
          className="font-medium tracking-[-0.06em] leading-none text-text"
          style={{ fontSize: "clamp(2.75rem, 5.4vw, 4rem)" }}
        >
          13
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-4">
        {gates.map((g) => (
          <span
            key={g}
            className="font-mono text-[10.5px] text-text-muted px-2 py-0.5 border border-hairline rounded"
          >
            {g}
          </span>
        ))}
      </div>
    </Cell>
  );
}

function SealCell() {
  return (
    <Cell className="flex flex-col justify-between min-h-[220px]">
      <div className="space-y-2">
        <Eyebrow>Compile-time sealing</Eyebrow>
        <Title>Secrets sealed into the binary.</Title>
        <Body>
          XTEA-encrypted at compile time — the plaintext never lands in .rdata.
          Decrypts to a wiped stack buffer only when the credential is used.
        </Body>
      </div>
      <pre className="mt-6 font-mono text-[12px] leading-[1.7] text-text-muted bg-bg-elevated border border-hairline rounded-md p-3 overflow-hidden">
<span className="text-text-faint">{`// header drop-in`}</span>{"\n"}
<span className="text-text">auto key </span>= EVSK(<span className="text-accent">&quot;sk_live_…&quot;</span>);{"\n"}
EVORION_PROTECT_BEGIN{"\n"}
{"  "}auth.login(user, key);{"\n"}
EVORION_PROTECT_END;
      </pre>
    </Cell>
  );
}

function HwidCell() {
  const sources = ["board", "disk", "mac", "cpu", "tpm", "smbios"];
  return (
    <Cell className="flex flex-col justify-between min-h-[220px]">
      <div className="space-y-2">
        <Eyebrow>Hardware-bound sessions</Eyebrow>
        <Title>One device, one session.</Title>
        <Body>
          Sessions and licenses are tied to a multi-source device fingerprint.
          Move the binary, lose the session.
        </Body>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-px bg-hairline border border-hairline rounded-md overflow-hidden">
        {sources.map((s) => (
          <div
            key={s}
            className="bg-bg-elevated px-2.5 py-2 font-mono text-[10.5px] text-text-muted text-center"
          >
            {s}
          </div>
        ))}
      </div>
    </Cell>
  );
}

function DecoyCell() {
  return (
    <Cell className="flex flex-col justify-between min-h-[200px]">
      <div className="space-y-2 max-w-md">
        <Eyebrow>Defense in shape</Eyebrow>
        <Title>Failed calls return a decoy.</Title>
        <Body>
          Real and decoy responses share a length bucket, a signature, and a
          status field. The client never learns which one it got — and neither
          does an attacker watching the wire.
        </Body>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <ResponsePill status="0" label="ok" accent />
        <ResponsePill status="1" label="decoy" />
      </div>
    </Cell>
  );
}

function ResponsePill({
  status,
  label,
  accent,
}: {
  status: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-hairline bg-bg-elevated px-3 py-2">
      <span
        className={cn(
          "size-1.5 rounded-full",
          accent ? "bg-accent" : "bg-text-faint"
        )}
      />
      <span className="font-mono text-[11px] text-text-muted">
        status_class={status}
      </span>
      <span className="font-mono text-[11px] text-text-faint">· {label}</span>
    </div>
  );
}

function TransportCell() {
  return (
    <Cell className="flex flex-col justify-between min-h-[200px]">
      <div className="space-y-2">
        <Eyebrow>Transport</Eyebrow>
        <Title>One authenticated socket.</Title>
        <Body>
          Everything rides the same DPoP-bound, SPKI-pinned channel. No new
          sockets to harden, no bootstrap fallback to bypass.
        </Body>
      </div>
      <div className="mt-6 flex items-center gap-2 font-mono text-[11px] text-text-faint">
        <span className="size-1.5 rounded-full bg-accent" />
        wss://api · /ws/sdk
      </div>
    </Cell>
  );
}
