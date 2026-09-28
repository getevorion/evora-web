"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";
import { HeroDemoFrame } from "./HeroDemoFrame";

const ENTER = { type: "tween", duration: 1, ease: [0.25, 0.1, 0.25, 1] } as const;
const FROM = { opacity: 0, filter: "blur(10px)", transform: "translateY(20%)" };
const TO = { opacity: 1, filter: "blur(0px)", transform: "translateY(0%)" };

export function Hero() {
  return (
    <section id="home" className="hero-root">
      <div className="hero-content">
        <h1 className="hero-title">
          <motion.span
            style={{ display: "inline-block" }}
            initial={FROM}
            animate={TO}
            transition={{ ...ENTER, delay: 0.4 }}
          >
            Be prepared for the{" "}
            <span className="hero-title-accent">AI frontier.</span>
          </motion.span>
        </h1>

        <div className="hero-desc-row">
          <motion.p
            className="hero-desc"
            initial={FROM}
            animate={TO}
            transition={{ ...ENTER, delay: 0.6 }}
          >
            AI-based cyberattacks are on the rise, and the tools used to pull
            software apart get cheaper every month. Your software needs a
            runtime that can take a hit and keep running.
          </motion.p>
          <motion.a
            href={SITE.links.signUp}
            className="hero-feature-link"
            initial={FROM}
            animate={TO}
            transition={{ ...ENTER, delay: 0.85 }}
          >
            Try free, no charge
            <ArrowRight className="hero-feature-link-arrow" strokeWidth={1.75} aria-hidden />
          </motion.a>
        </div>
      </div>

      <div className="hero-illustration">
        <div className="hero-illustration-bg" aria-hidden>
          <div className="hero-frame-grain" aria-hidden />
        </div>

        <div className="hero-frame-viewport">
          <HeroDemoFrame />
        </div>
      </div>
    </section>
  );
}
