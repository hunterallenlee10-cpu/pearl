import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { GinghamMenuCard } from "@/components/preorder/GinghamMenuCard";
import { getActiveCampaign } from "@/lib/campaigns";
import { cinnamonRollCake } from "@/content/preorders";

/** Shows the open seasonal pre-order; once it closes, swaps to the evergreen Cinnamon Roll Cake. */
export function PreorderTeaser({ now = new Date() }: { now?: Date }) {
  const campaign = getActiveCampaign(now);

  if (campaign) {
    return (
      <section aria-labelledby="preorder-title" className="relative overflow-hidden bg-parchment py-24 md:py-32">
        <div className="container-page grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-wheat-ink" data-reveal>
              Pre-orders are open
            </p>
            <h2 id="preorder-title" className="display-lg mt-4" data-reveal>
              {campaign.shortTitle}, <em className="italic">baked for your table.</em>
            </h2>
            <p className="mt-6 max-w-md text-lg" data-reveal>
              Sourdough, dinner rolls, pies, cakes and cookies, ready to pick up at the stand the day before
              Thanksgiving.
            </p>
            <dl className="mt-8 grid max-w-md gap-3 text-base" data-reveal>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 font-semibold">Order by</dt>
                <dd>Midnight Sunday, Nov 22</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 font-semibold">Pick up</dt>
                <dd>
                  {campaign.pickup.date}, {campaign.pickup.window}
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 font-semibold">Note</dt>
                <dd>Quantities are limited. It&rsquo;s reserved once you get my confirmation email.</dd>
              </div>
            </dl>
            <Link href="/pre-order" className="btn btn-primary mt-10" data-reveal>
              Request a Thanksgiving order <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="lg:col-span-7" data-reveal>
            <div className="mx-auto max-w-2xl -rotate-1 transition-transform duration-700 ease-(--ease-dough) hover:rotate-0">
              <GinghamMenuCard campaign={campaign} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="preorder-title" className="relative overflow-hidden bg-parchment py-24 md:py-32">
      <div className="container-page grid items-center gap-14 md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] shadow-lift" data-reveal data-cursor="view">
          <Img id={cinnamonRollCake.image} fill sizes="(min-width: 768px) 45vw, 92vw" className="h-full w-full" />
          <span className="absolute top-4 left-4 rounded-full bg-flour px-4 py-2 font-hand text-xl text-crust shadow-soft">
            {cinnamonRollCake.badge}
          </span>
        </div>
        <div>
          <p className="eyebrow text-wheat-ink" data-reveal>
            Pre-order only
          </p>
          <h2 id="preorder-title" className="display-lg mt-4" data-reveal>
            Cinnamon roll <em className="italic">cakes.</em>
          </h2>
          <p className="mt-6 max-w-lg text-lg" data-reveal>
            {cinnamonRollCake.description}
          </p>
          <Link href="/pre-order#cake-builder" className="btn btn-primary mt-10" data-reveal>
            Build your cake <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
