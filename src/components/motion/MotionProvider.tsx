"use client";
import { useEffect } from "react";
import { usePath } from "@/lib/use-path";
import { setLenis, loadGsap, prefersReducedMotion } from "./gsap";

/**
 * - Smooth scrolling with Lenis on desktop pointers only (native scroll on touch), never under
 *   reduced motion.
 * - Reveals [data-reveal] elements once as they scroll into view.
 * - Refreshes ScrollTrigger after fonts and route changes.
 */
export function MotionProvider() {
  const pathname = usePath();

  // Lenis
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    if (!fine || prefersReducedMotion()) return;
    let raf = 0;
    let lenis: import("lenis").default | null = null;
    let stopped = false;
    import("lenis").then(({ default: Lenis }) => {
      if (stopped) return;
      lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95, smoothWheel: true, anchors: { offset: -80 } });
      setLenis(lenis);
      const loop = (t: number) => {
        lenis?.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  // Reveal-once observer (re-scans on navigation). Content is never hidden before this runs:
  // anything already on screen is marked revealed first, and only then does the
  // html.reveal-ready class hide what's below the fold, ready to animate in.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])"));
    const vh = window.innerHeight;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.setAttribute("data-revealed", "");
    }
    document.documentElement.classList.add("reveal-ready");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.setAttribute("data-revealed", ""));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-revealed", "");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // Keep ScrollTrigger measurements right after fonts load / route changes
  useEffect(() => {
    let alive = true;
    const refresh = () => loadGsap().then(({ ScrollTrigger }) => alive && ScrollTrigger.refresh());
    document.fonts?.ready.then(refresh);
    const t = window.setTimeout(refresh, 600);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [pathname]);

  return null;
}
