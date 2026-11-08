import { testimonials } from "@/content/testimonials";
import { business } from "@/content/business";
import { MarqueeControls } from "./MarqueeControls";

function Card({ quote, name, i }: { quote: string; name: string; i: number }) {
  return (
    <figure
      className={`kraft shadow-soft relative w-[19rem] shrink-0 rounded-[var(--radius-card)] p-6 md:w-[23rem] ${
        i % 3 === 0 ? "-rotate-1" : i % 3 === 1 ? "rotate-1" : ""
      }`}
    >
      <span aria-hidden className="font-display text-wheat absolute -top-3 left-6 text-6xl leading-none">
        &ldquo;
      </span>
      <blockquote className="font-display text-xl leading-snug md:text-[1.4rem]">{quote}</blockquote>
      <figcaption className="font-hand text-wheat-ink mt-4 text-2xl">— {name}</figcaption>
    </figure>
  );
}

export function NeighborsSay() {
  const half = Math.ceil(testimonials.length / 2);
  const rows = [testimonials.slice(0, half), testimonials.slice(half)];

  return (
    <section
      aria-labelledby="neighbors-title"
      className="neighbors bg-flour relative overflow-hidden py-24 md:py-32"
    >
      <div className="container-page flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow text-wheat-ink" data-reveal>
            Neighbors say
          </p>
          <h2 id="neighbors-title" className="display-lg mt-4 max-w-[16ch]" data-reveal>
            &ldquo;You have a loaf on its way to <em className="italic">Boston!</em>&rdquo;
          </h2>
        </div>
        <a
          href={business.facebookReviews}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-parchment shadow-soft inline-flex items-center gap-3 rounded-full px-5 py-3 font-semibold no-underline"
          data-reveal
        >
          <span className="font-display text-3xl leading-none">{business.reviews.recommendPercent}%</span>
          <span className="text-left text-sm leading-tight">
            recommend
            <br />
            {business.reviews.count} reviews on Facebook <span aria-hidden>↗</span>
          </span>
        </a>
      </div>

      {/* readable list for screen readers and reduced motion */}
      <ul className="marquee-static container-page mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <li key={i}>
            <Card quote={t.quote} name={t.name} i={i} />
          </li>
        ))}
      </ul>

      <MarqueeControls>
        <div className="marquee mt-16 space-y-8" aria-hidden>
          {rows.map((row, r) => (
            <div key={r} className="overflow-hidden py-3">
              <div
                className="marquee-track animate-marquee flex w-max gap-6"
                style={
                  {
                    "--marquee-duration": r === 0 ? "70s" : "80s",
                    animationDirection: r === 0 ? "normal" : "reverse",
                  } as React.CSSProperties
                }
              >
                {[...row, ...row].map((t, i) => (
                  <Card key={i} quote={t.quote} name={t.name} i={i + r} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </MarqueeControls>

      <style>{`
        .marquee-static { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
        .marquee:hover .marquee-track, .neighbors.is-paused .marquee-track { animation-play-state: paused !important; }
        .marquee-static figure { width: auto; }
        @media (prefers-reduced-motion: reduce) {
          .marquee-static { position: static; width: auto; height: auto; overflow: visible; clip-path: none; }
          .marquee, [data-marquee-toggle] { display: none !important; }
        }
      `}</style>
    </section>
  );
}
