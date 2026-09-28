import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DitherStrip } from "@/components/site/DitherStrip";
import { Logo } from "@/components/site/Logo";
import { Footer } from "@/components/site/Footer";
import { JsonLd } from "@/components/site/JsonLd";
import { NAV } from "@/lib/site";
import {
  CHANGELOG,
  entryByPath,
  neighbours,
  pathFor,
  pathSegmentsFor,
} from "@/lib/changelog";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";

type Params = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return CHANGELOG.map((e) => ({ slug: pathSegmentsFor(e) }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const entry = entryByPath(slug);
  if (!entry) return {};
  const versioned = `Evorion ${entry.version.replace(/-.*/, "")}`;
  const base = entry.title === versioned ? versioned : `${versioned}: ${entry.title}`;
  const title = entry.codename ? `${base} “${entry.codename}”` : base;

  return pageMeta({
    title,
    description: entry.tagline || entry.body,
    path: pathFor(entry),
    keywords: [
      `evorion ${entry.version}`,
      entry.codename ? `evorion ${entry.codename.toLowerCase()}` : "",
      "evorion release notes",
      "licensing sdk changelog",
    ].filter(Boolean),
  });
}

export default async function ReleasePage({ params }: Params) {
  const { slug } = await params;
  const entry = entryByPath(slug);
  if (!entry) notFound();

  const canonical = pathSegmentsFor(entry);
  if (canonical.join("/") !== slug.join("/")) {
    redirect(pathFor(entry));
  }

  const { newer, older } = neighbours(entry);
  const isLatest = entry.status === "latest";
  const heroTitle = isLatest ? `Introducing ${entry.title}` : entry.title;
  const heroTagline = entry.tagline || entry.body;
  const versionLabel = entry.version.replace(/-.*/, "");

  return (
    <div className="utpl-root" data-glow="brand">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Changelog", path: "/updates" },
            {
              name: entry.codename
                ? `Evorion ${versionLabel} ${entry.codename}`
                : `Evorion ${entry.version}`,
              path: pathFor(entry),
            },
          ]),
        ]}
      />
      <style>{CSS}</style>

      <nav className="utpl-nav" aria-label="Main">
        <div className="utpl-nav-inner">
          <div className="utpl-nav-left">
            <Link href="/" className="utpl-nav-brand" aria-label="Evora home">
              <Logo size={22} withWordmark={false} />
            </Link>
            <ul className="utpl-nav-links">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="utpl-nav-actions">
            <Link href="/signin" className="utpl-nav-signin">
              Sign in
            </Link>
            <Link href="/signup" className="utpl-nav-cta">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="utpl-hero">
          <div className="utpl-stage">
            <div className="utpl-dither-strip" aria-hidden>
              <DitherStrip />
            </div>

            <div className="utpl-hero-inner">
              <p className="utpl-date">
                <time dateTime={entry.iso}>{entry.date}</time>
                <span aria-hidden> · </span>
                <span>v{versionLabel}</span>
                {entry.codename ? (
                  <>
                    <span aria-hidden> · </span>
                    <span>{entry.codename}</span>
                  </>
                ) : null}
              </p>

              <h1 className="utpl-title">{heroTitle}</h1>

              <p className="utpl-tagline">{heroTagline}</p>

              <div className="utpl-cta-row">
                <Link href="/signup" className="utpl-btn utpl-btn-primary">
                  Get started
                </Link>
                <Link href="/updates" className="utpl-btn utpl-btn-ghost">
                  See all releases
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="utpl-body">
          <div className="shell">
            <div className="utpl-col">
              <h2 className="utpl-lead">
                What shipped in {entry.title}
                {entry.codename ? ` ${entry.codename}` : ""}
              </h2>
              <p className="utpl-para">{entry.body}</p>
            </div>

            {entry.details && entry.details.length > 0 ? (
              <div className="utpl-col utpl-changed">
                <h3 className="utpl-sub">What changed</h3>
                <ul className="utpl-grid">
                  {entry.details.map((d, i) => (
                    <li key={i} className="utpl-item">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {entry.notes && entry.notes.length > 0 ? (
              <div className="utpl-col utpl-notes">
                {entry.notes.map((n, i) => (
                  <p key={i} className="utpl-note">
                    {n}
                  </p>
                ))}
              </div>
            ) : null}

            {newer || older ? (
              <div className="utpl-col utpl-neighbours">
                {older ? (
                  <Link href={pathFor(older)} className="utpl-nb utpl-nb-prev">
                    <span className="utpl-nb-eyebrow">
                      <ArrowLeft className="utpl-nb-arrow" strokeWidth={1.75} />
                      Previous release
                    </span>
                    <span className="utpl-nb-title">
                      {older.title}
                      {older.codename ? ` ${older.codename}` : ""}
                    </span>
                    <span className="utpl-nb-version">v{older.version}</span>
                  </Link>
                ) : (
                  <span aria-hidden />
                )}
                {newer ? (
                  <Link href={pathFor(newer)} className="utpl-nb utpl-nb-next">
                    <span className="utpl-nb-eyebrow">
                      Next release
                      <ArrowRight className="utpl-nb-arrow" strokeWidth={1.75} />
                    </span>
                    <span className="utpl-nb-title">
                      {newer.title}
                      {newer.codename ? ` ${newer.codename}` : ""}
                    </span>
                    <span className="utpl-nb-version">v{newer.version}</span>
                  </Link>
                ) : null}
              </div>
            ) : null}

            <div className="utpl-col utpl-close">
              <Link href="/signup" className="utpl-close-link">
                Apply for access
                <ArrowRight className="utpl-close-arrow" strokeWidth={1.75} />
              </Link>
              <p className="utpl-close-note">
                Release notes go out on the first heartbeat after ship.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

const CSS = `
html,
body {
  background: #000000;
}
.utpl-root {
  --utpl-bg: #000000;
  --utpl-ink: #f5f5f7;
  --utpl-ink-muted: rgba(255, 255, 255, 0.60);
  --utpl-ink-faint: rgba(255, 255, 255, 0.40);
  --utpl-hairline: rgba(255, 255, 255, 0.10);

  --utpl-rim: rgba(255, 224, 189, 0.95);
  --utpl-glow-hot: rgba(255, 197, 143, 0.75);
  --utpl-glow-strong: rgba(255, 148, 68, 0.42);
  --utpl-glow-mid: rgba(255, 120, 44, 0.26);
  --utpl-glow-soft: rgba(255, 96, 28, 0.14);
  --utpl-glow-ambient: rgba(255, 132, 58, 0.16);

  position: relative;
  background: var(--utpl-bg);
  color: var(--utpl-ink);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.utpl-root[data-glow="brand"] {
  --utpl-rim: rgba(255, 255, 255, 0.95);
  --utpl-glow-hot: rgba(255, 255, 255, 0.75);
  --utpl-glow-strong: rgba(255, 255, 255, 0.55);
  --utpl-glow-mid: rgba(255, 255, 255, 0.32);
  --utpl-glow-soft: rgba(255, 255, 255, 0.18);
  --utpl-glow-ambient: rgba(255, 255, 255, 0.20);
}

.utpl-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  background: #000000;
}
.utpl-nav-inner {
  max-width: 88rem;
  margin-inline: auto;
  height: 64px;
  padding-inline: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}
.utpl-nav-left {
  display: flex;
  align-items: center;
  gap: 1.75rem;
  min-width: 0;
}
.utpl-nav-brand {
  display: inline-flex;
  align-items: center;
  color: #ffffff;
  flex-shrink: 0;
}
.utpl-nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.utpl-nav-links a {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  transition: color 0.16s ease;
}
.utpl-nav-links a:hover { color: #ffffff; }
.utpl-nav-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}
.utpl-nav-signin,
.utpl-nav-cta {
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0 20px;
  border-radius: 40px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  transition: background-color 0.16s ease;
}
.utpl-nav-signin {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}
.utpl-nav-signin:hover { background: rgba(255, 255, 255, 0.18); }
.utpl-nav-cta {
  background: #ffffff;
  color: #000000;
}
.utpl-nav-cta:hover { background: rgba(255, 255, 255, 0.86); }
@media (max-width: 860px) {
  .utpl-nav-links { display: none; }
}

.utpl-hero {
  position: relative;
  padding: 2.5rem clamp(1.25rem, 5vw, 2.75rem) 4rem;
  background: var(--utpl-bg);
}
.utpl-stage {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  max-width: 88rem;
  margin-inline: auto;
  min-height: clamp(28rem, 56vh, 34rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 1.5rem;
  border-radius: 0;
  background: #000000;
}
.utpl-dither-strip {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.9;
}
.utpl-hero-inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 46rem;
  min-width: 0;
  text-align: center;
}
.utpl-hero-inner::before {
  content: "";
  position: absolute;
  inset: -32% -26%;
  z-index: -1;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0.72) 0%,
    rgba(0, 0, 0, 0.42) 46%,
    transparent 72%
  );
  pointer-events: none;
}

.utpl-date {
  font-size: 12.5px;
  letter-spacing: 0.02em;
  color: var(--utpl-ink-muted);
}
.utpl-title {
  margin-top: 1.1rem;
  font-size: clamp(2rem, 6vw, 4rem);
  line-height: 1.0;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--utpl-ink);
  text-wrap: balance;
}
.utpl-tagline {
  margin-top: 1.5rem;
  font-size: clamp(0.95rem, 1.5vw, 1.0625rem);
  line-height: 1.65;
  color: var(--utpl-ink-muted);
}
.utpl-cta-row {
  margin-top: 2.4rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}
.utpl-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 20px;
  border-radius: 40px;
  font-size: 13px;
  font-weight: 600;
  transition: background-color 0.16s ease, color 0.16s ease, border-color 0.16s ease;
}
.utpl-btn-primary {
  background: #ffffff;
  color: #0a0a0a;
}
.utpl-btn-primary:hover { background: rgba(255, 255, 255, 0.88); }
.utpl-btn-ghost {
  background: rgba(255, 255, 255, 0.08);
  color: var(--utpl-ink);
  border: 1px solid var(--utpl-hairline);
}
.utpl-btn-ghost:hover { background: rgba(255, 255, 255, 0.14); }

.utpl-body {
  position: relative;
  z-index: 1;
  background: var(--utpl-bg);
  padding: 5rem 0 7rem;
}
.utpl-col { max-width: 42rem; }
.utpl-col + .utpl-col { margin-top: 3.5rem; }
.utpl-lead {
  font-size: clamp(1.5rem, 3vw, 1.875rem);
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.32;
  color: var(--utpl-ink);
}
.utpl-para {
  margin-top: 1.1rem;
  font-size: 15px;
  line-height: 1.7;
  color: var(--utpl-ink-muted);
}
.utpl-sub {
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-weight: 500;
  color: var(--utpl-ink-faint);
}
.utpl-changed { max-width: 52rem; }
.utpl-grid {
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.85rem 2.5rem;
}
@media (min-width: 640px) {
  .utpl-grid { grid-template-columns: 1fr 1fr; }
}
.utpl-item {
  position: relative;
  padding-left: 1.1rem;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--utpl-ink-muted);
}
.utpl-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 9px;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #ffffff;
}
.utpl-notes {
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--utpl-hairline);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
}
.utpl-note {
  font-size: 13px;
  line-height: 1.6;
  color: var(--utpl-ink-faint);
}
.utpl-note + .utpl-note { margin-top: 0.5rem; }

.utpl-neighbours {
  max-width: 52rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}
@media (min-width: 640px) {
  .utpl-neighbours { grid-template-columns: 1fr 1fr; }
}
.utpl-nb {
  display: block;
  padding: 1rem 1.25rem;
  border: 1px solid var(--utpl-hairline);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  transition: border-color 0.16s ease, background-color 0.16s ease;
}
.utpl-nb:hover {
  border-color: rgba(255, 255, 255, 0.24);
  background: rgba(255, 255, 255, 0.04);
}
.utpl-nb-next { text-align: right; }
.utpl-nb-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 11px;
  color: var(--utpl-ink-faint);
}
.utpl-nb-arrow { width: 12px; height: 12px; }
.utpl-nb-title {
  display: block;
  margin-top: 0.5rem;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--utpl-ink);
}
.utpl-nb-version {
  display: block;
  margin-top: 0.15rem;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 11px;
  color: var(--utpl-ink-faint);
}

.utpl-close-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 14px;
  font-weight: 500;
  color: var(--utpl-ink);
}
.utpl-close-link:hover { color: var(--utpl-rim); }
.utpl-close-arrow {
  width: 15px;
  height: 15px;
  transition: transform 0.16s ease;
}
.utpl-close-link:hover .utpl-close-arrow { transform: translateX(3px); }
.utpl-close-note {
  margin-top: 0.6rem;
  font-size: 13px;
  color: var(--utpl-ink-faint);
}

@media (max-width: 640px) {
  .utpl-stage {
    min-height: 22rem;
    padding: 2.5rem 1.25rem;
  }
  .utpl-nav-inner {
    padding-inline: 1.25rem;
  }
  .utpl-nav-signin {
    display: none;
  }
}
`;
