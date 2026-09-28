"use client";

import type { ReactNode } from "react";
import { Logo } from "@/components/site/Logo";
import {
  EvChevronDownIcon,
  EvCollapseArrowIcon,
  EvDashboardIcon,
  EvInboxIcon,
  EvInitiativesIcon,
  EvNewIssueIcon,
  EvProjectsIcon,
  EvReviewsIcon,
  EvSearchIcon,
  EvShieldIcon,
  EvMoreIcon,
} from "./nav-icons";
import { useFrameDemo, type SidebarNavKey } from "./frame-interactive";

function NavSpacer() {
  return <div className="ev-sidebar-spacer" aria-hidden />;
}

function NavItem({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="ev-nav-item"
      data-active={active ? true : undefined}
      data-interactive
      onClick={onClick}
    >
      <span className="ev-nav-icon-slot">{icon}</span>
      <span className="ev-nav-label">{label}</span>
    </button>
  );
}

function CollapsibleSection({ label }: { label: string }) {
  return (
    <button type="button" className="ev-nav-item ev-nav-collapsible" tabIndex={-1}>
      <span className="ev-nav-label">{label}</span>
      <EvCollapseArrowIcon size={16} className="ev-nav-collapse-arrow" />
    </button>
  );
}

export function EvSidebar() {
  const demo = useFrameDemo();

  const pick = (key: SidebarNavKey) => {
    demo.setSidebarNav(key);
    demo.setSelectedId(null);
    demo.setDetail(null);
  };

  return (
    <aside className="ev-sidebar">
      <header className="ev-sidebar-head">
        <button
          type="button"
          className="ev-sidebar-workspace"
          onClick={() => demo.openModal("workspace")}
        >
          <span className="ev-sidebar-logo-wrap">
            <Logo size={14} withWordmark={false} />
          </span>
          <span className="ev-sidebar-workspace-name">{demo.workspace}</span>
          <EvChevronDownIcon size={14} className="ev-sidebar-workspace-chevron" />
        </button>
        <div className="ev-sidebar-actions">
          <button
            type="button"
            className="ev-sidebar-icon-btn ev-sidebar-search-btn"
            aria-label="Search console"
            onClick={() => demo.setPaletteOpen(true)}
          >
            <EvSearchIcon size={16} />
          </button>
          <button
            type="button"
            className="ev-sidebar-icon-btn ev-sidebar-new-btn"
            aria-label="Register app"
            onClick={() => demo.openModal("createApp")}
          >
            <EvNewIssueIcon size={15} />
          </button>
        </div>
      </header>

      <NavSpacer />

      <div className="ev-sidebar-nav-panel">

        <CollapsibleSection label="Developer" />
        <div className="ev-sidebar-nav-items">
          <NavItem
            label="Dashboard"
            icon={<EvDashboardIcon />}
            active={demo.sidebarNav === "dashboard"}
            onClick={() => pick("dashboard")}
          />
          <NavItem
            label="Applications"
            icon={<EvProjectsIcon />}
            active={demo.sidebarNav === "apps"}
            onClick={() => pick("apps")}
          />
          <NavItem
            label="Users"
            icon={<EvMoreIcon />}
            active={demo.sidebarNav === "users"}
            onClick={() => pick("users")}
          />
          <NavItem
            label="Licenses"
            icon={<EvInitiativesIcon />}
            active={demo.sidebarNav === "licenses"}
            onClick={() => pick("licenses")}
          />
        </div>

        <NavSpacer />

        <CollapsibleSection label="Console" />
        <div className="ev-sidebar-nav-items">
          <NavItem
            label="Sessions"
            icon={<EvReviewsIcon />}
            active={demo.sidebarNav === "sessions"}
            onClick={() => pick("sessions")}
          />
          <NavItem
            label="Security"
            icon={<EvShieldIcon />}
            active={demo.sidebarNav === "security"}
            onClick={() => pick("security")}
          />
        </div>
      </div>
    </aside>
  );
}
