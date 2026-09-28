"use client";

import { useEffect, useState } from "react";

export default function DomainMigrationBlocker() {
  const [show, setShow] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const host = window.location.hostname.toLowerCase();
    const isEvoraLol = host === "evora.lol" || host.endsWith(".evora.lol");
    if (isEvoraLol) setShow(true);
  }, []);

  if (!show) return null;

  const silver = "rgba(230, 231, 235, 1)";
  const silverDim = "rgba(230, 231, 235, 0.62)";
  const silverBorder = "rgba(230, 231, 235, 0.20)";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="evr-mig-title"
      aria-describedby="evr-mig-sub"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        background: "rgba(3, 3, 3, 0.94)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily:
          'var(--font-outfit), Outfit, "Inter", system-ui, -apple-system, sans-serif',
        color: silver,
        overflow: "auto",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          background: "#070707",
          border: `1px solid ${silverBorder}`,
          borderRadius: 14,
          padding: "26px 26px 24px",
          boxShadow:
            "0 40px 80px -20px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255,255,255,0.02)",
          textAlign: "left",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 11px",
            marginBottom: 20,
            borderRadius: 999,
            background: "rgba(230, 231, 235, 0.06)",
            border: `1px solid ${silverBorder}`,
            color: silver,
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: silver,
              opacity: 0.85,
            }}
          />
          Domain retiring
        </div>

        <h1
          id="evr-mig-title"
          style={{
            fontSize: 26,
            lineHeight: 1.2,
            fontWeight: 600,
            margin: "0 0 12px 0",
            letterSpacing: "-0.015em",
            color: "#ffffff",
          }}
        >
          Hi there, we&rsquo;ve moved to{" "}
          <span
            style={{
              color: "#ffffff",
              borderBottom: `1px solid ${silverBorder}`,
              paddingBottom: 1,
            }}
          >
            evora.cx
          </span>
        </h1>

        <p
          id="evr-mig-sub"
          style={{
            fontSize: 13.5,
            lineHeight: 1.55,
            color: silverDim,
            margin: "0 0 22px 0",
          }}
        >
          This domain will expire in 14 days. Please update any apps or
          integrations (SDK builds, webhooks, panel bookmarks, custom
          domains) you have pointed at evora.lol.
        </p>

        <a
          href="https://evora.cx"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: 38,
            padding: "0 14px",
            borderRadius: 8,
            background: hover
              ? "rgba(230, 231, 235, 0.17)"
              : "rgba(230, 231, 235, 0.11)",
            color: "#ffffff",
            fontSize: 13,
            fontWeight: 530,
            letterSpacing: "-0.005em",
            textDecoration: "none",
            border: "none",
            transition: "background 120ms ease",
          }}
        >
          Continue on evora.cx &rarr;
        </a>
      </div>
    </div>
  );
}
