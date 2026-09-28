import { DocsLayoutClient } from "./DocsLayoutClient";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Documentation",
  description:
    "Evorion documentation: C++ SDK reference, licence and user authentication, HWID binding, sessions, runtime protection, and the complete REST API for every other language.",
  path: "/docs",
  keywords: [
    "evorion documentation",
    "licensing sdk docs",
    "c++ licensing library",
    "license key api",
    "software licensing rest api",
    "hwid binding",
  ],
});

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Documentation", path: "/docs" },
        ])}
      />
      <DocsLayoutClient>{children}</DocsLayoutClient>
    </>
  );
}
