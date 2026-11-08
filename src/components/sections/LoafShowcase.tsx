import { Img } from "@/components/ui/Img";
import { LoafMotion } from "./LoafMotion";

type Loaf = {
  id: string;
  name: string;
  /** Outlined background word(s). */
  big: string;
  note: string;
  /** Zoom + centre so the round board fills the circle exactly. */
  zoom: number;
  center: string;
};

const LOAVES: Loaf[] = [
  {
    id: "HERO-classic-loaf-styled",
    name: "Classic",
    big: "CLASSIC",
    note: "The everyday loaf. Toast it, build a sandwich on it, or tear into it on the drive home.",
    zoom: 1.24,
    center: "50% 50%",
  },
  {
    id: "HERO-rosemary-loaf-styled",
    name: "Rosemary Garlic Parmesan",
    big: "ROSEMARY GARLIC PARMESAN",
    note: "The one regulars dip in good olive oil.",
    zoom: 1.12,
    center: "50% 50%",
  },
  {
    id: "HERO-jalapeno-cheddar-loaf-styled",
    name: "Jalapeño Cheddar",
    big: "JALAPEÑO CHEDDAR",
    note: "Green jalapeño and melted cheddar baked right into the crust.",
    zoom: 1.16,
    center: "50% 50%",
  },
  {
    id: "HERO-blueberry-lemon-loaf-styled",
    name: "Blueberry Lemon",
    big: "BLUEBERRY LEMON",
    note: "Blueberries bursting through the crust, with a little lemon.",
    zoom: 1.18,
    center: "50% 50%",
  },
];

const CAST = [
  "Lemon poppy seed",
  "Fig & walnut",
  "White cheddar Old Bay",
  "Pumpkin spice",
  "Honey whole wheat",
  "Cinnamon raisin",
  "Italian herbs & cheese",
  "Triple cheddar",
  "White cheddar",
  "Strawberry chocolate chip",
];

export function LoafShowcase() {
  return (
    <section aria-labelledby="loaves-title" className="loaves bg-parchment relative">
      <a
        href="#after-loaves"
        className="sr-only-focusable bg-crust text-flour absolute top-4 left-4 z-20 rounded-full px-4 py-2"
      >
        Skip the loaves
      </a>
      <LoafMotion count={LOAVES.length + 2}>
        <div data-track className="loaves-track flex">
          {/* intro */}
          <div data-panel className="loaf-panel flex items-center">
            <div className="container-page">
              <p className="eyebrow text-wheat-ink">The loaves</p>
              <h2 id="loaves-title" className="display-lg mt-4 max-w-[12ch]">
                Same board. <em className="italic">Different</em> loaf every weekend.
              </h2>
              <p className="text-crust-soft mt-6 max-w-md text-lg">
                Four of the regulars from the rotation.{" "}
                <span className="hidden md:inline">Keep scrolling, they spin.</span>
                <span className="md:hidden">Swipe through, they spin. →</span>
              </p>
            </div>
          </div>

          {LOAVES.map((l, i) => (
            <article
              key={l.id}
              data-panel
              tabIndex={0}
              aria-labelledby={`loaf-${i}`}
              className="loaf-panel relative flex items-center justify-center outline-none"
            >
              <p
                data-bigname
                aria-hidden
                className="outline-text font-display pointer-events-none absolute top-1/2 left-1/2 z-0 w-max max-w-none -translate-y-1/2 text-[clamp(5rem,15vw,15rem)] leading-[0.85] font-semibold whitespace-nowrap select-none"
                style={{ translate: "-50% 0" }}
              >
                {l.big}
              </p>

              <div className="relative z-10 grid w-full max-w-7xl items-center gap-8 px-[var(--gutter)] md:grid-cols-[1fr_auto_1fr]">
                <div className="order-2 md:order-1 md:self-end md:pb-10">
                  <p className="font-display text-wheat-ink text-xl">
                    0{i + 1} <span className="text-crust/40">/ 0{LOAVES.length}</span>
                  </p>
                  <h3 id={`loaf-${i}`} className="font-display mt-2 text-4xl leading-none md:text-5xl">
                    {l.name}
                  </h3>
                </div>

                <div className="relative order-1 justify-self-center md:order-2">
                  <div
                    className="loaf-disc relative aspect-square overflow-hidden rounded-full shadow-[0_40px_70px_-30px_rgb(42_27_18/0.55),0_10px_20px_-10px_rgb(42_27_18/0.3)]"
                    data-cursor="view"
                  >
                    <div data-spin className="absolute inset-0 will-change-transform">
                      <Img
                        id={l.id}
                        fill
                        sizes="(min-width: 768px) 46vh, 80vw"
                        className="h-full w-full"
                        position={l.center}
                        style={{ transform: `scale(${l.zoom})` }}
                      />
                    </div>
                    {/* soft light so the spin reads */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-full"
                      style={{
                        background:
                          "radial-gradient(70% 70% at 35% 25%, rgb(255 250 240 / .18), transparent 60%), radial-gradient(100% 100% at 50% 50%, transparent 62%, rgb(42 27 18 / .18) 100%)",
                      }}
                    />
                  </div>
                  <span className="sticker absolute -top-2 -right-2 md:top-2 md:-right-6">
                    Rotates
                    <br />
                    weekly
                  </span>
                </div>

                <p className="order-3 max-w-xs text-lg leading-snug md:self-start md:justify-self-end md:pt-10">
                  {l.note}
                </p>
              </div>
            </article>
          ))}

          {/* finale */}
          <div data-panel className="loaf-panel flex items-center overflow-hidden">
            <div className="w-full">
              <div className="container-page grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
                <div>
                  <p className="eyebrow text-wheat-ink">And a rotating cast</p>
                  <p className="display-md mt-4 max-w-3xl">
                    Lemon poppy seed, fig &amp; walnut, white cheddar Old Bay, pumpkin spice, honey whole
                    wheat…
                  </p>
                </div>
                <div className="shadow-lift relative mx-auto hidden aspect-[4/5] w-full max-w-[22rem] rotate-3 overflow-hidden rounded-[var(--radius-card)] md:block">
                  <Img
                    id="HERO-pumpkin-spice-sourdough-loaves"
                    fill
                    sizes="22rem"
                    className="h-full w-full"
                  />
                  <span className="sticker absolute! right-4 bottom-4 -rotate-6!">
                    Pumpkin
                    <br />
                    spice
                  </span>
                </div>
              </div>
              <div className="border-crust/15 mt-12 overflow-hidden border-y py-5" aria-hidden>
                <div className="marquee-track animate-marquee font-display flex w-max gap-10 text-4xl whitespace-nowrap italic [--marquee-duration:50s] md:text-5xl">
                  {[...CAST, ...CAST].map((c, i) => (
                    <span key={i} className="flex items-center gap-10">
                      {c} <span className="text-wheat not-italic">✦</span>
                    </span>
                  ))}
                </div>
              </div>
              <ul className="sr-only">
                {CAST.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </LoafMotion>
      <span id="after-loaves" />

      <style>{`
        .loaf-panel { flex: 0 0 auto; width: 88vw; min-height: 100svh; scroll-snap-align: center; padding-block: 6rem; }
        .loaves-track { overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; }
        .loaves-track::-webkit-scrollbar { display: none; }
        .loaf-disc { width: min(78vw, 26rem); }
        .loaf-panel:first-child, .loaf-panel:last-child { width: 100vw; }
        @media (min-width: 768px) {
          .loaf-panel { width: 100vw; height: 100svh; min-height: 640px; padding-block: 0; }
          .loaf-disc { width: min(58vh, 36vw); }
          html.js .loaves-track { overflow: visible; scroll-snap-type: none; }
        }
        .sticker {
          display: grid; place-items: center; width: 6.25rem; height: 6.25rem; border-radius: 999px;
          background: var(--color-flour); color: var(--color-crust); text-align: center;
          font-family: var(--font-hand); font-size: 1.35rem; line-height: 1; font-weight: 700;
          box-shadow: var(--shadow-soft), inset 0 0 0 2px rgb(91 58 36 / .15), inset 0 0 0 6px var(--color-flour), inset 0 0 0 7px rgb(91 58 36 / .25);
          transform: rotate(12deg);
        }
        @media (prefers-reduced-motion: reduce) {
          .loaves-track { flex-direction: column; overflow: visible !important; scroll-snap-type: none; }
          .loaf-panel { width: 100% !important; height: auto !important; min-height: 0 !important; padding-block: 4rem !important; }
          [data-bigname] { display: none; }
        }
      `}</style>
    </section>
  );
}
