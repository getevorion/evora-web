"use client";

import { useEffect, useState } from "react";
import { REVIEWS, monogram } from "@/lib/reviews";
import "./reviews.css";

const INTERVAL_MS = 2000;

export function ReviewsRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % REVIEWS.length),
      INTERVAL_MS
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="ev-quote">
      <div className="ev-quote-glow" aria-hidden />
      <div className="ev-quote-inner">
        <div className="ev-rotator">
          {REVIEWS.map((review, i) => (
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
      </div>
    </section>
  );
}
