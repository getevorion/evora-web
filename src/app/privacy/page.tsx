import { SiteFrame } from "@/components/site/SiteFrame";
import { SITE } from "@/lib/site";

import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description:
    "What data Evora collects when you use the dashboard and the Evorion SDK, why we collect it, how long we keep it, and the rights you have over it.",
  path: "/privacy",
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

const CONTACT_EMAIL = "privacy@evora.plus";

const LEAD = `This notice explains what personal data Evora collects when you use our website, developer dashboard, licensing API, and SDK integrations (Evorion, EVORION_PROTECT, and SSCX). It covers developers who hold an Evora account and end users of applications that embed our SDK. Evora is a UK-based operation and processes personal data in accordance with the UK GDPR and the Data Protection Act 2018.`;

const SECTIONS: Section[] = [
  {
    id: "introduction",
    title: "Introduction",
    clauses: [
      {
        num: "1.1",
        title: "Who we are",
        body: "Evora provides licensing, session validation, hardware binding, and runtime protection tooling for software developers. In this notice, \"Evora\", \"we\", \"us\", and \"our\" refer to the operator of evora.plus. As the operator of the platform, we act as a data controller for account and telemetry data described below.",
      },
      {
        num: "1.2",
        title: "Who this notice covers",
        body: "This notice applies to visitors of evora.plus, developers who register for an account or apply for access, and end users whose devices interact with an SDK-protected application through our authentication and licensing endpoints.",
      },
      {
        num: "1.3",
        title: "Developers as separate controllers",
        body: "Developers who integrate Evorion into their own applications determine what end-user data flows through the SDK and remain independent controllers for their own product's data practices. Evora processes fingerprint, HWID, and session data on their behalf to deliver anti-abuse and licensing services.",
      },
    ],
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    clauses: [
      {
        num: "2.1",
        title: "Account data",
        body: "When you create an account at /signup or sign in at /signin, we collect your email address, chosen username, and a salted hash of your password. We do not store your password in plaintext. If you subscribe to a paid plan, our payment processor collects billing details on our behalf; we receive only the transaction reference, plan, and status.",
      },
      {
        num: "2.2",
        title: "Developer session telemetry",
        body: "During sign-in and while your dashboard session is active, we record the IP address, user-agent string, CSRF token exchange, and timestamps of authentication events. This is used to secure your account, detect account sharing, and produce audit logs.",
      },
      {
        num: "2.3",
        title: "Browser fingerprint (developers only)",
        body: "Our sign-in page runs a bounded fingerprint collector against the developer's browser. The signals are: a hashed canvas rendering, WebGL vendor/renderer strings and a hash of a fixed set of WebGL parameters, a hashed audio-processing sample, IANA timezone, screen dimensions and colour depth, browser platform string, browser languages, hardware concurrency count, and two heuristic flags (\"incognito hint\" and \"weak platform\"). We do not collect fonts, WebRTC data, battery status, plugin lists, or the raw user-agent as a fingerprint signal. Values are hashed on the client where possible; only the hashes and short vendor strings are transmitted.",
      },
      {
        num: "2.4",
        title: "Hardware identifiers (end users of SDK apps)",
        body: "When an end user runs an application that integrates the Evorion SDK, the SDK may collect one or more hardware identifiers from the local machine to compute a HWID hash. Sources include the motherboard serial, disk serial, MAC address, CPU identifier, TPM public key, and SMBIOS metadata. The SDK sends only the derived HWID hash to Evora unless the integrating developer configures additional telemetry. The raw identifiers are not transmitted or stored by Evora.",
      },
      {
        num: "2.5",
        title: "License and session records",
        body: "For each active license we retain the license key, plan tier, bound HWID hash, activation and expiry timestamps, revocation status, and a rolling log of session validations, session cookies issued, IP addresses seen, and integrity check results. This information is required to make license enforcement work.",
      },
      {
        num: "2.6",
        title: "Website analytics and logs",
        body: "Our hosting and edge providers (see \"Sharing\") log basic request metadata for every request served by evora.plus: source IP, request path, response status, user-agent, and referrer. These logs are retained for a short period for security and debugging and are not linked to your account unless a security incident requires it.",
      },
      {
        num: "2.7",
        title: "Support communications",
        body: "If you contact us over email or Discord, we retain the message contents and any identifiers you provide (email address, Discord handle, license key) for the purpose of responding to you and improving the product.",
      },
    ],
  },
  {
    id: "legal-basis",
    title: "Why we collect it",
    clauses: [
      {
        num: "3.1",
        title: "Contract",
        body: "Account data, license records, HWID hashes, and session validation are processed to perform the contract you enter into when you sign up or when you use software protected by an Evora-integrating developer. Without this data the platform cannot deliver licensing or session validation.",
      },
      {
        num: "3.2",
        title: "Legitimate interests",
        body: "Developer fingerprints, IP logs, audit trails, and abuse-signal telemetry are processed on the basis of our legitimate interest in operating a secure platform, detecting account sharing and credential abuse, preventing fraud, and defending against automated attacks. We balance this against your privacy by minimising the signals collected, hashing them where practical, and limiting retention.",
      },
      {
        num: "3.3",
        title: "Legal obligation",
        body: "Some data (financial records, tax invoices, and lawful-request preservation) is retained to meet UK legal and regulatory obligations.",
      },
      {
        num: "3.4",
        title: "Consent",
        body: "Where we rely on your consent (for example, optional communications or non-essential cookies if we ever introduce them), you may withdraw consent at any time. Withdrawal does not affect processing carried out before withdrawal.",
      },
    ],
  },
  {
    id: "how-we-use-it",
    title: "How we use it",
    clauses: [
      {
        num: "4.1",
        title: "Operating the service",
        body: "To authenticate developers, issue and validate license keys, bind licenses to hardware, keep dashboard sessions alive, and run the SSCX server-side execution and EVORION_PROTECT integrity paths that customers integrate into their products.",
      },
      {
        num: "4.2",
        title: "Security and abuse prevention",
        body: "To detect account sharing across developer accounts, identify credential stuffing and brute-force attempts, block automated abuse of the licensing API, investigate reports of misuse, and maintain audit logs of privileged actions.",
      },
      {
        num: "4.3",
        title: "Product improvement",
        body: "To debug incidents, understand which SDK versions and endpoints are in use, and improve the developer dashboard. We do not build advertising profiles and we do not use your data to train third-party machine-learning models.",
      },
      {
        num: "4.4",
        title: "Communications",
        body: "To send you transactional and account-critical messages (security notices, billing, service incidents, changes to these terms). Marketing messages, if ever sent, are limited to existing customers and can be opted out of at any time.",
      },
    ],
  },
  {
    id: "sharing",
    title: "Sharing",
    clauses: [
      {
        num: "5.1",
        title: "We do not sell personal data",
        body: "Evora does not sell your personal data or that of your end users, and we do not share it with data brokers or advertising networks.",
      },
      {
        num: "5.2",
        title: "Sub-processors",
        body: "We share limited data with a small set of infrastructure providers that act as processors on our behalf: our hosting and database providers (to store account, license, and session records), Cloudflare (as our edge, WAF, and DDoS protection layer — which processes IPs, request metadata, and bot-management signals), our email delivery provider (for transactional email), and our payment processor (for billing). Each is bound by a written data-processing agreement.",
      },
      {
        num: "5.3",
        title: "Developer customers",
        body: "If you are an end user of a product that embeds Evorion, the developer of that product receives the HWID hash, license status, and session validation results necessary to operate their integration. The developer is a separate controller for that data and their own privacy notice applies to what they do with it inside their product.",
      },
      {
        num: "5.4",
        title: "Legal and safety disclosures",
        body: "We may disclose data where required by UK law, a valid legal request, or where we believe in good faith that disclosure is necessary to protect rights, prevent fraud or ongoing abuse, or defend Evora and its users. Where lawful, we will notify affected users.",
      },
      {
        num: "5.5",
        title: "Business transfers",
        body: "If Evora is involved in a merger, acquisition, or asset sale, personal data may be transferred subject to standard confidentiality protections and continued application of a privacy notice at least as protective as this one.",
      },
    ],
  },
  {
    id: "retention",
    title: "Retention",
    clauses: [
      {
        num: "6.1",
        title: "Account and license data",
        body: "Account data is kept for as long as your account is active and for a reasonable period after closure to handle disputes, chargebacks, and abuse investigations. License and HWID-hash records are kept while a license is active and for up to 24 months after expiry or revocation to support cross-license anti-abuse analysis.",
      },
      {
        num: "6.2",
        title: "Session, fingerprint and audit logs",
        body: "Developer session records, fingerprint samples, and IP logs are retained for up to 12 months. Security-critical audit logs may be retained longer where necessary to investigate an incident or comply with a legal obligation.",
      },
      {
        num: "6.3",
        title: "Edge and request logs",
        body: "Edge request logs held by our WAF and hosting providers are retained under those providers' standard retention windows, typically 30 to 90 days.",
      },
      {
        num: "6.4",
        title: "Deletion",
        body: "When retention periods expire, records are deleted or irreversibly aggregated. Hashed values (HWID, canvas, audio) cannot be reversed to their source identifiers.",
      },
    ],
  },
  {
    id: "your-rights",
    title: "Your rights",
    clauses: [
      {
        num: "7.1",
        title: "Rights under the UK GDPR",
        body: "You have the right to access the personal data we hold about you, to have inaccurate data corrected, to have data erased in defined circumstances, to restrict or object to processing based on legitimate interests, to receive a portable copy of data you provided, and to withdraw consent where processing is based on consent.",
      },
      {
        num: "7.2",
        title: "How to exercise your rights",
        body: `To exercise any of these rights, email ${CONTACT_EMAIL} from the address on file for your account. If you are an end user of a developer's product, please also contact that developer — they may hold copies of the same data outside our systems. We will respond within the timeframe required by the UK GDPR, normally within one month.`,
      },
      {
        num: "7.3",
        title: "Complaints",
        body: "If you are unhappy with how we have handled your data, you have the right to lodge a complaint with the UK Information Commissioner's Office (ICO) at ico.org.uk. We would appreciate the chance to address your concerns first.",
      },
    ],
  },
  {
    id: "international-transfers",
    title: "International transfers",
    clauses: [
      {
        num: "8.1",
        title: "Where your data is processed",
        body: "Evora's infrastructure and sub-processors may store or process personal data outside the United Kingdom, including in the European Economic Area and the United States. Cloudflare's global edge, in particular, will process request metadata at the point of presence closest to the request source.",
      },
      {
        num: "8.2",
        title: "Transfer safeguards",
        body: "Where personal data is transferred outside the UK to a country that has not received a UK adequacy decision, we rely on the UK International Data Transfer Agreement, the UK Addendum to the EU Standard Contractual Clauses, or another lawful transfer mechanism, together with appropriate technical measures such as encryption in transit.",
      },
    ],
  },
  {
    id: "cookies",
    title: "Cookies and local storage",
    clauses: [
      {
        num: "9.1",
        title: "What we set",
        body: "We use cookies and equivalent browser storage only where necessary for the service to work. The primary cookie is evora_sid, an HTTP-only, secure, same-site session cookie used to keep you signed in to the developer dashboard. We also set short-lived CSRF tokens for form submissions and may set cookies used by Cloudflare's bot management (for example, __cf_bm) as part of the edge protection layer.",
      },
      {
        num: "9.2",
        title: "No advertising or cross-site tracking cookies",
        body: "We do not use cookies for advertising, cross-site tracking, or behavioural profiling. We do not embed third-party analytics that build such profiles.",
      },
      {
        num: "9.3",
        title: "Managing cookies",
        body: "You can block or clear cookies through your browser settings. Blocking evora_sid will sign you out of the dashboard and prevent parts of the service that require authentication from working.",
      },
    ],
  },
  {
    id: "security",
    title: "Security",
    clauses: [
      {
        num: "10.1",
        title: "How we protect data",
        body: "Passwords are stored as salted hashes. Transport is encrypted with TLS. Session cookies are HTTP-only, secure, and same-site. The API sits behind CSRF protection, rate limiting, and Cloudflare's WAF and bot-management layer. Access to production data is restricted to a small operator group and gated by strong authentication.",
      },
      {
        num: "10.2",
        title: "Your role",
        body: "No system is perfectly secure. Please use a unique, strong password, treat your license keys as sensitive material, and report anything unusual about your account or a suspected compromise as quickly as possible.",
      },
    ],
  },
  {
    id: "children",
    title: "Children",
    clauses: [
      {
        num: "11.1",
        title: "Age",
        body: "Evora is a business-to-developer service and is not directed at children. We do not knowingly collect personal data from anyone under the age of 16. If you believe a minor has provided us with personal data, please contact us and we will delete it.",
      },
    ],
  },
  {
    id: "changes",
    title: "Changes",
    clauses: [
      {
        num: "12.1",
        title: "Updates to this notice",
        body: "We may update this notice from time to time. Material changes will be signalled through the dashboard or via email to account holders at least 14 days before they take effect. The current version is always available at /privacy and is dated at the top of this page.",
      },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    clauses: [
      {
        num: "13.1",
        title: "How to reach us",
        body: `For privacy questions, subject-access requests, or to exercise any of the rights above, email ${CONTACT_EMAIL}. For general support or informal contact, you can also reach us on Discord at ${SITE.social.discord}.`,
      },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <SiteFrame>
      <div className="ev-legal-page">
        <div className="ev-legal-shell">
          <article className="ev-legal-doc">
            <header>
              <h1>Privacy policy</h1>
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
