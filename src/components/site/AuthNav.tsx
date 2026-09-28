"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { cn } from "@/lib/cn";
import { apiUrl } from "@/lib/api";
import { spaHref } from "@/lib/spa";

const SESSION_CACHE_KEY = "evoraSessionUser_v1";

const SESSION_CACHE_TTL_MS = 30_000;

type SessionSource = "auth" | "user" | "seller";

type SessionUser = {
  username: string;
  source: SessionSource;
  role?: string;
  canAccessDeveloperDashboard: boolean;
};

function loadCache(): SessionUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_CACHE_KEY);
    if (!raw) return null;

    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== "object") return null;
    if (!Number.isFinite(obj.ts)) return null;
    if (Date.now() - obj.ts > SESSION_CACHE_TTL_MS) return null;

    const u = obj.user;
    if (!u || typeof u.username !== "string") return null;
    if (u.username.length < 1 || u.username.length > 64) return null;

    const source = u.source === "auth" || u.source === "user" || u.source === "seller" ? u.source : null;
    if (!source) return null;

    return {
      username: u.username,
      source,
      role: typeof u.role === "string" ? u.role : undefined,
      canAccessDeveloperDashboard: Boolean(u.canAccessDeveloperDashboard),
    };
  } catch {
    return null;
  }
}

function saveCache(user: SessionUser) {
  try {
    sessionStorage.setItem(
      SESSION_CACHE_KEY,
      JSON.stringify({
        ts: Date.now(),
        user,
      })
    );
  } catch {}
}

function clearCache() {
  try {
    sessionStorage.removeItem(SESSION_CACHE_KEY);
  } catch {}
}

function canAccessDeveloper(role?: string) {
  return role === "developer" || role === "admin" || role === "ev0ra" || role === "ev0ra_admin";
}

async function readJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchAuthSession(): Promise<SessionUser | null> {
  const res = await fetch(apiUrl("/api/auth/me"), {
    credentials: "include",
    headers: { "X-Requested-With": "XMLHttpRequest" },
    cache: "no-store",
  });
  if (!res.ok) return null;

  const data = await readJson(res);
  const user = data?.user;
  if (!user || typeof user.username !== "string") return null;

  const role = typeof user.role === "string" ? user.role : undefined;
  return {
    username: user.username,
    source: "auth",
    role,
    canAccessDeveloperDashboard: canAccessDeveloper(role),
  };
}

async function fetchUserSession(): Promise<SessionUser | null> {
  const res = await fetch(apiUrl("/api/user/me"), {
    credentials: "include",
    headers: { "X-Requested-With": "XMLHttpRequest" },
    cache: "no-store",
  });
  if (!res.ok) return null;

  const data = await readJson(res);
  const user = data?.data?.user ?? data?.data;
  if (!user || typeof user.username !== "string") return null;

  return {
    username: user.username,
    source: "user",
    canAccessDeveloperDashboard: false,
  };
}

async function fetchSellerSession(): Promise<SessionUser | null> {
  const res = await fetch(apiUrl("/api/seller/me"), {
    credentials: "include",
    headers: { "X-Requested-With": "XMLHttpRequest" },
    cache: "no-store",
  });
  if (!res.ok) return null;

  const data = await readJson(res);
  const seller = data?.seller;
  if (!seller || typeof seller.username !== "string") return null;

  return {
    username: seller.username,
    source: "seller",
    canAccessDeveloperDashboard: false,
  };
}

async function raceInPriorityOrder(
  probes: Array<() => Promise<SessionUser | null>>
): Promise<SessionUser | null> {
  const results = await Promise.all(probes.map((p) => p().catch(() => null)));
  for (const r of results) if (r) return r;
  return null;
}

async function fetchSession(): Promise<SessionUser | null> {
  const path = window.location.pathname;
  const preferAuth = path === "/developer" || path.startsWith("/developer/");
  const preferUser = path === "/panel" || path.startsWith("/panel/");
  const preferSeller = path === "/resell" || path.startsWith("/resell/");

  const cached = loadCache();
  if (cached?.source === "auth" && !preferUser && !preferSeller) {
    return raceInPriorityOrder([fetchAuthSession, fetchUserSession, fetchSellerSession]);
  }
  if (cached?.source === "seller" && !preferAuth && !preferUser) {
    return raceInPriorityOrder([fetchSellerSession, fetchUserSession, fetchAuthSession]);
  }

  if (preferAuth) return raceInPriorityOrder([fetchAuthSession, fetchUserSession, fetchSellerSession]);
  if (preferUser) return raceInPriorityOrder([fetchUserSession, fetchAuthSession, fetchSellerSession]);
  if (preferSeller) return raceInPriorityOrder([fetchSellerSession, fetchUserSession, fetchAuthSession]);

  return raceInPriorityOrder([fetchAuthSession, fetchUserSession, fetchSellerSession]);
}

async function fetchCsrfToken() {
  try {
    const res = await fetch(apiUrl("/api/csrf-token"), {
      credentials: "include",
      headers: { "X-Requested-With": "XMLHttpRequest" },
      cache: "no-store",
    });
    const data = await readJson(res);
    return typeof data?.csrfToken === "string" ? data.csrfToken : null;
  } catch {
    return null;
  }
}

async function postLogout(endpoint: string, csrfToken: string | null) {
  try {
    await fetch(apiUrl(endpoint), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
      },
      body: "{}",
    });
  } catch {}
}

async function logout(_source: SessionSource) {
  const csrfToken = await fetchCsrfToken();
  await Promise.all([
    postLogout("/api/auth/logout", csrfToken),
    postLogout("/api/user/logout", csrfToken),
    postLogout("/api/seller/logout", csrfToken),
  ]);

  clearCache();
  try {
    localStorage.removeItem("evoraToken");
    localStorage.removeItem("evoraUser");
  } catch {}
  window.location.href = "/signin";
}

function panelLink(user: SessionUser): { href: string; label: string } | null {
  if (user.source === "seller") return { href: spaHref("/resell"), label: "Seller panel" };
  if (user.source === "user") return { href: "/panel", label: "User panel" };
  if (user.canAccessDeveloperDashboard) return { href: "/developer", label: "Developer panel" };
  return null;
}

export function AuthNav({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    const cached = loadCache();
    if (cached) setUser(cached);

    fetchSession()
      .then((next) => {
        if (!alive) return;
        setUser(next);
        if (next) saveCache(next);
        else clearCache();
      })
      .catch(() => {
        if (alive) clearCache();
      })
      .finally(() => {
        if (alive) setLoaded(true);
      });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  if (!user) {
    if (mobile) {
      return (
        <div className="grid grid-cols-2 gap-2">

          <Link
            href="/signin"
            onClick={onNavigate}
            className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2.5 text-[13px] font-semibold tracking-[-0.01em] text-white dark:bg-white dark:text-neutral-950"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            onClick={onNavigate}
            className="inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[13px] font-semibold tracking-[-0.01em] bg-accent text-black"
          >
            Sign up
          </Link>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Link
          href="/signin"
          className="inline-flex shrink-0 items-center justify-center rounded-full px-5 h-9 text-[13px] font-semibold text-white bg-white/[0.1] hover:bg-white/[0.16] transition-colors"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-white text-black px-5 h-9 text-[13px] font-semibold hover:bg-white/90 transition-colors"
        >
          Sign up
        </Link>
      </div>
    );
  }

  const panel = panelLink(user);

  if (mobile) {
    return (
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-2 px-0.5">
          <UserRound className="size-4 shrink-0 text-text-faint" strokeWidth={1.75} />
          <p className="truncate text-[13px] font-medium text-text">{user.username}</p>
        </div>
        <div className="grid gap-1.5">
          {panel && (
            <Link
              href={panel.href}
              onClick={onNavigate}
              className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2.5 text-[13px] font-semibold text-black"
            >
              {panel.label}
            </Link>
          )}
          {user.source === "auth" && user.canAccessDeveloperDashboard && (
            <Link
              href="/panel"
              onClick={onNavigate}
              className="inline-flex items-center justify-center px-4 py-2 text-[13px] font-medium text-text-muted hover:text-text"
            >
              User panel
            </Link>
          )}
          <button
            type="button"
            onClick={() => logout(user.source)}
            className="inline-flex items-center justify-center px-4 py-2 text-[13px] font-medium text-text-muted hover:text-text"
          >
            Log out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 rounded-full h-9 px-4 text-[13px] font-semibold transition-colors",
          "bg-white/[0.1] text-text hover:bg-white/[0.16]",
          open && "bg-white/[0.16]"
        )}
      >
        <UserRound className="size-3.5 shrink-0 text-text-muted" strokeWidth={1.75} />
        <span className="max-w-[7.5rem] truncate">{user.username}</span>
        <ChevronDown
          className={cn(
            "size-3 shrink-0 text-text-muted transition-transform",
            open && "rotate-180"
          )}
          strokeWidth={1.75}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+6px)] min-w-[13rem] overflow-hidden rounded-xl border border-hairline bg-bg-elevated py-1 shadow-md shadow-black/25"
        >
          <p className="truncate px-3 pb-1.5 pt-2 text-[12.5px] text-text-faint">
            {user.username}
          </p>
          <div className="h-px bg-hairline/50" />
          {panel && (
            <Link
              href={panel.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="mt-1 block px-3 py-[7px] text-[13px] text-text-muted transition-colors hover:bg-surface hover:text-text"
            >
              {panel.label}
            </Link>
          )}
          {user.source === "auth" && user.canAccessDeveloperDashboard && (
            <Link
              href="/panel"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-3 py-[7px] text-[13px] text-text-muted transition-colors hover:bg-surface hover:text-text"
            >
              User panel
            </Link>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              logout(user.source);
            }}
            className="mb-0.5 flex w-full items-center gap-2 px-3 py-[7px] text-left text-[13px] text-[#e5595c] transition-colors hover:bg-[#e5595c]/10"
          >
            <LogOut className="size-3.5" strokeWidth={1.75} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
