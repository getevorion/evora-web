import Link from "next/link";
import { SiteFrame } from "@/components/site/SiteFrame";
import { EndCTA } from "@/components/sections/EndCTA";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbSchema, faqSchema, pageMeta } from "@/lib/seo";
import { allOperations } from "../docs/api-operations";

const ENDPOINT_COUNT = allOperations().length;

const CRITERIA: Array<{ title: string; ask: string; evora: string }> = [
  {
    title: "Does protection ship with the licensing?",
    ask: "A licence check is a network call. On its own it tells you nothing about whether the binary around it has been patched out.",
    evora:
      "The C++ SDK carries anti-debug, anti-VM, anti-hypervisor, anti-attach and encrypted code sections. The flags ride init and every heartbeat, so a dashboard toggle changes enforcement without the client reconnecting or you shipping a new build.",
  },
  {
    title: "Can you revoke a session that is already running?",
    ask: "Expiring a licence at next launch is not the same as cutting off a session in progress.",
    evora:
      "Over WebSocket transport the backend pushes kill and ban events. With auto_exit enabled the process terminates on a fatal detection or a kill instruction.",
  },
  {
    title: "Is the API documented in public, before you pay?",
    ask: "If you cannot read the endpoint list without an account, you cannot estimate the integration before committing.",
    evora: `All ${ENDPOINT_COUNT} endpoints are public, generated from an OpenAPI specification, with parameters and response bodies. The machine-readable spec is downloadable.`,
  },
  {
    title: "Can you integrate without their SDK?",
    ask: "An SDK for a language you do not use is a blocker. A documented HTTP API never is.",
    evora:
      "Every endpoint is plain REST over HTTPS with a bearer key. PHP, Node, Python, C#, Go, Java and Ruby examples are published; anything that can make an HTTP request works.",
  },
  {
    title: "What happens to your data if you leave?",
    ask: "Licences, users and subscription state are your business records, not the vendor's.",
    evora:
      "Everything readable through the dashboard is readable through the API — licences, users, subscriptions, sessions and logs are all listable and exportable with a scoped key.",
  },
  {
    title: "Are the limits knowable up front?",
    ask: "Rate limits you discover by getting a 429 in production are not documented limits.",
    evora:
      "A fixed anti-abuse ceiling of 300 requests/minute per key, plus your plan's quota. GET /quota returns your limits and current usage so you never have to guess.",
  },
];

const FAQS = [
  {
    question: "What is Evorion?",
    answer:
      "A software licensing and protection platform. It issues and validates licence keys and user accounts, binds them to devices, manages subscriptions and resellers, and — for native Windows applications — ships a C++ SDK that adds runtime protection driven from the server.",
  },
  {
    question: "Do I need the C++ SDK to use it?",
    answer:
      "No. The SDK is for native Windows binaries, where it adds encrypted request bodies, device-bound credentials and runtime protection. If you are licensing a web app, a service or a game server, the REST API is the whole integration.",
  },
  {
    question: "Can I migrate existing licence keys in?",
    answer:
      "Yes. Licences are created through the API, so an import is a loop over your existing keys against POST /apps/{appId}/licenses. You can set the key value, tier, expiry and HWID binding per licence.",
  },
  {
    question: "Is there a free tier?",
    answer:
      "Yes — core authentication and basic licensing with no card required. The paid tiers add the runtime protection surface, higher limits, and features like resellers and webhooks.",
  },
];

export const metadata = pageMeta({
  title: "Licensing provider alternatives",
  description:
    "Comparing software licensing providers? Six things worth testing before you commit — runtime protection, live session revocation, public API docs, SDK-free integration, data portability and documented limits.",
  path: "/alternatives",
  keywords: [
    "software licensing alternative",
    "licensing provider comparison",
    "license key system alternative",
    "software protection platform",
    "keyauth alternative",
  ],
});

export default function AlternativesPage() {
  return (
    <SiteFrame>
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Alternatives", path: "/alternatives" },
          ]),
          faqSchema(FAQS),
        ]}
      />

      <section className="ev-page-intro">
        <h1 className="ev-page-intro-title">Comparing licensing providers</h1>
        <p className="ev-page-intro-sub">
          Every provider in this space will tell you it does licensing. They diverge on what happens
          after the licence check passes. These are the six questions worth actually testing — go
          and check them against whoever you are evaluating, including us.
        </p>
      </section>

      <section className="ev-page-groups">
        {CRITERIA.map((c) => (
          <article key={c.title} className="ev-page-group">
            <h2 className="ev-page-group-title">{c.title}</h2>
            <p className="ev-page-group-blurb">{c.ask}</p>
            <ul className="ev-page-group-list">
              <li>
                <strong>Evorion:</strong> {c.evora}
              </li>
            </ul>
          </article>
        ))}
      </section>

      <section className="ev-page-intro">
        <p className="ev-page-intro-sub">
          We deliberately do not publish a feature table for other products. Their capabilities
          change, we cannot verify them from here, and a comparison with one wrong cell is worth
          less than none. Read our{" "}
          <Link href="/docs/api" className="ev-page-inline-link">
            full API reference
          </Link>{" "}
          and judge it against theirs.
        </p>
      </section>

      <section className="ev-page-faq" aria-labelledby="alt-faq">
        <h2 id="alt-faq" className="ev-page-faq-title">Common questions</h2>
        <dl className="ev-page-faq-list">
          {FAQS.map((f) => (
            <div key={f.question} className="ev-page-faq-item">
              <dt className="ev-page-faq-q">{f.question}</dt>
              <dd className="ev-page-faq-a">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <EndCTA />
    </SiteFrame>
  );
}
