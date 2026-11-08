import { Img } from "@/components/ui/Img";
import { StatusPill } from "@/components/nav/StatusPill";
import { ScrollSquiggle } from "@/components/ui/Doodle";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { HeroParticles } from "./HeroParticles";
import { business, maps } from "@/content/business";

const HEADLINE = "Sourdough, slow-made in Medley's Neck.";
// A/B alternates (see PLAN.md §7):
//   "Fresh bread. Country road. Every weekend."
//   "Baked this morning, a couple houses down."

export function Hero() {
  const words = HEADLINE.split(" ");
  return (
    <section
      aria-labelledby="hero-title"
      className="hero on-dark relative isolate flex min-h-[640px] h-[100svh] items-end overflow-hidden bg-espresso text-flour"
    >
      <div className="hero-photo absolute inset-0 -z-20">
        <Img
          id="HERO-golden-boules-pile"
          fill
          priority
          sizes="100vw"
          className="hero-kenburns h-full w-full"
          position="38% 68%"
        />
      </div>
      {/* warm vignette + legibility gradient + light beam */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 90% at 70% 30%, transparent 30%, rgb(42 27 18 / .55) 100%), linear-gradient(180deg, rgb(42 27 18 / .5) 0%, transparent 22%, transparent 45%, rgb(42 27 18 / .82) 100%), linear-gradient(90deg, rgb(42 27 18 / .55), transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 mix-blend-soft-light"
        style={{
          background:
            "linear-gradient(118deg, transparent 18%, rgb(255 236 200 / .55) 34%, rgb(255 236 200 / .15) 48%, transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 md:hidden"
        style={{ background: "linear-gradient(180deg, transparent 20%, rgb(42 27 18 / .55) 55%, rgb(42 27 18 / .85) 100%)" }}
      />
      <HeroParticles />

      <div className="container-page relative pb-[max(3.5rem,8vh)] pt-32">
        <p className="hero-fade eyebrow mb-5 text-flour/85" style={{ "--d": "0.05s" } as React.CSSProperties}>
          Farmstand bakery · Leonardtown, Maryland
        </p>
        <h1 id="hero-title" className="display-xl max-w-[11ch] text-flour md:max-w-[12.5ch]">
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-top">
              <span className="hero-word inline-block" style={{ "--i": i } as React.CSSProperties}>
                {i === words.length - 2 ? <em className="font-normal italic">{w}</em> : w}
                {i < words.length - 1 ? " " : ""}
              </span>
            </span>
          ))}
        </h1>
        <p
          className="hero-fade mt-6 max-w-[38rem] text-lg leading-relaxed text-flour/90 md:text-xl"
          style={{ "--d": "0.45s" } as React.CSSProperties}
        >
          Fresh sourdough, cinnamon rolls, and sweet things, set out at our farmstand in Leonardtown every Saturday
          &amp; Sunday at 9 AM, until sold out or sunset.
        </p>
        <div className="hero-fade mt-8 flex flex-wrap gap-3" style={{ "--d": "0.55s" } as React.CSSProperties}>
          <MagneticLink href="/menu" className="btn btn-light">
            See this weekend&rsquo;s menu
          </MagneticLink>
          <a href={maps.google} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            Get directions
            <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 12L12 4M6 4h6v6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
        <div
          className="hero-fade mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm"
          style={{ "--d": "0.65s" } as React.CSSProperties}
        >
          <StatusPill tone="glass" />
          <a
            href={business.facebookReviews}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-flour/90 underline-offset-4 hover:underline"
          >
            <span aria-hidden className="text-wheat">
              ★{" "}
            </span>
            {business.reviews.recommendPercent}% recommend on Facebook ({business.reviews.count} reviews)
          </a>
        </div>
      </div>

      <div aria-hidden className="absolute right-[var(--gutter)] bottom-8 hidden flex-col items-center gap-2 md:flex">
        <span className="font-hand text-xl text-flour/85 [writing-mode:vertical-rl]">scroll</span>
        <ScrollSquiggle className="scroll-squiggle h-16 w-auto text-flour/85" />
      </div>

      <style>{`
        .hero-kenburns { animation: kenburns 20s linear infinite alternate; transform-origin: 40% 70%; }
        @keyframes kenburns { from { transform: scale(1); } to { transform: scale(1.06); } }
        .hero-word { transform: translateY(110%); filter: blur(6px); }
        .hero-fade { opacity: 0; transform: translateY(16px); }
        html.hero-go .hero-word { animation: hero-rise 1s var(--ease-dough) both; animation-delay: calc(var(--i) * 70ms + 80ms); }
        html.hero-go .hero-fade { animation: hero-fade .9s var(--ease-dough) both; animation-delay: var(--d); }
        html:not(.js) .hero-word, html:not(.js) .hero-fade { transform: none; filter: none; opacity: 1; }
        @keyframes hero-rise { to { transform: translateY(0); filter: blur(0); } }
        @keyframes hero-fade { to { opacity: 1; transform: none; } }
        .scroll-squiggle path { stroke-dasharray: 1; animation: squiggle 3s var(--ease-soft) infinite; }
        @keyframes squiggle { 0% { stroke-dashoffset: 1; } 55%, 75% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -1; } }
        @media (prefers-reduced-motion: reduce) {
          .hero-kenburns { animation: none; }
          .hero-word, .hero-fade { transform: none !important; filter: none !important; opacity: 1 !important; animation: none !important; }
          .scroll-squiggle path { animation: none; stroke-dasharray: none; }
        }
      `}</style>
    </section>
  );
}
