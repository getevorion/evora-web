import Link from "next/link";
import { SITE } from "@/lib/site";
import { Logo } from "./Logo";

const COLS = [
  {
    title: "Product",
    links: [
      { href: "/#evorion", label: "Evorion SDK" },

      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/products", label: "Evorion" },
      { href: "/updates", label: "Updates" },
      { href: "/reviews", label: "Reviews" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/docs/api", label: "API reference" },
      { href: "/integrations", label: "Integrations" },
      { href: "/alternatives", label: "Why Evorion" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/aim", label: "Aim module" },
      { href: "/resell/apply", label: "Reseller program" },
      { href: SITE.social.discord, label: "Discord" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/signin", label: "Sign in" },
      { href: "/signup", label: "Create account" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24">
      <div className="shell py-12 grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <Logo />
          <p className="mt-3 text-[13px] text-text-muted leading-relaxed max-w-xs">
            Authentication, licensing, and runtime protection for Windows
            applications.
          </p>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <div className="text-[11px] uppercase tracking-wider text-text-faint font-medium mb-3">
              {c.title}
            </div>
            <ul className="space-y-2">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-text-muted hover:text-text transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div>
        <div className="shell py-5 flex items-center justify-between text-[12px] text-text-faint">
          <span>© 2026 Evora. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
