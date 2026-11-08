"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Desktop-only cursor companion: a small cream dot that grows into a soft circle reading
 * "view" over photos ([data-cursor="view"]) and "↗" over external links. The native cursor stays
 * visible, so nothing is lost if this fails. Off for touch and reduced motion.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<"" | "view" | "external" | "link">("");

  useEffect(() => {
    const ok =
      window.matchMedia("(pointer: fine) and (hover: hover)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(ok);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current!;
    let x = -100,
      y = -100,
      tx = -100,
      ty = -100,
      raf = 0,
      visible = false;
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        visible = true;
        x = tx;
        y = ty;
        el.style.opacity = "1";
      }
      const t = e.target as Element | null;
      const target = t?.closest?.("[data-cursor], a, button, input, select, textarea, label");
      if (!target) return setMode("");
      const explicit = target.getAttribute("data-cursor");
      if (explicit === "view" || explicit === "external") return setMode(explicit);
      if (target instanceof HTMLAnchorElement && target.target === "_blank") return setMode("external");
      setMode("link");
    };
    const leave = () => {
      visible = false;
      el.style.opacity = "0";
    };
    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  const big = mode === "view" || mode === "external";
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[90] opacity-0 transition-opacity duration-300"
      style={{ mixBlendMode: big ? "normal" : "difference" }}
    >
      <div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-display text-[15px] italic transition-[width,height,background-color,color] duration-500 ease-(--ease-dough)"
        style={{
          width: big ? 76 : mode === "link" ? 30 : 10,
          height: big ? 76 : mode === "link" ? 30 : 10,
          background: big ? "rgb(251 246 238 / 0.92)" : "#fbf6ee",
          color: "#5b3a24",
          boxShadow: big ? "0 10px 30px -10px rgb(42 27 18 / 0.45)" : "none",
        }}
      >
        <span className={`transition-opacity duration-300 ${big ? "opacity-100" : "opacity-0"}`}>
          {mode === "external" ? "↗" : "view"}
        </span>
      </div>
    </div>
  );
}
