import { getWeekendBoard, formatUpdated } from "@/lib/weekend-menu";
import { business } from "@/content/business";
import type { WeekendGroup } from "@/content/menu";
import { ChalkReveal } from "./ChalkReveal";

const GROUPS: { id: WeekendGroup; label: string }[] = [
  { id: "Sourdough", label: "Sourdough" },
  { id: "Baked goods", label: "Baked goods" },
  { id: "Also at the stand", label: "Also at the stand" },
];

export async function ChalkboardWeekend({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const board = await getWeekendBoard();
  const H = headingLevel === 1 ? "h1" : "h2";
  let n = 0;

  return (
    <section aria-labelledby="weekend-title" className="relative overflow-hidden bg-flour py-24 md:py-32">
      <div className="container-page">
        <ChalkReveal>
          <div className="board relative mx-auto max-w-6xl rounded-[18px] p-3 shadow-lift md:p-5">
            <div className="chalk relative overflow-hidden rounded-[10px] px-6 pt-10 pb-12 text-chalk md:px-14 md:pt-14 md:pb-16">
              <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
                <H id="weekend-title" className="chalk-line font-hand text-[clamp(2.75rem,6vw,5rem)] leading-[0.95] font-bold">
                  This Weekend at the Stand
                </H>
                <p className="chalk-line font-hand text-2xl text-chalk/80" style={{ "--n": 1 } as React.CSSProperties}>
                  Updated {formatUpdated(board.updated)}
                </p>
              </div>
              <svg aria-hidden viewBox="0 0 600 14" preserveAspectRatio="none" className="chalk-doodle mt-3 h-3 w-full max-w-xl text-chalk/70">
                <path d="M2 9c90-6 220-8 380-4s160 3 216-1" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" pathLength={1} />
              </svg>

              <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-12">
                {GROUPS.map((g) => {
                  const items = board.items.filter((i) => i.group === g.id);
                  if (!items.length) return null;
                  return (
                    <div key={g.id}>
                      <h3
                        className="chalk-line font-hand text-[2rem] leading-none font-bold text-wheat"
                        style={{ "--n": ++n } as React.CSSProperties}
                      >
                        {g.label}
                        {g.id === "Also at the stand" && <span className="font-medium text-chalk/70"> (eggs, honey)</span>}
                      </h3>
                      <ul className="mt-4 space-y-2.5">
                        {items.map((it) => (
                          <li
                            key={it.item}
                            className="chalk-line font-hand text-[1.7rem] leading-tight"
                            style={{ "--n": ++n } as React.CSSProperties}
                          >
                            <span className={it.available ? "" : "text-chalk/50 line-through decoration-2"}>{it.item}</span>
                            {!it.available && <span className="ml-2 text-xl text-wheat">sold out!</span>}
                            {it.badge && it.available && (
                              <span className="ml-2 inline-block -rotate-3 rounded-full border-2 border-chalk/60 px-2 text-lg leading-snug text-chalk/90">
                                {it.badge}
                              </span>
                            )}
                            {it.note && <span className="block text-xl text-chalk/70">{it.note}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* doodles */}
              <svg aria-hidden viewBox="0 0 120 80" className="chalk-doodle absolute right-8 bottom-8 hidden w-28 text-chalk/60 md:block">
                <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path pathLength={1} d="M8 58c-4-22 14-44 52-46 38-2 56 18 52 42-2 12-18 18-52 18S10 70 8 58z" />
                  <path pathLength={1} d="M34 30c10 6 18 16 22 30M58 24c10 8 16 20 18 34M82 28c6 8 10 18 10 28" />
                </g>
              </svg>
              <svg aria-hidden viewBox="0 0 100 100" className="chalk-doodle absolute top-1/2 right-12 hidden w-16 text-wheat/70 lg:block">
                <path
                  pathLength={1}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  d="M52 50c0-4-5-6-8-3-5 4-1 12 6 12 9 0 14-10 9-18-6-10-21-10-28 0-9 13 1 30 17 30 18 0 30-16 25-33-5-19-27-28-45-18C12 29 6 51 16 67c11 19 38 25 56 13 13-9 19-24 17-38"
                />
              </svg>
            </div>
          </div>
        </ChalkReveal>

        <p className="mt-8 text-center text-lg">
          Menu changes every week.{" "}
          <a
            href={business.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-crust underline decoration-wheat decoration-2 underline-offset-4 hover:decoration-crust"
          >
            Follow along on Facebook <span aria-hidden>→</span>
          </a>
        </p>
      </div>

      <style>{`
        .board {
          background:
            linear-gradient(90deg, rgb(0 0 0 / .08), transparent 8%, transparent 92%, rgb(0 0 0 / .1)),
            repeating-linear-gradient(92deg, #8a5a36 0 6px, #7d5130 6px 9px, #93633e 9px 15px, #845632 15px 22px);
          box-shadow: inset 0 0 0 1px rgb(255 255 255 / .12), inset 0 2px 0 rgb(255 255 255 / .18), 0 30px 60px -30px rgb(42 27 18 / .6);
        }
        .chalk {
          background-color: #232624;
          background-image:
            radial-gradient(60% 40% at 20% 15%, rgb(244 241 234 / .07), transparent 70%),
            radial-gradient(40% 30% at 80% 70%, rgb(244 241 234 / .06), transparent 70%),
            radial-gradient(30% 20% at 55% 35%, rgb(244 241 234 / .045), transparent 70%),
            radial-gradient(25% 12% at 30% 85%, rgb(244 241 234 / .05), transparent 70%);
          box-shadow: inset 0 0 60px rgb(0 0 0 / .45);
          text-shadow: 0 0 1px rgb(244 241 234 / .35);
        }
        .chalk::before {
          content: ""; position: absolute; inset: 0; pointer-events: none;
          background: url("/textures/grain.png"); background-size: 140px; opacity: .07; mix-blend-mode: screen;
        }
        html.js .chalk-reveal:not(.is-in) .chalk-line { clip-path: inset(-10% 100% -10% 0); }
        .chalk-reveal.is-in .chalk-line {
          animation: chalk-write .8s cubic-bezier(.5,.1,.3,1) both;
          animation-delay: calc(var(--n, 0) * 90ms);
        }
        @keyframes chalk-write { from { clip-path: inset(-10% 100% -10% 0); } to { clip-path: inset(-10% -2% -10% 0); } }
        .chalk-doodle path { stroke-dasharray: 1; stroke-dashoffset: 1; }
        html:not(.js) .chalk-doodle path { stroke-dashoffset: 0; }
        .chalk-reveal.is-in .chalk-doodle path { animation: draw 1.4s var(--ease-soft) .6s forwards; }
        @keyframes draw { to { stroke-dashoffset: 0; } }
        @media (prefers-reduced-motion: reduce) {
          html.js .chalk-reveal .chalk-line { clip-path: none !important; animation: none !important; }
          .chalk-doodle path { stroke-dashoffset: 0 !important; animation: none !important; }
          .chalk-reveal { transition: opacity .4s; }
        }
      `}</style>
    </section>
  );
}
