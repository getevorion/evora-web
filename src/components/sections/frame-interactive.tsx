"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AppWindow,
  KeyRound,
  LayoutDashboard,
  Plus,
  Search,
  Shield,
  Fingerprint,
  Users,
} from "lucide-react";

export type ViewKey =
  | "dashboard"
  | "apps"
  | "licenses"
  | "sessions"
  | "users"
  | "security";

export type SidebarNavKey =
  | "dashboard"
  | "alerts"
  | "sessions"
  | "security"
  | "licenses"
  | "apps"
  | "users";

const SIDEBAR_TO_VIEW: Record<SidebarNavKey, ViewKey> = {
  dashboard: "dashboard",
  alerts: "security",
  sessions: "sessions",
  security: "security",
  licenses: "licenses",
  apps: "apps",
  users: "users",
};

export type AppRecord = {
  id: string;
  name: string;
  build: string;
  state: "ok" | "warn";
  users: number;
  updated: string;
};

export type LicenseRecord = {
  id: string;
  customer: string;
  plan: string;
  seats: string;
  state: "ok" | "warn" | "expired";
  expires: string;
};

export type SessionRecord = {
  id: string;
  hwid: string;
  user: string;
  app: string;
  region: string;
  status: "live" | "tamper";
  since: string;
};

export type UserRecord = {
  id: string;
  handle: string;
  name: string;
  role: string;
  seats: number;
  last: string;
  status: "online" | "away" | "offline";
};

export type AlertRecord = {
  id: string;
  severity: "high" | "med" | "low";
  title: string;
  when: string;
};

export type ActivityRecord = {
  ts: string;
  actor: string;
  action: string;
  target: string;
};

export type Detail =
  | { kind: "app"; id: string }
  | { kind: "license"; id: string }
  | null;

export type ModalKind =
  | "createApp"
  | "issueLicense"
  | "inviteUser"
  | "help"
  | "settings"
  | "workspace"
  | "export";

const INITIAL_APPS: AppRecord[] = [
  { id: "EVR-9181", name: "Evorion", build: "v2.4.1", state: "ok", users: 1247, updated: "12m ago" },
  { id: "VSH-2207", name: "Vorashield", build: "v1.8.0", state: "ok", users: 312, updated: "1h ago" },
  { id: "BKP-0144", name: "Binarykeep", build: "v0.9.3", state: "warn", users: 88, updated: "2h ago" },
  { id: "SNT-7702", name: "Sentinel Mac", build: "v3.1.0", state: "ok", users: 524, updated: "4h ago" },
  { id: "CPK-5510", name: "Cipherpack", build: "v1.0.0-rc4", state: "warn", users: 47, updated: "6h ago" },
  { id: "GAT-3320", name: "Gatewall", build: "v2.0.0", state: "ok", users: 891, updated: "1d ago" },
];

const INITIAL_LICENSES: LicenseRecord[] = [
  { id: "LIC-9821", customer: "Northwind AI", plan: "Ultra", seats: "120 / 200", state: "ok", expires: "12d" },
  { id: "LIC-9822", customer: "Axiom Labs", plan: "Pro", seats: "8 / 10", state: "ok", expires: "47d" },
  { id: "LIC-9823", customer: "Raze Systems", plan: "Pro", seats: "12 / 12", state: "warn", expires: "2d" },
  { id: "LIC-9824", customer: "Synthwave", plan: "Free", seats: "1 / 1", state: "expired", expires: "—" },
  { id: "LIC-9825", customer: "Bytestream", plan: "Ultra", seats: "44 / 100", state: "ok", expires: "187d" },
];

const INITIAL_SESSIONS: SessionRecord[] = [
  { id: "SES-22119", hwid: "0xA3F8…2C71", user: "@arvin", app: "Evorion", region: "us-east", status: "live", since: "8m" },
  { id: "SES-22118", hwid: "0x71BA…CC04", user: "@nikolai", app: "Vorashield", region: "eu-fra", status: "live", since: "32m" },
  { id: "SES-22117", hwid: "0xFFE3…8801", user: "@misha", app: "Evorion", region: "ap-sg", status: "tamper", since: "1h" },
  { id: "SES-22116", hwid: "0x4421…99AA", user: "@hannah", app: "Sentinel Mac", region: "us-west", status: "live", since: "2h" },
];

const INITIAL_USERS: UserRecord[] = [
  { id: "USR-7701", handle: "@arvin", name: "Arvin Pollack", role: "Owner", seats: 4, last: "12s ago", status: "online" },
  { id: "USR-7702", handle: "@nikolai", name: "Nikolai Petrov", role: "Admin", seats: 3, last: "32m ago", status: "online" },
  { id: "USR-7703", handle: "@misha", name: "Misha Konova", role: "Developer", seats: 2, last: "1h ago", status: "away" },
  { id: "USR-7704", handle: "@hannah", name: "Hannah Reyes", role: "Developer", seats: 1, last: "2h ago", status: "online" },
  { id: "USR-7705", handle: "@finn", name: "Finn Bauer", role: "Auditor", seats: 1, last: "8h ago", status: "offline" },
  { id: "USR-7706", handle: "@kiri", name: "Kiri Tatsuya", role: "Developer", seats: 1, last: "1d ago", status: "offline" },
];

const INITIAL_ALERTS: AlertRecord[] = [
  { id: "ALERT-441", severity: "high", title: "HWID rebind spike detected on Cipherpack", when: "9m" },
  { id: "ALERT-440", severity: "med", title: "Tamper checksum mismatch in Vorashield v1.8.0", when: "36m" },
  { id: "ALERT-439", severity: "low", title: "Unusual session region delta for @misha", when: "1h" },
];

const INITIAL_ACTIVITY: ActivityRecord[] = [
  { ts: "2m", actor: "Evorion", action: "HWID rotated", target: "@arvin" },
  { ts: "12m", actor: "Cipherpack", action: "Tamper checksum alert", target: "v1.0.0-rc4" },
  { ts: "28m", actor: "Vorashield", action: "License renewed", target: "Axiom Labs" },
  { ts: "1h", actor: "Evorion", action: "Session terminated", target: "@misha · ap-sg" },
  { ts: "2h", actor: "Gatewall", action: "New build pushed", target: "v2.0.0" },
  { ts: "3h", actor: "Sentinel Mac", action: "API key issued", target: "Raze Systems" },
];

type DemoCtx = {
  view: ViewKey;
  setView: (v: ViewKey) => void;
  sidebarNav: SidebarNavKey;
  setSidebarNav: (key: SidebarNavKey) => void;
  apps: AppRecord[];
  licenses: LicenseRecord[];
  sessions: SessionRecord[];
  users: UserRecord[];
  alerts: AlertRecord[];
  activity: ActivityRecord[];
  detail: Detail;
  setDetail: (d: Detail) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  modal: ModalKind | null;
  openModal: (m: ModalKind) => void;
  closeModal: () => void;
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
  popover: string | null;
  setPopover: (id: string | null) => void;
  workspace: string;
  setWorkspace: (w: string) => void;
  appFilter: "all" | "active" | "tamper";
  setAppFilter: (v: "all" | "active" | "tamper") => void;
  licFilter: "all" | "active" | "expiring";
  setLicFilter: (v: "all" | "active" | "expiring") => void;
  sessRegion: string;
  setSessRegion: (v: string) => void;
  sessApp: string;
  setSessApp: (v: string) => void;
  userRole: string;
  setUserRole: (v: string) => void;
  userStatus: string;
  setUserStatus: (v: string) => void;
  alertSeverity: string;
  setAlertSeverity: (v: string) => void;
  appSort: "name" | "users" | "updated";
  setAppSort: (s: "name" | "users" | "updated") => void;
  createApp: (name: string, build: string) => void;
  issueLicense: (customer: string, plan: string, seats: number) => void;
  inviteUser: (handle: string, role: string) => void;
  dismissAlert: (id: string) => void;
  terminateSession: (id: string) => void;
  pushActivity: (action: string, target: string, actor?: string) => void;
  licenseCount: number;
  securityCount: number;
  closeTopLayer: () => void;
};

const Ctx = createContext<DemoCtx | null>(null);

export function useFrameDemo() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useFrameDemo outside provider");
  return v;
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Date.now().toString(36).slice(-3).toUpperCase()}`;
}

export function EvDemoProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewKey>("dashboard");
  const [sidebarNav, setSidebarNavState] = useState<SidebarNavKey>("dashboard");

  const setSidebarNav = useCallback((key: SidebarNavKey) => {
    setSidebarNavState(key);
    setView(SIDEBAR_TO_VIEW[key]);
  }, []);
  const [apps, setApps] = useState(INITIAL_APPS);
  const [licenses, setLicenses] = useState(INITIAL_LICENSES);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [activity, setActivity] = useState(INITIAL_ACTIVITY);
  const [detail, setDetail] = useState<Detail>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalKind | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [popover, setPopover] = useState<string | null>(null);
  const [workspace, setWorkspace] = useState("Northwind");

  const [appFilter, setAppFilter] = useState<"all" | "active" | "tamper">("all");
  const [licFilter, setLicFilter] = useState<"all" | "active" | "expiring">("all");
  const [sessRegion, setSessRegion] = useState("all");
  const [sessApp, setSessApp] = useState("all");
  const [userRole, setUserRole] = useState("all");
  const [userStatus, setUserStatus] = useState("all");
  const [alertSeverity, setAlertSeverity] = useState("all");
  const [appSort, setAppSort] = useState<"name" | "users" | "updated">("name");

  const pushActivity = useCallback((action: string, target: string, actor = "Evora") => {
    setActivity((prev) => [{ ts: "now", actor, action, target }, ...prev].slice(0, 8));
  }, []);

  const createApp = useCallback((name: string, build: string) => {
    const id = uid("APP");
    setApps((prev) => [
      { id, name, build, state: "ok", users: 0, updated: "just now" },
      ...prev,
    ]);
    pushActivity("App created", name);
    setView("apps");
  }, [pushActivity]);

  const issueLicense = useCallback((customer: string, plan: string, seats: number) => {
    const id = uid("LIC");
    setLicenses((prev) => [
      { id, customer, plan, seats: `0 / ${seats}`, state: "ok", expires: "365d" },
      ...prev,
    ]);
    pushActivity("License issued", customer);
    setView("licenses");
  }, [pushActivity]);

  const inviteUser = useCallback((handle: string, role: string) => {
    const id = uid("USR");
    const clean = handle.startsWith("@") ? handle : `@${handle}`;
    setUsers((prev) => [
      {
        id,
        handle: clean,
        name: clean.slice(1).replace(/^\w/, (c) => c.toUpperCase()),
        role,
        seats: 1,
        last: "invited",
        status: "offline",
      },
      ...prev,
    ]);
    pushActivity("User invited", clean);
    setView("users");
  }, [pushActivity]);

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    pushActivity("Alert dismissed", id);
  }, [pushActivity]);

  const terminateSession = useCallback((id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    pushActivity("Session terminated", id);
  }, [pushActivity]);

  const closeTopLayer = useCallback(() => {
    if (modal) setModal(null);
    else if (paletteOpen) setPaletteOpen(false);
    else if (popover) setPopover(null);
    else if (detail) setDetail(null);
  }, [modal, paletteOpen, popover, detail]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        setPopover(null);
      } else if (e.key === "Escape") {
        closeTopLayer();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeTopLayer]);

  const licenseCount = licenses.filter((l) => l.state !== "expired").length;
  const securityCount = alerts.length;

  const value = useMemo(
    () => ({
      view,
      setView,
      sidebarNav,
      setSidebarNav,
      apps,
      licenses,
      sessions,
      users,
      alerts,
      activity,
      detail,
      setDetail,
      selectedId,
      setSelectedId,
      modal,
      openModal: setModal,
      closeModal: () => setModal(null),
      paletteOpen,
      setPaletteOpen,
      popover,
      setPopover,
      workspace,
      setWorkspace,
      appFilter,
      setAppFilter,
      licFilter,
      setLicFilter,
      sessRegion,
      setSessRegion,
      sessApp,
      setSessApp,
      userRole,
      setUserRole,
      userStatus,
      setUserStatus,
      alertSeverity,
      setAlertSeverity,
      appSort,
      setAppSort,
      createApp,
      issueLicense,
      inviteUser,
      dismissAlert,
      terminateSession,
      pushActivity,
      licenseCount,
      securityCount,
      closeTopLayer,
    }),
    [
      view,
      sidebarNav,
      setSidebarNav,
      apps,
      licenses,
      sessions,
      users,
      alerts,
      activity,
      detail,
      selectedId,
      modal,
      paletteOpen,
      popover,
      workspace,
      appFilter,
      licFilter,
      sessRegion,
      sessApp,
      userRole,
      userStatus,
      alertSeverity,
      appSort,
      createApp,
      issueLicense,
      inviteUser,
      dismissAlert,
      terminateSession,
      pushActivity,
      licenseCount,
      securityCount,
      closeTopLayer,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function FilterPopover({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const { popover, setPopover } = useFrameDemo();
  const open = popover === id;
  const current = options.find((o) => o.value === value)?.label ?? label;

  return (
    <div className="ev-popover-anchor">
      <button
        type="button"
        className={`ev-pill ${open ? "ev-pill-open" : ""}`}
        onClick={() => setPopover(open ? null : id)}
      >
        {current}
        <span className="ev-pill-caret" aria-hidden />
      </button>
      {open ? (
        <>
          <button
            type="button"
            className="ev-popover-dismiss"
            aria-label="Close menu"
            onClick={() => setPopover(null)}
          />
          <div className="ev-popover-menu" role="menu">
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                role="menuitem"
                className={`ev-popover-item ${o.value === value ? "ev-popover-item-active" : ""}`}
                onClick={() => {
                  onChange(o.value);
                  setPopover(null);
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function FrameModal({
  title,
  subtitle,
  onClose,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <>
      <div className="ev-modal-backdrop" onClick={onClose} />
      <div className="ev-modal" role="dialog" aria-modal="true">
        <header className="ev-modal-head">
          <div>
            <div className="ev-modal-title">{title}</div>
            {subtitle ? <div className="ev-modal-sub">{subtitle}</div> : null}
          </div>
          <button type="button" className="ev-icon-btn" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="ev-modal-body">{children}</div>
        <footer className="ev-modal-foot">{footer}</footer>
      </div>
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="ev-field">
      <span className="ev-field-label">{label}</span>
      {children}
    </label>
  );
}

export function ModalHost() {
  const demo = useFrameDemo();
  const { modal, closeModal } = demo;

  const [appName, setAppName] = useState("");
  const [appBuild, setAppBuild] = useState("v1.0.0");
  const [licCustomer, setLicCustomer] = useState("");
  const [licPlan, setLicPlan] = useState("Pro");
  const [licSeats, setLicSeats] = useState("10");
  const [inviteHandle, setInviteHandle] = useState("");
  const [inviteRole, setInviteRole] = useState("Developer");

  useEffect(() => {
    if (!modal) return;
    if (modal === "createApp") {
      setAppName("");
      setAppBuild("v1.0.0");
    }
    if (modal === "issueLicense") {
      setLicCustomer("");
      setLicPlan("Pro");
      setLicSeats("10");
    }
    if (modal === "inviteUser") {
      setInviteHandle("");
      setInviteRole("Developer");
    }
  }, [modal]);

  if (!modal) return null;

  if (modal === "createApp") {
    return (
      <FrameModal
        title="New app"
        subtitle="Register a protected binary in this workspace"
        onClose={closeModal}
        footer={
          <>
            <button type="button" className="ev-btn-ghost" onClick={closeModal}>Cancel</button>
            <button
              type="button"
              className="ev-btn-primary"
              disabled={!appName.trim()}
              onClick={() => {
                demo.createApp(appName.trim(), appBuild.trim() || "v1.0.0");
                closeModal();
              }}
            >
              Create app
            </button>
          </>
        }
      >
        <Field label="Name">
          <input
            className="ev-field-input"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="My Application"
            autoFocus
          />
        </Field>
        <Field label="Build">
          <input
            className="ev-field-input"
            value={appBuild}
            onChange={(e) => setAppBuild(e.target.value)}
            placeholder="v1.0.0"
          />
        </Field>
      </FrameModal>
    );
  }

  if (modal === "issueLicense") {
    return (
      <FrameModal
        title="Issue license"
        subtitle="Generate a new customer entitlement"
        onClose={closeModal}
        footer={
          <>
            <button type="button" className="ev-btn-ghost" onClick={closeModal}>Cancel</button>
            <button
              type="button"
              className="ev-btn-primary"
              disabled={!licCustomer.trim()}
              onClick={() => {
                demo.issueLicense(licCustomer.trim(), licPlan, Number(licSeats) || 1);
                closeModal();
              }}
            >
              Issue license
            </button>
          </>
        }
      >
        <Field label="Customer">
          <input
            className="ev-field-input"
            value={licCustomer}
            onChange={(e) => setLicCustomer(e.target.value)}
            placeholder="Acme Corp"
            autoFocus
          />
        </Field>
        <Field label="Plan">
          <select className="ev-field-input" value={licPlan} onChange={(e) => setLicPlan(e.target.value)}>
            <option>Free</option>
            <option>Pro</option>
            <option>Ultra</option>
          </select>
        </Field>
        <Field label="Seats">
          <input
            className="ev-field-input"
            type="number"
            min={1}
            value={licSeats}
            onChange={(e) => setLicSeats(e.target.value)}
          />
        </Field>
      </FrameModal>
    );
  }

  if (modal === "inviteUser") {
    return (
      <FrameModal
        title="Invite member"
        subtitle="Send a workspace invite"
        onClose={closeModal}
        footer={
          <>
            <button type="button" className="ev-btn-ghost" onClick={closeModal}>Cancel</button>
            <button
              type="button"
              className="ev-btn-primary"
              disabled={!inviteHandle.trim()}
              onClick={() => {
                demo.inviteUser(inviteHandle.trim(), inviteRole);
                closeModal();
              }}
            >
              Send invite
            </button>
          </>
        }
      >
        <Field label="Handle">
          <input
            className="ev-field-input"
            value={inviteHandle}
            onChange={(e) => setInviteHandle(e.target.value)}
            placeholder="@username"
            autoFocus
          />
        </Field>
        <Field label="Role">
          <select className="ev-field-input" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
            <option>Owner</option>
            <option>Admin</option>
            <option>Developer</option>
            <option>Auditor</option>
          </select>
        </Field>
      </FrameModal>
    );
  }

  if (modal === "workspace") {
    const opts = ["Northwind", "Northwind Staging", "Evora Platform"];
    return (
      <FrameModal
        title="Switch workspace"
        onClose={closeModal}
        footer={<button type="button" className="ev-btn-ghost" onClick={closeModal}>Done</button>}
      >
        <ul className="ev-modal-list">
          {opts.map((w) => (
            <li key={w}>
              <button
                type="button"
                className={`ev-modal-list-item ${demo.workspace === w ? "ev-modal-list-item-active" : ""}`}
                onClick={() => {
                  demo.setWorkspace(w);
                  closeModal();
                }}
              >
                {w}
              </button>
            </li>
          ))}
        </ul>
      </FrameModal>
    );
  }

  if (modal === "help") {
    return (
      <FrameModal
        title="Help"
        onClose={closeModal}
        footer={<button type="button" className="ev-btn-primary" onClick={closeModal}>Got it</button>}
      >
        <p className="ev-modal-copy">
          This is a live demo of the Evora console. Use ⌘K to jump views, click rows for details,
          and create apps or licenses from the action buttons.
        </p>
      </FrameModal>
    );
  }

  if (modal === "settings") {
    return (
      <FrameModal
        title="Settings"
        onClose={closeModal}
        footer={<button type="button" className="ev-btn-primary" onClick={closeModal}>Close</button>}
      >
        <ul className="ev-prop-list">
          <li><span>Workspace</span><code>{demo.workspace}</code></li>
          <li><span>Theme</span><code>Dark</code></li>
          <li><span>Region</span><code>us-east</code></li>
        </ul>
      </FrameModal>
    );
  }

  if (modal === "export") {
    return (
      <FrameModal
        title="Export queued"
        onClose={closeModal}
        footer={<button type="button" className="ev-btn-primary" onClick={closeModal}>OK</button>}
      >
        <p className="ev-modal-copy">Your export will be ready in a few seconds. This demo does not download a file.</p>
      </FrameModal>
    );
  }

  return null;
}

type PaletteEntry = {
  id: string;
  label: string;
  hint?: string;
  icon: typeof LayoutDashboard;
  run: () => void;
};

export function CommandPalette() {
  const demo = useFrameDemo();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const entries = useMemo<PaletteEntry[]>(() => {
    const nav: PaletteEntry[] = [
      { id: "nav-d", label: "Go to Dashboard", hint: "G D", icon: LayoutDashboard, run: () => demo.setView("dashboard") },
      { id: "nav-a", label: "Open Apps", hint: "G A", icon: AppWindow, run: () => demo.setView("apps") },
      { id: "nav-l", label: "Open Licenses", hint: "G L", icon: KeyRound, run: () => demo.setView("licenses") },
      { id: "nav-s", label: "Open Sessions", hint: "G S", icon: Fingerprint, run: () => demo.setView("sessions") },
      { id: "nav-u", label: "Open Users", hint: "G U", icon: Users, run: () => demo.setView("users") },
      { id: "nav-x", label: "Open Security", hint: "G X", icon: Shield, run: () => demo.setView("security") },
    ];
    const actions: PaletteEntry[] = [
      { id: "act-app", label: "New app", hint: "N", icon: Plus, run: () => demo.openModal("createApp") },
      { id: "act-lic", label: "Issue license", icon: KeyRound, run: () => demo.openModal("issueLicense") },
      { id: "act-inv", label: "Invite member", icon: Users, run: () => demo.openModal("inviteUser") },
    ];
    const records: PaletteEntry[] = demo.apps.slice(0, 4).map((a) => ({
      id: `app-${a.id}`,
      label: a.name,
      hint: a.id,
      icon: AppWindow,
      run: () => {
        demo.setView("apps");
        demo.setSelectedId(a.id);
        demo.setDetail({ kind: "app", id: a.id });
      },
    }));
    return [...actions, ...nav, ...records];
  }, [demo]);

  const filtered = entries.filter((e) =>
    e.label.toLowerCase().includes(query.toLowerCase()) ||
    (e.hint?.toLowerCase().includes(query.toLowerCase()) ?? false),
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setActive(0);
  }, [query]);

  function close() {
    demo.setPaletteOpen(false);
    setQuery("");
  }

  function run(i: number) {
    const sel = filtered[i];
    if (!sel) return;
    sel.run();
    close();
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(filtered.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(active);
    }
  }

  if (!demo.paletteOpen) return null;

  return (
    <>
      <div className="ev-palette-backdrop" onClick={close} />
      <div className="ev-palette" role="dialog" aria-modal="true">
        <div className="ev-palette-input-row">
          <Search className="ev-palette-search-icon" strokeWidth={1.75} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKey}
            placeholder="Search or jump to…"
            className="ev-palette-input"
          />
          <kbd className="ev-palette-esc">esc</kbd>
        </div>
        <ul className="ev-palette-list">
          {filtered.length === 0 ? (
            <li className="ev-palette-empty">No results</li>
          ) : (
            filtered.map((c, i) => (
              <li
                key={c.id}
                className={`ev-palette-item ${i === active ? "ev-palette-item-active" : ""}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => run(i)}
              >
                <c.icon className="ev-palette-item-icon" strokeWidth={1.75} />
                <span>{c.label}</span>
                {c.hint ? <kbd className="ev-palette-hint">{c.hint}</kbd> : null}
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}
