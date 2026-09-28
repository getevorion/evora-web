import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteFrame } from "@/components/site/SiteFrame";
import { EndCTA } from "@/components/sections/EndCTA";
import { ReviewsRotator } from "@/components/sections/ReviewsRotator";
import "@/components/sections/reviews.css";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Reviews",
  description:
    "What developers shipping on Evorion say about the SDK, the panel, the documentation, and the support behind them.",
  path: "/reviews",
  keywords: ["evorion reviews", "licensing sdk reviews", "software protection reviews"],
});

export default function ReviewsPage() {
  return (
    <SiteFrame>
      <div className="ev-reviews-page">
        <div className="ev-reviews-shell">
          <Link href="/" className="ev-reviews-back">
            <ArrowLeft className="size-3.5" strokeWidth={1.75} />
            Back to Evora
          </Link>

          <header className="ev-reviews-head">
            <p className="ev-reviews-eyebrow">Reviews</p>
            <h1 className="ev-reviews-title">
              What teams say once{" "}
              <span className="ev-reviews-title-mute">
                they have shipped on it.
              </span>
            </h1>
          </header>
        </div>

        <ReviewsRotator />
      </div>

      <EndCTA />
    </SiteFrame>
  );
}
