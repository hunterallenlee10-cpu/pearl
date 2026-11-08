"use client";
import { useRef, type ReactNode } from "react";
import { useGsap } from "@/components/motion/useGsap";

/** Draws the timeline line as you scroll and morphs the trailer photo into the new shed. */
export function TimelineMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGsap(ref, ({ gsap, reduced, scope }) => {
    if (reduced) return;
    const line = scope.querySelector("[data-line]");
    const list = scope.querySelector("ol");
    if (line && list) {
      gsap.fromTo(
        line,
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: list, start: "top 70%", end: "bottom 60%", scrub: 0.6 },
        },
      );
    }
    const morph = scope.querySelector("[data-morph]");
    if (morph) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: morph, start: "top 75%", end: "bottom 45%", scrub: 0.8 },
      });
      tl.fromTo(
        morph.querySelector("[data-morph-to]"),
        { opacity: 0, scale: 1.08, filter: "blur(8px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", ease: "none" },
        0,
      )
        .to(morph.querySelector("[data-label-from]"), { opacity: 0, ease: "none", duration: 0.3 }, 0.4)
        .fromTo(
          morph.querySelector("[data-label-to]"),
          { opacity: 0 },
          { opacity: 1, ease: "none", duration: 0.3 },
          0.6,
        );
      const dots = scope.querySelector("[data-dots]");
      if (dots)
        gsap.fromTo(
          dots,
          { strokeDashoffset: 60 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: morph, start: "top 85%", end: "top 40%", scrub: true },
          },
        );
    }
  });
  return <div ref={ref}>{children}</div>;
}
