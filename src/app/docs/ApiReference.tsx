import { DocSection, DocH2, DocH3, DocP, Code, CodeBlock, Divider } from "./components";
import spec from "../../../public/openapi/developer-api.json";

type AnyObj = Record<string, any>;

const METHODS = ["get", "post", "put", "delete", "patch"] as const;
type Method = (typeof METHODS)[number];

const METHOD_STYLE: Record<string, { fg: string; bg: string }> = {
  GET: { fg: "#3b9c6b", bg: "rgba(59,156,107,0.13)" },
  POST: { fg: "#3f7fd4", bg: "rgba(63,127,212,0.14)" },
  PUT: { fg: "#c08a2e", bg: "rgba(192,138,46,0.13)" },
  DELETE: { fg: "#c0554e", bg: "rgba(192,85,78,0.13)" },
  PATCH: { fg: "#8a6bc4", bg: "rgba(138,107,196,0.13)" },
};

const SURFACE = "rgba(255,255,255,0.028)";
const HAIRLINE = "rgba(255,255,255,0.055)";

const BASE_URL = (spec as AnyObj).servers?.[0]?.url ?? "https://api.evora.cx/api/developer-api";

function operationSlug(method: string, path: string) {
  const cleaned = path
    .replace(/[{}]/g, "")
    .replace(/[^a-zA-Z0-9/]+/g, "-")
    .split("/")
    .filter(Boolean)
    .join("-")
    .toLowerCase();
  return `api-${method}-${cleaned}`;
}

function resolveRef(ref: string): AnyObj {

  return ref
    .replace(/^#\//, "")
    .split("/")
    .reduce<AnyObj>((acc, k) => (acc ? acc[k] : undefined), spec as AnyObj) ?? {};
}

function deref<T extends AnyObj>(node: T): AnyObj {
  return node && typeof node.$ref === "string" ? resolveRef(node.$ref) : node;
}

function typeLabel(schema: AnyObj | undefined): string {
  if (!schema) return "—";
  const s = deref(schema);
  if (Array.isArray(s.enum)) return `enum`;
  if (s.type === "array") return `${typeLabel(s.items)}[]`;
  if (s.format) return `${s.type} (${s.format})`;
  return s.type ?? "object";
}

function constraintNotes(s: AnyObj): string[] {
  const out: string[] = [];
  if (Array.isArray(s.enum)) out.push(`One of: ${s.enum.join(" · ")}`);
  if (s.default !== undefined) out.push(`Default: ${JSON.stringify(s.default)}`);

  if (s.minimum !== undefined && s.maximum !== undefined) {
    out.push(`Range: ${s.minimum}–${s.maximum}`);
  } else if (s.minimum !== undefined) {
    out.push(`Minimum: ${s.minimum}`);
  } else if (s.maximum !== undefined) {
    out.push(`Maximum: ${s.maximum}`);
  }
  if (s.minLength !== undefined && s.maxLength !== undefined) {
    out.push(`Length: ${s.minLength}–${s.maxLength}`);
  } else if (s.maxLength !== undefined) {
    out.push(`Max length: ${s.maxLength}`);
  } else if (s.minLength !== undefined) {
    out.push(`Min length: ${s.minLength}`);
  }
  return out;
}

export function MethodBadge({ method, size = "md" }: { method: string; size?: "sm" | "md" }) {
  const m = method.toUpperCase();
  const c = METHOD_STYLE[m] ?? METHOD_STYLE.GET;
  return (
    <span
      className="not-prose inline-flex items-center justify-center rounded-[4px] font-semibold shrink-0"
      style={{
        color: c.fg,
        background: c.bg,
        fontFamily: "var(--font-mono, ui-monospace, monospace)",
        fontSize: size === "sm" ? "9.5px" : "10.5px",
        lineHeight: 1,
        padding: size === "sm" ? "4px 5px" : "5px 7px",
        minWidth: size === "sm" ? "40px" : "48px",
      }}
    >
      {m}
    </span>
  );
}

function ScopeChip({ scope }: { scope: string }) {
  return (
    <span
      className="not-prose inline-flex items-center rounded-[4px] px-1.5 py-[3px] text-[11px]"
      style={{
        color: "rgb(150,150,150)",
        background: "rgba(255,255,255,0.05)",
        fontFamily: "var(--font-mono, ui-monospace, monospace)",
      }}
    >
      {scope}
    </span>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 text-[12px]" style={{ color: "var(--docs-faint)" }}>
      {children}
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const n = Number(status);
  const color = n < 300 ? "#3b9c6b" : n < 400 ? "#3f7fd4" : n < 500 ? "#c08a2e" : "#c0554e";
  return (
    <span className="not-prose inline-flex items-center gap-1.5">
      <span className="inline-block rounded-full" style={{ width: 7, height: 7, background: color }} />
      <span
        className="font-semibold text-[12.5px]"
        style={{ color: "var(--docs-heading)", fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
      >
        {status}
      </span>
    </span>
  );
}

function splitScope(description: string): { body: string; scopes: string[] } {
  const scopes: string[] = [];
  const body = description.replace(/\*\*Scopes?:\*\*\s*([^\n]+)/g, (_m, list: string) => {
    for (const s of list.matchAll(/`([^`]+)`/g)) scopes.push(s[1]);
    return "";
  });
  return { body: body.trim(), scopes };
}

function Prose({ text }: { text: string }) {
  if (!text) return null;
  const blocks = text.split(/\n\s*\n/);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const isList = lines.every((l) => /^\s*[-*]\s+/.test(l) || !l.trim());
        if (isList) {
          const items = lines.filter((l) => l.trim()).map((l) => l.replace(/^\s*[-*]\s+/, ""));
          return (
            <ul key={i} className="not-prose mb-3 space-y-1.5 pl-4">
              {items.map((it, j) => (
                <li
                  key={j}
                  className="text-[13.5px] leading-[1.65] list-disc"
                  style={{ color: "var(--docs-body)", fontFamily: "var(--font-docs)" }}
                >
                  <Inline text={it} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p
            key={i}
            className="not-prose mb-3 text-[13.5px] leading-[1.7]"
            style={{ color: "var(--docs-body)", fontFamily: "var(--font-docs)" }}
          >
            <Inline text={block.replace(/\n/g, " ")} />
          </p>
        );
      })}
    </>
  );
}

function Inline({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("`") && p.endsWith("`")) return <Code key={i}>{p.slice(1, -1)}</Code>;
        if (p.startsWith("**") && p.endsWith("**")) {
          return (
            <strong key={i} style={{ color: "var(--docs-heading)", fontWeight: 600 }}>
              {p.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

function ParamTable({ title, params }: { title: string; params: AnyObj[] }) {
  if (!params.length) return null;
  return (
    <div className="not-prose mb-5">
      <FieldLabel>{title}</FieldLabel>
      <div className="overflow-hidden rounded-[8px]" style={{ background: SURFACE }}>
        <table className="w-full text-[13px] border-collapse">
          <tbody>
            {params.map((raw, i) => {
              const p = deref(raw);
              const s = deref(p.schema ?? {});
              const notes = constraintNotes(s);
              return (
                <tr key={i} style={{ borderTop: i === 0 ? "none" : `1px solid ${HAIRLINE}` }}>
                  <td className="py-3 px-4 align-top whitespace-nowrap" style={{ width: "1%" }}>
                    <span
                      className="text-[13px]"
                      style={{ color: "var(--docs-heading)", fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
                    >
                      {p.name}
                    </span>
                    {p.required ? (
                      <span className="ml-2 text-[10.5px]" style={{ color: "#c07a74" }}>
                        required
                      </span>
                    ) : null}
                    <div className="mt-1 text-[11.5px]" style={{ color: "var(--docs-faint)" }}>
                      {typeLabel(p.schema)}
                    </div>
                  </td>
                  <td className="py-3 px-4 align-top" style={{ color: "var(--docs-body)", fontFamily: "var(--font-docs)" }}>
                    {p.description ? <Inline text={String(p.description)} /> : null}
                    {notes.length ? (
                      <div className="mt-1.5 text-[11.5px]" style={{ color: "var(--docs-faint)" }}>
                        {notes.join(" · ")}
                      </div>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function bodyRows(schema: AnyObj | undefined): AnyObj[] {
  if (!schema) return [];
  const s = deref(schema);
  const props: AnyObj = s.properties ?? {};
  const required: string[] = s.required ?? [];
  return Object.entries(props).map(([name, raw]) => {
    const p = deref(raw as AnyObj);
    return { name, required: required.includes(name), schema: p, description: p.description };
  });
}

function firstExample(content: AnyObj | undefined): unknown {
  if (!content) return undefined;
  const media = content["application/json"];
  if (!media) return undefined;
  if (media.example !== undefined) return media.example;
  if (media.examples) {
    const first = Object.values(media.examples)[0] as AnyObj | undefined;
    return first?.value;
  }
  return undefined;
}

function allExamples(content: AnyObj | undefined): Array<{ label?: string; value: unknown }> {
  const media = content?.["application/json"];
  if (!media) return [];
  if (media.examples) {
    return Object.entries(media.examples).map(([key, v]) => {
      const ex = v as AnyObj;
      return { label: ex.summary ?? key, value: ex.value };
    });
  }
  if (media.example !== undefined) return [{ value: media.example }];
  return [];
}

export function Endpoint({
  method,
  path,
  op,
  pathParams,
  as = "h3",
}: {
  method: Method;
  path: string;
  op: AnyObj;
  pathParams: AnyObj[];

  as?: "h1" | "h3";
}) {
  const slug = operationSlug(method, path);
  const Heading = as;
  const { body: prose, scopes } = splitScope(String(op.description ?? ""));
  const params = [...pathParams, ...(op.parameters ?? [])].map(deref);
  const query = params.filter((p) => p.in === "query");
  const inPath = params.filter((p) => p.in === "path");
  const reqSchema = op.requestBody?.content?.["application/json"]?.schema;
  const reqRows = bodyRows(reqSchema);
  const reqExamples = allExamples(op.requestBody?.content);
  const responses: AnyObj = op.responses ?? {};

  return (
    <div id={slug} className="scroll-mt-24 mb-12">
      <Heading
        className={
          as === "h1"
            ? "not-prose mb-2.5 text-[26px] font-semibold tracking-[-0.02em]"
            : "not-prose mb-2.5 text-[16px] font-semibold"
        }
        style={{ color: "var(--docs-heading)", fontFamily: "var(--font-docs)" }}
      >
        {op.summary}
      </Heading>

      <div className="not-prose mb-3.5 flex flex-wrap items-center gap-2.5">
        <MethodBadge method={method} />
        <span
          className="text-[13.5px] break-all"
          style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
        >
          <span style={{ color: "rgb(120,120,120)" }}>{BASE_URL}</span>
          <span style={{ color: "var(--docs-heading)" }}>{path}</span>
        </span>
      </div>

      {scopes.length ? (
        <div className="not-prose mb-3.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[11.5px]" style={{ color: "var(--docs-faint)" }}>
            Requires scope
          </span>
          {scopes.map((s) => (
            <ScopeChip key={s} scope={s} />
          ))}
        </div>
      ) : null}

      <Prose text={prose} />

      <ParamTable title="Path parameters" params={inPath} />
      <ParamTable title="Query parameters" params={query} />
      {reqRows.length ? <ParamTable title="Body" params={reqRows} /> : null}

      {reqExamples.map((ex, i) => (
        <CodeBlock key={i} label={ex.label ? `Request — ${ex.label}` : "Request"}>
          {JSON.stringify(ex.value, null, 2)}
        </CodeBlock>
      ))}

      <div className="not-prose mt-5">
        <FieldLabel>Responses</FieldLabel>
        <div className="rounded-[8px] overflow-hidden" style={{ background: SURFACE }}>
          {Object.entries(responses).map(([status, raw], i) => {
            const r = deref(raw as AnyObj);
            const examples = allExamples(r.content);
            return (
              <div
                key={status}
                className="px-4 py-3"
                style={{ borderTop: i === 0 ? "none" : `1px solid ${HAIRLINE}` }}
              >
                <div className="flex flex-wrap items-baseline gap-3">
                  <StatusDot status={status} />
                  <span className="text-[13px]" style={{ color: "var(--docs-body)", fontFamily: "var(--font-docs)" }}>
                    <Inline text={String(r.description ?? "")} />
                  </span>
                </div>
                {examples.map((ex, j) => (
                  <div key={j} className="mt-2.5">
                    {ex.label && examples.length > 1 ? (
                      <div className="mb-1 text-[11.5px]" style={{ color: "var(--docs-faint)" }}>
                        {ex.label}
                      </div>
                    ) : null}

                    <CodeBlock label="json">{JSON.stringify(ex.value, null, 2)}</CodeBlock>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ApiReference() {
  const doc = spec as AnyObj;
  const tagMeta: AnyObj[] = doc.tags ?? [];

  const groups = new Map<string, Array<{ method: Method; path: string; op: AnyObj; pathParams: AnyObj[] }>>();
  for (const t of tagMeta) groups.set(t.name, []);

  for (const [path, itemRaw] of Object.entries(doc.paths as AnyObj)) {
    const item = itemRaw as AnyObj;
    const pathParams: AnyObj[] = item.parameters ?? [];
    for (const method of METHODS) {
      const op = item[method];
      if (!op) continue;
      const tag = (op.tags ?? ["Other"])[0];
      if (!groups.has(tag)) groups.set(tag, []);
      groups.get(tag)!.push({ method, path, op, pathParams });
    }
  }

  return (
    <>
      {[...groups.entries()]
        .filter(([, ops]) => ops.length > 0)
        .map(([tag, ops]) => {
          const meta = tagMeta.find((t) => t.name === tag);
          return (
            <div key={tag}>
              <Divider />
              <DocSection id={`api-tag-${tag.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                <DocH2>{tag}</DocH2>
                {meta?.description ? <DocP>{meta.description}</DocP> : null}
                <div className="mt-6">
                  {ops.map((o) => (
                    <Endpoint key={o.method + o.path} {...o} />
                  ))}
                </div>
              </DocSection>
            </div>
          );
        })}
    </>
  );
}

export function ApiReferenceIntro() {
  const doc = spec as AnyObj;
  const count = Object.values(doc.paths as AnyObj).reduce(
    (n, item) => n + METHODS.filter((m) => (item as AnyObj)[m]).length,
    0,
  );
  return (
    <DocSection id="api-reference">
      <DocH2>API reference</DocH2>
      <DocP>
        Every endpoint below is generated from the OpenAPI specification, so it always matches what
        the server actually implements — {count} operations in total. A drift check fails the build
        if a route and the specification disagree.
      </DocP>
      <DocH3>Base URL</DocH3>
      <div className="not-prose mb-6">
        <span
          className="text-[14px]"
          style={{ color: "var(--docs-heading)", fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
        >
          {BASE_URL}
        </span>
      </div>

      <DocH3>Machine-readable</DocH3>
      <DocP>
        Import the specification into Postman, Insomnia, Apidog or Scalar, or use it to generate a
        client library. Agents should start at <Code>llms.txt</Code>.
      </DocP>
      <SpecLinks />
    </DocSection>
  );
}

function SpecLinks() {
  const links = [
    { href: "/openapi/developer-api.yaml", label: "openapi/developer-api.yaml", note: "OpenAPI 3.1, the source of truth" },
    { href: "/openapi/developer-api.json", label: "openapi/developer-api.json", note: "the same specification as JSON" },
    { href: "/llms.txt", label: "llms.txt", note: "orientation for AI agents" },
  ];
  return (
    <div className="not-prose mb-6 space-y-2.5">
      {links.map((l) => (
        <div key={l.href} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <a
            href={l.href}
            className="text-[13.5px] underline-offset-4 hover:underline transition-colors"
            style={{ color: "rgb(185,185,185)", fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
          >
            {l.label}
          </a>
          <span className="text-[12.5px]" style={{ color: "var(--docs-faint)" }}>
            {l.note}
          </span>
        </div>
      ))}
    </div>
  );
}
