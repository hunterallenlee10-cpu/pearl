"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { useGsap } from "@/components/motion/useGsap";
import { getLenis } from "@/components/motion/gsap";
import type { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Desktop: pins the section and turns vertical scroll into a horizontal track; each loaf spins
 * like a record and its name slides behind at a different speed.
 * Mobile: native swipe row with snap, rotation tied to swipe position.
 * Reduced motion: plain vertical stack (CSS), no JS motion.
 */
export function LoafMotion({ children, count }: { children: ReactNode; count: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);

  useGsap(ref, ({ gsap, reduced, scope }) => {
    if (reduced) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const track = scope.querySelector<HTMLElement>("[data-track]")!;
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", scope);
      const dist = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: scope,
          pin: true,
          scrub: 0.9,
          start: "top top",
          end: () => `+=${dist() * 0.85}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      stRef.current = tween.scrollTrigger ?? null;
      panels.forEach((p) => {
        const spin = p.querySelector("[data-spin]");
        const big = p.querySelector("[data-bigname]");
        const st = { trigger: p, containerAnimation: tween, start: "left right", end: "right left", scrub: true };
        if (spin) gsap.fromTo(spin, { rotate: -70 }, { rotate: 110, ease: "none", scrollTrigger: st });
        if (big) gsap.fromTo(big, { xPercent: 22 }, { xPercent: -22, ease: "none", scrollTrigger: { ...st } });
      });
      return () => {
        stRef.current = null;
      };
    });
    return () => mm.revert();
  });

  // Mobile swipe: rotation follows scroll position.
  useEffect(() => {
    const scope = ref.current!;
    const track = scope.querySelector<HTMLElement>("[data-track]")!;
    const mq = window.matchMedia("(max-width: 767px)");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (!mq.matches) return;
      const mid = track.scrollLeft + track.clientWidth / 2;
      track.querySelectorAll<HTMLElement>("[data-panel]").forEach((p) => {
        const spin = p.querySelector<HTMLElement>("[data-spin]");
        if (!spin) return;
        const c = p.offsetLeft + p.offsetWidth / 2;
        spin.style.transform = `rotate(${((c - mid) / p.offsetWidth) * -90}deg)`;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Keyboard: focusing a loaf scrolls the pinned track to it.
  const onFocus = (e: React.FocusEvent) => {
    const st = stRef.current;
    const panel = (e.target as HTMLElement).closest<HTMLElement>("[data-panel]");
    if (!st || !panel || !ref.current) return;
    const panels = Array.from(ref.current.querySelectorAll("[data-panel]"));
    const i = panels.indexOf(panel);
    const y = st.start + ((st.end - st.start) * i) / (count - 1);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { immediate: true });
    else window.scrollTo({ top: y });
  };

  return (
    <div ref={ref} onFocus={onFocus} className="relative overflow-hidden">
      {children}
    </div>
  );
}
