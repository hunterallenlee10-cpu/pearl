"use client";
import dynamic from "next/dynamic";

// Loaded after hydration so it never competes with the hero image.
export const HeroParticles = dynamic(
  () => import("@/components/motion/FlourParticles").then((m) => m.FlourParticles),
  { ssr: false },
);
