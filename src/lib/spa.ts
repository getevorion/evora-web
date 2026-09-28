export function spaHref(path: string): string {
  const raw = process.env.NEXT_PUBLIC_EVORA_APP_ORIGIN;
  if (!raw || typeof raw !== "string") return path;
  const origin = raw.trim().replace(/\/+$/, "");
  if (!origin) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${p}`;
}
