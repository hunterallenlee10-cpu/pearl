import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { timeline } from "@/content/timeline";
import { TimelineMotion } from "./TimelineMotion";

const tilt = ["-rotate-2", "rotate-2", "-rotate-1", "rotate-3"];

export function TrailerToFarmstand({ showLink = true }: { showLink?: boolean }) {
  const entries = timeline.filter((e) => e.id !== "moved");
  const moved = timeline.find((e) => e.id === "moved")!;

  return (
    <section aria-labelledby="story-title" className="relative overflow-hidden bg-parchment py-24 md:py-36">
      <TimelineMotion>
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="eyebrow text-wheat-ink" data-reveal>
              The story so far
            </p>
            <h2 id="story-title" className="display-lg mt-4" data-reveal>
              From a trailer to a <em className="italic">farmstand.</em>
            </h2>
          </div>

          <ol className="relative mt-16 md:mt-24">
            {/* the line, drawn as you scroll */}
            <svg
              aria-hidden
              className="absolute top-0 left-[11px] h-full w-6 md:left-1/2 md:-translate-x-1/2"
              viewBox="0 0 24 1000"
              preserveAspectRatio="none"
            >
              <path d="M12 0V1000" stroke="rgb(91 58 36 / .15)" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" vectorEffect="non-scaling-stroke" fill="none" />
              <path
                data-line
                d="M12 0V1000"
                stroke="#C99A5B"
                strokeWidth="3"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                fill="none"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset="0"
              />
            </svg>

            {entries.map((e, i) => {
              const right = i % 2 === 1;
              return (
                <li key={e.id} className="relative grid gap-8 pb-20 pl-12 md:grid-cols-2 md:gap-20 md:pb-28 md:pl-0">
                  <span
                    aria-hidden
                    className="absolute top-2 left-[3px] size-[18px] rounded-full border-[3px] border-parchment bg-wheat shadow-[0_0_0_2px_var(--color-wheat)] md:left-1/2 md:-translate-x-1/2"
                  />
                  <div className={`${right ? "md:order-2" : "md:text-right"} md:pt-0`} data-reveal>
                    <p className="font-hand text-2xl text-wheat-ink">{e.when}</p>
                    <h3 className="mt-1 font-display text-4xl leading-none md:text-5xl">{e.title}</h3>
                    {e.quote && (
                      <blockquote className={`mt-6 ${right ? "" : "md:ml-auto"} max-w-md`}>
                        <p className="font-display text-3xl leading-tight italic md:text-[2.4rem]">
                          &ldquo;{e.quote}&rdquo;
                        </p>
                      </blockquote>
                    )}
                    {e.body && (
                      <p className={`mt-4 max-w-md text-lg text-crust-soft ${right ? "" : "md:ml-auto"}`}>
                        {e.quote ? <>&ldquo;{e.body}&rdquo;</> : e.body}
                      </p>
                    )}
                  </div>
                  <div className={`flex flex-wrap gap-4 ${right ? "md:order-1 md:justify-end" : ""}`}>
                    {e.images.map((id, k) => (
                      <figure
                        key={id}
                        data-reveal
                        style={{ "--reveal-delay": `${k * 0.08}s` } as React.CSSProperties}
                        className={`relative w-[min(100%,15rem)] bg-flour p-2.5 pb-3 shadow-soft ${tilt[(i + k) % tilt.length]} ${
                          e.images.length === 1 ? "md:w-[22rem]" : ""
                        }`}
                      >
                        <div className="relative aspect-[4/5] overflow-hidden">
                          <Img id={id} fill sizes="(min-width: 768px) 22rem, 70vw" className="h-full w-full" />
                        </div>
                      </figure>
                    ))}
                  </div>
                </li>
              );
            })}

            {/* the move: the trailer grows up into the shed */}
            <li className="relative grid items-center gap-10 pl-12 md:grid-cols-2 md:gap-20 md:pl-0">
              <span
                aria-hidden
                className="absolute top-2 left-[3px] size-[18px] rounded-full border-[3px] border-parchment bg-crust shadow-[0_0_0_2px_var(--color-crust)] md:left-1/2 md:-translate-x-1/2"
              />
              <div className="md:text-right" data-reveal>
                <p className="font-hand text-2xl text-wheat-ink">{moved.when}</p>
                <h3 className="mt-1 font-display text-5xl leading-none md:text-6xl">{moved.title}</h3>
                <p className="mt-4 max-w-md text-lg text-crust-soft md:ml-auto">{moved.body}</p>
                <div className="mt-8 hidden md:ml-auto md:block md:w-56">
                  <div className="-rotate-3 bg-flour p-2 shadow-soft">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Img id="we-moved-announcement-40960-medleys-neck" fill sizes="14rem" className="h-full w-full" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div data-morph className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] shadow-lift">
                  <div className="absolute inset-0">
                    <Img id="HERO-trailer-wide-green-field" fill sizes="(min-width: 768px) 40vw, 85vw" className="h-full w-full" />
                  </div>
                  <div data-morph-to className="absolute inset-0">
                    <Img id="HERO-shed-exterior-fall-field" fill sizes="(min-width: 768px) 40vw, 85vw" className="h-full w-full" />
                  </div>
                  <p className="absolute bottom-3 left-3 flex gap-2 text-sm font-semibold">
                    <span data-label-from className="rounded-full bg-flour/90 px-3 py-1 text-crust">2025: the trailer</span>
                    <span data-label-to className="rounded-full bg-crust px-3 py-1 text-flour">Now: the farmstand</span>
                  </p>
                </div>
                <div className="pointer-events-none absolute -top-14 -left-4 flex items-end gap-1 text-crust md:-top-20 md:-left-28">
                  <svg aria-hidden viewBox="0 0 160 90" className="w-32 md:w-40">
                    <path
                      data-dots
                      d="M8 80c20-44 60-70 104-62 16 3 26 12 34 26"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="0.5 9"
                    />
                    <path d="M138 34l8 12 6-14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="mb-10 w-36 font-hand text-xl leading-tight md:w-44 md:text-2xl">a couple houses down the road</span>
                </div>
              </div>
            </li>
          </ol>

          {showLink && (
            <p className="mt-20 text-center" data-reveal>
              <Link href="/story" className="btn btn-secondary">
                Read the whole story <span aria-hidden>→</span>
              </Link>
            </p>
          )}
        </div>
      </TimelineMotion>
      <style>{`
        [data-label-to] { opacity: 0; }
        html:not(.js) [data-morph-to], html:not(.js) [data-label-to] { opacity: 1; }
        @media (prefers-reduced-motion: reduce) {
          [data-morph-to] { opacity: 1 !important; }
          [data-label-to] { opacity: 1 !important; }
          [data-label-from] { display: none; }
        }
      `}</style>
    </section>
  );
}
