import Link from "next/link";
import { spaHref } from "@/lib/spa";
import { SuccessChime } from "./SuccessChime";

export const metadata = {
  title: "Payment successful",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 20,
        padding: "80px 24px",
      }}
    >

      <SuccessChime />

      <div aria-hidden style={{ color: "#22c55e", fontSize: 56, lineHeight: 1 }}>
        ✓
      </div>

      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0 }}>
        Payment successful
      </h1>

      <p style={{ maxWidth: 420, color: "var(--ev-text-tertiary)", margin: 0, lineHeight: 1.6 }}>
        Your Evorion plan is being activated. New tier and limits can take a few
        seconds to reach your dashboard. If nothing changes after a minute,
        refresh.
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href={spaHref("/developer")} className="lnp-btn-primary" style={{ padding: "10px 22px" }}>
          Go to dashboard
        </Link>
        <Link href="/" className="lnp-btn-secondary" style={{ padding: "10px 22px" }}>
          Back to home
        </Link>
      </div>
    </main>
  );
}
