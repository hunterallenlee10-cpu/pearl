import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { CutMotion } from "./CutMotion";

// The score runs along the boule's own cut: from near the top-centre to the bottom-centre.
const LEFT = "polygon(0 0, 56% 0, 52% 34%, 47% 66%, 44% 100%, 0 100%)";
const RIGHT = "polygon(56% 0, 100% 0, 100% 100%, 44% 100%, 47% 66%, 52% 34%)";

export function CutItOpen() {
  return (
    <section aria-labelledby="cut-title" className="cut relative bg-flour">
      <CutMotion>
        <div className="container-page grid min-h-[100svh] items-center gap-12 py-24 md:grid-cols-12 md:py-0">
          <div className="md:col-span-5">
            <p className="eyebrow text-wheat-ink" data-reveal>
              Cut it open
            </p>
            <h2 id="cut-title" className="display-lg mt-5">
              <span className="cut-line block" data-reveal style={{ "--reveal-delay": "0.05s" } as React.CSSProperties}>
                Naturally leavened.
              </span>
              <span className="cut-line block" data-reveal style={{ "--reveal-delay": "0.15s" } as React.CSSProperties}>
                Shaped by hand.
              </span>
              <span className="cut-line block italic" data-reveal style={{ "--reveal-delay": "0.25s" } as React.CSSProperties}>
                Baked for the weekend.
              </span>
            </h2>
            <p className="mt-8 max-w-md text-lg text-crust-soft" data-reveal style={{ "--reveal-delay": "0.35s" } as React.CSSProperties}>
              Classic &amp; cinnamon swirl sandwich loaves, almost every weekend.
            </p>
            <Link
              href="/menu#sourdough"
              className="mt-8 inline-flex items-center gap-2 font-semibold underline decoration-wheat decoration-2 underline-offset-4 hover:decoration-crust"
              data-reveal
              style={{ "--reveal-delay": "0.45s" } as React.CSSProperties}
            >
              All the sourdough <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <div
              data-stage
              className="relative mx-auto aspect-[4/5] w-full max-w-[34rem] overflow-hidden rounded-[var(--radius-card)] bg-espresso shadow-lift"
            >
              {/* revealed underneath */}
              <div data-inside className="absolute inset-0">
                <Img
                  id="HERO-cinnamon-swirl-loaf-sliced"
                  fill
                  sizes="(min-width: 768px) 40vw, 92vw"
                  className="h-full w-full"
                  position="28% 50%"
                />
              </div>
              {/* the crust, in two halves that part along the score */}
              <div data-half="l" className="cut-half absolute inset-0" style={{ clipPath: LEFT }}>
                <Img id="HERO-scored-boule-in-hand" fill sizes="(min-width: 768px) 40vw, 92vw" className="h-full w-full" />
              </div>
              <div data-half="r" className="cut-half absolute inset-0" style={{ clipPath: RIGHT }}>
                <Img
                  id="HERO-scored-boule-in-hand"
                  fill
                  sizes="(min-width: 768px) 40vw, 92vw"
                  className="h-full w-full"
                  decorative
                />
              </div>
              {/* the lame */}
              <svg aria-hidden viewBox="0 0 100 125" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
                <path
                  data-score
                  d="M56 -2 C 54 30, 50 60, 44 127"
                  fill="none"
                  stroke="#FBF6EE"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset="1"
                  vectorEffect="non-scaling-stroke"
                  style={{ filter: "drop-shadow(0 0 3px rgb(255 240 210 / .9))" }}
                />
              </svg>
              <p
                data-caption
                className="absolute bottom-4 left-4 rounded-full bg-flour/90 px-3 py-1 font-hand text-xl text-crust opacity-0 shadow-soft"
              >
                the cinnamon swirl inside
              </p>
            </div>
          </div>
        </div>
      </CutMotion>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .cut .cut-half { display: none; }
          .cut [data-score] { display: none; }
          .cut [data-caption] { opacity: 1 !important; }
        }
      `}</style>
    </section>
  );
}
