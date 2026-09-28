import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { Outfit } from "next/font/google";
import { SITE } from "@/lib/site";
import { SITE_URL, organizationSchema, websiteSchema } from "@/lib/seo";
import { JsonLd } from "@/components/site/JsonLd";
import "./globals.css";
import "@/components/sections/laptop.css";
import { cn } from "@/lib/utils";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import ScrollHint from "@/components/ui/ScrollHint";
import ReferralCapture from "@/components/site/ReferralCapture";
import DomainMigrationBlocker from "@/components/site/DomainMigrationBlocker";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "software licensing",
    "license key api",
    "hwid lock",
    "anti-tamper",
    "anti-debug",
    "software protection",
    "licensing sdk",
    "c++ licensing library",
    "windows app licensing",
    "license management",
  ],
  icons: {
    icon: [{ url: "/evora-white.png", type: "image/png" }],
    shortcut: "/evora-white.png",
    apple: "/evora-white.png",
  },
  referrer: "origin-when-cross-origin",
  verification: { other: { "msvalidate.01": "A0E0D3AF368AC85749020F4B25B349EB" } },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE_URL,
    siteName: SITE.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#030303",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
  auth,
}: Readonly<{ children: React.ReactNode; auth: React.ReactNode }>) {
  void cookies;
  const theme = "dark";

  const nonce = (await headers()).get("x-csp-nonce") ?? undefined;

  return (
    <html lang="en" data-theme={theme} className={cn("h-full", outfit.variable)} suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/inter-variable-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{document.documentElement.setAttribute("data-theme","dark");}catch(e){}})();',
          }}
        />
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html:
              'try{if("scrollRestoration" in history){history.scrollRestoration="manual";}var isReload=false;try{var n=performance.getEntriesByType("navigation")[0];isReload=n&&n.type==="reload";}catch(_){}if(!isReload){try{isReload=performance.navigation&&performance.navigation.type===1;}catch(_){}}if(isReload&&location.hash){try{history.replaceState(null,"",location.pathname+location.search);}catch(_){}}window.scrollTo(0,0);if(isReload){var h=document.documentElement;var prevOverflow=h.style.overflowY;h.style.setProperty("overflow-y","clip","important");var released=false;var rafId=0;var pin=function(){try{window.scrollTo(0,0);}catch(_){}rafId=requestAnimationFrame(pin);};rafId=requestAnimationFrame(pin);var release=function(){if(released)return;released=true;try{cancelAnimationFrame(rafId);}catch(_){}try{window.scrollTo(0,0);}catch(_){}if(prevOverflow){h.style.overflowY=prevOverflow;}else{h.style.removeProperty("overflow-y");}};var onInput=function(){release();};window.addEventListener("wheel",onInput,{passive:true,once:true});window.addEventListener("touchstart",onInput,{passive:true,once:true});window.addEventListener("keydown",onInput,{passive:true,once:true});window.addEventListener("pointerdown",onInput,{passive:true,once:true});window.addEventListener("load",function(){setTimeout(release,250);},{once:true});setTimeout(release,2500);}}catch(_){}',
          }}
        />
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html:
              'try{var isHome=location.pathname==="/";var landed=sessionStorage.getItem("evora_hero_landed")==="1";if(isHome&&landed){document.documentElement.setAttribute("data-hero-landed","1");}if(isHome){sessionStorage.setItem("evora_hero_landed","1");}}catch(_){}',
          }}
        />
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var G='__evora_chunk_reload__';function onErr(e){var msg=(e&&(e.message||(e.reason&&(e.reason.message||e.reason))))||'';var name=(e&&(e.name||(e.reason&&e.reason.name)))||'';if(typeof msg!=='string'){try{msg=String(msg);}catch(_){msg='';}}var isChunk=/ChunkLoadError|Loading chunk|Loading CSS chunk|Failed to load module script|Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(msg)||name==='ChunkLoadError';if(!isChunk)return;var key=G+':'+location.pathname;try{if(sessionStorage.getItem(key)==='1'){return;}sessionStorage.setItem(key,'1');}catch(_){}console.warn('[evora] Detected stale chunk after deploy — hard-refreshing to pick up the new build.');setTimeout(function(){location.reload();},50);}window.addEventListener('error',onErr,true);window.addEventListener('unhandledrejection',onErr,true);}catch(_){}})();",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased font-sans">
        <JsonLd schema={[organizationSchema(), websiteSchema()]} />
        <SmoothScroll />
        <Suspense fallback={null}>
          <ReferralCapture />
        </Suspense>
        <ScrollHint />
        {children}
        <DomainMigrationBlocker />
        {auth}
      </body>
    </html>
  );
}
