// Hand-drawn line doodles. Strokes use pathLength=1 so they can be "drawn" by animating
// stroke-dashoffset from 1 to 0 (see .doodle-draw in globals or GSAP in sections).
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { title?: string };

const base = (title?: string) =>
  title
    ? { role: "img" as const, "aria-label": title }
    : { "aria-hidden": true as const, focusable: false as const };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  pathLength: 1,
};

export function WheatSprig({ title, ...p }: P) {
  return (
    <svg viewBox="0 0 60 140" {...base(title)} {...p}>
      <path {...stroke} d="M30 138c0-30 1-62 0-96" />
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 100 - i * 16;
        return (
          <g key={i}>
            <path {...stroke} d={`M30 ${y}c-9-3-15-11-16-21 9 2 15 9 16 21z`} />
            <path {...stroke} d={`M30 ${y - 4}c9-3 15-11 16-21-9 2-15 9-16 21z`} />
          </g>
        );
      })}
      <path {...stroke} d="M30 30c-3-9-2-18 0-27 2 9 3 18 0 27z" />
    </svg>
  );
}

export function LoafDoodle({ title, ...p }: P) {
  return (
    <svg viewBox="0 0 120 80" {...base(title)} {...p}>
      <path {...stroke} d="M8 58c-4-22 14-44 52-46 38-2 56 18 52 42-2 12-18 18-52 18S10 70 8 58z" />
      <path {...stroke} d="M34 30c10 6 18 16 22 30" />
      <path {...stroke} d="M58 24c10 8 16 20 18 34" />
      <path {...stroke} d="M82 28c6 8 10 18 10 28" />
    </svg>
  );
}

export function SwirlDoodle({ title, ...p }: P) {
  return (
    <svg viewBox="0 0 100 100" {...base(title)} {...p}>
      <path
        {...stroke}
        d="M52 50c0-4-5-6-8-3-5 4-1 12 6 12 9 0 14-10 9-18-6-10-21-10-28 0-9 13 1 30 17 30 18 0 30-16 25-33-5-19-27-28-45-18C12 29 6 51 16 67c11 19 38 25 56 13 13-9 19-24 17-38"
      />
    </svg>
  );
}

export function ArrowDoodle({ title, ...p }: P) {
  return (
    <svg viewBox="0 0 120 70" {...base(title)} {...p}>
      <path {...stroke} d="M6 12c24 6 48 20 64 36 10 10 18 12 34 10" />
      <path {...stroke} d="M92 46c6 4 10 8 12 12-5 2-11 3-17 2" />
    </svg>
  );
}

export function ScrollSquiggle({ title, ...p }: P) {
  return (
    <svg viewBox="0 0 40 90" {...base(title)} {...p}>
      <path {...stroke} d="M20 4c-10 8 10 14 0 22s10 14 0 22-10 14 0 22" />
      <path {...stroke} d="M12 74l8 12 8-12" />
    </svg>
  );
}

export function QrDoodle({ title, ...p }: P) {
  return (
    <svg viewBox="0 0 64 64" {...base(title)} {...p}>
      <path {...stroke} d="M6 6h18v18H6zM40 6h18v18H40zM6 40h18v18H6z" />
      <path {...stroke} d="M12 12h6v6h-6zM46 12h6v6h-6zM12 46h6v6h-6z" />
      <path
        {...stroke}
        d="M40 40h6v6M52 40h6M40 52h6v6M52 52v6h6M30 6v8M30 20v6M6 30h8M20 30h10v10M46 30h12"
      />
    </svg>
  );
}

export function EggDoodle({ title, ...p }: P) {
  return (
    <svg viewBox="0 0 64 64" {...base(title)} {...p}>
      <path {...stroke} d="M24 8c-10 0-17 18-17 30 0 10 7 18 17 18s17-8 17-18C41 26 34 8 24 8z" />
      <path {...stroke} d="M44 18c-7 1-11 13-11 21 0 7 5 13 12 13s12-6 12-13c0-8-6-21-13-21z" />
    </svg>
  );
}

export function HoneyDoodle({ title, ...p }: P) {
  return (
    <svg viewBox="0 0 64 64" {...base(title)} {...p}>
      <path {...stroke} d="M18 18h28M20 18c-6 4-8 12-8 22 0 10 6 18 20 18s20-8 20-18c0-10-2-18-8-22" />
      <path {...stroke} d="M22 10h20v8H22z" />
      <path {...stroke} d="M20 36c4 3 8-3 12 0s8 3 12 0" />
    </svg>
  );
}

export function DottedPath({ title, ...p }: P) {
  return (
    <svg viewBox="0 0 300 120" {...base(title)} {...p}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray="0.1 10"
        d="M6 100c40-10 60-60 110-60s60 50 110 40 50-50 70-70"
      />
    </svg>
  );
}

export function UnderlineDoodle({ title, ...p }: P) {
  return (
    <svg viewBox="0 0 200 16" preserveAspectRatio="none" {...base(title)} {...p}>
      <path {...stroke} strokeWidth={3} d="M3 11c40-6 90-9 194-4" />
    </svg>
  );
}
