"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// A gentle curved score across the middle of the screen; the two halves are exact complements.
const WAVE = Array.from({ length: 13 }, (_, i) => {
  const x = (i / 12) * 100;
  const y = 50 + Math.sin((i / 12) * Math.PI * 2.2 + 0.4) * 2.2;
  return `${x.toFixed(1)}% ${y.toFixed(2)}%`;
});
const TOP_CLIP = `polygon(0 0, 100% 0, ${[...WAVE].reverse().join(", ")})`;
const BOTTOM_CLIP = `polygon(${WAVE.join(", ")}, 100% 100%, 0 100%)`;

const KEY = "pearl:proofed";

/**
 * "Proofing…" — first visit per session only, ≤ 1.8s, skippable with any key or click.
 * A dough ball rises, a score is cut across it, it blooms into the wheat sprig, and the screen
 * splits along the score to reveal the hero. Hidden entirely (via the boot script) under
 * reduced motion or once it has played.
 */
export function Preloader() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return <PreloaderInner />;
}

function PreloaderInner() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    if (!el || html.classList.contains("proofed")) {
      html.classList.add("hero-go");
      return;
    }
    const q = <T extends Element>(s: string) => el.querySelector<T>(s)!;
    const dough = q<SVGGElement>("[data-dough]");
    const score = q<SVGPathElement>("[data-score]");
    const sprig = q<SVGGElement>("[data-sprig]");
    const count = q<HTMLSpanElement>("[data-count]");
    const top = q<HTMLDivElement>("[data-top]");
    const bottom = q<HTMLDivElement>("[data-bottom]");
    const ease = "cubic-bezier(.22,1,.36,1)";
    const anims: Animation[] = [];
    let done = false;
    let raf = 0;

    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      html.classList.add("hero-go");
      const opts = { duration: 480, easing: "cubic-bezier(.65,0,.35,1)", fill: "forwards" as const };
      el.querySelector("[data-stage]")?.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 200,
        fill: "forwards",
      });
      top.animate([{ transform: "translateY(0)" }, { transform: "translateY(-102%)" }], opts);
      const last = bottom.animate([{ transform: "translateY(0)" }, { transform: "translateY(102%)" }], opts);
      last.onfinish = () => {
        html.classList.add("proofed");
        el.remove();
      };
    };

    // rise (elastic-ish via keyframe overshoot)
    anims.push(
      dough.animate(
        [
          { transform: "scaleY(.78) scaleX(1.06)", offset: 0 },
          { transform: "scaleY(1.06) scaleX(.97)", offset: 0.62 },
          { transform: "scaleY(.98) scaleX(1.01)", offset: 0.82 },
          { transform: "scaleY(1) scaleX(1)", offset: 1 },
        ],
        { duration: 850, easing: ease, fill: "both" },
      ),
    );
    // counter
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 850);
      count.textContent = String(Math.round(100 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // score + bloom
    anims.push(
      score.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
        duration: 260,
        delay: 850,
        easing: ease,
        fill: "both",
      }),
    );
    anims.push(
      dough.animate([{ opacity: 1 }, { opacity: 0, transform: "scale(.9)" }], {
        duration: 240,
        delay: 1100,
        easing: ease,
        fill: "forwards",
      }),
    );
    const bloom = sprig.animate(
      [
        { opacity: 0, transform: "scale(.6) translateY(10px)" },
        { opacity: 1, transform: "scale(1) translateY(0)" },
      ],
      { duration: 260, delay: 1100, easing: ease, fill: "both" },
    );
    anims.push(bloom);
    const timer = window.setTimeout(finish, 1300);

    const skip = () => finish();
    window.addEventListener("keydown", skip, { once: true });
    el.addEventListener("pointerdown", skip, { once: true });
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", skip);
      anims.forEach((a) => a.cancel());
    };
  }, []);

  const half = "absolute inset-0 bg-flour";
  return (
    <div ref={root} className="preloader fixed inset-0 z-[80] cursor-pointer" role="presentation" aria-hidden>
      {/* the two halves split along a curved score */}
      <div data-top className={half} style={{ clipPath: TOP_CLIP }} />
      <div data-bottom className={half} style={{ clipPath: BOTTOM_CLIP }} />

      <div data-stage className="text-crust absolute inset-0 flex flex-col items-center justify-center">
        <svg viewBox="0 0 200 200" className="h-44 w-44 overflow-visible md:h-60 md:w-60">
          <g data-dough style={{ transformOrigin: "100px 170px", transformBox: "view-box" }}>
            <path
              d="M24 150c-6-52 30-92 76-92s82 40 76 92c-2 14-34 22-76 22s-74-8-76-22z"
              fill="#F3EADB"
              stroke="#5B3A24"
              strokeWidth="3"
            />
            <path
              d="M48 128c10 6 22 8 30 6"
              fill="none"
              stroke="#C99A5B"
              strokeWidth="2"
              strokeLinecap="round"
              opacity=".7"
            />
            <path
              data-score
              d="M62 96c20 20 56 26 84 18"
              fill="none"
              stroke="#5B3A24"
              strokeWidth="4"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
            />
          </g>
          <g
            data-sprig
            style={{ opacity: 0, transformOrigin: "100px 160px", transformBox: "view-box" }}
            fill="none"
            stroke="#C99A5B"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <path d="M100 176V58" />
            {[0, 1, 2, 3].map((i) => {
              const y = 140 - i * 24;
              return (
                <g key={i}>
                  <path
                    d={`M100 ${y}c-13-4-21-16-22-30 13 3 21 14 22 30z`}
                    fill="#C99A5B"
                    fillOpacity=".25"
                  />
                  <path
                    d={`M100 ${y - 6}c13-4 21-16 22-30-13 3-21 14-22 30z`}
                    fill="#C99A5B"
                    fillOpacity=".25"
                  />
                </g>
              );
            })}
            <path d="M100 58c-4-12-3-24 0-36 3 12 4 24 0 36z" fill="#C99A5B" fillOpacity=".25" />
          </g>
        </svg>
        <p className="font-hand mt-6 text-2xl tracking-wide">
          proofing… <span data-count>0</span>%
        </p>
      </div>
      <style>{`
        html:not(.js) .preloader, html.proofed .preloader { display: none; }
      `}</style>
    </div>
  );
}
