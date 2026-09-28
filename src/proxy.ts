import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROD_CSP_BASE = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",

  "img-src 'self' data: blob: https://*.r2.cloudflarestorage.com https://cdn.discordapp.com https://cdn.evora.lol https://cdn.evora.cx",
  "font-src 'self' https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

  "connect-src 'self' https://api.evora.lol https://evora.lol https://www.evora.lol wss://ws.evora.lol wss://api.evora.lol https://api.evora.cx https://evora.cx https://www.evora.cx wss://ws.evora.cx wss://api.evora.cx https://*.r2.cloudflarestorage.com",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

export function proxy(req: NextRequest) {

  if (process.env.NODE_ENV !== "development" && req.nextUrl.pathname.startsWith("/dev-modals")) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const nonce = crypto.randomUUID().replace(/-/g, "");

  const isDev = process.env.NODE_ENV === "development";
  const scriptSrc = isDev
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`
    : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`;
  const cspValue = `${PROD_CSP_BASE}; ${scriptSrc}`;

  const reqHeaders = new Headers(req.headers);
  reqHeaders.set("x-csp-nonce", nonce);

  reqHeaders.set("Content-Security-Policy", cspValue);

  const res = NextResponse.next({ request: { headers: reqHeaders } });

  res.headers.set("Content-Security-Policy", cspValue);
  res.headers.set("x-csp-nonce", nonce);

  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return res;
}

export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|fonts/|maps/).*)",
  ],
};
