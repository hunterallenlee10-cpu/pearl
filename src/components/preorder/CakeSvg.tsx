"use client";
import { useMemo } from "react";

export type Sprinkles = "rainbow" | "nonpareils" | "pearls" | "seasonal";

// Seeded random so sprinkles don't jump around on every render.
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

const RAINBOW = ["#e8574a", "#f2a93b", "#f4d35e", "#5cb85c", "#4a90d9", "#a065c9", "#ff8fb1"];

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v + amt)));
  return `#${[c(n >> 16), c((n >> 8) & 255), c(n & 255)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/** Smooth closed path through points (Catmull-Rom → cubic Bézier). */
function smooth(pts: [number, number][]) {
  const n = pts.length;
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + "Z";
}

/** Frosting cap for a roll: an oval top with drips over the front edge. */
function frostingPath(cx: number, y: number, rx: number) {
  const ry = rx * 0.3;
  const R = rx + 5;
  const pts: [number, number][] = [];
  // back edge (top of the oval), left → right
  for (let k = 0; k <= 10; k++) {
    const a = Math.PI + (k / 10) * Math.PI;
    pts.push([cx + Math.cos(a) * R, y + Math.sin(a) * ry * 1.05 - 2]);
  }
  // front edge with drips, right → left
  const drips = Math.max(6, Math.round(rx / 14));
  const r = rng(Math.round(rx));
  for (let k = 1; k < drips * 2; k++) {
    const a = (k / (drips * 2)) * Math.PI;
    const deep = k % 2 === 1 ? 6 + r() * 16 : 1;
    pts.push([cx + Math.cos(a) * R, y + Math.sin(a) * ry + deep]);
  }
  return smooth(pts);
}

/** A stacked cinnamon-roll cake, three tiers, re-coloured live by the builder. */
export function CakeSvg({ frosting, sprinkles, accent }: { frosting: string; sprinkles: Sprinkles; accent: string }) {
  // tiers from bottom to top: cx, top y of the roll, rx, height
  const tiers = [
    { y: 300, rx: 150, h: 70 },
    { y: 210, rx: 118, h: 64 },
    { y: 128, rx: 88, h: 58 },
  ];

  // Sprinkles per tier, rounded so server and browser render identical numbers. Lower tiers only
  // show their front rim (the tier above covers the rest), so their sprinkles sit along the front.
  const dots = useMemo(() => {
    const r = rng(7);
    const q = (n: number) => Math.round(n * 10) / 10;
    return tiers.map((t, ti) => {
      const top = ti === tiers.length - 1;
      return Array.from({ length: top ? 30 : 22 }, () => {
        const a = top ? r() * Math.PI * 2 : 0.15 + r() * (Math.PI - 0.3);
        const d = top ? Math.sqrt(r()) * 0.88 : 0.72 + r() * 0.24;
        return {
          x: q(200 + Math.cos(a) * t.rx * d),
          y: q(t.y - 2 + Math.sin(a) * t.rx * 0.3 * d),
          rot: Math.round(r() * 180),
          c: Math.floor(r() * 7),
          s: q(r()),
        };
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const frostDark = shade(frosting, -28);
  const frostLight = shade(frosting, 22);

  return (
    <svg viewBox="0 0 400 420" className="h-auto w-full" role="img" aria-label="Preview of your cinnamon roll cake">
      <defs>
        <linearGradient id="roll" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E3A65E" />
          <stop offset="1" stopColor="#B9762F" />
        </linearGradient>
        <radialGradient id="pearl-sheen" cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#fff" />
          <stop offset=".6" stopColor="#efe6f0" />
          <stop offset="1" stopColor="#cfd8de" />
        </radialGradient>
      </defs>
      {/* plate */}
      <ellipse cx="200" cy="384" rx="186" ry="24" fill="#5B3A24" opacity=".12" />
      <ellipse cx="200" cy="376" rx="178" ry="22" fill="#FBF6EE" stroke="#5B3A24" strokeOpacity=".25" strokeWidth="2" />

      {tiers.map((t, i) => (
        <g key={i}>
          {/* roll body */}
          <path
            d={`M${200 - t.rx} ${t.y} v${t.h} a${t.rx} ${t.rx * 0.3} 0 0 0 ${t.rx * 2} 0 v${-t.h} z`}
            fill="url(#roll)"
            stroke="#8A5226"
            strokeWidth="2"
          />
          {/* swirl seams on the side */}
          {[0.25, 0.5, 0.75].map((f) => (
            <path
              key={f}
              d={`M${200 - t.rx + 6} ${t.y + t.h * f} q${t.rx} ${t.rx * 0.2} ${t.rx * 2 - 12} 0`}
              fill="none"
              stroke="#8A5226"
              strokeOpacity=".55"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ))}
          {/* frosting top + drips */}
          <g style={{ transition: "fill .4s" }}>
            <path
              d={frostingPath(200, t.y, t.rx)}
              fill={frosting}
              stroke={frostDark}
              strokeWidth="1.5"
              style={{ transition: "fill .4s, stroke .4s" }}
            />
            <ellipse cx={200 - t.rx * 0.3} cy={t.y - t.rx * 0.12} rx={t.rx * 0.35} ry={t.rx * 0.06} fill={frostLight} opacity=".7" style={{ transition: "fill .4s" }} />
          </g>
          {/* sprinkles */}
          <g key={sprinkles} className="cake-sprinkles">
            {dots[i].map((d, k) => {
              const style = { animationDelay: `${(k % 20) * 18 + i * 60}ms` };
              if (sprinkles === "rainbow")
                return <rect key={k} x={d.x - 4} y={d.y - 1.5} width="8" height="3" rx="1.5" fill={RAINBOW[d.c]} transform={`rotate(${d.rot} ${d.x} ${d.y})`} style={style} />;
              if (sprinkles === "nonpareils") return <circle key={k} cx={d.x} cy={d.y} r="1.9" fill={RAINBOW[d.c]} style={style} />;
              if (sprinkles === "pearls")
                return k % 2 ? <circle key={k} cx={d.x} cy={d.y} r={2.6 + d.s * 1.6} fill="url(#pearl-sheen)" stroke="#bfc8ce" strokeWidth=".5" style={style} /> : null;
              return k % 2 ? (
                <path key={k} d="M0 -5 L1.5 -1.5 5 -1.5 2.2 .8 3.2 4.5 0 2.3 -3.2 4.5 -2.2 .8 -5 -1.5 -1.5 -1.5Z" fill={accent} transform={`translate(${d.x} ${d.y}) rotate(${d.rot})`} style={style} />
              ) : null;
            })}
          </g>
        </g>
      ))}

      <style>{`
        .cake-sprinkles > * { animation: sprinkle-fall .55s cubic-bezier(.22,1,.36,1) both; }
        @keyframes sprinkle-fall { from { opacity: 0; translate: 0 -22px; } to { opacity: 1; translate: 0 0; } }
        @media (prefers-reduced-motion: reduce) { .cake-sprinkles > * { animation: none; } }
      `}</style>
    </svg>
  );
}
