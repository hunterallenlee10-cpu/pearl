import { IllustratedMap } from "@/components/visit/IllustratedMap";
import { StatusPill } from "@/components/nav/StatusPill";
import { business, maps } from "@/content/business";

export const HOW_IT_WORKS = [
  { title: "Pull up", body: "Park on the gravel by the white shed on Medley's Neck Rd." },
  { title: "Pick your bread & treats", body: "Everything's bagged, labelled and set out on the shelves." },
  // [CONFIRM: self-serve/honor system wording]
  { title: "Pay with cash, Venmo, or PayPal", body: "There's a QR code plaque right at the stand." },
];

export function FindTheFarmstand({ headingLevel = 2 }: { headingLevel?: 1 | 2 }) {
  const H = headingLevel === 1 ? "h1" : "h2";
  return (
    <section aria-labelledby="visit-title" className="relative bg-flour py-24 md:py-32">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow text-wheat-ink" data-reveal>
            Find the farmstand
          </p>
          <H id="visit-title" className="display-lg mt-4" data-reveal>
            40960 Medley&rsquo;s Neck&nbsp;Rd
          </H>
          <p className="mt-3 text-xl" data-reveal>
            Leonardtown, MD 20650
          </p>

          <div className="mt-8 space-y-4" data-reveal>
            <p className="font-display text-2xl leading-snug">
              Saturdays &amp; Sundays · from 9&nbsp;AM
              <br />
              <span className="italic">until sold out or sunset</span>
            </p>
            <StatusPill />
            <p className="max-w-md text-crust-soft">
              We moved just a couple houses down the road, into the white shed with the string lights.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3" data-reveal>
            <a href={maps.google} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Directions in Google Maps
            </a>
            <a href={maps.apple} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              Apple Maps
            </a>
          </div>

          <h3 className="mt-14 font-display text-3xl" data-reveal>
            How the stand works
          </h3>
          <ol className="mt-6 space-y-5">
            {HOW_IT_WORKS.map((s, i) => (
              <li key={s.title} className="flex gap-4" data-reveal style={{ "--reveal-delay": `${i * 0.08}s` } as React.CSSProperties}>
                <span
                  aria-hidden
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-parchment font-display text-xl ring-1 ring-crust/15"
                >
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="text-crust-soft">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="lg:col-span-7 lg:pt-6" data-reveal>
          <IllustratedMap />
        </div>
      </div>
    </section>
  );
}
