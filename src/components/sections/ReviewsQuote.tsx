"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { REVIEWS, getReview, monogram } from "@/lib/reviews";
import "./reviews.css";

const INTERVAL_MS = 5200;

export function ReviewsQuote({ reviewId }: { reviewId: string }) {
  const featured = getReview(reviewId);
  const reviews = [featured, ...REVIEWS.filter((r) => r.id !== featured.id)];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reviews.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % reviews.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, [reviews.length]);

  const active = reviews[index] ?? featured;

  return (
    <section id="reviews" className="ev-quote">
      <div className="ev-quote-rail" aria-hidden />
      <div className="ev-quote-glow" aria-hidden />
      <Link
        href="/reviews"
        className="ev-quote-inner"
        aria-label={`Read all customer reviews. Featured: ${active.name}`}
      >
        <div className="ev-rotator">
          {reviews.map((review, i) => (
            <figure
              key={review.id}
              className="ev-rotator-item"
              data-active={i === index ? "true" : undefined}
            >
              <blockquote className="ev-quote-text">
                {"“"}
                {review.body}
                {"”"}
              </blockquote>
              <figcaption className="ev-quote-cite">
                <span className="ev-quote-mono" aria-hidden>
                  {monogram(review.name)}
                </span>
                <span className="ev-quote-name">{review.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <span className="ev-quote-more">
          Read all reviews
          <ArrowRight className="size-3.5" strokeWidth={1.75} aria-hidden />
        </span>
      </Link>
    </section>
  );
}
