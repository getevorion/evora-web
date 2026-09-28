export type ChangelogStatus = "latest" | "stable" | "major";

export type ChangelogEntry = {

  version: string;

  date: string;

  iso: string;
  status: ChangelogStatus;

  title: string;

  tagline?: string;

  body: string;

  details?: string[];

  codename?: string;

  notes?: string[];

  image?: string;
};

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "4",
    date: "Sep 2026",
    iso: "2026-09-24",
    status: "latest",
    title: "Evorion 4",
    codename: "Hydra",
    image: "/evorion-banner.png",
    tagline:
      "Bug fixes and improvements, tighter security, and platform features across the board.",
    body:
      "Hydra ships bug fixes and improvements across the platform, tightens security throughout the SDK and API, upgrades virtual machine detection, hardens the heartbeat, and rolls out many feature implementations we have had queued for this release.",
    details: [
      "Bug fixes and improvements.",
      "Improved security.",
      "Improved virtual machine detection.",
      "Improved heartbeat security.",
      "No need for end users to sync time anymore.",
      "Enhanced telemetry capture.",
      "Many feature implementations around the platform.",
    ],
    notes: [
      "Evorion 4 Umbra builds continue to authenticate side by side with Hydra. New builds should target the Hydra SDK; existing Umbra integrations keep working with no forced migration date.",
      "Any issues? Email night@evora.lol.",
    ],
  },
  {
    version: "4-umbra",
    date: "Sep 2026",
    iso: "2026-09-08",
    status: "stable",
    title: "Evorion 4",
    codename: "Umbra",
    image: "/updates/umbra.jpg",
    tagline:
      "Stronger server-side security, sharper tamper detection, and clearer failure signals across the platform.",
    body:
      "Umbra is a security and reliability release on top of Denali. Server-side authorisation is signed end to end, tamper detection was rewritten around a self-verifying integrity mesh, transport was hardened across every request path, and every server rejection now surfaces the exact reason your client needs to react. Windows 11 24H2 is supported natively, false-positive integrity trips on real launcher environments are gone, and the developer panel has been polished throughout.",
    details: [
      "Better server-side security.",
      "Sharper tamper detection.",
      "Resolved vulnerabilities across the SDK, shield, and API.",
      "Server-signed session capabilities, verified on every request.",
      "Runtime security downgrade detection.",
      "Response replay protection.",
      "Anti-tamper telemetry across every subsystem.",
      "Transport hardening across every request path.",
      "Vault and key material hardening.",
      "Reworked syscall gate with health telemetry.",
      "Fewer false positives on real end-user machines.",
      "Server-provided reason codes surfaced directly in client errors.",
      "Secure payload delivery.",
      "Frontend polish across the developer panel.",
      "Documentation updated with the new methods.",
      "Bug fixes and improvements.",
    ],
    notes: [
      "Supported alongside Hydra with no forced migration date. New builds should target Hydra to pick up the changes above.",
      "Any issues? Email night@evora.lol.",
    ],
  },
  {
    version: "4-denali",
    date: "Jun 2026",
    iso: "2026-06-01",
    status: "stable",
    title: "Evorion 4",
    codename: "Denali",
    image: "/updates/denali.jpg",
    body: "Two-factor auth and password reset for end users, self-serve billing, custom API domains, a referral program, and server-side code execution, plus security, performance, and documentation work across the platform.",
    details: [
      "Two-factor authentication for end users.",
      "Password reset for end users.",
      "Social sign-in and email verification.",
      "Self-serve billing: check out and get upgraded automatically.",
      "Referral program: earn commission on referred sign-ups.",
      "Custom API domains: point your own hostname at the API.",
      "Server-side code execution.",
      "Server-decrypted sections.",
      "More API functionality.",
      "Durable webhooks and notifications.",
      "Free SDK resolved.",
      "Shield CLI deprecated.",
      "Better auth performance.",
      "False positives resolved.",
      "Frontend changes.",
      "Security upgrades.",
      "Documentation updated with the upgraded methods.",
      "Bug fixes and improvements.",
    ],
    notes: [
      "Supported alongside Hydra with no forced migration date. New builds should target Hydra to pick up the changes above.",
      "Any issues? Email night@evora.lol.",
    ],
  },
  {
    version: "3.1.0",
    date: "Apr 2026",
    iso: "2026-04-15",
    status: "stable",
    title: "Pro and Ultra tiers",
    body: "Platinum/Obsidian renamed to Pro/Ultra in the dashboard. Unified security panel, broadcast delivery fix, chart edge-case fixes.",
    details: [
      "Tier rename: Platinum → Pro, Obsidian → Ultra. No pricing changes.",
      "Unified security panel: anti-debug, integrity, and CFF settings now live under one tab.",
      "Fixed broadcast delivery race that could silently drop messages under high fan-out.",
      "Chart axis stabilised for sub-hour windows and zero-value ranges.",
    ],
  },
  {
    version: "2.9.8",
    date: "Mar 2026",
    iso: "2026-03-20",
    status: "stable",
    title: "EVORION_PROTECT",
    body: "EVORION_PROTECT and EVORION_SPLIT with auto-seed, plus EVORION_PROTECT_SEH. Developer REST API, resellers, abuse alerts, anti-inject.",
    details: [
      "EVORION_PROTECT: control-flow flattening into a 64-slot encrypted dispatch table with ghost blocks.",
      "EVORION_SPLIT: distributes real logic across additional dispatch blocks (up to 6).",
      "EVORION_PROTECT_SEH: CFF transitions via int3 exceptions; debuggers stall the dispatcher.",
      "Developer REST API opened to Pro/Ultra tiers. Reseller panel + per-seller abuse alerts shipped.",
      "Anti-inject monitor added to the runtime, detecting LoadLibrary/CreateRemoteThread patterns.",
    ],
  },
  {
    version: "2.9.5",
    date: "Mar 2026",
    iso: "2026-03-01",
    status: "major",
    title: "WebSocket transport",
    body: "WebSocket mode with server push, capability tokens, DPoP-signed requests, and remote attestation challenge/response.",
    details: [
      "WSS transport goes GA: the server can push revocations, alerts, and variable updates without polling.",
      "Capability tokens replace per-call scopes; issued at handshake, refreshed on the socket.",
      "DPoP request binding on every frame; keys rotate per session.",
      "Remote attestation: the server issues a challenge, and the client responds with a signed hash chain over its runtime state.",
    ],
  },
];

export function slugFor(entry: Pick<ChangelogEntry, "version">): string {
  return entry.version.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
}

function majorSegment(version: string): string {
  const dash = version.indexOf("-");
  return dash >= 0 ? version.slice(0, dash) : version;
}

export function pathSegmentsFor(
  entry: Pick<ChangelogEntry, "version" | "codename">,
): string[] {
  if (entry.codename) {
    return [majorSegment(entry.version), entry.codename.toLowerCase()];
  }
  return [slugFor(entry)];
}

export function pathFor(
  entry: Pick<ChangelogEntry, "version" | "codename">,
): string {
  return `/updates/${pathSegmentsFor(entry).join("/")}`;
}

export function entryBySlug(slug: string): ChangelogEntry | undefined {
  return CHANGELOG.find((e) => slugFor(e) === slug);
}

export function entryByPath(segments: string[]): ChangelogEntry | undefined {
  if (segments.length === 2) {
    const [major, codenameSlug] = segments;
    const codenameLower = codenameSlug.toLowerCase();
    return CHANGELOG.find(
      (e) =>
        e.codename?.toLowerCase() === codenameLower &&
        majorSegment(e.version) === major,
    );
  }
  if (segments.length === 1) {
    return entryBySlug(segments[0]);
  }
  return undefined;
}

export function neighbours(entry: ChangelogEntry) {
  const i = CHANGELOG.findIndex((e) => e.version === entry.version);
  return {
    newer: i > 0 ? CHANGELOG[i - 1] : undefined,
    older: i >= 0 && i < CHANGELOG.length - 1 ? CHANGELOG[i + 1] : undefined,
  };
}

export function statusLabel(status: ChangelogStatus) {
  if (status === "latest") return "Live";
  if (status === "major") return "Major";
  return null;
}
