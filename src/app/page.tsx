import { Hero } from "@/components/sections/Hero";
import { ChalkboardWeekend } from "@/components/sections/ChalkboardWeekend";
import { LoafShowcase } from "@/components/sections/LoafShowcase";
import { CutItOpen } from "@/components/sections/CutItOpen";
import { SweetBento } from "@/components/sections/SweetBento";
import { TrailerToFarmstand } from "@/components/sections/TrailerToFarmstand";
import { StepInside } from "@/components/sections/StepInside";
import { NeighborsSay } from "@/components/sections/NeighborsSay";
import { PreorderTeaser } from "@/components/sections/PreorderTeaser";
import { FindTheFarmstand } from "@/components/sections/FindTheFarmstand";

// Re-render at most every 5 minutes: picks up the weekend menu sheet and pre-order deadlines.
export const revalidate = 300;

// Each section is self-contained: reorder by moving a line.
export default function Home() {
  return (
    <>
      <Hero />
      <ChalkboardWeekend />
      <LoafShowcase />
      <CutItOpen />
      <SweetBento />
      <TrailerToFarmstand />
      <StepInside />
      <NeighborsSay />
      <PreorderTeaser />
      <FindTheFarmstand />
    </>
  );
}
