"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";
import CodeInput from "./CodeInput";
import PasswordStrength from "./PasswordStrength";
import { useAuthProgress } from "./AuthShell";
import { apiUrl } from "@/lib/api";
import { cn } from "@/lib/cn";
import { spaHref } from "@/lib/spa";
import { GoogleIcon } from "@/components/site/GoogleIcon";
import { DiscordIcon } from "@/components/site/DiscordIcon";
import { GithubIcon } from "@/components/site/GithubIcon";
import { Logo } from "@/components/site/Logo";

type Mode = "login" | "register";

type Step = "entry" | "forgot" | "reset" | "verify" | "totp";
type SsoProvider = "google" | "discord" | "github";

const LAST_SSO_KEY = "evora:last-sso";
function readLastSso(): SsoProvider | null {
  try {
    const v = localStorage.getItem(LAST_SSO_KEY);
    return v === "google" || v === "discord" || v === "github" ? v : null;
  } catch {
    return null;
  }
}

const SSO_LABELS: Record<SsoProvider, string> = {
  google: "Google",
  discord: "Discord",
  github: "GitHub",
};

const SSO_ERRORS: Record<string, string> = {
  cancelled: "Sign-in was cancelled.",
  expired: "That sign-in attempt expired. Please try again.",
  invalid_request: "That sign-in link wasn't valid. Please try again.",
  email_unverified:
    "Your provider didn't confirm a verified email address, so we can't create an account from it.",
  email_taken:
    "An Evora account already uses that email. Log in with your password first, then connect the provider from your account settings.",
  identity_taken: "That account is already connected to a different Evora account.",
  already_linked: "You've already connected an account from that provider.",
  link_requires_login: "Log in first, then connect your account.",
  session_error: "We couldn't start that sign-in. Please try again.",
  sign_in_failed: "Sign-in failed. Please try again.",
};

const NEXT_ALLOW = new Set(["/aim", "/panel", "/developer", "/checkout"]);

function resolveNext(raw: string | null): string | null {
  if (!raw) return null;
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  const path = raw.split(/[?#]/, 1)[0];
  if (!NEXT_ALLOW.has(path) && !path.startsWith("/checkout/")) return null;
  if (path.includes("//")) return null;
  return raw;
}

export function apiErrorText(data: unknown, fallback: string): string {
  const d = data as { error?: unknown; message?: unknown } | null;
  if (typeof d?.error === "string" && d.error) return d.error;
  const nested = (d?.error as { message?: unknown } | null)?.message;
  if (typeof nested === "string" && nested) return nested;
  if (typeof d?.message === "string" && d.message) return d.message;
  return fallback;
}

const stepVariants = {
  enter: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.12 } },
};

export function AuthField({
  id,
  label,
  children,
  hint,
  trailing,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  hint?: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="au-field">
      <div className="au-label-row">
        <label htmlFor={id} className="au-label">
          {label}
        </label>
        {trailing}
      </div>
      <div className="au-input-wrap">{children}</div>
      {hint}
    </div>
  );
}

export function PasswordToggle({
  shown,
  onToggle,
}: {
  shown: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="au-input-toggle"
      onClick={onToggle}
      tabIndex={-1}
      aria-label={shown ? "Hide password" : "Show password"}
    >
      {shown ? (
        <Eye className="size-4" strokeWidth={1.75} />
      ) : (
        <EyeOff className="size-4" strokeWidth={1.75} />
      )}
    </button>
  );
}

export function SignInForm({ initialMode = "login" }: { initialMode?: Mode }) {
  const searchParams = useSearchParams();
  const nextParam = resolveNext(searchParams?.get("next") ?? null);

  useEffect(() => {
    const ref = searchParams?.get("ref");
    if (ref && /^[A-Za-z0-9]{4,16}$/.test(ref)) {
      try { localStorage.setItem("evora_ref", ref.toUpperCase()); } catch {  }
    }
  }, [searchParams]);

  const [mode, setMode] = useState<Mode>(initialMode);
  const [step, setStep] = useState<Step>("entry");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [finished, setFinished] = useState(false);

  const [ssoProviders, setSsoProviders] = useState<SsoProvider[]>([]);

  const [lastSso, setLastSso] = useState<SsoProvider | null>(null);
  useEffect(() => {
    setLastSso(readLastSso());
  }, []);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiUrl("/api/auth/oauth/providers"), {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data?.providers)) {
          setSsoProviders(
            data.providers.filter(
              (p: unknown): p is SsoProvider => p === "google" || p === "discord" || p === "github",
            ),
          );
        }
      } catch {  }
    })();
    return () => { cancelled = true; };
  }, []);

  const [ssoDismissed, setSsoDismissed] = useState(false);
  const ssoErrorCode = searchParams?.get("sso_error") ?? null;
  const ssoError =
    ssoErrorCode && !ssoDismissed
      ? SSO_ERRORS[ssoErrorCode] ?? SSO_ERRORS.sign_in_failed
      : "";

  const [signupEmail, setSignupEmail] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [verifyMode, setVerifyMode] = useState<"signup" | "account">("account");

  const [pendingEmail, setPendingEmail] = useState("");

  useEffect(() => {
    if (searchParams?.get("step") !== "verify") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiUrl("/api/auth/signup/pending"), {
          credentials: "include",
          headers: { "X-Requested-With": "XMLHttpRequest" },
        });
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (!data?.email || cancelled) return;
        setPendingEmail(data.email);
        setVerifyMode("signup");
        setMode("register");
        setStep("verify");
      } catch {

      }
    })();
    return () => { cancelled = true; };
  }, [searchParams]);

  useEffect(() => {
    if (searchParams?.get("step") !== "totp") return;
    setMode("login");
    setCode("");
    setStep("totp");
  }, [searchParams]);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const codeRef = useRef<HTMLInputElement | null>(null);

  const isLogin = mode === "login";

  useAuthProgress(mode, finished ? 3 : step === "verify" ? 1 : 0);

  async function csrfToken(): Promise<string> {
    const res = await fetch(apiUrl("/api/csrf-token"), {
      credentials: "include",
      headers: { "X-Requested-With": "XMLHttpRequest" },
    });
    return (await res.json()).csrfToken as string;
  }

  async function submitForgot(e: React.FormEvent) {
    e.preventDefault();
    resetMessages();
    const target = resetEmail.trim();
    if (!target) {
      setError("Enter your email address.");
      return;
    }
    setLoading(true);
    try {
      await fetch(apiUrl("/api/auth/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: target }),
      });

      setCode("");
      setNewPassword("");
      setStep("reset");
      setSuccess("If that address has an account, a code is on its way.");
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

  async function submitReset(e: React.FormEvent) {
    e.preventDefault();
    resetMessages();
    if (!code.trim() || !newPassword) {
      setError("Enter the code and a new password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/auth/reset-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: resetEmail, code: code.trim(), newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPassword("");
        setCode("");
        setNewPassword("");
        setStep("entry");
        setSuccess("Password updated. Log in with your new password.");
      } else {

        setError(apiErrorText(data, "That code is invalid or has expired."));
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

  async function submitVerify(e?: React.FormEvent, codeOverride?: string) {
    e?.preventDefault();
    resetMessages();
    const codeToSend = (codeOverride ?? code).trim();
    if (codeToSend.length !== 6) {
      setError("Enter the code from your email.");
      return;
    }
    setLoading(true);
    try {
      const token = await csrfToken();

      const res = await fetch(
        apiUrl(verifyMode === "signup" ? "/api/auth/signup/verify" : "/api/auth/verify-email/confirm"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "x-csrf-token": token,
          },
          credentials: "include",
          body: JSON.stringify({ code: codeToSend }),
        },
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setFinished(true);
        window.location.assign(spaHref(nextParam ?? "/developer"));
        return;
      }

      if (verifyMode === "signup" && (data.code === "no_claim" || data.code === "taken")) {
        setCode("");
        setError(apiErrorText(data, "That signup expired. Start again."));
        setLoading(false);
        return;
      }
      setError(
        data.attemptsLeft !== undefined && data.attemptsLeft > 0
          ? `${apiErrorText(data, "That code is invalid.")} ${data.attemptsLeft} attempts left.`
          : apiErrorText(data, "That code is invalid or has expired.")
      );
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

  async function resendVerification() {
    resetMessages();
    setLoading(true);
    try {
      const token = await csrfToken();
      const res = await fetch(
        apiUrl(verifyMode === "signup" ? "/api/auth/signup/resend" : "/api/auth/verify-email/send"),
        {
          method: "POST",
          headers: { "X-Requested-With": "XMLHttpRequest", "x-csrf-token": token },
          credentials: "include",
        },
      );
      setSuccess(res.ok ? "A new code is on its way." : "");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(apiErrorText(data, "Could not send a new code."));
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

  function skipVerification() {
    window.location.assign(spaHref(nextParam ?? "/developer"));
  }

  function startSso(provider: SsoProvider) {

    if (!ssoProviders.includes(provider)) {
      resetMessages();
      setError(`${SSO_LABELS[provider]} sign-in isn't available yet.`);
      return;
    }

    try {
      localStorage.setItem(LAST_SSO_KEY, provider);
    } catch {  }
    const params = new URLSearchParams();
    if (nextParam) params.set("next", nextParam);

    let ref = searchParams?.get("ref") || null;
    if (!ref) {
      try { ref = localStorage.getItem("evora_ref"); } catch {  }
    }
    if (ref && /^[A-Za-z0-9]{4,16}$/.test(ref)) params.set("ref", ref.toUpperCase());
    const qs = params.toString() ? `?${params.toString()}` : "";
    window.location.assign(apiUrl(`/api/auth/oauth/${provider}/start${qs}`));
  }

  const usernameRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (step === "entry") usernameRef.current?.focus();
    else if (step === "forgot") emailRef.current?.focus();
    else if (step === "reset" || step === "verify" || step === "totp") codeRef.current?.focus();
  }, [step, mode]);

  function resetMessages() {
    setError("");
    setSuccess("");

    setSsoDismissed(true);
  }

  function switchMode() {
    setMode(isLogin ? "register" : "login");
    setStep("entry");
    setUsername("");
    setPassword("");
    setSignupEmail("");
    resetMessages();
  }

  function backToEntry() {
    resetMessages();
    setCode("");
    setNewPassword("");
    setStep("entry");
  }

  async function submitAuth(e: React.FormEvent) {
    e.preventDefault();
    resetMessages();

    const trimmedUser = username.trim();
    if (!trimmedUser || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const email = signupEmail.trim();
    if (!isLogin && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!isLogin && password.length < 8) {
      setError("Your password needs at least 8 characters.");
      return;
    }

    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup/start";
    const body: Record<string, unknown> = { username: trimmedUser, password };
    if (!isLogin) {
      body.email = email;

      try {
        const ref = searchParams?.get("ref") || localStorage.getItem("evora_ref");
        if (ref && /^[A-Za-z0-9]{4,16}$/.test(ref)) body.referralCode = ref.toUpperCase();
      } catch {  }
    }
    const successRedirect = nextParam ?? "/developer";

    try {

      let token = "";
      try { token = await csrfToken(); } catch {  }
      const res = await fetch(apiUrl(endpoint), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          ...(token ? { "x-csrf-token": token } : {}),
        },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!isLogin && res.ok && data.success && data.email) {
        setCode("");
        setPendingEmail(data.email);
        setVerifyMode("signup");
        setStep("verify");
        setSuccess("");
        setLoading(false);
        return;
      }

      if (isLogin && res.ok && data.requires_totp) {
        setCode("");
        setStep("totp");
        setLoading(false);
        return;
      }

      if (res.ok && (data.success || data.data)) {
        setSuccess("Signed in.");
        setFinished(true);
        try {
          const role = typeof data.user?.role === "string" ? data.user.role : undefined;
          const canAccessDeveloperDashboard =
            role === "developer" || role === "admin" || role === "ev0ra" || role === "ev0ra_admin" || role === "manager";
          sessionStorage.setItem(
            "evoraSessionUser_v1",
            JSON.stringify({
              ts: Date.now(),
              user: { username: trimmedUser, source: "auth", role, canAccessDeveloperDashboard },
            })
          );
        } catch {}
        setTimeout(() => {
          window.location.href = spaHref(successRedirect);
        }, 500);
      } else {
        setError(apiErrorText(data, "Authentication failed."));
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  async function submitTotp(e?: React.FormEvent) {
    e?.preventDefault();
    resetMessages();
    const codeToSend = code.trim();
    if (!codeToSend) {
      setError("Enter the 6-digit code from your authenticator app.");
      return;
    }
    setLoading(true);
    try {
      let token = "";
      try { token = await csrfToken(); } catch {  }
      const res = await fetch(apiUrl("/api/auth/totp/verify-login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          ...(token ? { "x-csrf-token": token } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ code: codeToSend }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess("Signed in.");
        setFinished(true);
        try {
          const role = typeof data.user?.role === "string" ? data.user.role : undefined;
          const canAccessDeveloperDashboard =
            role === "developer" || role === "admin" || role === "ev0ra" || role === "ev0ra_admin" || role === "manager";
          sessionStorage.setItem(
            "evoraSessionUser_v1",
            JSON.stringify({
              ts: Date.now(),
              user: { username: username.trim(), source: "auth", role, canAccessDeveloperDashboard },
            })
          );
        } catch {}
        setTimeout(() => {
          window.location.href = spaHref(nextParam ?? "/developer");
        }, 400);
      } else {
        if (data.code === "TOTP_STEP_EXPIRED") {
          setStep("entry");
          setError("That step expired — enter your password again.");
        } else {
          setError(apiErrorText(data, "Invalid code."));
        }
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  const heading: Record<Step, { title: string; sub: React.ReactNode }> = {
    entry: isLogin
      ? { title: "Log in to Evora", sub: "Enter your details to open your developer panel." }
      : { title: "Create your account", sub: "Enter your details to create your account." },
    forgot: {
      title: "Reset your password",
      sub: "We'll send a code to the address on your account.",
    },
    reset: {
      title: "Enter your code",
      sub: "Check your inbox for a 6-digit code, then pick a new password.",
    },
    verify: {
      title: "Verify your email",
      sub: (
        <>
          We sent a security code to{" "}
          <span className="au-strong">{pendingEmail || signupEmail.trim() || "your email"}</span>.
        </>
      ),
    },
    totp: {
      title: "Two-factor check",
      sub: "Enter the code from your authenticator app, or one of your backup codes.",
    },
  };

  const entryReady =
    username.trim().length > 0 &&
    password.length > 0 &&
    (isLogin || signupEmail.trim().length > 0);

  const stepKey = `${mode}-${step}`;

  return (
    <div className="au-form-root">

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stepKey}
          variants={stepVariants}
          initial="enter"
          animate="show"
          exit="exit"
          className="au-form-stage"
        >
          <header className="au-head">
            <div className="au-title-row">
              <Logo size={20} withWordmark={false} className="au-title-logo" />
              <h1 className="au-title">{heading[step].title}</h1>
            </div>
            <p className="au-sub">{heading[step].sub}</p>
          </header>

          {step === "entry" && ssoProviders.length > 0 && (
            <>
              <div className="au-sso">
                {ssoProviders.includes("google") && (
                  <button
                    type="button"
                    className="au-sso-btn au-sso-btn-light"
                    data-provider="google"
                    onClick={() => startSso("google")}
                    aria-label="Continue with Google"
                  >
                    {lastSso === "google" && <span className="au-sso-last">Last used</span>}
                    <GoogleIcon className="size-4" />
                    <span>Google</span>
                  </button>
                )}
                <div className="au-sso-row">
                  {ssoProviders.includes("discord") && (
                    <button
                      type="button"
                      className="au-sso-btn"
                      data-provider="discord"
                      onClick={() => startSso("discord")}
                      aria-label="Continue with Discord"
                    >
                      {lastSso === "discord" && <span className="au-sso-last">Last used</span>}
                      <DiscordIcon className="size-4" />
                      <span>Discord</span>
                    </button>
                  )}
                  <button
                    type="button"
                    className="au-sso-btn"
                    data-provider="github"
                    onClick={() => startSso("github")}
                    aria-label="Continue with GitHub"
                  >
                    {lastSso === "github" && <span className="au-sso-last">Last used</span>}
                    <GithubIcon className="size-4" />
                    <span>GitHub</span>
                  </button>
                </div>
              </div>
              <div className="au-or" aria-hidden>
                <span>Or</span>
              </div>
            </>
          )}

          {step === "entry" && (
            <form className="au-form" onSubmit={submitAuth} noValidate>
              <AuthField id="username" label="Username or email">
                <input
                  ref={usernameRef}
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="eg. johnfrans or john@example.com"
                  autoComplete="username email"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  className="au-input"
                />
              </AuthField>

              {!isLogin && (
                <AuthField id="signup-email" label="Email">
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="eg. john@example.com"
                    autoComplete="email"
                    required
                    className="au-input"
                  />
                </AuthField>
              )}

              <AuthField
                id="password"
                label="Password"
                trailing={
                  isLogin ? (
                    <button
                      type="button"
                      className="au-hint-link"
                      onClick={() => {
                        resetMessages();
                        setResetEmail("");
                        setStep("forgot");
                      }}
                    >
                      Forgot your password?
                    </button>
                  ) : undefined
                }
                hint={
                  !isLogin ? (
                    <>
                      <p className="au-hint">Must be at least 8 characters.</p>

                      <PasswordStrength value={password} />
                    </>
                  ) : undefined
                }
              >
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  className="au-input au-input-trailing"
                />
                <PasswordToggle shown={showPassword} onToggle={() => setShowPassword((v) => !v)} />
              </AuthField>

              {(error || ssoError) && <p className="au-error">{error || ssoError}</p>}
              {success && <p className="au-success">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className={cn("au-submit", entryReady && !loading ? "is-ready" : "")}
              >
                {loading
                  ? isLogin
                    ? "Logging in…"
                    : "Sending code…"
                  : isLogin
                  ? "Log in"
                  : "Sign up"}
              </button>

              <p className="au-foot">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button type="button" onClick={switchMode}>
                  {isLogin ? "Sign up" : "Log in"}
                </button>
              </p>
            </form>
          )}

          {step === "forgot" && (
            <form className="au-form" onSubmit={submitForgot} noValidate>
              <AuthField id="reset-email" label="Email">
                <input
                  ref={emailRef}
                  id="reset-email"
                  name="email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="eg. john@example.com"
                  autoComplete="email"
                  required
                  className="au-input"
                />
              </AuthField>
              {error && <p className="au-error">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className={cn("au-submit", resetEmail.trim() && !loading ? "is-ready" : "")}
              >
                {loading ? "Sending…" : "Send code"}
              </button>
              <p className="au-foot">
                Remembered it?{" "}
                <button type="button" onClick={backToEntry}>
                  Back to log in
                </button>
              </p>
            </form>
          )}

          {step === "reset" && (
            <form className="au-form" onSubmit={submitReset} noValidate>
              <AuthField id="reset-code" label="Code">
                <input
                  ref={codeRef}
                  id="reset-code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="6-digit code"
                  required
                  className="au-input"
                />
              </AuthField>
              <AuthField
                id="reset-new-password"
                label="New password"
                hint={
                  <>
                    <p className="au-hint">Must be at least 8 characters.</p>
                    <PasswordStrength value={newPassword} />
                  </>
                }
              >
                <input
                  id="reset-new-password"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter a new password"
                  autoComplete="new-password"
                  required
                  className="au-input au-input-trailing"
                />
                <PasswordToggle shown={showPassword} onToggle={() => setShowPassword((v) => !v)} />
              </AuthField>
              {error && <p className="au-error">{error}</p>}
              {success && <p className="au-success">{success}</p>}
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "au-submit",
                  code.trim() && newPassword && !loading ? "is-ready" : ""
                )}
              >
                {loading ? "Updating…" : "Set new password"}
              </button>
              <p className="au-foot">
                Didn&rsquo;t get a code?{" "}
                <button
                  type="button"
                  onClick={() => {
                    resetMessages();
                    setCode("");
                    setNewPassword("");
                    setStep("forgot");
                  }}
                >
                  Try another address
                </button>
              </p>
            </form>
          )}

          {step === "verify" && (
            <form className="au-form" onSubmit={submitVerify} noValidate>
              <div className="au-field">
                <div className="au-label-row">
                  <span className="au-label">Security code</span>
                </div>
                <CodeInput
                  value={code}
                  onChange={setCode}
                  disabled={loading}
                  autoFocus

                  onComplete={(complete) => {
                    if (!loading) void submitVerify(undefined, complete);
                  }}
                />
              </div>
              {error && <p className="au-error">{error}</p>}
              {success && <p className="au-success">{success}</p>}
              <button
                type="submit"
                disabled={loading}
                className={cn("au-submit", code.length === 6 && !loading ? "is-ready" : "")}
              >
                {loading
                  ? verifyMode === "signup" ? "Creating account…" : "Verifying…"
                  : verifyMode === "signup" ? "Create account" : "Verify email"}
              </button>
              <p className="au-foot">
                <button type="button" onClick={resendVerification} disabled={loading}>
                  Resend code
                </button>

                {verifyMode === "account" && (
                  <>
                    {" · "}
                    <button type="button" onClick={skipVerification}>
                      Skip for now
                    </button>
                  </>
                )}
              </p>
            </form>
          )}

          {step === "totp" && (
            <form className="au-form" onSubmit={submitTotp} noValidate>
              <AuthField id="totp-code" label="Authenticator code">
                <input
                  ref={codeRef}
                  id="totp-code"
                  name="totp-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="6-digit code or backup code"
                  required
                  className="au-input"
                />
              </AuthField>
              {error && <p className="au-error">{error}</p>}
              {success && <p className="au-success">{success}</p>}
              <button
                type="submit"
                disabled={loading}
                className={cn("au-submit", code.trim() && !loading ? "is-ready" : "")}
              >
                {loading ? "Verifying…" : "Verify"}
              </button>
              <p className="au-foot">
                Wrong account?{" "}
                <button type="button" onClick={backToEntry}>
                  Back to log in
                </button>
              </p>
            </form>
          )}
        </motion.div>
      </AnimatePresence>

      <p className="au-terms">
        By continuing, you agree to our <Link href="/terms">Terms of Service</Link>.
      </p>
    </div>
  );
}
