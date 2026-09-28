import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const SITE_URL = "https://evora.cx";

export const PUBLIC_ROUTES: Array<{
  path: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
  { path: "/features", changeFrequency: "monthly", priority: 0.9 },
  { path: "/products", changeFrequency: "monthly", priority: 0.9 },
  { path: "/docs", changeFrequency: "weekly", priority: 0.95 },
  { path: "/alternatives", changeFrequency: "monthly", priority: 0.85 },
  { path: "/updates", changeFrequency: "weekly", priority: 0.6 },
  { path: "/reviews", changeFrequency: "monthly", priority: 0.5 },
  { path: "/portfolio", changeFrequency: "monthly", priority: 0.4 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
];

export const DISALLOWED_PATHS = [
  "/api/",
  "/developer",
  "/panel",
  "/resell/",
  "/checkout",
  "/pricing/success",
  "/signin",
  "/signup",
  "/aim",
  "/keynote",
];

export function canonical(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${SITE.name} — ${SITE.tagline}`,
};

export function pageMeta({
  title,
  description,
  path,
  keywords,
  noIndex,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const url = canonical(path);
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    openGraph: {
      title: `${title} · ${SITE.name}`,
      description,
      url,
      siteName: SITE.name,
      type: "website",
      locale: "en_US",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${SITE.name}`,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE_URL,
    description: SITE.description,
    logo: `${SITE_URL}/evora-white.png`,
    sameAs: [SITE.social.discord],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE_URL,
    description: SITE.description,
  };
}

export function softwareSchema(offers?: Array<{ name: string; price: number; currency?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Evorion",
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "Software licensing and protection",
    operatingSystem: "Windows",
    url: SITE_URL,
    description: SITE.description,
    publisher: { "@type": "Organization", name: SITE.name, url: SITE_URL },
    ...(offers?.length
      ? {
          offers: offers.map((o) => ({
            "@type": "Offer",
            name: o.name,
            price: String(o.price),
            priceCurrency: o.currency ?? "USD",
            availability: "https://schema.org/InStock",
            url: canonical("/pricing"),
          })),
        }
      : {}),
  };
}

export function breadcrumbSchema(trail: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: canonical(t.path),
    })),
  };
}

export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
