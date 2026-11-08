"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { maps } from "@/content/business";

/** Wraps the illustrated map: starts its draw-in on enter, and swaps in Google's embed on request. */
export function MapEmbedToggle({ children }: { children: ReactNode }) {
  const [live, setLive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = ref.current?.closest(".illustrated-map");
    if (!wrap) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          wrap.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {live ? (
        <iframe
          title="Google Map of 40960 Medley's Neck Rd, Leonardtown, MD"
          src={maps.embed}
          className="aspect-[1.1] w-full rounded-[var(--radius-card)] shadow-lift"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        children
      )}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <span className="text-crust-soft">
          {live ? "Interactive map from Google." : "Tap the map to open it in Google Maps."}
        </span>
        <button
          type="button"
          onClick={() => setLive((v) => !v)}
          className="min-h-11 rounded-full px-4 font-semibold underline decoration-wheat decoration-2 underline-offset-4 hover:decoration-crust"
        >
          {live ? "Show the drawn map" : "Load interactive map"}
        </button>
      </div>
    </div>
  );
}
