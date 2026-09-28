"use client";

import { Logo } from "@/components/site/Logo";
import {
  House, ClockCounterClockwise, SquaresFour, ShieldCheck, Key, DiscordLogo,
  DownloadSimple, BookOpen, Gift, Lightbulb, GearSix, Question,
  Users as PhUsers, Bell as PhBell,
} from "@phosphor-icons/react/dist/ssr";
import { PanelAxisChart, PanelSpark } from "@/components/panel/panel-charts";
import {
  IcCalendar, IcChevronDown, IcChevronRight, IcDownload, IcGlobe, IcHistory,
  IcPanelLeft, IcRefresh, IcRocket, IcSearch, IcSparkle,
} from "@/components/panel/panel-icons";

const SESSIONS = [52, 61, 58, 70, 66, 74, 81, 77, 88, 92, 84, 96, 103, 98, 110, 121, 114, 108, 126, 133, 128, 141, 137, 152, 148, 160, 171, 166, 182, 214];
const LICENSES = [464, 466, 468, 468, 471, 473, 476, 478, 478, 480, 483, 485, 487, 487, 489, 492, 494, 495, 497, 499, 500, 502, 503, 505, 506, 508, 509, 510, 511, 512];
const USERS = [3739, 3744, 3750, 3757, 3762, 3768, 3775, 3779, 3786, 3792, 3797, 3803, 3808, 3812, 3817, 3821, 3826, 3830, 3834, 3837, 3841, 3844, 3847, 3850, 3852, 3854, 3856, 3858, 3860, 3861];
const BLOCKS = [0, 1, 0, 2, 1, 0, 1, 3, 0, 1, 2, 0, 1, 0, 2, 1, 1, 0, 3, 1, 0, 2, 1, 0, 1, 2, 0, 1, 1, 0];

function DeltaChip({ dir, pct }: { dir: "up" | "down" | "flat"; pct: string }) {
  return (
    <span className="pnl-delta" data-dir={dir}>
      <svg viewBox="0 0 10 10" aria-hidden>
        {dir === "flat" ? (
          <path d="M2 5h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        ) : dir === "up" ? (
          <path d="M2 7.5 5.2 4.3 8 7M8 4h.01M4.6 4H8v3.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        ) : (
          <path d="M2 2.5 5.2 5.7 8 3M4.6 6H8V2.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" transform="translate(0,1.5)" />
        )}
      </svg>
      <span>{pct}</span>
    </span>
  );
}

function SideRow({
  icon: Icon,
  label,
  active,
  caret,
  tier,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  active?: boolean;
  caret?: boolean;
  tier?: "obsidian" | "ultra_plus";
}) {
  return (
    <span className="pnl-side-row" data-active={active ? "true" : undefined}>
      <span className="pnl-side-ic"><Icon size={16} /></span>
      <span className="pnl-side-label">{label}</span>
      {tier && (
        <span className="pnl-plan-badge pnl-side-subrow-tier" data-plan={tier}>
          {tier === "ultra_plus" ? "Ultimate" : "Ultra"}
        </span>
      )}
      {caret && (
        <span className="pnl-side-caret">
          <IcChevronRight size={12} strokeWidth={1.7} />
        </span>
      )}
    </span>
  );
}

export function EvPanelHome() {
  return (
    <div className="hero-cf" aria-hidden>
      <div className="hero-pnl-zoom">
      <div className="pnl-body">
        <aside className="pnl-sidebar">
          <div className="pnl-side-brand">
            <span className="pnl-side-brand-mark">
              <Logo size={21} withWordmark={false} />
            </span>
            <span className="pnl-side-brand-name">Evorion</span>
          </div>

          <nav className="pnl-side-nav">
            <SideRow icon={House} label="Overview" active />
            <SideRow icon={ClockCounterClockwise} label="Recents" caret />
            <SideRow icon={SquaresFour} label="Applications" caret />
            <SideRow icon={ShieldCheck} label="Post build protection" caret />

            <div className="pnl-side-section">Observe</div>
            <SideRow icon={PhUsers} label="Users" />
            <SideRow icon={PhBell} label="Notifications" />

            <div className="pnl-side-section">Build</div>
            <SideRow icon={Key} label="API keys" />
            <SideRow icon={DiscordLogo} label="Discord bot" tier="ultra_plus" />
            <SideRow icon={DownloadSimple} label="Downloads" />
            <SideRow icon={BookOpen} label="Documentation" />

            <div className="pnl-side-section">Community</div>
            <SideRow icon={Gift} label="Referrals" />
            <SideRow icon={Lightbulb} label="Suggestions" />

            <div className="pnl-side-sep" />
            <SideRow icon={GearSix} label="Manage account" caret />
            <SideRow icon={Question} label="Support" />
          </nav>

          <div className="pnl-side-foot">
            <span className="pnl-side-user">
              <span className="pnl-side-user-avatar">NX</span>
              <span className="pnl-side-user-meta">
                <span className="pnl-plan-badge" data-plan="obsidian">Ultra</span>
              </span>
            </span>
            <span className="pnl-side-upgrade">Upgrade</span>
            <span className="pnl-side-foot-btn"><IcPanelLeft size={15} /></span>
          </div>
        </aside>

        <div className="pnl-view">
        <div className="pnl-main">
          <div className="pnl-home">
            <div className="pnl-home-pill-row">
              <span className="pnl-home-pill">
                <IcSparkle size={13} className="pnl-home-pill-spark" />
                <span>Onboard your build to Evorion</span>
                <IcChevronRight size={12} className="pnl-home-pill-chev" />
              </span>
            </div>

            <h1 className="pnl-home-title">Let&apos;s get to work.</h1>

            <span className="pnl-home-search">
              <IcSearch size={15} className="pnl-home-search-ic" />
              <span className="pnl-home-search-label">Search</span>
              <span className="pnl-home-search-kbds">
                <kbd className="pnl-kbd">Ctrl</kbd>
                <kbd className="pnl-kbd">K</kbd>
              </span>
            </span>

            <div className="pnl-home-cols">
              <section className="pnl-home-col">
                <a className="pnl-home-col-head" href="#home" onClick={(e) => e.preventDefault()}>
                  <span>Applications</span>
                  <IcChevronRight size={12} />
                </a>
                <div className="pnl-home-list">
                  {["Nebula Loader", "Atlas SDK", "Orbit Auth"].map((name) => (
                    <span key={name} className="pnl-home-item">
                      <IcGlobe size={15} className="pnl-home-item-ic" />
                      <span className="pnl-home-item-name">{name}</span>
                      <IcChevronRight size={12} className="pnl-home-item-chev" />
                    </span>
                  ))}
                </div>
              </section>

              <section className="pnl-home-col">
                <a className="pnl-home-col-head" href="#home" onClick={(e) => e.preventDefault()}>
                  <span>Build</span>
                  <IcChevronRight size={12} />
                </a>
                <span className="pnl-home-ship">
                  <IcRocket size={16} className="pnl-home-ship-ic" />
                  <span>Ship something new</span>
                </span>
                <span className="pnl-home-ship">
                  <IcDownload size={15} className="pnl-home-ship-ic" />
                  <span>Get the Evorion SDK</span>
                </span>
              </section>

              <section className="pnl-home-col">
                <div className="pnl-home-col-head pnl-home-col-head-static">
                  <span>Recents</span>
                </div>
                <div className="pnl-home-list pnl-home-list-recents">
                  {[
                    ["Build", "Downloads"],
                    ["Observe", "Users"],
                    ["Build", "API keys"],
                    ["Applications", "Nebula Loader"],
                  ].map(([section, page]) => (
                    <span key={`${section}-${page}`} className="pnl-home-recent">
                      <IcHistory size={14} className="pnl-home-item-ic" />
                      <span className="pnl-home-recent-crumb">
                        {section} / <span className="pnl-home-recent-page">{page}</span>
                      </span>
                      <IcChevronRight size={12} className="pnl-home-item-chev" />
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <div className="pnl-ana">
              <div className="pnl-ana-head">
                <h2 className="pnl-ana-title">Analytics</h2>
                <div className="pnl-ana-controls">
                  <span className="pnl-ana-range">
                    <IcCalendar size={13} />
                    <span>Last 30 days</span>
                    <IcChevronDown size={11} strokeWidth={1.8} />
                  </span>
                  <span className="pnl-ana-iconbtn"><IcRefresh size={13} /></span>
                </div>
              </div>

              <div className="pnl-ana-grid">
                <div className="pnl-ana-card pnl-ana-card-wide">
                  <div className="pnl-ana-card-head">
                    <span className="pnl-ana-card-label">Session volume</span>
                    <span className="pnl-ana-card-menu" aria-hidden>⋯</span>
                  </div>
                  <div className="pnl-ana-card-value-row">
                    <span className="pnl-ana-card-value">3,412</span>
                    <DeltaChip dir="up" pct="12.4%" />
                  </div>
                  <div className="pnl-ana-card-sub">peak 214 · avg 114/day · 36 live now</div>
                  <div className="pnl-ana-card-chart"><PanelAxisChart data={SESSIONS} /></div>
                </div>

                <div className="pnl-ana-card">
                  <div className="pnl-ana-card-head">
                    <span className="pnl-ana-card-label">Licenses issued</span>
                    <span className="pnl-ana-card-menu" aria-hidden>⋯</span>
                  </div>
                  <div className="pnl-ana-card-value-row">
                    <span className="pnl-ana-card-value">+48</span>
                    <DeltaChip dir="up" pct="9.2%" />
                  </div>
                  <div className="pnl-ana-card-sub">512 active total</div>
                  <div className="pnl-ana-card-chart"><PanelSpark data={LICENSES} /></div>
                </div>

                <div className="pnl-ana-card">
                  <div className="pnl-ana-card-head">
                    <span className="pnl-ana-card-label">New users</span>
                    <span className="pnl-ana-card-menu" aria-hidden>⋯</span>
                  </div>
                  <div className="pnl-ana-card-value-row">
                    <span className="pnl-ana-card-value">+122</span>
                    <DeltaChip dir="up" pct="7.8%" />
                  </div>
                  <div className="pnl-ana-card-sub">3,861 total users</div>
                  <div className="pnl-ana-card-chart"><PanelSpark data={USERS} /></div>
                </div>

                <div className="pnl-ana-card">
                  <div className="pnl-ana-card-head">
                    <span className="pnl-ana-card-label">Blocks</span>
                    <span className="pnl-ana-card-menu" aria-hidden>⋯</span>
                  </div>
                  <div className="pnl-ana-card-value-row">
                    <span className="pnl-ana-card-value">27</span>
                    <DeltaChip dir="flat" pct="0%" />
                  </div>
                  <div className="pnl-ana-card-sub">312 blocked total</div>
                  <div className="pnl-ana-card-chart"><PanelSpark data={BLOCKS} /></div>
                </div>

                <div className="pnl-ana-card pnl-ana-card-list">
                  <div className="pnl-ana-card-head">
                    <span className="pnl-ana-card-label">License status</span>
                    <span className="pnl-ana-card-menu" aria-hidden>⋯</span>
                  </div>
                  <div className="pnl-ana-bars">
                    {[
                      ["Active", 512, 74],
                      ["Unused", 118, 17],
                      ["Expired", 64, 9],
                    ].map(([name, count, share]) => (
                      <div key={String(name)} className="pnl-ana-bar-row">
                        <span className="pnl-ana-bar-name">{name}</span>
                        <span className="pnl-ana-bar-track">
                          <span className="pnl-ana-bar-fill" style={{ width: `${share}%` }} />
                        </span>
                        <span className="pnl-ana-bar-count">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pnl-ana-card pnl-ana-card-wide pnl-ana-card-list">
                  <div className="pnl-ana-card-head">
                    <span className="pnl-ana-card-label">Top applications</span>
                    <span className="pnl-ana-card-link">
                      View all
                      <IcChevronRight size={11} />
                    </span>
                  </div>
                  <div className="pnl-ana-table">
                    {[
                      ["Nebula Loader", "1,922", 24],
                      ["Atlas SDK", "1,204", 9],
                    ].map(([name, users, sessions]) => (
                      <span key={String(name)} className="pnl-ana-table-row">
                        <span className="pnl-ana-table-avatar">{String(name).charAt(0)}</span>
                        <span className="pnl-ana-table-name">{name}</span>
                        <span className="pnl-ana-table-num">{users}<em>users</em></span>
                        <span className="pnl-ana-table-num">{sessions}<em>sessions</em></span>
                        <IcChevronRight size={12} className="pnl-home-item-chev" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      </div>
    </div>
  );
}
