import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public", "evora-white.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(125deg, #0d1c40 0%, #0a1024 34%, #08090a 68%)",
          padding: "76px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={52} height={52} alt="" />
          <div style={{ fontSize: 40, color: "#f4f5f7", letterSpacing: -1.2 }}>
            {SITE.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              fontSize: 68,
              lineHeight: 1.06,
              color: "#ffffff",
              letterSpacing: -2.6,
              maxWidth: 940,
            }}
          >
            {SITE.tagline}
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.42,
              color: "#9a9ba1",
              letterSpacing: -0.6,
              maxWidth: 940,
            }}
          >
            Licensing, sessions, HWID binding, and runtime checks. A dedicated C++ SDK, plus a
            REST API for every other language.
          </div>
        </div>
      </div>
    ),
    size
  );
}
