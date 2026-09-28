"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { motion } from "motion/react";
import { Logo } from "@/components/site/Logo";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site";
import {
  MagnifyingGlass,
  WifiHigh,
  BatteryHigh,
} from "@phosphor-icons/react/dist/ssr";
import { EvAppFrame } from "./EvAppFrame";

const SHINE_EASE = [0.455, 0.03, 0.515, 0.955] as const;

const APP_W = 1320;
const APP_H = 720;

type Box = { k: number };

export function LaptopFrame() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<HTMLDivElement | null>(null);
  const [box, setBox] = useState<Box>({ k: 0.6 });

  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ px: number; py: number; bx: number; by: number } | null>(null);

  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches,
  );

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const compute = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;

      const k = Math.max(0.2, Math.min((w * 0.92) / APP_W, (h * 0.94) / APP_H));
      setBox({ k });
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function clampDrag(nx: number, ny: number) {
    const wrap = wrapRef.current;
    const app = appRef.current;
    if (!wrap || !app) return { x: nx, y: ny };

    const cw = wrap.clientWidth, ch = wrap.clientHeight;
    const aw = app.offsetWidth, ah = app.offsetHeight;
    const restLeft = (cw - aw) / 2;
    const restTop = (ch - ah) / 2;
    const KEEP = 48;
    const minX = KEEP - restLeft - aw;
    const maxX = cw - KEEP - restLeft;
    const minY = KEEP - restTop - ah;
    const maxY = ch - KEEP - restTop;
    return { x: Math.min(maxX, Math.max(minX, nx)), y: Math.min(maxY, Math.max(minY, ny)) };
  }

  useEffect(() => {
    setDrag((d) => {
      const c = clampDrag(d.x, d.y);
      return c.x === d.x && c.y === d.y ? d : c;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [box]);

  function onAppPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    dragRef.current = { px: e.clientX, py: e.clientY, bx: drag.x, by: drag.y };
    setDragging(true);
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
  }
  function onAppPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const s = dragRef.current;
    if (!s) return;
    setDrag(clampDrag(s.bx + (e.clientX - s.px), s.by + (e.clientY - s.py)));
  }
  function onAppPointerEnd(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;
    dragRef.current = null;
    setDragging(false);
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
  }

  if (isMobile) {
    return <EvAppFrame />;
  }

  return (

    <motion.div
      className="mac"
      initial={{ "--lap-shade": 1 }}
      animate={{ "--lap-shade": [1, 1, 0] }}
      transition={{ duration: 1.7, times: [0, 0.68, 1], ease: [0.4, 0, 0.2, 1] }}
    >

      <a href={SITE.links.signUp} className="lap-callout">
        Try free, no charge
        <ArrowRight className="hero-demo-callout-arrow" strokeWidth={1.5} aria-hidden />
      </a>

      <div className="lap-lid">

        <div className="lap-lid-rim-shade" aria-hidden />

        <motion.div
          className="lap-shine-group"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.7, delay: 0.4 }}
        >
          <motion.div
            className="lap-shine"
            style={{ "--mask-x": "0%", "--mask-y": "25%" } as CSSProperties}
            animate={{ "--mask-x": ["0%", "3%", "8%"], "--mask-y": ["25%", "4%", "0%"] }}
            transition={{ duration: 0.75, delay: 0.45, ease: SHINE_EASE, times: [0, 0.5, 1] }}
          />
        </motion.div>
        <motion.div
          className="lap-shine-group"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 1.5, delay: 0.7 }}
        >
          <div
            className="lap-shine"
            style={{ "--mask-x": "0%", "--mask-y": "0%" } as CSSProperties}
          />
        </motion.div>

        <div className="lap-bezel">

          <div className="lap-bezel-shade" aria-hidden />
          <div className="lap-display">
            <div className="lap-wall" aria-hidden />
            <div className="lap-scrim" aria-hidden />

            <div className="lap-menubar" aria-hidden>
              <div className="lap-menubar-left">
                <span className="lap-menubar-logo">
                  <Logo size={12} withWordmark={false} />
                </span>
                <span className="lap-menubar-app">Evorion</span>
                <span className="lap-menubar-item">File</span>
                <span className="lap-menubar-item">Edit</span>
                <span className="lap-menubar-item">View</span>
                <span className="lap-menubar-item">Window</span>
                <span className="lap-menubar-item">Help</span>
              </div>
              <div className="lap-menubar-right">
                <BatteryHigh weight="fill" className="lap-menubar-glyph" />
                <WifiHigh weight="bold" className="lap-menubar-glyph" />
                <MagnifyingGlass weight="bold" className="lap-menubar-glyph" />
                <span className="lap-menubar-clock">Fri 9:41 AM</span>
              </div>
            </div>

            <div className="lap-screen-shade" aria-hidden />

            <div className="lap-appwrap" ref={wrapRef}>
              <div
                ref={appRef}
                className="lap-app"
                style={{

                  transform: `translate(${drag.x}px, ${drag.y}px)`,
                  cursor: dragging ? "grabbing" : "grab",
                  touchAction: "none",
                  userSelect: dragging ? "none" : undefined,
                }}
                onPointerDown={onAppPointerDown}
                onPointerMove={onAppPointerMove}
                onPointerUp={onAppPointerEnd}
                onPointerCancel={onAppPointerEnd}
              >

                <div
                  className="lap-app-scale"
                  style={{ width: APP_W, zoom: box.k }}
                >
                  <EvAppFrame forceReveal />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lap-hinge" aria-hidden>
        <div className="lap-hinge-shade" aria-hidden />
      </div>
      <div className="lap-base" aria-hidden>
        <div className="lap-base-notch" />
        <div className="lap-base-shade" aria-hidden />
      </div>
    </motion.div>
  );
}
