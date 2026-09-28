import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
];

const isDev = process.env.NODE_ENV !== "production";

const config: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  ...(isDev ? { watchOptions: { pollIntervalMs: 1000 } } : {}),
  turbopack: {
    root: __dirname,
  },
  experimental: {
    optimizePackageImports: [
      "@phosphor-icons/react/dist/ssr",
      "@phosphor-icons/react",
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-tooltip",
      "@tanstack/react-query",
    ],
    ...(isDev ? { preloadEntriesOnStart: true } : {}),
    ...(isDev ? { turbopackFileSystemCacheForDev: false } : {}),
  },
  ...(isDev ? {
    onDemandEntries: {
      maxInactiveAge: 60 * 60 * 1000,
      pagesBufferLength: 100,
    },
  } : {}),
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    qualities: [75, 95],
  },
  async rewrites() {
    if (process.env.NODE_ENV === "production") return [];
    return {
      beforeFiles: [],
      afterFiles: [{ source: "/api/:path*", destination: "https://api.evora.lol/api/:path*" }],
      fallback: [],
    };
  },
  async redirects() {
    return [
      { source: "/updates/4", destination: "/updates/4/hydra", permanent: false },
      { source: "/updates/4-umbra", destination: "/updates/4/umbra", permanent: true },
      { source: "/updates/4-denali", destination: "/updates/4/denali", permanent: true },
      { source: "/login", destination: "/signin", permanent: true },
      { source: "/register", destination: "/signup", permanent: true },
    ];
  },
  async headers() {
    const isDev = process.env.NODE_ENV !== "production";
    const noStore = [
      { key: "Cache-Control", value: "no-store, must-revalidate" },
      { key: "Pragma", value: "no-cache" },
      { key: "Expires", value: "0" },
    ];
    return [
      {
        source: "/:path*",
        headers: isDev ? [...securityHeaders, ...noStore] : securityHeaders,
      },
    ];
  },
};

export default config;
