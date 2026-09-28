import { Suspense } from "react";
import { SiteFrame } from "@/components/site/SiteFrame";
import { Hero } from "@/components/sections/Hero";
import { PricingSection } from "@/components/sections/PricingSection";
import { EndCTA } from "@/components/sections/EndCTA";

import { ShowcaseSection } from "@/components/sections/ShowcaseSection";
import {
  IntroducingEvorionShowcase,
  LicensingShowcase,
  SessionsShowcase,
} from "@/components/sections/PanelShowcase";
import { SscxPitch } from "@/components/sections/SscxPitch";
import { ReviewsQuote } from "@/components/sections/ReviewsQuote";
import { FEATURED_HOME_ID } from "@/lib/reviews";
import { canonical } from "@/lib/seo";

export const metadata = { alternates: { canonical: canonical("/") } };

export default function HomePage() {
  return (
    <SiteFrame>
      <Hero />

      <ShowcaseSection
        id="evorion-4"
        first
        eyebrow="What's new"
        eyebrowTone="blue"
        title={
          <>
            <span className="ev-h2-lead">Evorion 4 has helped teams</span>{" "}
            <span className="ev-h2-mute">
              ship faster without worrying about license theft, HWID abuse, or runtime tampering.
            </span>
          </>
        }
        kicker="A wider stack, safer sessions, a hardened runtime, and a larger surface to build against: the protection layer rewritten from the boot path up."
        layout="feature"
      >
        <IntroducingEvorionShowcase />
      </ShowcaseSection>

      <ShowcaseSection
        id="licensing"
        eyebrow="Licensing"
        eyebrowTone="purple"
        title={
          <>
            <span className="ev-h2-lead">Per-device entitlements,</span>{" "}
            <span className="ev-h2-mute">hardware-bound.</span>
          </>
        }
        kicker="Issue keys, lock to HWID on first auth, watch expiry. Inspector one click from any row."
        layout="text-left"
        dataCv="auto"
      >
        <Suspense fallback={null}>
          <LicensingShowcase />
        </Suspense>
      </ShowcaseSection>

      <ShowcaseSection
        id="telemetry"
        eyebrow="Telemetry"
        eyebrowTone="blue"
        title={
          <>
            <span className="ev-h2-lead">Live sessions across regions.</span>{" "}
            <span className="ev-h2-mute">Terminate on tamper.</span>
          </>
        }
        kicker="Authenticated sessions heartbeat to Evora. Tampered or expired sessions surface in real time — click a row to pull it."
        layout="stacked"
        dataCv="auto"
      >
        <Suspense fallback={null}>
          <SessionsShowcase />
        </Suspense>
      </ShowcaseSection>

      <ShowcaseSection
        id="integrity"
        eyebrow="Server-side execution"
        eyebrowTone="orange"
        title={
          <>
            <span className="ev-h2-lead">Your client and our server,</span>{" "}
            <span className="ev-h2-mute">running as one.</span>
          </>
        }
        kicker="Run your most sensitive logic on Evora instead of the shipped client, behind the same auth and integrity checks. The code that matters never lands on a device to be lifted."
        layout="text-right"
        dataCv="auto"
      >
        <SscxPitch />
      </ShowcaseSection>

      <ReviewsQuote reviewId={FEATURED_HOME_ID} />

      <PricingSection />

      <EndCTA />
    </SiteFrame>
  );
}
