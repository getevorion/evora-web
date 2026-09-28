"use client";

import { useState, useEffect } from "react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Command } from "cmdk";
import API_NAV from "./api-nav.json";
import { Logo } from "@/components/site/Logo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/cn";
import {
  IcAlert, IcArrowLeft, IcArrowRight, IcBook, IcBolt, IcBan, IcCard, IcChart,
  IcChevronRight, IcCode, IcCube, IcDatabase, IcGear, IcGlobe, IcGrid, IcKey,
  IcKeyRound, IcLogs, IcMonitor, IcPanelLeft, IcPulse, IcRocket, IcSearch,
  IcShield, IcShieldCheck, IcStore, IcUsers,
  type PanelIconProps,
} from "@/components/panel/panel-icons";
import "./docs-nav.css";

type NavLink = { id: string; label: string; method?: string; href?: string };
type Group = { title: string; icon: React.ComponentType<PanelIconProps>; links: NavLink[] };
type Band = { band: string; groups: Group[] };

function iconForApiGroup(title: string): React.ComponentType<PanelIconProps> {
  const t = title.toLowerCase();
  if (t.includes("application")) return IcGrid;
  if (t.includes("statistic")) return IcChart;
  if (t.includes("licens")) return IcKey;
  if (t.includes("user")) return IcUsers;
  if (t.includes("auth")) return IcKeyRound;
  if (t.includes("subscription")) return IcCard;
  if (t.includes("variable")) return IcDatabase;
  if (t.includes("webhook")) return IcBolt;
  if (t.includes("access")) return IcBan;
  if (t.includes("session")) return IcPulse;
  if (t.includes("log")) return IcLogs;
  if (t.includes("seller")) return IcStore;
  if (t.includes("client")) return IcMonitor;
  if (t.includes("entitlement")) return IcShieldCheck;
  if (t.includes("geo")) return IcGlobe;
  if (t.includes("quota")) return IcPulse;
  return IcCube;
}

const BANDS: Band[] = [
  {
    band: "Get started",
    groups: [
      {
        title: "SDK reference",
        icon: IcRocket,
        links: [
          { id: "overview", label: "Overview" },
          { id: "installation", label: "Installation" },
          { id: "quickstart", label: "Quick start" },
          { id: "checklist", label: "Developer checklist" },
          { id: "auth-modes", label: "Auth modes" },
        ],
      },
    ],
  },
  {
    band: "C++ SDK",
    groups: [
      {
        title: "Authentication",
        icon: IcKeyRound,
        links: [
          { id: "login", label: "Login" },
          { id: "register", label: "Register" },
          { id: "license", label: "License key" },
          { id: "client", label: "Client" },
          { id: "result", label: "Result" },
          { id: "userdata", label: "UserData" },
          { id: "errors", label: "Error codes" },
          { id: "init", label: "Init" },
          { id: "check", label: "Check" },
          { id: "heartbeat", label: "Heartbeat" },
          { id: "getvar", label: "GetVar" },
          { id: "setuservar", label: "SetUserVar" },
          { id: "getuservar", label: "GetUserVar" },
          { id: "fetchonline", label: "FetchOnline" },
          { id: "ban", label: "Ban" },
          { id: "invokewebhook", label: "InvokeWebhook" },
          { id: "downloadfile", label: "DownloadFile" },
          { id: "onpush", label: "OnPush" },
        ],
      },
      {
        title: "User accounts",
        icon: IcKeyRound,
        links: [
          { id: "twofa-overview", label: "Two-factor overview" },
          { id: "setup2fa", label: "Setup2FA" },
          { id: "confirm2fa", label: "Confirm2FA" },
          { id: "disable2fa", label: "Disable2FA" },
          { id: "get2fastatus", label: "Get2FAStatus" },
          { id: "twofa-errors", label: "Two-factor error codes" },
          { id: "logout", label: "Logout" },
          { id: "changeusername", label: "ChangeUsername" },
          { id: "password-recovery", label: "Password recovery" },
          { id: "fetchstats", label: "FetchStats" },
          { id: "twofa-support", label: "Lost authenticator" },
        ],
      },
      {
        title: "Secure integration",
        icon: IcAlert,
        links: [
          { id: "security-notice-overview", label: "Overview" },
          { id: "security-notice-recipe-1", label: "Consumer transfer flow" },
          { id: "security-notice-auto-armed", label: "Automatic protection" },
          { id: "security-notice-recipe-2", label: "Refactor inline code" },
          { id: "security-notice-recipe-3", label: "Heartbeat" },
          { id: "security-notice-do-dont", label: "Do / Don't" },
          { id: "security-notice-limitations", label: "Limitations" },
          { id: "security-notice-incident", label: "Incident response" },
          { id: "security-notice-reporting", label: "Vulnerability reporting" },
          { id: "security-notice-glossary", label: "Glossary" },
        ],
      },
      {
        title: "Runtime protection",
        icon: IcShield,
        links: [
          { id: "antidebug", label: "Anti-debug" },
          { id: "integrity", label: "Binary integrity" },
          { id: "hwid", label: "Hardware ID" },
          { id: "secure-creds", label: "Secure credentials" },
          { id: "transport", label: "Transport modes" },
          { id: "version-mgmt", label: "Version management" },
        ],
      },
      {
        title: "Code protection",
        icon: IcCode,
        links: [
          { id: "security-philosophy", label: "Core rule: keep the client bare" },
          { id: "code-protection", label: "Primitives overview" },
          { id: "secure-strings", label: "Encrypted strings" },
          { id: "auth-protect", label: "Auth-protected blocks" },
          { id: "locked-values", label: "Auth-gated integers" },
          { id: "session-bound", label: "Session-bound keys and MACs" },
          { id: "sealed-payloads", label: "Sealed payloads" },
          { id: "dynapi", label: "Dynamic API" },
          { id: "annotated-example", label: "Annotated example" },
        ],
      },
      {
        title: "Custom domain",
        icon: IcGlobe,
        links: [
          { id: "custom-domain", label: "Overview" },
          { id: "custom-domain-setup", label: "Connecting a domain" },
          { id: "custom-domain-rest", label: "REST API" },
          { id: "custom-domain-sdk", label: "C++ SDK" },
          { id: "custom-domain-remove", label: "Disconnecting" },
        ],
      },
    ],
  },
  {
    band: "REST API",
    groups: [
      {
        title: "Developer API",
        icon: IcGrid,
        links: [
          { id: "developer-api", label: "Overview" },
          { id: "developer-api-recipes", label: "Bot & panel recipes" },
          { id: "developer-api-apps", label: "Applications" },
          { id: "developer-api-statistics", label: "Statistics" },
          { id: "developer-api-users", label: "Users" },
          { id: "developer-api-licenses", label: "Licenses" },
          { id: "developer-api-variables", label: "Variables" },
          { id: "developer-api-webhooks", label: "Webhooks" },
          { id: "developer-api-access-lists", label: "Blacklist & whitelist" },
          { id: "developer-api-sellers", label: "Sellers" },
          { id: "developer-api-logs-sessions", label: "Logs & sessions" },
          { id: "developer-api-subscription-tiers", label: "Subscription tiers" },
          { id: "developer-api-advanced", label: "Entitlements & geo" },
          { id: "developer-api-clients", label: "Clients" },
          { id: "developer-api-quota", label: "Quota" },
        ],
      },
      {
        title: "Reseller API",
        icon: IcStore,
        links: [
          { id: "reseller-api", label: "Overview" },
          { id: "reseller-api-idempotency", label: "Idempotency" },
          { id: "reseller-api-licenses", label: "Minting keys" },
          { id: "reseller-api-support", label: "Support & errors" },
          { id: "reseller-api-webhooks", label: "Webhooks" },
          { id: "reseller-api-recipe", label: "Shop delivery recipe" },
        ],
      },
    ],
  },
  {
    band: "Manage",
    groups: [
      {
        title: "Dashboard & tooling",
        icon: IcGear,
        links: [
          { id: "api-keys", label: "API keys" },
          { id: "subscriptions", label: "Subscriptions" },
          { id: "blacklist-whitelist", label: "Blacklist & whitelist" },
          { id: "sessions", label: "Sessions" },
          { id: "sellers", label: "Sellers" },
          { id: "abuse-detection", label: "Abuse detection" },
          { id: "utilities", label: "Utility methods" },
          { id: "preprocessor", label: "Preprocessor defines" },
          { id: "full-example", label: "Full example" },
          { id: "macros", label: "Macros" },
          { id: "changelog", label: "Changelog" },
        ],
      },
    ],
  },
  {
    band: "Endpoint reference",
    groups: [
      {
        title: "Overview",
        icon: IcBook,
        links: [{ id: "api-reference", label: "All endpoints", href: "/docs/api" }],
      },
      ...API_NAV.groups.map((g) => ({
        title: g.title,
        icon: iconForApiGroup(g.title),
        links: g.links.map((l) => ({
          id: l.id,
          label: l.label,
          method: l.method,
          href: `/docs/api/${l.id.replace(/^api-/, "")}`,
        })),
      })),
    ],
  },
];

const GROUPS: Group[] = BANDS.flatMap((b) => b.groups);
const ALL_LINKS = GROUPS.flatMap((g) =>
  g.links.filter((l) => !l.href).map((l) => ({ ...l, group: g.title })),
);

const groupKey = (g: Group) => g.links[0].id;

const HEADER_H = 52;
const SCROLL_OFFSET = HEADER_H + 24;

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  history.replaceState(null, "", `#${id}`);
}

function sectionForId(id: string): string | null {
  for (const g of GROUPS) {
    if (g.links.some((l) => l.id === id)) return groupKey(g);
  }
  return null;
}

function SidebarBrand() {
  return (
    <NextLink href="/" className="dp-brand">
      <Logo size={20} withWordmark={false} />
      <span className="dp-brand-name">Evora</span>
      <span className="dp-brand-chip">Docs</span>
    </NextLink>
  );
}

function SidebarBody({ activeId, onPick }: { activeId: string; onPick?: (id: string) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const activeSection = sectionForId(activeId);
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      GROUPS.map((g) => [groupKey(g), groupKey(g) === "overview" || groupKey(g) === activeSection])
    )
  );

  const [spied, setSpied] = useState(activeSection);
  if (spied !== activeSection) {
    setSpied(activeSection);
    if (activeSection && !open[activeSection]) {
      setOpen((prev) => ({ ...prev, [activeSection]: true }));
    }
  }

  return (
    <ScrollArea
      className="h-full [&>[data-radix-scroll-area-viewport]]:overscroll-contain"
      style={{ overscrollBehavior: "contain" }}
    >
      <nav className="dp-nav">
        {BANDS.map((b, bIdx) => (
          <div key={b.band} className="contents">
            {bIdx > 0 ? <div className="dp-sep" aria-hidden /> : null}
            <div className="dp-band">{b.band}</div>
            {b.groups.map((g) => {
              const gk = groupKey(g);
              const isOpen = !!open[gk];
              const Icon = g.icon;
              const groupActive = g.links.some((l) => l.id === activeId);
              return (
                <div key={gk}>
                  <div
                    className="dp-row-split"
                    data-active={groupActive && !isOpen ? "true" : undefined}
                  >
                    <button
                      type="button"
                      className="dp-row-main"
                      title={g.title}
                      onClick={() => {
                        setOpen((prev) => ({ ...prev, [gk]: true }));
                        const first = g.links[0];
                        if (first.href) router.push(first.href);
                        else scrollToId(first.id);
                        onPick?.(first.id);
                      }}
                    >
                      <span className="dp-ic"><Icon size={16} /></span>
                      <span className="dp-row-label">{g.title}</span>
                    </button>
                    <button
                      type="button"
                      className="dp-caret-btn"
                      aria-label={`${isOpen ? "Collapse" : "Expand"} ${g.title}`}
                      aria-expanded={isOpen}
                      onClick={() => setOpen((prev) => ({ ...prev, [gk]: !prev[gk] }))}
                    >
                      <span className="dp-caret" data-open={isOpen ? "true" : undefined}>
                        <IcChevronRight size={12} strokeWidth={1.7} />
                      </span>
                    </button>
                  </div>

                  <div className="dp-body" data-open={isOpen ? "true" : undefined}>
                    <div className="dp-body-clip">
                      {g.links.map((l) => {
                        const inner = (
                          <>
                            {l.method ? (
                              <span className="dp-method" data-method={l.method}>{l.method}</span>
                            ) : null}
                            <span className="dp-subrow-label">{l.label}</span>
                          </>
                        );
                        return l.href ? (
                          <NextLink
                            key={l.id}
                            href={l.href}
                            className="dp-subrow"
                            data-active={pathname === l.href ? "true" : undefined}
                            title={l.label}
                            onClick={() => onPick?.(l.id)}
                          >
                            {inner}
                          </NextLink>
                        ) : (
                          <button
                            key={l.id}
                            type="button"
                            className="dp-subrow"
                            data-active={activeId === l.id ? "true" : undefined}
                            title={l.label}
                            onClick={() => {
                              scrollToId(l.id);
                              onPick?.(l.id);
                            }}
                          >
                            {inner}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </nav>
    </ScrollArea>
  );
}

type TocEntry = { id: string; text: string; level: 2 | 3 };

function useRightToc(activeId: string) {
  const [entries, setEntries] = useState<TocEntry[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const group = GROUPS.find((g) => g.links.some((l) => l.id === activeId));
    if (!group) {
      setEntries([]);
      return;
    }
    const seen = new Set<string>();
    const next: TocEntry[] = [];
    for (const link of group.links) {
      if (seen.has(link.id)) continue;
      const el = document.getElementById(link.id);
      if (!el) continue;
      const heading = el.querySelector("h2, h3");
      seen.add(link.id);
      next.push({
        id: link.id,
        text: (heading?.textContent || link.label).trim(),
        level: 2,
      });
      const subs = el.querySelectorAll<HTMLHeadingElement>("h3[id]");
      subs.forEach((h) => {
        if (!h.id || seen.has(h.id)) return;
        seen.add(h.id);
        next.push({
          id: h.id,
          text: h.textContent?.trim() || h.id,
          level: 3,
        });
      });
    }
    setEntries(next);
  }, [activeId]);

  useEffect(() => {
    if (entries.length === 0) return;
    const els = entries.map((e) => document.getElementById(e.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (records) => {
        const visible = records
          .filter((r) => r.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: `-${HEADER_H + 16}px 0px -70% 0px`, threshold: [0, 0.25, 0.5, 1] }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [entries]);

  return { entries, active };
}

function RightToc({ activeId }: { activeId: string }) {
  const { entries, active } = useRightToc(activeId);
  if (entries.length === 0) return null;
  return (
    <aside
      className="hidden xl:block fixed top-[52px] h-[calc(100vh-52px)] overflow-y-auto w-[220px] z-30"
      style={{ right: "40px", overscrollBehavior: "contain" }}
    >
      <div className="py-14 pl-6 pr-4">
        <h2
          className="text-[12.5px] font-medium mb-3"
          style={{ color: "var(--docs-toc-label)", letterSpacing: "-0.005em" }}
        >
          On this page
        </h2>
        <ul
          className="relative border-l"
          style={{ borderColor: "var(--docs-toc-rail)" }}
        >
          {entries.map((e) => {
            const isActive = active === e.id;
            return (
              <li key={e.id} className="relative">
                {isActive ? (
                  <span
                    className="absolute -left-[1px] top-1.5 bottom-1.5 w-[2px] rounded-sm"
                    style={{ background: "var(--docs-toc-rail-active)" }}
                    aria-hidden
                  />
                ) : null}
                <button
                  onClick={() => {
                    const el = document.getElementById(e.id);
                    if (!el) return;
                    const y = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
                    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
                    history.replaceState(null, "", `#${e.id}`);
                  }}
                  className={cn(
                    "block text-left text-[13px] leading-[1.5] py-1.5 pl-3 pr-2 transition-colors w-full line-clamp-2",
                    e.level === 3 && "pl-6 text-[12.5px]"
                  )}
                  style={{
                    color: isActive ? "var(--docs-toc-item-fg-active)" : "var(--docs-toc-item-fg)",
                    fontWeight: isActive ? 500 : 400,
                    fontFamily: "var(--font-docs)",
                  }}
                >
                  {e.text}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center pt-[14vh] px-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in"
        onClick={() => onOpenChange(false)}
      />
      <Command
        label="Docs search"
        className="relative w-full max-w-[560px] rounded-xl shadow-2xl overflow-hidden"
        style={{
          background: "var(--bg-docs-elevated, #131313)",
          border: "1px solid var(--docs-hairline-strong)",
        }}
      >
        <div
          className="flex items-center gap-2 px-4 border-b"
          style={{ borderColor: "var(--docs-hairline)" }}
        >
          <span style={{ color: "var(--docs-faint)" }}><IcSearch size={15} /></span>
          <Command.Input
            autoFocus
            placeholder="Search the documentation…"
            className="flex-1 bg-transparent py-3.5 text-[14px] outline-none"
            style={{
              color: "var(--docs-heading)",
              fontFamily: "var(--font-docs)",
            }}
          />
          <kbd
            className="text-[10px] font-mono rounded px-1.5 py-0.5"
            style={{
              color: "var(--docs-faint)",
              border: "1px solid var(--docs-hairline)",
            }}
          >
            ESC
          </kbd>
        </div>
        <Command.List className="max-h-[380px] overflow-y-auto py-2">
          <Command.Empty
            className="px-4 py-6 text-[13px] text-center"
            style={{ color: "var(--docs-faint)" }}
          >
            No results.
          </Command.Empty>
          {GROUPS.map((s) => (
            <Command.Group
              key={groupKey(s)}
              heading={s.title}
              className="px-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[12px] [&_[cmdk-group-heading]]:font-medium"
            >
              {s.links.map((l) => (
                <Command.Item
                  key={l.id}
                  value={`${s.title} ${l.label}`}
                  onSelect={() => {
                    onOpenChange(false);
                    setTimeout(() => scrollToId(l.id), 30);
                  }}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-md text-[13.5px] cursor-pointer data-[selected=true]:bg-white/[0.06]"
                  style={{
                    color: "var(--docs-body)",
                    fontFamily: "var(--font-docs)",
                  }}
                >
                  <span className="flex-1 truncate">{l.label}</span>
                  <span className="text-[10.5px]" style={{ color: "var(--docs-faint)" }}>
                    {s.title}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>
      </Command>
    </div>
  );
}

function PrevNext({ activeId }: { activeId: string }) {
  const idx = ALL_LINKS.findIndex((l) => l.id === activeId);
  if (idx === -1) return null;
  const prev = idx > 0 ? ALL_LINKS[idx - 1] : null;
  const next = idx < ALL_LINKS.length - 1 ? ALL_LINKS[idx + 1] : null;
  return (
    <nav
      className="not-prose mt-16 flex flex-col gap-3 pt-6 sm:flex-row sm:justify-between"
      style={{ borderTop: "1px solid var(--docs-hairline)" }}
    >
      {prev ? (
        <button
          onClick={() => scrollToId(prev.id)}
          className="group flex-1 text-left rounded-[10px] px-4 py-3.5 transition-colors"
          style={{
            border: "1px solid var(--docs-hairline)",
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--docs-hairline-strong)";
            e.currentTarget.style.background = "rgba(255,255,255,0.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--docs-hairline)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <div
            className="flex items-center gap-1.5 text-[12px] font-medium mb-1.5"
            style={{ color: "var(--docs-faint)" }}
          >
            <IcArrowLeft size={13} strokeWidth={1.7} /> Previous
          </div>
          <div className="text-[14px] font-medium truncate" style={{ color: "var(--docs-heading)" }}>
            {prev.label}
          </div>
          <div className="text-[11.5px] truncate mt-0.5" style={{ color: "var(--docs-faint)" }}>
            {prev.group}
          </div>
        </button>
      ) : <div className="flex-1" />}
      {next ? (
        <button
          onClick={() => scrollToId(next.id)}
          className="group flex-1 text-right rounded-[10px] px-4 py-3.5 transition-colors"
          style={{
            border: "1px solid var(--docs-hairline)",
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--docs-hairline-strong)";
            e.currentTarget.style.background = "rgba(255,255,255,0.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--docs-hairline)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <div
            className="flex items-center justify-end gap-1.5 text-[12px] font-medium mb-1.5"
            style={{ color: "var(--docs-faint)" }}
          >
            Next <IcArrowRight size={13} strokeWidth={1.7} />
          </div>
          <div className="text-[14px] font-medium truncate" style={{ color: "var(--docs-heading)" }}>
            {next.label}
          </div>
          <div className="text-[11.5px] truncate mt-0.5" style={{ color: "var(--docs-faint)" }}>
            {next.group}
          </div>
        </button>
      ) : <div className="flex-1" />}
    </nav>
  );
}

function TopHeader({ onCmdK, onMobileNav }: { onCmdK: () => void; onMobileNav: () => void }) {
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent);
  return (
    <header className="dp-topbar fixed top-0 right-0 left-0 lg:left-[260px] h-[52px] z-30 flex items-center gap-3 pl-3 pr-4 lg:px-5">
      <button
        type="button"
        onClick={onMobileNav}
        aria-label="Open navigation"
        className="dp-iconbtn lg:hidden"
      >
        <IcPanelLeft size={16} />
      </button>

      <button
        type="button"
        onClick={onCmdK}
        aria-label="Search documentation"
        className="dp-search w-full max-w-[420px] sm:min-w-[280px]"
      >
        <IcSearch size={14} />
        <span className="dp-search-text hidden sm:inline">Search the documentation</span>
        <span className="dp-kbd hidden sm:inline-flex">{isMac ? "⌘K" : "Ctrl K"}</span>
      </button>
    </header>
  );
}

export function DocsLayoutClient({ children }: { children: React.ReactNode }) {
  const [activeId, setActiveId] = useState("overview");
  const [cmdOpen, setCmdOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    const ids = ALL_LINKS.map((l) => l.id);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: `-${HEADER_H + 8}px 0px -70% 0px`, threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      setTimeout(() => scrollToId(id), 50);
    }
  }, []);

  return (
    <div
      data-theme="dark"
      data-lenis-prevent
      className="min-h-screen docs-scope"
      style={{
        background: "var(--bg-docs)",
        fontFamily: "var(--font-docs)",
        color: "var(--docs-body)",
      }}
    >
      <TopHeader onCmdK={() => setCmdOpen(true)} onMobileNav={() => setMobileNav(true)} />
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />

      <Sheet open={mobileNav} onOpenChange={setMobileNav}>
        <SheetContent
          side="left"
          data-theme="dark"
          className="dp-side w-[260px] p-0 docs-scope flex flex-col"
          style={{ fontFamily: "var(--font-docs)", color: "var(--docs-body)" }}
        >
          <SheetTitle className="sr-only">Documentation navigation</SheetTitle>
          <SidebarBrand />
          <div className="flex-1 min-h-0">
            <SidebarBody activeId={activeId} onPick={() => setMobileNav(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="pt-[52px]">
        <aside className="dp-side hidden lg:flex flex-col fixed left-0 top-0 h-screen w-[260px] z-40">
          <SidebarBrand />
          <div className="flex-1 min-h-0">
            <SidebarBody activeId={activeId} />
          </div>
        </aside>

        <div className="relative lg:pl-[260px] xl:pr-[280px]">
          <div
            aria-hidden
            className="pointer-events-none fixed inset-x-0 top-[52px] z-0"
            style={{
              height: 420,
              background:
                "linear-gradient(180deg, rgba(0, 87, 255, 0.13) 0%, rgba(0, 87, 255, 0.06) 30%, rgba(0, 87, 255, 0.02) 62%, transparent 100%)",
              maskImage: "linear-gradient(180deg, black 0%, black 55%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(180deg, black 0%, black 55%, transparent 100%)",
            }}
          />

          <div className="relative z-10 flex justify-center">
            <main className="w-full max-w-[1000px] px-6 lg:px-16 pt-14 lg:pt-16 pb-32">
              {children}
              <PrevNext activeId={activeId} />
            </main>
          </div>
        </div>

        <RightToc activeId={activeId} />
      </div>
    </div>
  );
}
