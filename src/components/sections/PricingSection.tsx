"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { SITE } from "@/lib/site";
import type { BillingTier } from "@/lib/billing";

const BILLING_PLANS = [
  {
    id: "free",
    name: "Free",
    price: { monthly: "£0", annual: "£0" },
    per: "forever",
    desc: "Core auth and basic licensing. No card required.",
    cta: "Get started",
    href: SITE.social.discord,
    featured: false,
    enterprise: false,
  },
  {
    id: "pro",
    name: "Evorion Pro",
    price: { monthly: "£6.99", annual: "£4.99" },
    per: "/ month",
    desc: "Full runtime protection for production apps.",
    cta: "Get Pro",
    href: SITE.social.discord,
    featured: false,
    enterprise: false,
  },
  {
    id: "ultra",
    name: "Evorion Ultra",
    price: { monthly: "£14.99", annual: "£11.99" },
    per: "/ month",
    desc: "Everything in Pro plus SSCX and attestation. Sensitive functions leave the client.",
    cta: "Get Ultra",
    href: SITE.social.discord,
    featured: false,
    enterprise: false,
  },
  {
    id: "ultra_plus",
    name: "Evorion Ultimate",
    price: { monthly: "£24.99", annual: "£19.99" },
    per: "/ month",
    desc: "DRM-grade protection. Whole-binary code virtualisation, license + HWID-bound activation. Currently in beta.",
    cta: "Get Ultimate",
    href: SITE.social.discord,
    featured: false,
    enterprise: false,
    beta: true,
  },
] as const;

type PlanId = (typeof BILLING_PLANS)[number]["id"];

const PLAN_CHECKOUT: Record<string, { tier: BillingTier; lifetime: string } | null> = {
  free: null,
  pro: { tier: "platinum", lifetime: "£149.99" },
  ultra: { tier: "obsidian", lifetime: "£299.99" },
  ultra_plus: { tier: "ultra_plus", lifetime: "£499.99" },
};

type FeatureValue = true | false | string;

type FeatureSection = {
  heading: string;
  rows: {
    label: string;
    tooltip?: string;
    values: Record<PlanId, FeatureValue>;
  }[];
};

const FEATURE_SECTIONS: FeatureSection[] = [
  {
    heading: "Apps & licensing",
    rows: [
      {
        label: "Apps",
        values: { free: "1 app", pro: "4 apps", ultra: "Unlimited apps", ultra_plus: "Unlimited apps" },
      },
      {
        label: "Users per app",
        values: { free: "10 users", pro: "500 users", ultra: "Unlimited users", ultra_plus: "Unlimited users" },
      },
      {
        label: "License keys",
        tooltip: "Free-plan keys carry an EVORION- prefix so end users can tell the tier at a glance. Paid tiers generate against your own mask.",
        values: { free: "EVORION- prefix", pro: true, ultra: true, ultra_plus: true },
      },
      {
        label: "HWID binding",
        tooltip: "Hardware ID binding locks a license to a specific device.",
        values: { free: true, pro: true, ultra: true, ultra_plus: true },
      },
      {
        label: "Subscription levels",
        values: { free: "1 level", pro: "5 levels", ultra: "Unlimited levels", ultra_plus: "Unlimited levels" },
      },
    ],
  },
  {
    heading: "Runtime protection",
    rows: [
      {
        label: "Anti-debug & anti-VM",
        tooltip: "Interval-driven background monitor — PEB, NtQueryInformationProcess, hardware DRs, hypervisor probes.",
        values: { free: false, pro: true, ultra: true, ultra_plus: true },
      },
      {
        label: "Control-flow flattening",
        tooltip: "EVORION_PROTECT restructures branches into a 64-slot encrypted dispatch table with ghost blocks.",
        values: { free: false, pro: false, ultra: true, ultra_plus: true },
      },
      {
        label: "Sealed string constants",
        tooltip: "EVSK() XTEA-encrypts credentials at compile time — no plaintext in .rdata.",
        values: { free: false, pro: true, ultra: true, ultra_plus: true },
      },
      {
        label: "Server-decrypted sections",
        tooltip: "EVORION_ENCRYPT — AES-256-GCM at rest, keys held on Evora servers, decrypted on entry.",
        values: { free: false, pro: true, ultra: true, ultra_plus: true },
      },
      {
        label: "Server-side code execution",
        tooltip: "Sensitive functions stripped from client binary, executed server-side.",
        values: { free: false, pro: false, ultra: true, ultra_plus: true },
      },
      {
        label: "Whole-binary code virtualisation (DRM)",
        tooltip: "evora-shield — VMProtect-class whole-binary packer. 99.9% of functions are lifted to a per-build bytecode VM (per-region threaded dispatcher, position-rolling opcode cipher). Native x64 of protected code never lives in the shipped binary. Activation is bound to the license + HWID via the SDK runtime.",
        values: { free: false, pro: false, ultra: false, ultra_plus: true },
      },
    ],
  },
  {
    heading: "Developer tools",
    rows: [
      {
        label: "API & webhook access",
        values: { free: false, pro: true, ultra: true, ultra_plus: true },
      },
      {
        label: "Reseller / seller panel",
        values: { free: false, pro: true, ultra: true, ultra_plus: true },
      },
      {
        label: "Audit trail & export",
        values: { free: false, pro: false, ultra: true, ultra_plus: true },
      },
      {
        label: "Variables (remote config)",
        values: { free: false, pro: true, ultra: true, ultra_plus: true },
      },
      {
        label: "Evorion discord bot",
        tooltip: "The exclusive Evorion bot in your own discord server — generate and revoke keys, reset HWIDs, ban users and read live stats, driven from the developer panel.",
        values: { free: false, pro: false, ultra: false, ultra_plus: true },
      },
    ],
  },
  {
    heading: "Support",
    rows: [
      {
        label: "Discord community",
        values: { free: true, pro: true, ultra: true, ultra_plus: true },
      },
      {
        label: "Priority support",
        values: { free: false, pro: false, ultra: true, ultra_plus: true },
      },
    ],
  },
];

const ALL_FEATURE_ROWS = FEATURE_SECTIONS.flatMap((section) => section.rows);

function FeatureMark({ included }: { included: boolean }) {
  if (!included) {
    return <span className="lnp-feature-mark lnp-feature-mark-off">—</span>;
  }
  return (
    <span className="lnp-feature-mark lnp-feature-mark-on">
      <Check className="size-3.5" strokeWidth={2.5} />
    </span>
  );
}

function FeatureCell({ value }: { value: FeatureValue }) {
  const included = value !== false;

  if (!included) {
    return (
      <div className="lnp-feature lnp-feature-off">
        <FeatureMark included={false} />
      </div>
    );
  }

  if (value === true) {
    return (
      <div className="lnp-feature lnp-feature-included">
        <FeatureMark included={true} />
      </div>
    );
  }

  return (
    <div className="lnp-feature lnp-feature-included">
      <FeatureMark included={true} />
      <span className="lnp-feature-text">{value}</span>
    </div>
  );
}

function PlanCardFeatures({ planId }: { planId: PlanId }) {
  return (
    <ul className="lnp-card-features">
      {ALL_FEATURE_ROWS.map((row) => {
        const value = row.values[planId];
        const included = value !== false;
        return (
          <li
            key={row.label}
            className={`lnp-card-feature${included ? " lnp-card-feature-included" : " lnp-card-feature-off"}`}
          >
            <FeatureMark included={included} />
            <span className="lnp-card-feature-text">
              {included ? (
                typeof value === "string" ? (
                  <>
                    {row.label}
                    <span className="lnp-card-feature-detail"> · {value}</span>
                  </>
                ) : (
                  row.label
                )
              ) : (
                row.label
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function BillingToggle({
  annual,
  onToggle,
}: {
  annual: boolean;
  onToggle: () => void;
}) {
  return (
    <button type="button" className="lnp-toggle" onClick={onToggle} aria-pressed={annual}>
      <span className="lnp-toggle-label" style={{ color: annual ? "var(--ev-text-tertiary)" : "var(--ev-text-primary)" }}>
        Monthly
      </span>
      <span className={`lnp-switch ${annual ? "lnp-switch-on" : ""}`} aria-hidden>
        <span className={`lnp-switch-thumb ${annual ? "lnp-switch-thumb-on" : ""}`} />
      </span>
      <span className="lnp-toggle-label" style={{ color: annual ? "var(--ev-text-primary)" : "var(--ev-text-tertiary)" }}>
        Annual
      </span>
      <span className="lnp-discount-pill">Save 20%</span>
    </button>
  );
}

function PlanCTA({
  plan,
  annual,
}: {
  plan: (typeof BILLING_PLANS)[number];
  annual: boolean;
}) {
  const checkout = PLAN_CHECKOUT[plan.id];
  const cadence = annual ? "annual" : "monthly";
  const cls = plan.featured ? "lnp-btn-primary" : "lnp-btn-secondary";

  return (
    <div className="lnp-cta">
      <div className="lnp-btn-wrap">
        {checkout ? (
          <Link href={`/checkout?tier=${checkout.tier}&cadence=${cadence}`} className={cls}>
            {plan.cta}
          </Link>
        ) : (
          <Link href={plan.href} className={cls}>
            {plan.cta}
          </Link>
        )}
      </div>

      <div className="lnp-cta-sub">
        {checkout && (
          <Link
            href={`/checkout?tier=${checkout.tier}&cadence=lifetime`}
            className="lnp-cta-lifetime"
          >
            or {checkout.lifetime} lifetime
          </Link>
        )}
      </div>
    </div>
  );
}

function PaymentMethods() {
  const ic: CSSProperties = { height: 68, width: "auto", flex: "0 0 auto" };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 12,
        padding: "30px 16px 64px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: 120,
          color: "#ffffff",
          maxWidth: "100%",
        }}
      >
        <svg style={{ ...ic, height: 58 }} viewBox="58 140 664 220" role="img" aria-label="Visa">
          <path d="M489.823 143.111C442.988 143.111 401.134 167.393 401.134 212.256C401.134 263.706 475.364 267.259 475.364 293.106C475.364 303.989 462.895 313.731 441.6 313.731C411.377 313.731 388.789 300.119 388.789 300.119L379.123 345.391C379.123 345.391 405.145 356.889 439.692 356.889C490.898 356.889 531.19 331.415 531.19 285.784C531.19 231.419 456.652 227.971 456.652 203.981C456.652 195.455 466.887 186.114 488.122 186.114C512.081 186.114 531.628 196.014 531.628 196.014L541.087 152.289C541.087 152.289 519.818 143.111 489.823 143.111ZM61.3294 146.411L60.1953 153.011C60.1953 153.011 79.8988 156.618 97.645 163.814C120.495 172.064 122.122 176.868 125.971 191.786L167.905 353.486H224.118L310.719 146.411H254.635L198.989 287.202L176.282 167.861C174.199 154.203 163.651 146.411 150.74 146.411H61.3294ZM333.271 146.411L289.275 353.486H342.756L386.598 146.411H333.271ZM631.554 146.411C618.658 146.411 611.825 153.318 606.811 165.386L528.458 353.486H584.542L595.393 322.136H663.72L670.318 353.486H719.805L676.633 146.411H631.554ZM638.848 202.356L655.473 280.061H610.935L638.848 202.356Z" fill="#1434CB" />
        </svg>

        <svg style={ic} viewBox="100 68 580 364" role="img" aria-label="Mastercard">
          <path d="M465.738 113.525H313.812V386.475H465.738V113.525Z" fill="#FF5A00" />
          <path d="M323.926 250C323.926 194.545 349.996 145.326 390 113.525C360.559 90.3769 323.42 76.3867 282.91 76.3867C186.945 76.3867 109.297 154.035 109.297 250C109.297 345.965 186.945 423.614 282.91 423.614C323.42 423.614 360.559 409.623 390 386.475C349.94 355.123 323.926 305.455 323.926 250Z" fill="#EB001B" />
          <path d="M670.711 250C670.711 345.965 593.062 423.614 497.098 423.614C456.588 423.614 419.449 409.623 390.008 386.475C430.518 354.618 456.082 305.455 456.082 250C456.082 194.545 430.012 145.326 390.008 113.525C419.393 90.3769 456.532 76.3867 497.041 76.3867C593.062 76.3867 670.711 154.541 670.711 250Z" fill="#F79E1B" />
        </svg>

        <svg style={ic} viewBox="0 0 32 32" role="img" aria-label="Bitcoin">
          <circle cx="16" cy="16" r="16" fill="#F7931A" />
          <path d="M23.189 13.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 5l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z" fill="#fff" fillRule="evenodd" />
        </svg>

        <svg style={ic} viewBox="0 0 32 32" role="img" aria-label="Ethereum">
          <circle cx="16" cy="16" r="16" fill="#627EEA" />
          <g fill="#fff">
            <path fillOpacity="0.6" d="M16.498 3v8.87l7.497 3.35z" />
            <path d="M16.498 3L9 15.22l7.498-3.35z" />
            <path fillOpacity="0.6" d="M16.498 20.968v6.027L24 16.616z" />
            <path d="M16.498 26.995v-6.028L9 16.616z" />
            <path fillOpacity="0.2" d="M16.498 19.573l7.497-4.353-7.497-3.348z" />
            <path fillOpacity="0.6" d="M9 15.22l7.498 4.353v-7.701z" />
          </g>
        </svg>

        <svg style={ic} viewBox="0 0 32 32" role="img" aria-label="Litecoin">
          <circle cx="16" cy="16" r="16" fill="#345D9D" />
          <path d="M10.427 18.214L9 18.768l.688-2.759 1.444-.58L13.213 7h5.129l-1.519 6.196 1.41-.571-.68 2.75-1.427.571-.848 3.483H23L22.127 23H9.252z" fill="#fff" />
        </svg>
      </div>
    </div>
  );
}

export function PricingSection({ showHeader = true }: { showHeader?: boolean }) {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="lnp-root section-anchor">
      <div className="ev-section-inner">
        {showHeader ? (
          <header className="lnp-header">
            <div className="lnp-eyebrow">
              <span className="lnp-eyebrow-dot" />
              Pricing
            </div>
            <h2 className="lnp-title">
              Start free. Upgrade when it matters.
            </h2>
            <p className="lnp-subtitle">
              Same SDK surface on every plan. Higher limits and runtime
              protection scale with your tier.
            </p>
          </header>
        ) : null}

        <div className="lnp-billing">
          <BillingToggle annual={annual} onToggle={() => setAnnual((v) => !v)} />
        </div>

        <div className="lnp-plans">
          {BILLING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`lnp-card ${plan.featured ? "lnp-card-featured" : ""}`}
            >
              <div className="lnp-card-top">
                <div className="lnp-plan-name-row">
                  <span className={`lnp-plan-name ${plan.featured ? "lnp-plan-name-featured" : ""}`}>
                    {plan.name}
                  </span>
                  {"beta" in plan && plan.beta ? (
                    <span className="lnp-badge lnp-badge-beta">Beta</span>
                  ) : plan.featured ? (
                    <span className="lnp-badge">Most popular</span>
                  ) : null}
                </div>

                <div className="lnp-price-row">
                  <span className={`lnp-price ${plan.featured ? "lnp-price-featured" : ""}`}>
                    {plan.enterprise
                      ? "Custom"
                      : annual
                      ? plan.price.annual
                      : plan.price.monthly}
                  </span>
                  {plan.per && (
                    <span className="lnp-price-per">{plan.per}</span>
                  )}
                </div>

                <p className="lnp-desc">{plan.desc}</p>
              </div>

              <PlanCardFeatures planId={plan.id} />

              <PlanCTA plan={plan} annual={annual} />
            </div>
          ))}
        </div>

        <PaymentMethods />

        {FEATURE_SECTIONS.map((section) => (
          <div key={section.heading} className="lnp-section">
            <h3 className="lnp-section-heading">{section.heading}</h3>

            {section.rows.map((row) => (
              <div key={row.label} className="lnp-row">
                <span className="lnp-row-label" title={row.tooltip}>
                  {row.label}
                  {row.tooltip && <span className="lnp-row-tooltip-dot" aria-hidden>?</span>}
                </span>
                {BILLING_PLANS.map((plan) => (
                  <FeatureCell key={plan.id} value={row.values[plan.id]} />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
