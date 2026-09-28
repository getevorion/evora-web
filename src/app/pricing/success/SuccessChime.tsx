"use client";

import { useEffect } from "react";

export function SuccessChime() {
  useEffect(() => {
    const AC =
      typeof window !== "undefined"
        ? window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        : undefined;
    if (!AC) return;

    let ctx: AudioContext | null = null;
    let armed = false;

    const ding = () => {
      if (!ctx) return;
      const now = ctx.currentTime;

      const notes = [
        { f: 880.0, at: 0 },
        { f: 1174.66, at: 0.11 },
      ];
      for (const n of notes) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = n.f;
        const start = now + n.at;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.14, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.26);
        osc.connect(gain).connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.3);
      }
    };

    const onGesture = () => {
      if (!ctx) return;
      ctx.resume().then(ding).catch(() => {});
      teardownGesture();
    };
    const teardownGesture = () => {
      if (!armed) return;
      armed = false;
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };

    try {
      ctx = new AC();
      if (ctx.state === "running") {
        ding();
      } else {

        ctx.resume().then(() => {
          if (ctx && ctx.state === "running") ding();
        }).catch(() => {});
        armed = true;
        window.addEventListener("pointerdown", onGesture, { once: true });
        window.addEventListener("keydown", onGesture, { once: true });
      }
    } catch {

    }

    return () => {
      teardownGesture();
      try {
        ctx?.close();
      } catch {

      }
    };
  }, []);

  return null;
}
