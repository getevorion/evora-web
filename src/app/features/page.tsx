import { SiteFrame } from "@/components/site/SiteFrame";
import { EndCTA } from "@/components/sections/EndCTA";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMeta({
  title: "Features",
  description:
    "Licensing, sessions, HWID binding, and server-driven runtime protection. A dedicated C++ SDK for native apps, and a REST API for every other language.",
  path: "/features",
  keywords: [
    "software licensing features",
    "hwid locking",
    "anti-debug protection",
    "license key api",
    "session management",
  ],
});

const GROUPS: Array<{ title: string; blurb: string; items: string[] }> = [
  {
    title: "Authentication and licensing",
    blurb:
      "The auth mode is set per application and enforced by the backend on every request, so the client can't be talked into a flow you didn't enable.",
    items: [
      "License keys, username and password, or both — selected per application.",
      "Login, Register, and License entry points — on the C++ client, or over REST from any language.",
      "Restricted modes reject the wrong entry point with AUTH_MODE_RESTRICTED.",
      "HWID binding per application, with hardware ID resets from the dashboard.",
    ],
  },
  {
    title: "Sessions and live control",
    blurb:
      "Sessions are visible while they run, and the backend keeps a channel open to act on them.",
    items: [
      "Init opens a session; Check and Heartbeat keep it verified.",
      "WebSocket transport delivers push events — kill and ban are the terminal ones.",
      "With auto_exit enabled, fatal detections and kill instructions terminate the process.",
      "Live session, user, and license state in the developer dashboard.",
    ],
  },
  {
    title: "Runtime protection",
    blurb:
      "Protection is server-driven rather than baked in at compile time: the flags ride init and every heartbeat, so a dashboard toggle applies without the client reconnecting.",
    items: [
      "anti_debug, anti_vm, anti_hv, anti_http_debug, and anti_attach returned by the backend.",
      "Heartbeat carries live runtime flags, so enforcement can change mid-session.",
      "Shield entry points (ShieldInit, ShieldDecrypt, ShieldShutdown) for encrypted code sections.",
      "Owner id can be sealed with SecureCredential rather than shipped as a plain string.",
    ],
  },
  {
    title: "Data and integrations",
    blurb: "The pieces most apps end up needing, without standing up your own service for them.",
    items: [
      "Global variables, per-user variables, and online counts.",
      "File delivery and webhooks.",
      "Blacklist and whitelist controls, plus abuse alerts.",
      "Subscriptions and reseller management.",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <SiteFrame>
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Features", path: "/features" },
        ])}
      />

      <section className="ev-page-intro">
        <h1 className="ev-page-intro-title">Features</h1>
        <p className="ev-page-intro-sub">
          Licensing, sessions, HWID binding, and runtime checks. Native Windows apps use the dedicated
          C++ SDK — one header and one library, MSVC 2019+ and C++17. Every other language talks to
          the same backend over REST.
        </p>
      </section>

      <section className="ev-page-groups">
        {GROUPS.map((g) => (
          <article key={g.title} className="ev-page-group">
            <h2 className="ev-page-group-title">{g.title}</h2>
            <p className="ev-page-group-blurb">{g.blurb}</p>
            <ul className="ev-page-group-list">
              {g.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="ev-page-intro">
        <p className="ev-page-intro-sub">
          Full method signatures, payload shapes, and integration notes live in the{" "}
          <Link href="/docs" className="ev-page-inline-link">
            SDK documentation
          </Link>
          . Plans and limits are on{" "}
          <Link href="/pricing" className="ev-page-inline-link">
            pricing
          </Link>
          .
        </p>
      </section>

      <EndCTA />
    </SiteFrame>
  );
}
