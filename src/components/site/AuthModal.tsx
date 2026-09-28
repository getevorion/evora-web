"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { Logo } from "@/components/site/Logo";

export function AuthModal({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") router.back();
    }
    window.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [router]);

  return (
    <div
      className="ev-auth-modal-root"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) router.back();
      }}
    >
      <div className="ev-auth-modal-scrim" aria-hidden />
      <div className="ev-auth-modal-panel">
        <div className="ev-login-logo-corner">
          <Logo
            size={32}
            wordmarkClassName="text-[15px] font-normal tracking-tight text-[#e2e3e5]"
          />
        </div>
        <button
          type="button"
          className="ev-auth-modal-close"
          onClick={() => router.back()}
          aria-label="Close"
        >
          ×
        </button>
        <div className="ev-login-content" id="auth-modal-title">
          {children}
        </div>
      </div>
    </div>
  );
}
