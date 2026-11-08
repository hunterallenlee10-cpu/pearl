"use client";
import Link from "next/link";
import { useRef, type ComponentProps } from "react";

/** A link that leans toward the pointer (≤ 6px) on desktop. Plain link everywhere else. */
export function MagneticLink({ children, className, ...props }: ComponentProps<typeof Link>) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const dx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const dy = ((e.clientY - r.top) / r.height - 0.5) * 2;
    el.style.transform = `translate(${dx * 6}px, ${dy * 4}px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <Link ref={ref} className={className} onPointerMove={move} onPointerLeave={leave} {...props}>
      {children}
    </Link>
  );
}
