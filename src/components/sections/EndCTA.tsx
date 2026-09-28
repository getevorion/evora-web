"use client";

import Link from "next/link";
import { SITE } from "@/lib/site";

export function EndCTA() {
  return (
    <section id="end-cta" className="ev-endcap">
      <div className="ev-endcap-glow" aria-hidden />
      <div className="shell ev-endcap-inner">
        <h2 className="ev-endcap-title">
          <span className="ev-endcap-line">Make the hunt endless.</span>
          <span className="ev-endcap-line ev-endcap-line-alt">
            Available today.
          </span>
        </h2>
        <div className="ev-endcap-actions">
          <Link href="/signup" className="ev-endcap-cta ev-endcap-cta-primary">
            Get started
          </Link>
          <Link
            href={SITE.social.discord}
            className="ev-endcap-cta ev-endcap-cta-secondary"
          >
            Contact sales
          </Link>
        </div>
      </div>
    </section>
  );
}
