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

export function loadGsap() {
  if (!loading) {
    loading = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, s]) => {
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
