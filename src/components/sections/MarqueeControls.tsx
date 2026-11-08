"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Pause/play for the testimonial marquee (WCAG 2.2.2). Also pauses when off-screen. */
export function MarqueeControls({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = ref.current?.closest("section");
    section?.classList.toggle("is-paused", paused);
  }, [paused]);

  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(([e]) => {
      el.querySelectorAll<HTMLElement>(".marquee-track").forEach((t) => {
        t.style.animationPlayState = e.isIntersecting ? "" : "paused";
      });
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative">
      {children}
      <div className="container-page mt-6 flex justify-end">
        <button
          type="button"
          data-marquee-toggle
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="ring-crust/25 hover:bg-parchment inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold ring-1"
        >
          {paused ? (
            <svg aria-hidden viewBox="0 0 16 16" className="size-3.5" fill="currentColor">
              <path d="M4 2.5v11l9-5.5z" />
            </svg>
          ) : (
            <svg aria-hidden viewBox="0 0 16 16" className="size-3.5" fill="currentColor">
              <path d="M4 2h3v12H4zM9 2h3v12H9z" />
            </svg>
          )}
          {paused ? "Play reviews" : "Pause reviews"}
        </button>
      </div>
    </div>
  );
}
