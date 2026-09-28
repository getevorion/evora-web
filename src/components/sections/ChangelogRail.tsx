"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/cn";
import { CHANGELOG, pathFor, statusLabel } from "@/lib/changelog";

export function ChangelogRail({ className }: { className?: string }) {
  return (
    <div id="updates" className={cn("scroll-mt-[96px] w-full", className)}>
      <Reveal duration={520} fade>
        <header className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-none lg:flex lg:items-end lg:justify-between lg:gap-8 lg:text-left">
          <div>
            <p className="keynote-eyebrow text-[10px] font-semibold tracking-[0.02em]">
              <span className="keynote-eyebrow-gradient">Changelog</span>
            </p>
            <h3 className="mt-3 text-[clamp(1.35rem,2.8vw,1.75rem)] font-medium leading-[1.08] tracking-[-0.035em]">
              <span className="keynote-title-lead">Release </span>
              <span className="keynote-title-em">history</span>
            </h3>
          </div>
          <Link
            href="/updates"
            className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] text-text-muted hover:text-text transition-colors lg:mt-0"
          >
            View full changelog
            <ArrowRight className="size-3.5" strokeWidth={1.75} />
          </Link>
        </header>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:mt-12 lg:mt-14 xl:grid-cols-4 xl:gap-6">
        {CHANGELOG.map((entry, i) => {
          const label = statusLabel(entry.status);

          return (
            <Reveal
              key={entry.version}
              delay={0.12 + i * 0.08}
              duration={560}
              fade
              className="min-w-0"
            >
              <article className="text-center xl:text-left">
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 xl:justify-start">
                  <span className="font-mono text-[11px] font-medium tracking-tight text-text">
                    {entry.version}
                  </span>
                  {entry.codename ? (
                    <span className="text-[11px] text-text-faint">{entry.codename}</span>
                  ) : null}
                  <span className="text-[11px] text-text-faint">{entry.date}</span>
                  {label ? (
                    <span
                      className="text-[11px] font-medium"
                      style={
                        entry.status === "latest"
                          ? { color: "var(--ev-success, #4cb782)" }
                          : { color: "var(--ev-text-tertiary, #939496)" }
                      }
                    >
                      {label}
                    </span>
                  ) : null}
                </div>
                <h4 className="mt-2.5 text-[13px] font-medium tracking-[-0.02em] sm:text-[13.5px]">
                  <Link
                    href={pathFor(entry)}
                    className="text-text transition-colors hover:text-white"
                  >
                    {entry.title}
                  </Link>
                </h4>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-text-muted sm:text-[12px]">
                  {entry.body}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
