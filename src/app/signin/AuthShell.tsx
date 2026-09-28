"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Check } from "lucide-react";
import panelShot from "./panel-shot.webp";
import panelShot1x from "./panel-shot-1x.webp";

export type AuthMode = "login" | "register";
export type AuthRealm = "developer" | "user";

export type RailCopy = { title: string; sub: string; steps: string[] };

export type CornerLink = { href: string; prompt: string; label: string };

type Progress = { mode: AuthMode; stage: number; rail?: RailCopy };

const ProgressContext = createContext<((p: Progress) => void) | null>(null);

export function useAuthProgress(mode: AuthMode, stage: number, rail?: RailCopy) {
  const report = useContext(ProgressContext);
  const title = rail?.title;
  const sub = rail?.sub;
  const steps = rail?.steps.join(" ");
  useEffect(() => {
    report?.({
      mode,
      stage,
      rail: title !== undefined && sub !== undefined && steps !== undefined
        ? { title, sub, steps: steps.split(" ") }
        : undefined,
    });
  }, [report, mode, stage, title, sub, steps]);
}

const COPY: Record<AuthRealm, Record<AuthMode, RailCopy>> = {
  developer: {
    login: {
      title: "Welcome back to Evora",
      sub: "Log in to get back to your apps, licences and builds.",
      steps: ["Log in to your account", "Open your developer panel", "Ship your next release"],
    },
    register: {
      title: "Get started with Evora",
      sub: "Complete these easy steps to register your account.",
      steps: ["Create your account", "Verify your email", "Set up your first app"],
    },
  },
  user: {
    login: {
      title: "Welcome back",
      sub: "Log in to reach the products you have access to.",
      steps: ["Log in to your account", "Open your panel", "Manage your licences"],
    },
    register: {
      title: "Create your account",
      sub: "Complete these easy steps to get set up.",
      steps: ["Create your account", "Open your panel", "Redeem your licence"],
    },
  },
};

export function AuthShell({
  realm,
  initialMode = "login",
  corner,
  rail,
  children,
}: {
  realm: AuthRealm;
  initialMode?: AuthMode;
  corner: CornerLink[] | null;
  rail?: RailCopy;
  children: ReactNode;
}) {
  const [progress, setProgress] = useState<Progress>({ mode: initialMode, stage: 0 });
  const copy = progress.rail ?? rail ?? COPY[realm][progress.mode];

  return (
    <ProgressContext.Provider value={setProgress}>
      <div className="au-root">
        <aside className="au-rail">
          <div className="au-rail-grain" aria-hidden />
          <div className="au-showcase" aria-hidden>
            <div className="au-showcase-tilt">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={panelShot1x.src}
                srcSet={`${panelShot1x.src} 1x, ${panelShot.src} 2x`}
                width={panelShot1x.width}
                height={panelShot1x.height}
                alt=""
                decoding="async"
              />
            </div>
          </div>
          <div className="au-rail-body">
            <h2 className="au-rail-title">{copy.title}</h2>
            <p className="au-rail-sub">{copy.sub}</p>
            <ol className="au-steps" aria-label="Progress">
              {copy.steps.map((label, i) => {
                const state = i < progress.stage ? "done" : i === progress.stage ? "active" : "todo";
                return (
                  <li
                    key={label}
                    className="au-step"
                    data-state={state}
                    aria-current={state === "active" ? "step" : undefined}
                  >
                    <span className="au-step-num" aria-hidden>
                      {state === "done" ? <Check className="size-3" strokeWidth={2.5} /> : i + 1}
                    </span>
                    <span className="au-step-label">{label}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>

        <main className="au-main">
          <div className="au-col">{children}</div>
          {corner && corner.length > 0 && (
            <div className="au-corners">
              {corner.map((c) => (
                <Link key={c.href} href={c.href} className="au-corner">
                  {c.prompt} <span>{c.label}</span>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProgressContext.Provider>
  );
}
