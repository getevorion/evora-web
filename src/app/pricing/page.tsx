import { SiteFrame } from "@/components/site/SiteFrame";
import { PricingSection } from "@/components/sections/PricingSection";
import { EndCTA } from "@/components/sections/EndCTA";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbSchema, faqSchema, pageMeta, softwareSchema } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Pricing",
  description:
    "Evorion plans for software licensing and runtime protection. Free tier for core auth and basic licensing; paid tiers add runtime protection, SSCX, and code virtualisation.",
  path: "/pricing",
  keywords: [
    "software licensing pricing",
    "license key system cost",
    "software protection pricing",
    "evorion plans",
  ],
});

const OFFERS = [
  { name: "Free", price: 0, currency: "GBP" },
  { name: "Evorion Pro", price: 6.99, currency: "GBP" },
  { name: "Evorion Ultra", price: 14.99, currency: "GBP" },
  { name: "Evorion Ultimate", price: 24.99, currency: "GBP" },
];

const FAQS = [
  {
    question: "What does the Free plan include?",
    answer:
      "Core authentication and basic licensing, with no card required. Paid plans add the runtime protection surface.",
  },
  {
    question: "Which languages and platforms are supported?",
    answer:
      "The dedicated C++ SDK targets Windows and integrates as one header and one library, built with MSVC 2019 or newer using C++17. Every other language integrates over the REST API, which is the recommended path for server-side and web application integrations.",
  },
  {
    question: "Can I authenticate users on my website?",
    answer:
      "Yes, from your server. Your backend holds an API key and calls the REST API to validate a licence or a user, then issues your own session. The key stays on your server and is never exposed to the browser.",
  },
  {
    question: "Can I change protection settings without shipping a new build?",
    answer:
      "Yes. Runtime protection is server-driven: anti_debug, anti_vm, anti_hv, anti_http_debug, and anti_attach are returned by the backend during init and carried on every heartbeat, so a dashboard toggle takes effect without the client reconnecting.",
  },
  {
    question: "Do you support license keys, accounts, or both?",
    answer:
      "All three. The auth mode is set per application: 'license' for license keys only, 'user_pass' for username and password, or 'both' for a mixed flow. The backend enforces the mode on every auth request.",
  },
  {
    question: "Can I bind a licence to a device?",
    answer:
      "Yes. HWID binding is available per application, and hardware IDs can be reset or blacklisted from the developer dashboard.",
  },
  {
    question: "Can I revoke access to a running session?",
    answer:
      "Yes. Over WebSocket transport the backend can push kill and ban events, and with auto_exit enabled the client terminates the process on fatal detections and kill instructions.",
  },
];

export default function PricingPage() {
  return (
    <SiteFrame>
      <JsonLd
        schema={[
          softwareSchema(OFFERS),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/pricing" },
          ]),
        ]}
      />

      <section className="ev-page-intro">
        <h1 className="ev-page-intro-title">Pricing</h1>
        <p className="ev-page-intro-sub">
          Start free with core auth and basic licensing. Paid plans add the runtime protection
          surface, SSCX, and code virtualisation. Prices are per month in GBP.
        </p>
      </section>

      <PricingSection showHeader={false} />

      <section className="ev-page-faq" aria-labelledby="pricing-faq-title">
        <h2 id="pricing-faq-title" className="ev-page-faq-title">
          Common questions
        </h2>
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
