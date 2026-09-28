import type { MetadataRoute } from "next";
import { PUBLIC_ROUTES, canonical } from "@/lib/seo";
import { CHANGELOG, pathFor } from "@/lib/changelog";
import { allOperations } from "./docs/api-operations";
import { LANGUAGES } from "./integrations/languages";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const marketing = PUBLIC_ROUTES.map((r) => ({
    url: canonical(r.path),
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const apiHub = {
    url: canonical("/docs/api"),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  };

  const endpoints = allOperations().map((o) => ({
    url: canonical(`/docs/api/${o.slug}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const releases = CHANGELOG.map((e) => ({
    url: canonical(pathFor(e)),
    lastModified: new Date(e.iso),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  const integrations = [
    {
      url: canonical("/integrations"),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    ...LANGUAGES.map((l) => ({
      url: canonical(`/integrations/${l.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];

  return [...marketing, ...releases, ...integrations, apiHub, ...endpoints];
}
