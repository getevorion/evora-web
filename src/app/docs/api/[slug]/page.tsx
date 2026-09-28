import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Endpoint } from "../../ApiReference";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbSchema, canonical, pageMeta } from "@/lib/seo";
import {
  BASE_URL,
  allOperations,
  operationBySlug,
  tagSlug,
} from "../../api-operations";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allOperations().map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const op = operationBySlug(slug);
  if (!op) return {};

  const title = `${op.summary} — ${op.method.toUpperCase()} ${op.path}`;
  const description =
    op.description ||
    `${op.method.toUpperCase()} ${op.path} — ${op.summary} in the Evorion Developer API. Request parameters, response body and required scope.`;

  return pageMeta({
    title,
    description: description.slice(0, 300),
    path: `/docs/api/${slug}`,
    keywords: [
      op.summary.toLowerCase(),
      `${op.method.toLowerCase()} ${op.path}`,
      "evorion api",
      "licensing rest api",
      op.tag.toLowerCase(),
    ],
  });
}

export default async function ApiEndpointPage({ params }: Params) {
  const { slug } = await params;
  const op = operationBySlug(slug);
  if (!op) notFound();

  const siblings = allOperations().filter((o) => o.tag === op.tag && o.slug !== op.slug);

  return (
    <>
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Documentation", path: "/docs" },
          { name: "API reference", path: "/docs/api" },
          { name: op.summary, path: `/docs/api/${slug}` },
        ])}
      />

      <nav className="not-prose mb-6 text-[12.5px]" style={{ color: "var(--docs-faint)" }}>
        <Link href="/docs" className="hover:underline">Docs</Link>
        <span className="mx-1.5">/</span>
        <Link href="/docs/api" className="hover:underline">API reference</Link>
        <span className="mx-1.5">/</span>
        <Link href={`/docs/api#${tagSlug(op.tag)}`} className="hover:underline">{op.tag}</Link>
      </nav>

      <Endpoint method={op.method} path={op.path} op={op.op} pathParams={op.pathParams} as="h1" />

      {siblings.length ? (
        <section className="not-prose mt-12 pt-6" style={{ borderTop: "1px solid var(--docs-hairline)" }}>
          <h2 className="mb-3 text-[13px] font-medium" style={{ color: "var(--docs-muted)" }}>
            More in {op.tag}
          </h2>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {siblings.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/docs/api/${s.slug}`}
                  className="block text-[13px] hover:underline"
                  style={{ color: "var(--docs-body)" }}
                >
                  <span
                    className="mr-2 text-[10px] font-semibold uppercase"
                    style={{ color: "var(--docs-faint)", fontFamily: "var(--font-mono, monospace)" }}
                  >
                    {s.method}
                  </span>
                  {s.summary}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="not-prose mt-8 text-[12.5px]" style={{ color: "var(--docs-faint)" }}>
        Base URL <code>{BASE_URL}</code> · full spec at{" "}
        <a href="/openapi/developer-api.yaml" className="hover:underline">developer-api.yaml</a> ·{" "}
        <Link href={canonical("/docs")} className="hover:underline">back to the docs</Link>
      </p>
    </>
  );
}
