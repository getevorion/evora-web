"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { fetchPromo, type SitePromo } from "@/lib/billing";

function daysLeft(endsAt: string | null): number | null {
  if (!endsAt) return null;
  const ms = new Date(endsAt).getTime() - Date.now();
  if (!Number.isFinite(ms) || ms <= 0) return null;
  return Math.max(1, Math.ceil(ms / 86400000));
}

export function PromoBar() {
  const [promo, setPromo] = useState<SitePromo | null>(null);

  useEffect(() => {
    fetchPromo()
      .then((r) => setPromo(r.promo))
      .catch(() => setPromo(null));
  }, []);

  useEffect(() => {
    if (!promo) return;
    document.documentElement.dataset.promo = "1";
    return () => {
      delete document.documentElement.dataset.promo;
    };
  }, [promo]);

  if (!promo) return null;

  const left = daysLeft(promo.ends_at);

  return (
    <div className="promobar" role="region" aria-label="Current offer">
      <div className="promobar-inner">
        <span className="promobar-pill">
          <Sparkles className="size-3" strokeWidth={2} aria-hidden />
          Offer
        </span>

        <p className="promobar-copy">
          {promo.percent_off}% off <span className="promobar-long">any plan </span>with code{" "}
          <span className="promobar-code">{promo.code}</span>
          {left != null && (
            <span className="promobar-dim">
              {" "}
              · {left} {left === 1 ? "day" : "days"} left
            </span>
          )}
        </p>

        <Link href="/pricing" className="promobar-cta" aria-label="Claim the discount">
          <span className="promobar-cta-text">Claim the discount</span>
          <ArrowRight className="size-3" strokeWidth={2} aria-hidden />
        </Link>
      </div>
    </div>
  );
}
