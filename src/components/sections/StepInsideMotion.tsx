"use client";
import { useRef, type ReactNode } from "react";
import { useGsap } from "@/components/motion/useGsap";

/**
 * Day turns to night: the section fades from flour to espresso, the photo dims, and the string
 * lights switch on one by one. Desktop scrubs it with a pin; mobile plays it once on enter.
 */
export function StepInsideMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGsap(ref, ({ gsap, reduced, scope }) => {
    const section = scope.closest("section")!;
    if (reduced) {
      section.classList.add("is-night", "on-dark");
      return;
    }
    const bg = scope.querySelector("[data-bg]");
    const photo = scope.querySelector("[data-photo]");
    const dusk = scope.querySelector("[data-dusk]");
    const bulbs = gsap.utils.toArray<HTMLElement>("[data-bulb]", scope);
    const copy = gsap.utils.toArray<HTMLElement>("[data-copy]", scope);
    const cards = gsap.utils.toArray<HTMLElement>("[data-card]", scope);

    const build = (tl: gsap.core.Timeline) => {
      tl.to(bg, { backgroundColor: "#2A1B12", duration: 1, ease: "none" }, 0)
        .to(section, { color: "#FBF6EE", duration: 0.6, ease: "none" }, 0.3)
        .to(photo, { filter: "brightness(.58) saturate(1.1)", duration: 1, ease: "none" }, 0)
        .to(dusk, { opacity: 1, duration: 1, ease: "none" }, 0)
        .call(() => section.classList.add("is-night", "on-dark"), [], 0.5)
        .call(() => section.classList.remove("is-night", "on-dark"), [], 0.49)
        .to(bulbs, { opacity: 1, duration: 0.12, stagger: 0.07, ease: "power2.in" }, 0.55)
        .to(scope.querySelector("[data-bloom]"), { opacity: 1, duration: 0.5, ease: "power1.in" }, 0.6)
        .call(() => section.classList.add("is-lit"), [], 1.1)
        .fromTo(
          copy,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power3.out" },
          0.2,
        )
        .fromTo(
          cards,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power3.out" },
          0.9,
        );
      return tl;
    };

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      build(
        gsap.timeline({
          // Pin our own wrapper, not the <section>: the pin wraps the pinned element in a spacer,
          // and React must still find the section where it put it when the page changes.
          scrollTrigger: {
            trigger: scope,
            start: "top top",
            end: "+=180%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        }),
      );
    });
    mm.add("(max-width: 767px)", () => {
      const tl = build(gsap.timeline({ paused: true }));
      tl.duration(2.4);
      gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 55%", once: true, onEnter: () => tl.play() },
      });
    });
    return () => mm.revert();
  });
  return (
    <div ref={ref} className="relative isolate">
      {children}
    </div>
  );
}
