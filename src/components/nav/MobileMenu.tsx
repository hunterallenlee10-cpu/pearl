"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { business } from "@/content/business";
import { getLenis } from "@/components/motion/gsap";
import { StatusPill } from "./StatusPill";
import { navLinks } from "./nav-links";

/** Full-screen menu that opens like the top of a kraft-paper bag being unfolded. */
export function MobileMenu({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !ref.current) return;
      const f = ref.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenis?.start();
      prevFocus?.focus?.();
    };
  }, [open, onClose]);

  return (
    <div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      hidden={!open}
      className="kraft text-crust fixed inset-0 z-[70] flex flex-col lg:hidden"
      style={{ animation: open ? "bag-open 0.7s var(--ease-dough) both" : undefined }}
    >
      {/* serrated bag edge */}
      <div
        aria-hidden
        className="absolute inset-x-0 -bottom-3 h-3"
        style={{
          background: "linear-gradient(-45deg, transparent 6px, #e2cfae 0) 0 0 / 12px 12px repeat-x",
        }}
      />
      <div className="container-page flex h-(--nav-h) items-center justify-between">
        <span className="font-display text-2xl">Pearl Bakery</span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 font-medium"
        >
          Close
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <nav aria-label="Mobile" className="container-page flex flex-1 flex-col justify-center">
        <ul className="space-y-1">
          {[{ href: "/", label: "Home" }, ...navLinks].map((l, i) => (
            <li
              key={l.href}
              style={{
                animation: open ? `menu-rise 0.8s var(--ease-dough) ${0.12 + i * 0.06}s both` : undefined,
              }}
            >
              <Link
                href={l.href}
                onClick={onClose}
                aria-current={
                  (l.href === "/" ? pathname === "/" : pathname.startsWith(l.href)) ? "page" : undefined
                }
                className="font-display block py-1 text-[clamp(2.75rem,13vw,4.5rem)] leading-[1.05] no-underline aria-[current=page]:italic"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="container-page border-crust/20 space-y-3 border-t py-6">
        <StatusPill tone="light" />
        <p className="font-medium">{business.hours.line}</p>
        <p className="text-crust-soft">{business.address.oneLine}</p>
      </div>
      <style>{`
        @keyframes bag-open { from { clip-path: polygon(0 0,100% 0,100% 0,0 0); } to { clip-path: polygon(0 0,100% 0,100% 100%,0 100%); } }
        @keyframes menu-rise { from { opacity: 0; transform: translateY(40%); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { #mobile-menu, #mobile-menu li { animation: none !important; } }
      `}</style>
    </div>
  );
}
