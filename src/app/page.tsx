import { Preloader } from "@/components/sections/Preloader";
import { Hero } from "@/components/sections/Hero";
import { ChalkboardWeekend } from "@/components/sections/ChalkboardWeekend";
import { LoafShowcase } from "@/components/sections/LoafShowcase";
import { CutItOpen } from "@/components/sections/CutItOpen";
import { SweetBento } from "@/components/sections/SweetBento";

// Re-render at most every 5 minutes: picks up the weekend menu sheet and pre-order deadlines.
export const revalidate = 300;

// Each section is self-contained: reorder by moving a line.
export default function Home() {
  return (
    <>
      <Preloader />
      <Hero />
      <ChalkboardWeekend />
      <LoafShowcase />
      <CutItOpen />
      <SweetBento />
    </>
  );
}
