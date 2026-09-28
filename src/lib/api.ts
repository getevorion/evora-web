export function apiBase(): string {
  if (typeof window === "undefined") return "";
  const override = process.env.NEXT_PUBLIC_API_BASE;
  if (override) return override.replace(/\/+$/, "");
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return "";
  }
  if (
    host === "evora.lol" || host === "www.evora.lol" || host.endsWith(".evora.lol") ||
    host === "evora.cx"  || host === "www.evora.cx"  || host.endsWith(".evora.cx")
  ) {
    return "";
  }
  return "https://api.evora.lol";
}

export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const base = apiBase();
  if (base && p.startsWith("/api/")) return base + p;
  return p;
}
