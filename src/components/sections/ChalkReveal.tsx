"use client";
import { useEffect, useRef, type ReactNode } from "react";

/** Adds .is-in once the board scrolls into view, which starts the chalk-writing animation. */
export function ChalkReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="chalk-reveal">
      {children}
    </div>
  );
}
