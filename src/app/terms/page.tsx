import { SiteFrame } from "@/components/site/SiteFrame";

import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Terms",
  description:
    "The terms covering use of Evora, the Evorion SDK, and the developer dashboard — licensing, acceptable use, billing, and liability.",
  path: "/terms",
});

type Clause = {
  num: string;
  title: string;
  body: string;
};

type Section = {
  id: string;
  title: string;
  clauses: Clause[];
};

const LEAD = `These terms of service govern your access to and use of Evora, Evorion, and related services. By creating an account, integrating the SDK, or otherwise using the service, you agree to be bound by these terms. If you do not agree, do not use Evora.`;

const SECTIONS: Section[] = [
  {
    id: "acceptance",
    title: "Acceptance",
    clauses: [
      {
        num: "1.1",
        title: "Agreement to terms",
        body: "By accessing Evora or integrating Evorion you agree to these terms. If you are accepting on behalf of a company or other legal entity, you represent that you have authority to bind that entity.",
      },
      {
        num: "1.2",
        title: "Eligibility",
        body: "You must be able to form a binding contract to use the service. You may not use Evora if you are barred from doing so under applicable law or if we have previously terminated your account for cause.",
      },
    ],
  },
  {
    id: "license",
    title: "License",
    clauses: [
      {
        num: "2.1",
        title: "License grant",
        body: "Evorion is licensed, not sold. Subject to these terms and your subscription, we grant you a limited, non-exclusive, non-transferable license to integrate and use the SDK for your own applications.",
      },
      {
        num: "2.2",
        title: "Restrictions",
        body: "Reverse engineering, redistribution, or repackaging of the SDK is prohibited unless explicitly granted in writing. You may not sublicense Evorion, remove proprietary notices, or use the SDK to build a competing protection platform.",
      },
      {
        num: "2.3",
        title: "Delivery and updates",
        body: "We may update the SDK, runtime, or related tooling from time to time. Security and compatibility updates may be required to maintain access to protected builds or online verification features.",
      },
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    clauses: [
      {
        num: "3.1",
        title: "Permitted use",
        body: "You may use Evora to protect software you own or are authorized to protect, manage licenses for legitimate end users, and operate authentication flows consistent with your published product terms.",
      },
      {
        num: "3.2",
        title: "Prohibited conduct",
        body: "You may not use Evora to protect malware, distribute illegal content, or facilitate fraud. We reserve the right to terminate accounts that violate this clause, interfere with the service, or attempt to bypass protection or licensing controls.",
      },
    ],
  },
  {
    id: "service-availability",
    title: "Service availability",
    clauses: [
      {
        num: "4.1",
        title: "Uptime target",
        body: "We target 99.99% uptime for core authentication, licensing, and dashboard services. Actual availability may vary during incidents, dependency failures, or abuse mitigation.",
      },
      {
        num: "4.2",
        title: "Maintenance",
        body: "Planned maintenance is announced in advance when practicable. Emergency maintenance may occur without notice when required to preserve security or stability. Force-majeure events are excluded from uptime commitments.",
      },
    ],
  },
  {
    id: "data",
    title: "Data",
    clauses: [
      {
        num: "5.1",
        title: "Data we process",
        body: "We retain license metadata, HWID hashes, session and audit logs, and account information needed to operate the service. You remain responsible for lawful collection and use of end-user data in your applications.",
      },
      {
        num: "5.2",
        title: "Retention and privacy",
        body: "We do not sell user data. Retention timelines and privacy practices are documented in our privacy notice. You must not submit sensitive personal data to Evora unless necessary for your use case and permitted by law.",
      },
    ],
  },
  {
    id: "liability",
    title: "Liability",
    clauses: [
      {
        num: "6.1",
        title: "Disclaimer",
        body: "The service is provided as-is. We disclaim implied warranties to the fullest extent permitted by law. We do not guarantee that protection, obfuscation, or anti-tamper measures will be effective against every attack.",
      },
      {
        num: "6.2",
        title: "Limitation of liability",
        body: "We are not liable for indirect or consequential damages, including lost profits, data loss, or business interruption. Total liability is capped at the fees paid to Evora in the twelve months before the claim arose.",
      },
    ],
  },
  {
    id: "changes",
    title: "Changes",
    clauses: [
      {
        num: "7.1",
        title: "Modifications",
        body: "These terms may change as the product evolves. Material changes affecting paid plans or acceptable use will be communicated through the dashboard or account email at least 14 days before they take effect.",
      },
      {
        num: "7.2",
        title: "Continued use",
        body: "Your continued use of Evora after the effective date of updated terms constitutes acceptance. If you do not agree to revised terms, you must stop using the service and close your account.",
      },
    ],
  },
];

export default function TermsPage() {
  return (
    <SiteFrame>
      <div className="ev-legal-page">
        <div className="ev-legal-shell">
          <article className="ev-legal-doc">
            <header>
              <h1>Terms of service</h1>
              <p className="ev-legal-date">Effective date: January 2026</p>
              <p className="ev-legal-lead">{LEAD}</p>
            </header>

            <nav aria-label="Table of contents">
              <ol className="ev-legal-toc">
                {SECTIONS.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.title}</a>
                  </li>
                ))}
              </ol>
            </nav>

            {SECTIONS.map((section, index) => (
              <div key={section.id}>
                {index > 0 && <hr className="ev-legal-divider" />}
                <section id={section.id} className="ev-legal-section">
                  <h2>{section.title}</h2>
                  {section.clauses.map((clause) => (
                    <div key={clause.num} className="ev-legal-clause">
                      <div className="ev-legal-clause-head">
                        <span className="ev-legal-clause-num">{clause.num}</span>
                        <h3>{clause.title}</h3>
                      </div>
                      <p>{clause.body}</p>
                    </div>
                  ))}
                </section>
              </div>
            ))}
          </article>
        </div>
      </div>
    </SiteFrame>
  );
}
