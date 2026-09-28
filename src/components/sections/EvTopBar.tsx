"use client";

import type { ReactNode } from "react";
import { Logo } from "@/components/site/Logo";
import {
  SquaresFour,
  AppWindow,
  Users,
  Key,
  CaretDown,
  MagnifyingGlass,
  Moon,
  Bell,
} from "@phosphor-icons/react/dist/ssr";
import { useFrameDemo, type SidebarNavKey } from "./frame-interactive";

type NavDef = {
  label: string;
  icon: ReactNode;
  nav: SidebarNavKey;
  count?: number;
  badge?: string;
};

export function EvTopBar() {
  const demo = useFrameDemo();

  const pick = (key: SidebarNavKey) => {
    demo.setSidebarNav(key);
    demo.setSelectedId(null);
    demo.setDetail(null);
  };

  const nav: NavDef[] = [
    { label: "Dashboard", icon: <SquaresFour weight="duotone" className="size-3.5" />, nav: "dashboard" },
    { label: "Applications", icon: <AppWindow weight="duotone" className="size-3.5" />, nav: "apps", count: 3 },
    { label: "Users", icon: <Users weight="duotone" className="size-3.5" />, nav: "users" },
    { label: "Licenses", icon: <Key weight="duotone" className="size-3.5" />, nav: "licenses" },
  ];

  return (
    <header className="ev-topbar">
      <div className="ev-topbar-left">
        <button
          type="button"
          className="ev-topbar-workspace"
          onClick={() => demo.openModal("workspace")}
        >
          <span className="ev-topbar-workspace-logo">
            <Logo size={16} withWordmark={false} />
          </span>
          <span className="ev-topbar-workspace-name">Northwind</span>
          <CaretDown className="ev-topbar-workspace-chevron size-3" />
        </button>

        <nav className="ev-topbar-nav">
          {nav.map((item) => (
            <button
              key={item.label}
              type="button"
              className="ev-topbar-nav-item"
              data-active={demo.sidebarNav === item.nav ? "true" : undefined}
              onClick={() => pick(item.nav)}
            >
              <span className="ev-topbar-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.count != null ? (
                <span className="ev-topbar-nav-count">{item.count}</span>
              ) : null}
              {item.badge ? (
                <span className="ev-topbar-badge ev-topbar-badge-live">{item.badge}</span>
              ) : null}
            </button>
          ))}
          <button
            type="button"
            className="ev-topbar-nav-item ev-topbar-nav-more"
            onClick={() => demo.setPaletteOpen(true)}
          >
            <span>More</span>
            <CaretDown className="size-3" />
          </button>
        </nav>
      </div>

      <div className="ev-topbar-right">
        <button
          type="button"
          className="ev-topbar-search"
          onClick={() => demo.setPaletteOpen(true)}
        >
          <MagnifyingGlass className="size-3.5" />
          <span className="ev-topbar-search-label">Search</span>
          <kbd className="ev-topbar-search-kbd">⌘K</kbd>
        </button>
        <button type="button" className="ev-topbar-theme" aria-label="Theme">
          <Moon className="size-[15px]" />
        </button>
        <button type="button" className="ev-topbar-action" aria-label="Notifications">
          <Bell className="size-[15px]" />
        </button>
        <button type="button" className="ev-topbar-user" aria-label="Account">
          <span className="ev-topbar-user-avatar">E</span>
          <CaretDown className="size-3 text-[color:var(--ev-text-quaternary)]" />
        </button>
      </div>
    </header>
  );
}
