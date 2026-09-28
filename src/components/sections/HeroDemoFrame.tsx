"use client";

import dynamic from "next/dynamic";
import "@/components/kit/frame.css";
import "./hero-panel.css";

const EvAppFrame = dynamic(
  () => import("./EvAppFrame").then((m) => m.EvAppFrame),
  {
    ssr: false,
    loading: () => <div className="ev-frame-ssr-slot" aria-hidden />,
  },
);

export function HeroDemoFrame({ heroEntry = true }: { heroEntry?: boolean } = {}) {
  return <EvAppFrame forceReveal heroEntry={heroEntry} />;
}
