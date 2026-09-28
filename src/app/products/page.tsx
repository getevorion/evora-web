import { SiteFrame } from "@/components/site/SiteFrame";
import { EndCTA } from "@/components/sections/EndCTA";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbSchema, pageMeta, softwareSchema } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMeta({
  title: "Evorion",
  description:
    "Evorion is a licensing and runtime-protection platform: a dedicated C++ SDK for native Windows apps, a REST API for every other language, and a dashboard for licenses, sessions, and users.",
  path: "/products",
  keywords: [
    "evorion",
    "licensing sdk",
    "c++ licensing library",
    "licensing rest api",
    "windows software protection",
    "license api any language",
  ],
});

const SPECS: Array<{ label: string; value: string }> = [
  { label: "Native SDK", value: "C++17 on Windows, MSVC 2019 or newer" },
  { label: "Integration", value: "One header (Evorion.h) and one library (Evorion.lib)" },
  { label: "Other languages", value: "REST API — any language that can make an HTTP request" },
  { label: "Transport", value: "HTTP, or WebSocket for push events" },
  { label: "Auth modes", value: "License key, username and password, or both" },
];

export default function ProductsPage() {
  return (
    <SiteFrame>
      <JsonLd
        schema={[
          softwareSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Evorion", path: "/products" },
          ]),
        ]}
      />

      <section className="ev-page-intro">
        <h1 className="ev-page-intro-title">Evorion</h1>
        <p className="ev-page-intro-sub">
          A licensing and runtime-protection platform. Native Windows apps get the dedicated C++ SDK,
          where one header and one library bring licensing, sessions, HWID binding, and server-driven
          runtime protection. Everything else talks to the same backend over REST, so you can
          integrate from any language that can make an HTTP request.
        </p>
      </section>

      <section className="ev-page-groups">
        <article className="ev-page-group">
          <h2 className="ev-page-group-title">How it fits into your app</h2>
          <p className="ev-page-group-blurb">
            Construct a client with your owner id and application id, call Init to open a session,
            then authenticate with a license key or an account depending on the mode you configured.
            Heartbeat keeps the session verified and carries the live protection flags.
          </p>
          <ul className="ev-page-group-list">
            <li>Auto init starts the session immediately on construction.</li>
            <li>Set your application version before init so version policy evaluates correctly.</li>
            <li>Seal the owner id with SecureCredential in production builds.</li>
            <li>Choose HTTP for the simplest setup, or WebSocket to receive push events.</li>
          </ul>
        </article>

        <article className="ev-page-group">
          <h2 className="ev-page-group-title">Specifications</h2>
          <dl className="ev-page-spec-list">
            {SPECS.map((s) => (
              <div key={s.label} className="ev-page-spec-row">
                <dt className="ev-page-spec-label">{s.label}</dt>
                <dd className="ev-page-spec-value">{s.value}</dd>
              </div>
            ))}
          </dl>
        </article>
      </section>

      <section className="ev-page-intro">
        <p className="ev-page-intro-sub">
          See the{" "}
          <Link href="/features" className="ev-page-inline-link">
            full feature set
          </Link>
          , the{" "}
          <Link href="/docs" className="ev-page-inline-link">
            SDK reference
          </Link>
          , or{" "}
          <Link href="/pricing" className="ev-page-inline-link">
            plans and pricing
          </Link>
          .
        </p>
      </section>

      <EndCTA />
    </SiteFrame>
  );
}
