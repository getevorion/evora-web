import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteFrame } from "@/components/site/SiteFrame";
import { EndCTA } from "@/components/sections/EndCTA";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbSchema, faqSchema, pageMeta } from "@/lib/seo";
import { LANGUAGES, languageBySlug } from "../languages";

type Params = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return LANGUAGES.map((l) => ({ lang: l.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params;
  const l = languageBySlug(lang);
  if (!l) return {};
  return pageMeta({
    title: `${l.name} licensing API`,
    description: `Add licence key validation to ${l.name}. Call the Evorion REST API from your ${l.name} backend to authenticate licences and user accounts, check subscriptions, and bind to a device.`,
    path: `/integrations/${l.slug}`,
    keywords: [...l.aka, `${l.name.toLowerCase()} software licensing`, "license key api"],
  });
}

export default async function LanguagePage({ params }: Params) {
  const { lang } = await params;
  const l = languageBySlug(lang);
  if (!l) notFound();

  const others = LANGUAGES.filter((x) => x.slug !== l.slug);

  const faqs = [
    {
      question: `Is there an Evorion SDK for ${l.name}?`,
      answer: `No, and you do not need one. ${l.name} talks to the same REST API the dashboard uses — the snippet on this page is the whole integration. The one native SDK is C++, which exists because it adds things a REST call cannot: encrypted request bodies, device-bound credentials, and server-driven runtime protection.`,
    },
    {
      question: `Can I call the API from ${l.name} running in a browser?`,
      answer:
        "No. Anything shipped to a browser is readable by anyone who opens developer tools, so an API key there is a public key. Call it from your server, and issue your own session to the browser afterwards. CORS blocks browser origins for exactly this reason.",
    },
    {
      question: "What does the authenticate endpoint return?",
      answer:
        "A JSON object with `authenticated` (boolean) and, when the licence resolves to a customer, a `subscription` object carrying level, name, expiry, HWID and an `active` flag. Read `active` rather than comparing the expiry date yourself — it applies the same rule the SDK does, including pauses.",
    },
  ];

  return (
    <SiteFrame>
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Integrations", path: "/integrations" },
            { name: l.name, path: `/integrations/${l.slug}` },
          ]),
          faqSchema(faqs),
        ]}
      />

      <section className="ev-page-intro">
        <h1 className="ev-page-intro-title">{l.name} licensing API</h1>
        <p className="ev-page-intro-sub">{l.blurb}</p>
      </section>

      <section className="ev-page-groups">
        <article className="ev-page-group">
          <h2 className="ev-page-group-title">Validate a licence key</h2>
          <p className="ev-page-group-blurb">
            One POST to <code>/apps/{"{appId}"}/licenses/authenticate</code>. {l.runtime}
          </p>
          <pre className="ev-page-code">
            <code>{l.sample}</code>
          </pre>
        </article>
      </section>

      <section className="ev-page-groups">
        <article className="ev-page-group">
          <h2 className="ev-page-group-title">What you get back</h2>
          <ul className="ev-page-group-list">
            <li><code>authenticated</code> — whether the key is valid and usable right now.</li>
            <li><code>subscription.level</code> and <code>subscription.name</code> — the tier you configured.</li>
            <li><code>subscription.active</code> — false when expired <em>or</em> paused. Use this, not the raw expiry.</li>
            <li><code>subscription.hwid</code> — the bound device, when HWID locking is on.</li>
          </ul>
        </article>

        <article className="ev-page-group">
          <h2 className="ev-page-group-title">Keep the key server-side</h2>
          <p className="ev-page-group-blurb">
            The API key is a server credential. The safe shape is always: browser → your server →
            Evorion. Your backend holds the key, validates the licence, then issues your own session.
          </p>
          <ul className="ev-page-group-list">
            <li>Never ship <code>ag_sk_</code> keys to a client of any kind.</li>
            <li>Scope each key to the minimum it needs, and to one application where you can.</li>
            <li>Rotate from the dashboard; keys are shown once on creation.</li>
          </ul>
        </article>

        <article className="ev-page-group">
          <h2 className="ev-page-group-title">Native apps want the C++ SDK</h2>
          <p className="ev-page-group-blurb">
            If you are shipping a Windows binary to end users, REST alone leaves the client
            unprotected. The C++ SDK adds encrypted bodies, device-bound credentials and runtime
            protection that a dashboard toggle can change mid-session.
          </p>
          <ul className="ev-page-group-list">
            <li>
              <Link href="/docs" className="ev-page-inline-link">SDK documentation</Link>
            </li>
            <li>
              <Link href="/docs/api" className="ev-page-inline-link">Full REST reference</Link>
            </li>
          </ul>
        </article>
      </section>

      <section className="ev-page-faq" aria-labelledby="lang-faq">
        <h2 id="lang-faq" className="ev-page-faq-title">{l.name} questions</h2>
        <dl className="ev-page-faq-list">
          {faqs.map((f) => (
            <div key={f.question} className="ev-page-faq-item">
              <dt className="ev-page-faq-q">{f.question}</dt>
              <dd className="ev-page-faq-a">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="ev-page-intro">
        <p className="ev-page-intro-sub">
          Other languages:{" "}
          {others.map((o, i) => (
            <span key={o.slug}>
              <Link href={`/integrations/${o.slug}`} className="ev-page-inline-link">{o.name}</Link>
              {i < others.length - 1 ? ", " : ""}
            </span>
          ))}
          .
        </p>
      </section>

      <EndCTA />
    </SiteFrame>
  );
}
