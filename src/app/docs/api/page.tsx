import Link from "next/link";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbSchema, pageMeta } from "@/lib/seo";
import { BASE_URL, allOperations, operationsByTag, tagSlug } from "../api-operations";

const COUNT = allOperations().length;

export const metadata = pageMeta({
  title: "REST API reference",
  description: `Complete Evorion Developer API reference — ${COUNT} endpoints for licences, users, subscriptions, variables, webhooks and resellers. Callable from any language over HTTPS.`,
  path: "/docs/api",
  keywords: [
    "licensing rest api",
    "license key api reference",
    "software licensing api endpoints",
    "evorion developer api",
    "authenticate licence api",
  ],
});

export default function ApiIndexPage() {
  const groups = operationsByTag();

  return (
    <>
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Documentation", path: "/docs" },
          { name: "API reference", path: "/docs/api" },
        ])}
      />

      <h1
        className="not-prose mb-3 text-[28px] font-semibold tracking-[-0.02em]"
        style={{ color: "var(--docs-heading)" }}
      >
        REST API reference
      </h1>
      <p className="not-prose mb-2 text-[15px] leading-[1.7]" style={{ color: "var(--docs-body)" }}>
        {COUNT} endpoints, generated from the OpenAPI specification so they always match what the
        server implements. Every one is callable from any language that can make an HTTP request —
        PHP, Node, Python, Go, C#, Ruby, Java.
      </p>
      <p className="not-prose mb-10 text-[13px]" style={{ color: "var(--docs-faint)" }}>
        Base URL <code>{BASE_URL}</code> · authenticate with{" "}
        <code>Authorization: Bearer ag_sk_…</code> · machine-readable spec at{" "}
        <a href="/openapi/developer-api.yaml" className="hover:underline">developer-api.yaml</a>
      </p>

      {groups.map((g) => (
        <section key={g.tag} id={tagSlug(g.tag)} className="not-prose mb-10 scroll-mt-24">
          <h2 className="mb-1.5 text-[17px] font-semibold" style={{ color: "var(--docs-heading)" }}>
            {g.tag}
          </h2>
          {g.description ? (
            <p className="mb-4 text-[13.5px] leading-[1.6]" style={{ color: "var(--docs-muted)" }}>
              {g.description}
            </p>
          ) : null}
          <ul className="grid gap-px overflow-hidden rounded-[10px]" style={{ background: "var(--docs-hairline)" }}>
            {g.ops.map((o) => (
              <li key={o.slug} style={{ background: "var(--bg-docs)" }}>
                <Link
                  href={`/docs/api/${o.slug}`}
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-3 transition-colors hover:bg-white/[0.03]"
                >
                  <span
                    className="w-[52px] shrink-0 text-[10px] font-semibold uppercase"
                    style={{ color: "var(--docs-faint)", fontFamily: "var(--font-mono, monospace)" }}
                  >
                    {o.method}
                  </span>
                  <span className="text-[13.5px]" style={{ color: "var(--docs-heading)" }}>
                    {o.summary}
                  </span>
                  <span
                    className="ml-auto text-[12px]"
                    style={{ color: "var(--docs-faint)", fontFamily: "var(--font-mono, monospace)" }}
                  >
                    {o.path}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
