import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { TrailerToFarmstand } from "@/components/sections/TrailerToFarmstand";
import { NeighborsSay } from "@/components/sections/NeighborsSay";
import { Img } from "@/components/ui/Img";
import { pastSpecials } from "@/content/preorders";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Our story: from a trailer to a farmstand",
  description:
    "Pearl Bakery opened on March 15, 2025 as a little sourdough trailer in Leonardtown, MD. A year and a half later it moved a couple houses down Medley's Neck Rd into a new farmstand.",
  path: "/story",
});

export default function StoryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our story"
        title={
          <>
            One baker, one farmstand, <em className="italic">every weekend.</em>
          </>
        }
        intro="Pearl Bakery is a sourdough micro-bakery run by one home baker, selling from a self-serve farmstand in the Medley's Neck area of Leonardtown, Maryland."
      />

      <section aria-labelledby="baker-title" className="bg-flour pb-24 md:pb-32">
        <div className="container-page grid items-center gap-12 md:grid-cols-12">
          <div className="relative md:col-span-6">
            <div className="shadow-lift relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)]">
              <Img
                id="HERO-baker-with-bread-at-farmstand"
                fill
                sizes="(min-width: 768px) 50vw, 92vw"
                className="h-full w-full"
              />
            </div>
            <p className="font-hand text-crust-soft mt-3 text-xl">At the original trailer, 2025.</p>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <h2 id="baker-title" className="display-md">
              Baked at home. <em className="italic">Set out every weekend.</em>
            </h2>
            {/* [BAKER FIRST NAME — confirm] before adding a name here */}
            <div className="mt-6 space-y-4 text-lg">
              <p>
                Everything at the stand is baked by one person, who also stocks the shelves, writes the
                chalkboard, posts the menu every week and answers the messages.
              </p>
              <p>
                The menu changes with the seasons and with whatever&rsquo;s being tested in the kitchen that
                week: &ldquo;feeling soo close to finding the recipe for the perfect chocolate chip
                cookie.&rdquo;
              </p>
              <p>
                A year after opening day she wrote:{" "}
                <em className="font-display text-xl">
                  &ldquo;I truly never imagined how much it would grow in just one year.&rdquo;
                </em>
              </p>
            </div>
          </div>
        </div>
      </section>

      <TrailerToFarmstand showLink={false} />

      <section aria-labelledby="seasons-title" className="bg-flour py-24 md:py-32">
        <div className="container-page">
          <h2 id="seasons-title" className="display-md max-w-xl">
            Something for every <em className="italic">season.</em>
          </h2>
          <p className="text-crust-soft mt-4 max-w-xl text-lg">
            A few of the specials that have come around so far.
          </p>
          <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-5">
            {pastSpecials.map((p) => (
              <li key={p.title}>
                <div className="shadow-soft relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)]">
                  <Img id={p.image} fill sizes="(min-width: 768px) 19vw, 46vw" className="h-full w-full" />
                </div>
                <p className="mt-3 font-semibold">{p.title}</p>
                <p className="text-crust-soft text-sm">{p.detail}</p>
              </li>
            ))}
          </ul>
          <p className="mt-14">
            <Link href="/pre-order" className="btn btn-primary">
              See what&rsquo;s on pre-order now <span aria-hidden>→</span>
            </Link>
          </p>
        </div>
      </section>

      <NeighborsSay />
    </>
  );
}
