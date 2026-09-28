import spec from "../../../public/openapi/developer-api.json";

type AnyObj = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export const METHODS = ["get", "post", "put", "delete", "patch"] as const;
export type Method = (typeof METHODS)[number];

export type Operation = {
  slug: string;
  method: Method;
  path: string;
  summary: string;
  description: string;
  tag: string;
  op: AnyObj;
  pathParams: AnyObj[];
};

export function operationSlug(method: string, path: string): string {
  const cleaned = path
    .replace(/[{}]/g, "")
    .replace(/[^a-zA-Z0-9/]+/g, "-")
    .split("/")
    .filter(Boolean)
    .join("-")
    .toLowerCase();
  return `api-${method.toLowerCase()}-${cleaned}`;
}

export function routeSlug(method: string, path: string): string {
  return operationSlug(method, path).replace(/^api-/, "");
}

let cached: Operation[] | null = null;

export function allOperations(): Operation[] {
  if (cached) return cached;
  const doc = spec as AnyObj;
  const out: Operation[] = [];
  for (const [path, itemRaw] of Object.entries(doc.paths as AnyObj)) {
    const item = itemRaw as AnyObj;
    const pathParams: AnyObj[] = item.parameters ?? [];
    for (const method of METHODS) {
      const op = item[method];
      if (!op) continue;
      out.push({
        slug: routeSlug(method, path),
        method,
        path,
        summary: String(op.summary ?? `${method.toUpperCase()} ${path}`),

        description: String(op.description ?? "")
          .replace(/\*\*Scope:\*\*\s*`[^`]*`/g, "")
          .replace(/\s+/g, " ")
          .trim(),
        tag: (op.tags ?? ["Other"])[0],
        op,
        pathParams,
      });
    }
  }
  cached = out;
  return out;
}

export function operationBySlug(slug: string): Operation | undefined {
  return allOperations().find((o) => o.slug === slug);
}

export function operationsByTag(): Array<{ tag: string; description: string; ops: Operation[] }> {
  const doc = spec as AnyObj;
  const tagMeta: AnyObj[] = doc.tags ?? [];
  const order = new Map<string, { tag: string; description: string; ops: Operation[] }>();
  for (const t of tagMeta) {
    order.set(t.name, { tag: t.name, description: String(t.description ?? ""), ops: [] });
  }
  for (const o of allOperations()) {
    if (!order.has(o.tag)) order.set(o.tag, { tag: o.tag, description: "", ops: [] });
    order.get(o.tag)!.ops.push(o);
  }
  return [...order.values()].filter((g) => g.ops.length > 0);
}

export function tagSlug(tag: string): string {
  return tag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const BASE_URL: string =
  (spec as AnyObj).servers?.[0]?.url ?? "https://api.evora.cx/api/developer-api";
