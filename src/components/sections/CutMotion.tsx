"use client";
import { useRef, type ReactNode } from "react";
import { useGsap } from "@/components/motion/useGsap";

/** Desktop: short pin, scroll scrubs the blade then parts the crust. Mobile: plays once on enter. */
export function CutMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGsap(ref, ({ gsap, reduced, scope }) => {
    if (reduced) return;
    const score = scope.querySelector("[data-score]");
    const l = scope.querySelector("[data-half='l']");
    const r = scope.querySelector("[data-half='r']");
    const inside = scope.querySelector("[data-inside]");
    const caption = scope.querySelector("[data-caption]");
    const build = (tl: gsap.core.Timeline) =>
      tl
        .fromTo(score, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.35, ease: "power2.inOut" })
        .fromTo(
          inside,
          { scale: 1.15, filter: "brightness(.6)" },
          { scale: 1, filter: "brightness(1)", duration: 0.65, ease: "power2.out" },
          0.3,
        )
        .to(l, { xPercent: -62, rotate: -4, duration: 0.65, ease: "power3.inOut" }, 0.3)
        .to(r, { xPercent: 62, rotate: 4, duration: 0.65, ease: "power3.inOut" }, 0.3)
        .to(score, { opacity: 0, duration: 0.15 }, 0.38)
        .to(caption, { opacity: 1, y: 0, duration: 0.2 }, 0.8);

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      build(
        gsap.timeline({
          scrollTrigger: {
            trigger: scope,
            start: "top top",
            end: "+=110%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        }),
      );
    });
    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline({ paused: true });
      build(tl);
      tl.duration(1.8);
      gsap.timeline({
        scrollTrigger: {
          trigger: scope.querySelector("[data-stage]"),
          start: "top 65%",
          once: true,
          onEnter: () => tl.play(),
        },
      });
    });
    return () => mm.revert();
  });
  return <div ref={ref}>{children}</div>;
}
