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
      // A clean wipe (no muddy double exposure) that is finished by the time the photo is
      // centred on screen, so you always see both photos crisp, then the farmstand.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: morph, start: "top 75%", end: "center 55%", scrub: 0.5 },
      });
      tl.fromTo(
        morph.querySelector("[data-morph-to]"),
        { clipPath: "inset(0% 0% 0% 100%)" },
        { clipPath: "inset(0% 0% 0% 0%)", ease: "power1.inOut" },
        0,
      )
        .fromTo(
          morph.querySelector("[data-morph-edge]"),
          { left: "100%", opacity: 1 },
          { left: "0%", ease: "power1.inOut" },
          0,
        )
        .to(morph.querySelector("[data-morph-edge]"), { opacity: 0, duration: 0.1 }, 0.95);
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
