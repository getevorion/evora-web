import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Evorion 4 Keynote",
  robots: { index: false, follow: false },
};

export default function KeynoteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-theme="dark"
      style={{
        width: "1920px",
        height: "1080px",
        overflow: "hidden",
        background: "#050608",
        color: "#f7f8f8",
        position: "fixed",
        inset: 0,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        textRendering: "geometricPrecision",
        fontSmooth: "always",
      }}
    >
      {children}
    </div>
  );
}
