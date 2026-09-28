"use client";

import dynamic from "next/dynamic";

const Dither = dynamic(() => import("./Dither"), { ssr: false });

export function DitherStrip() {
  return (
    <Dither
      waveSpeed={0.05}
      waveFrequency={3}
      waveAmplitude={0.3}
      waveColor={[0.6, 0.6, 0.6]}
      colorNum={4}
      pixelSize={2}
      enableMouseInteraction
      mouseRadius={0.7}
    />
  );
}
