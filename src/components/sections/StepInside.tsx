import { Img } from "@/components/ui/Img";
import { QrDoodle } from "@/components/ui/Doodle";
import { getPresentImage } from "@/lib/images";
import { business } from "@/content/business";
import { StepInsideMotion } from "./StepInsideMotion";

// Bulb positions in HERO-shed-interior-hutch-string-lights.jpg, as % of the full photo.
// Hand-placed against a grid of the original; the photo is shown at its native 3:4 ratio so these line up.
const BULBS: [number, number][] = [
  [4.6, 3.4],
  [23, 3.4],
  [18.5, 11.2],
  [35.2, 12.5],
  [51.6, 13],
  [68.8, 9],
  [89, 6.6],
];

export function StepInside() {
  const photo = getPresentImage("HERO-shed-interior-hutch-string-lights");
  const honey = getPresentImage("local-honey-display");

  return (
    <section aria-labelledby="inside-title" className="step-inside relative">
      <StepInsideMotion>
        <div data-bg className="absolute inset-0 -z-10 bg-flour" />
        <div className="container-page grid min-h-[100svh] items-center gap-12 py-24 md:grid-cols-12 md:gap-10 md:py-16">
          <div className="md:col-span-6 lg:col-span-5">
            <div
              data-photo-frame
              className="relative mx-auto aspect-[3/4] w-full max-w-[30rem] overflow-hidden rounded-[var(--radius-card)] shadow-lift md:h-[min(82vh,46rem)] md:w-auto md:max-w-none"
            >
              <div data-photo className="absolute inset-0">
                <Img id={photo} fill sizes="(min-width: 768px) 36vw, 92vw" className="h-full w-full" position="50% 50%" />
              </div>
              <div data-dusk aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_10%,transparent,rgb(20_12_6/.55))] opacity-0" />
              <div data-bloom aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/3 opacity-0 mix-blend-screen" style={{ background: "radial-gradient(80% 100% at 50% 0%, rgb(255 200 120 / .35), transparent 70%)" }} />
              {BULBS.map(([x, y], i) => (
                <span
                  key={i}
                  data-bulb
                  aria-hidden
                  className="bulb absolute"
                  style={{ left: `${x}%`, top: `${y}%`, "--i": i } as React.CSSProperties}
                />
              ))}
            </div>
          </div>

          <div className="md:col-span-6 lg:col-span-6 lg:col-start-7">
            <p className="eyebrow text-wheat-ink transition-colors duration-700 [.is-night_&]:text-wheat">
              Step inside
            </p>
            <h2 id="inside-title" className="display-lg mt-4">
              The new farmstand.
            </h2>
            <p data-copy className="mt-6 max-w-lg font-display text-2xl leading-snug italic md:text-3xl">
              String lights, a checkered floor, and the smell of fresh bread.
            </p>

            <ul className="mt-12 grid gap-4 sm:grid-cols-3">
              <li data-card className="card-night overflow-hidden rounded-[var(--radius-card)]">
                <div className="relative aspect-[4/3]">
                  <Img id={honey} fill sizes="(min-width: 640px) 14rem, 92vw" className="h-full w-full" position="50% 35%" />
                </div>
                <p className="p-4 font-semibold">Local honey</p>
              </li>
              <li data-card className="card-night overflow-hidden rounded-[var(--radius-card)]">
                <div className="relative aspect-[4/3]">
                  <Img id="chicken-duck-eggs" fill sizes="(min-width: 640px) 14rem, 92vw" className="h-full w-full" position="50% 40%" />
                </div>
                {/* [CONFIRM: eggs still available] */}
                <p className="p-4 font-semibold">Chicken &amp; duck eggs</p>
              </li>
              <li data-card className="card-night flex flex-col justify-between rounded-[var(--radius-card)] p-4">
                <QrDoodle className="size-16 text-wheat" />
                <div className="mt-6">
                  <p className="font-semibold">Cash, Venmo, or PayPal</p>
                  <p className="mt-1 text-sm opacity-75">There&rsquo;s a QR plaque right at the stand.</p>
                </div>
              </li>
            </ul>
            <p data-copy className="mt-8 text-base opacity-80">
              {business.address.street} · {business.hours.short}
            </p>
          </div>
        </div>
      </StepInsideMotion>

      <style>{`
        .step-inside { color: var(--color-crust); }
        .bulb { width: 0; height: 0; opacity: 0; }
        .bulb::before, .bulb::after { content: ""; position: absolute; border-radius: 999px; transform: translate(-50%, -50%); pointer-events: none; }
        .bulb::before { width: 15vmin; height: 15vmin; max-width: 150px; max-height: 150px; background: radial-gradient(circle, rgb(255 222 160 / .95) 0%, rgb(255 196 112 / .45) 28%, rgb(255 180 90 / .12) 55%, transparent 72%); mix-blend-mode: screen; }
        .bulb::after { width: 13px; height: 18px; background: radial-gradient(circle, #fffaf0 0%, #ffe2a8 45%, rgb(255 200 120 / 0) 75%); filter: blur(.5px); }
        .is-lit .bulb { animation: flicker 3.2s ease-in-out infinite; animation-delay: calc(var(--i) * -0.47s); }
        @keyframes flicker { 0%,100% { filter: brightness(1); } 42% { filter: brightness(.86); } 47% { filter: brightness(1.08); } 70% { filter: brightness(.95); } }
        .card-night { background: var(--color-parchment); box-shadow: var(--shadow-soft); transition: background-color .8s, color .8s, box-shadow .8s; }
        .is-night .card-night { background: rgb(251 246 238 / .07); color: var(--color-flour); box-shadow: inset 0 0 0 1px rgb(251 246 238 / .12); }
        @media (prefers-reduced-motion: reduce) {
          .step-inside [data-bg] { background: var(--color-espresso) !important; }
          .step-inside { color: var(--color-flour) !important; }
          .step-inside .bulb, .step-inside [data-bloom] { opacity: 1 !important; animation: none !important; }
          .step-inside [data-dusk] { opacity: 1 !important; }
          .step-inside .card-night { background: rgb(251 246 238 / .07); color: var(--color-flour); box-shadow: inset 0 0 0 1px rgb(251 246 238 / .12); }
          .step-inside .text-wheat-ink { color: var(--color-wheat); }
        }
      `}</style>
    </section>
  );
}
