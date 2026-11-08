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
export function LoafMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);

  useGsap(ref, ({ gsap, reduced, scope }) => {
    if (reduced) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const track = scope.querySelector<HTMLElement>("[data-track]")!;
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", scope);
      // Distance = until the last panel's right edge meets the screen's right edge
      // (scrollWidth would include the overflowing outlined names).
      const last = panels[panels.length - 1];
      const dist = () => Math.max(0, last.offsetLeft + last.offsetWidth - window.innerWidth);
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
        const st = {
          trigger: p,
          containerAnimation: tween,
          start: "left right",
          end: "right left",
          scrub: true,
        };
        if (spin) gsap.fromTo(spin, { rotate: -70 }, { rotate: 110, ease: "none", scrollTrigger: st });
        if (big) {
          gsap.fromTo(big, { xPercent: 22 }, { xPercent: -22, ease: "none", scrollTrigger: { ...st } });
          // only the name of the loaf in the middle shows, so neighbouring names never pile up
          gsap.to(big, { keyframes: { opacity: [0, 0, 1, 0, 0] }, ease: "none", scrollTrigger: { ...st } });
        }
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
    // Centre the focused panel on screen (clamped to the track's ends).
    const lastPanel = panels[panels.length - 1] as HTMLElement;
    const dist = Math.max(1, lastPanel.offsetLeft + lastPanel.offsetWidth - window.innerWidth);
    const p = panel.offsetLeft + panel.offsetWidth / 2 - window.innerWidth / 2;
    const progress = Math.min(1, Math.max(0, p / dist));
    const y = st.start + (st.end - st.start) * progress;
    // Run after the browser's own focus-scroll, which would otherwise nudge the pinned track.
    const go = () => {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
    };
    go();
    requestAnimationFrame(() => requestAnimationFrame(go));
  };

  return (
    <div ref={ref} onFocus={onFocus} className="relative overflow-clip">
      {children}
    </div>
  );
}
