import Link from "next/link";
import { SiteFrame } from "@/components/site/SiteFrame";
import { EndCTA } from "@/components/sections/EndCTA";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";
import { LANGUAGES } from "./languages";

export const metadata = pageMeta({
  title: "Integrations",
  description:
    "Add software licensing to any language. A dedicated C++ SDK for native Windows apps, and a REST API you can call from PHP, Node, Python, C#, Go, Java or Ruby.",
  path: "/integrations",
  keywords: [
    "software licensing api",
    "license key api",
    "licensing integration",
    "licence validation rest api",
  ],
});

export default function IntegrationsPage() {
  return (
    <SiteFrame>
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Integrations", path: "/integrations" },
        ])}
      />

      <section className="ev-page-intro">
        <h1 className="ev-page-intro-title">Integrations</h1>
        <p className="ev-page-intro-sub">
          Native Windows applications use the dedicated C++ SDK, which adds encrypted request
          bodies, device-bound credentials and server-driven runtime protection. Everything else
          talks to the same backend over REST — one POST validates a licence.
        </p>
      </section>

      <section className="ev-page-groups">
        {LANGUAGES.map((l) => (
          <article key={l.slug} className="ev-page-group">
            <h2 className="ev-page-group-title">
              <Link href={`/integrations/${l.slug}`} className="ev-page-inline-link">
                {l.name}
              </Link>
            </h2>
            <p className="ev-page-group-blurb">{l.blurb}</p>
            <ul className="ev-page-group-list">
              <li>{l.runtime}</li>
              <li>
                <Link href={`/integrations/${l.slug}`} className="ev-page-inline-link">
                  See the {l.name} example
                </Link>
              </li>
            </ul>
          </article>
        ))}

        <article className="ev-page-group">
          <h2 className="ev-page-group-title">
            <Link href="/docs" className="ev-page-inline-link">C++ (native SDK)</Link>
          </h2>
          <p className="ev-page-group-blurb">
            One header and one library, MSVC 2019+ and C++17. The only path that also carries
            runtime protection — anti-debug, anti-VM, HWID binding and encrypted code sections,
            all driven from the dashboard.
          </p>
          <ul className="ev-page-group-list">
            <li>Licensing, sessions and protection in one integration.</li>
            <li>
              <Link href="/docs" className="ev-page-inline-link">SDK documentation</Link>
            </li>
          </ul>
        </article>
      </section>

      <EndCTA />
    </SiteFrame>
  );
}
