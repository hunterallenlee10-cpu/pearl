"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Category chips for the rotating menu. Without JS every category simply shows; with JS the
 * chips filter, and a #hash (e.g. /menu#cookies) preselects a category.
 */
export function MenuFilter({
  categories,
  children,
}: {
  categories: { id: string; label: string }[];
  children: ReactNode;
}) {
  const [active, setActive] = useState<string>("all");
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fromHash = () => {
      const h = decodeURIComponent(window.location.hash.slice(1));
      if (categories.some((c) => c.id === h)) setActive(h);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [categories]);

  useEffect(() => {
    wrap.current?.querySelectorAll<HTMLElement>("[data-category]").forEach((el) => {
      el.hidden = active !== "all" && el.dataset.category !== active;
    });
  }, [active]);

  const choose = (id: string) => {
    setActive(id);
    history.replaceState(null, "", id === "all" ? window.location.pathname : `#${id}`);
  };

  const chips = [{ id: "all", label: "Everything" }, ...categories];
  return (
    <div ref={wrap}>
      <div
        role="group"
        aria-label="Filter the menu"
        className="sticky top-[calc(var(--nav-h)+0.5rem)] z-20 -mx-[var(--gutter)] mt-10 flex [scrollbar-width:none] gap-2 overflow-x-auto px-[var(--gutter)] py-3"
      >
        {chips.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={active === c.id}
            onClick={() => choose(c.id)}
            className="bg-flour/90 ring-crust/20 aria-pressed:bg-crust aria-pressed:text-flour aria-pressed:ring-crust min-h-11 shrink-0 rounded-full px-4 font-semibold ring-1 backdrop-blur transition-colors"
          >
            {c.label}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {active === "all" ? "Showing everything" : `Showing ${chips.find((c) => c.id === active)?.label}`}
      </p>
      {children}
    </div>
  );
}
