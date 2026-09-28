import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteFrame } from "@/components/site/SiteFrame";
import { CHANGELOG, pathFor, statusLabel } from "@/lib/changelog";
import { cn } from "@/lib/cn";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Changelog",
  description: "Every Evorion release. Version, ship date, and what changed.",
  path: "/updates",
  keywords: ["evorion changelog", "licensing sdk releases", "evorion release notes"],
});

export default function UpdatesPage() {
  return (
    <SiteFrame>
      <section className="relative pt-24 pb-24 sm:pt-28 lg:pt-32">
        <div className="shell">
          <div className="max-w-2xl">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[12.5px] text-text-muted hover:text-text transition-colors"
            >
              <ArrowLeft className="size-3.5" strokeWidth={1.75} />
              Back to Evora
            </Link>
            <p className="mt-8 text-[11px] tracking-[0.02em] text-text-faint font-medium">
              Changelog
            </p>
            <h1 className="mt-3 text-[clamp(1.8rem,4vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-text">
              Every Evorion release.
            </h1>
          </div>

          <ol className="relative mt-20 lg:mt-24">
            <div
              aria-hidden
              className="absolute left-[5px] top-3 bottom-3 w-px bg-hairline hidden lg:block"
            />

            {CHANGELOG.map((entry, i) => {
              const label = statusLabel(entry.status);
              const isLast = i === CHANGELOG.length - 1;
              return (
                <li
                  key={entry.version}
                  className={cn(
                    "relative grid grid-cols-1 gap-x-14 gap-y-4 lg:grid-cols-[220px_1fr]",
                    !isLast && "pb-20 lg:pb-24"
                  )}
                >
                  <aside className="lg:pl-8 lg:relative">
                    <span
                      aria-hidden
                      className={cn(
                        "hidden lg:block absolute left-0 top-[7px] size-[11px] rounded-full ring-4 ring-bg",
                        entry.status === "latest"
                          ? "bg-white"
                          : "bg-text-faint/60"
                      )}
                    />
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-mono text-[13px] font-medium tracking-tight text-text">
                        v{entry.version}
                      </span>
                      {entry.codename ? (
                        <span className="text-[12px] text-text-faint">{entry.codename}</span>
                      ) : null}
                      <time
                        dateTime={entry.iso}
                        className="text-[12px] text-text-faint"
                      >
                        {entry.date}
                      </time>
                    </div>
                    {label ? (
                      <span
                        className="mt-2 block text-[11px] font-medium"
                        style={
                          entry.status === "latest"
                            ? { color: "var(--ev-success, #4cb782)" }
                            : { color: "var(--ev-text-tertiary, #939496)" }
                        }
                      >
                        {label}
                      </span>
                    ) : null}
                  </aside>

                  <article>
                    <h2 className="text-[19px] sm:text-[21px] font-medium tracking-[-0.017em] leading-[1.25]">
                      <Link
                        href={pathFor(entry)}
                        className="text-text transition-colors hover:text-white"
                      >
                        {entry.title}
                      </Link>
                    </h2>
                    <p
                      className="mt-3 text-[13.5px] sm:text-[14px] leading-relaxed max-w-2xl"
                      style={{ color: "var(--ev-text-tertiary, #939496)" }}
                    >
                      {entry.body}
                    </p>
                    {entry.details && entry.details.length > 0 ? (
                      <ul className="mt-6 space-y-2.5 max-w-2xl">
                        {entry.details.map((d, k) => (
                          <li
                            key={k}
                            className="relative pl-4 text-[13px] leading-relaxed before:absolute before:left-0 before:top-[10px] before:size-[3px] before:rounded-full before:bg-text-faint/70"
                            style={{ color: "var(--ev-text-tertiary, #939496)" }}
                          >
                            {d}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <Link
                      href={pathFor(entry)}
                      className="mt-6 inline-block text-[12.5px] text-text-muted hover:text-text transition-colors"
                    >
                      Read the release notes
                    </Link>
                  </article>
                </li>
              );
            })}
          </ol>

          <div className="mt-8 lg:pl-[calc(220px+3.5rem)]">
            <p className="text-[13px] max-w-2xl" style={{ color: "var(--ev-text-tertiary, #939496)" }}>
              Want a heads-up on new releases?{" "}
              <Link
                href="/signup"
                className="text-text underline underline-offset-2 hover:no-underline"
              >
                Apply for access
              </Link>
              . Release notes go out on the first heartbeat after ship.
            </p>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
