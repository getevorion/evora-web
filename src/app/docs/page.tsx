import Link from "next/link";
import { SdkReference } from "./sections/SdkReference";
import { AuthSections } from "./sections/AuthSections";
import { AccountSections } from "./sections/AccountSections";
import { SecurityNoticeSections } from "./sections/SecurityNoticeSections";
import { SecuritySections } from "./sections/SecuritySections";
import { CodeProtectionSections } from "./sections/CodeProtectionSections";
import { CustomDomainSections } from "./sections/CustomDomainSections";
import { DevApiSections } from "./sections/DevApiSections";
import { ResellerApiSections } from "./sections/ResellerApiSections";
import { ManagementSections } from "./sections/ManagementSections";
import { ApiReferenceIntro } from "./ApiReference";
import { allOperations, operationsByTag, tagSlug } from "./api-operations";

export default function DocsPage() {
  const groups = operationsByTag();
  const count = allOperations().length;

  return (
    <div>
      <SdkReference />
      <AuthSections />
      <AccountSections />
      <SecurityNoticeSections />
      <SecuritySections />
      <CodeProtectionSections />
      <CustomDomainSections />

      <DevApiSections />
      <ResellerApiSections />
      <ManagementSections />

      <ApiReferenceIntro />

      <div className="not-prose mb-16">
        <p className="mb-6 text-[14px] leading-[1.7]" style={{ color: "var(--docs-body)" }}>
          All {count} endpoints, grouped. Each has its own page with parameters, response body and
          required scope —{" "}
          <Link href="/docs/api" className="underline underline-offset-2">
            browse the full reference
          </Link>
          .
        </p>

        {groups.map((g) => (
          <section key={g.tag} className="mb-7">
            <h3 className="mb-2.5 text-[14px] font-semibold" style={{ color: "var(--docs-heading)" }}>
              <Link href={`/docs/api#${tagSlug(g.tag)}`} className="hover:underline">
                {g.tag}
              </Link>
            </h3>
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
              {g.ops.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/docs/api/${o.slug}`}
                    className="text-[12.5px] hover:underline"
                    style={{ color: "var(--docs-muted)" }}
                  >
                    <span
                      className="mr-1.5 text-[9.5px] font-semibold uppercase"
                      style={{ color: "var(--docs-faint)", fontFamily: "var(--font-mono, monospace)" }}
                    >
                      {o.method}
                    </span>
                    {o.summary}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
