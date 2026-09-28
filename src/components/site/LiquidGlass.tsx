"use client";

import { useEffect, useId, useRef, useState } from "react";

export function LiquidGlass({
  children,
  className,
  scale = 18,
  chromaR = -4,
  chromaG = 0,
  chromaB = 6,
  edge = 0.18,
  edgeBlur = 8,
  innerL = 50,
  innerA = 1,
  finalBlur = 0.5,
  radius = 9999,
}: {
  children: React.ReactNode;
  className?: string;
  scale?: number;
  chromaR?: number;
  chromaG?: number;
  chromaB?: number;
  edge?: number;
  edgeBlur?: number;
  innerL?: number;
  innerA?: number;
  finalBlur?: number;
  radius?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const filterId = `lg-${uid}`;
  const gradXId = `lgx-${uid}`;
  const gradYId = `lgy-${uid}`;

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<SVGFEImageElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const writeMap = () => {
      const rect = wrap.getBoundingClientRect();
      const w = Math.max(2, Math.round(rect.width));
      const h = Math.max(2, Math.round(rect.height));
      const rx = Math.min(radius, h / 2);
      const inset = Math.max(1, Math.round(edge * Math.min(w, h)));

      const svg = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${gradXId}" x1="100%" y1="0%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#0000"/>
      <stop offset="100%" stop-color="red"/>
    </linearGradient>
    <linearGradient id="${gradYId}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0000"/>
      <stop offset="100%" stop-color="blue"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${w}" height="${h}" fill="black"/>
  <rect x="0" y="0" width="${w}" height="${h}" rx="${rx}" fill="url(#${gradXId})"/>
  <rect x="0" y="0" width="${w}" height="${h}" rx="${rx}" fill="url(#${gradYId})" style="mix-blend-mode: screen"/>
  <rect x="${inset}" y="${inset}" width="${w - 2 * inset}" height="${h - 2 * inset}" rx="${Math.max(0, rx - inset)}" fill="hsl(0 0% ${innerL}% / ${innerA})" style="filter:blur(${edgeBlur}px)"/>
</svg>`;

      imgRef.current?.setAttribute(
        "href",
        `data:image/svg+xml,${encodeURIComponent(svg)}`,
      );
    };

    writeMap();
    const ro = new ResizeObserver(() => {
      if ("requestIdleCallback" in window) {
        (window as Window & typeof globalThis).requestIdleCallback(
          () => writeMap(),
          { timeout: 100 },
        );
      } else {
        setTimeout(writeMap, 0);
      }
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [mounted, edge, edgeBlur, innerL, innerA, radius, gradXId, gradYId]);

  const filterStyle: React.CSSProperties = mounted
    ? {
        WebkitBackdropFilter: `url(#${filterId}) saturate(160%)`,
        backdropFilter: `url(#${filterId}) saturate(160%)`,
      }
    : {
        WebkitBackdropFilter: "blur(2px) saturate(170%) contrast(106%)",
        backdropFilter: "blur(2px) saturate(170%) contrast(106%)",
      };

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{
        isolation: "isolate",
        willChange: "backdrop-filter",
        ...filterStyle,
      }}
    >
      <svg
        aria-hidden
        width="0"
        height="0"
        style={{ position: "absolute", width: 0, height: 0 }}
      >
        <defs>
          <filter
            id={filterId}
            colorInterpolationFilters="sRGB"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          >
            <feImage
              ref={imgRef}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="map"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={scale + chromaR}
              xChannelSelector="R"
              yChannelSelector="B"
              result="dispR"
            />
            <feColorMatrix
              in="dispR"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="R"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={scale + chromaG}
              xChannelSelector="R"
              yChannelSelector="B"
              result="dispG"
            />
            <feColorMatrix
              in="dispG"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="G"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={scale + chromaB}
              xChannelSelector="R"
              yChannelSelector="B"
              result="dispB"
            />
            <feColorMatrix
              in="dispB"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="B"
            />
            <feBlend in="R" in2="G" mode="screen" result="rg" />
            <feBlend in="rg" in2="B" mode="screen" result="rgb" />
            <feGaussianBlur in="rgb" stdDeviation={finalBlur} />
          </filter>
        </defs>
      </svg>
      {children}
    </div>
  );
}
