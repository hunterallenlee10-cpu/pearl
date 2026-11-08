import { FindTheFarmstand } from "@/components/sections/FindTheFarmstand";
import { Img } from "@/components/ui/Img";
import { getPresentImage } from "@/lib/images";
import { faqs } from "@/content/faq";
import { business } from "@/content/business";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Visit the farmstand in Leonardtown, MD",
  description:
    "Pearl Bakery's self-serve farmstand is at 40960 Medley's Neck Rd, Leonardtown, MD. Open Saturdays & Sundays from 9 AM until sold out or sunset. Cash, Venmo or PayPal.",
  path: "/visit",
});

// Present-day photos only: getPresentImage throws if a trailer photo sneaks in here.
const PHOTOS = [
  "HERO-shed-exterior-fall-field",
  "shed-doorway-view",
  "HERO-shed-interior-barrels",
  "shed-exterior-blue-sky",
];

export default function VisitPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <>
      <div className="pt-[var(--nav-h)]">
        <FindTheFarmstand headingLevel={1} />
      </div>

      <section aria-label="The farmstand" className="bg-flour pb-20">
        <div className="container-page">
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {PHOTOS.map((id, i) => (
              <li
                key={id}
                className={`shadow-soft relative overflow-hidden rounded-[var(--radius-card)] ${i % 2 ? "aspect-[3/4] md:translate-y-8" : "aspect-[3/4]"}`}
              >
                <Img
                  id={getPresentImage(id)}
                  fill
                  sizes="(min-width: 768px) 24vw, 46vw"
                  className="h-full w-full"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="bg-parchment py-24 md:py-32">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-wheat-ink">Good to know</p>
            <h2 id="faq-title" className="display-md mt-4">
              Questions, <em className="italic">answered.</em>
            </h2>
            <p className="text-crust-soft mt-5">
              Something else? Call or text{" "}
              <a href={business.phoneHref} className="text-crust font-semibold underline">
                {business.phone}
              </a>{" "}
              or email{" "}
              <a
                href={`mailto:${business.email}`}
                className="text-crust font-semibold [overflow-wrap:anywhere] underline"
              >
                {business.email}
              </a>
              .
            </p>
          </div>
          <div className="lg:col-span-8">
            {faqs.map((f) => (
              <details key={f.q} className="faq group border-crust/15 border-b py-2">
                <summary className="font-display flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 text-2xl [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    aria-hidden
                    className="ring-crust/25 grid size-9 shrink-0 place-items-center rounded-full ring-1 transition-transform duration-500 ease-(--ease-dough) group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="text-crust-soft max-w-2xl pt-1 pb-5 text-lg">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </>
  );
}
