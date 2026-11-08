"use client";
// GSAP + ScrollTrigger are loaded lazily (after first paint) and shared by every section.
import type { gsap as GSAP } from "gsap";
import type { ScrollTrigger as ST } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

export type Gsap = typeof GSAP;
export type ScrollTriggerT = typeof ST;

let loading: Promise<{ gsap: Gsap; ScrollTrigger: ScrollTriggerT }> | null = null;
let lenisRef: Lenis | null = null;
let hooked = false;

export function setLenis(l: Lenis | null) {
  lenisRef = l;
  hooked = false;
  if (loading) loading.then(hookLenis);
}
export function getLenis() {
  return lenisRef;
}

function hookLenis({ gsap, ScrollTrigger }: { gsap: Gsap; ScrollTrigger: ScrollTriggerT }) {
  if (!lenisRef || hooked) return;
  hooked = true;
  lenisRef.on("scroll", ScrollTrigger.update);
}

/** Resolves when the browser has a quiet moment (or after `timeout` ms), so motion setup never
 * competes with the first paint and hydration. */
export function whenIdle(timeout = 1500) {
  return new Promise<void>((resolve) => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    };
    if (w.requestIdleCallback) w.requestIdleCallback(() => resolve(), { timeout });
    else setTimeout(resolve, 200);
  });
}

export function loadGsap() {
  if (!loading) {
    loading = whenIdle()
      .then(() => Promise.all([import("gsap"), import("gsap/ScrollTrigger")]))
      .then(([g, s]) => {
        const gsap = g.gsap;
        const ScrollTrigger = s.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        gsap.defaults({ ease: "expo.out", duration: 0.9 });
        ScrollTrigger.config({ ignoreMobileResize: true });
        const mods = { gsap, ScrollTrigger };
        hookLenis(mods);
        return mods;
      });
  }
  return loading;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
