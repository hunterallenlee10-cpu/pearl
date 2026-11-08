import { PageHeader } from "@/components/ui/PageHeader";
import { GinghamMenuCard } from "@/components/preorder/GinghamMenuCard";
import { PreorderForm } from "@/components/preorder/PreorderForm";
import { CakeBuilder } from "@/components/preorder/CakeBuilder";
import { RequestForm } from "@/components/preorder/RequestForm";
import { Img } from "@/components/ui/Img";
import { getActiveCampaign, hasRealUrl } from "@/lib/campaigns";
import { cinnamonRollCake, pastSpecials } from "@/content/preorders";
import { business } from "@/content/business";
import { pageMeta } from "@/lib/seo";

export const revalidate = 300;

export const metadata = pageMeta({
  title: "Pre-order: Thanksgiving & cinnamon roll cakes",
  description:
    "Pre-order Thanksgiving sourdough, dinner rolls, pies, cakes and cookies from Pearl Bakery in Leonardtown, MD, or build a custom cinnamon roll cake for any occasion.",
  path: "/pre-order",
});

export default function PreorderPage() {
  const campaign = getActiveCampaign(new Date());

  return (
    <>
      <PageHeader
        eyebrow="Pre-order"
        title={
          <>
            Order <em className="italic">ahead.</em>
          </>
        }
        intro={
          campaign
            ? "Thanksgiving pre-orders are open, and cinnamon roll cakes can be ordered any time."
            : "Cinnamon roll cakes can be ordered any time, and seasonal pre-order menus come around for the holidays."
        }
      >
        <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-2">
          {campaign && (
            <a href="#seasonal" className="btn btn-secondary min-h-11! px-5! py-2! text-sm">
              {campaign.shortTitle} menu
            </a>
          )}
          <a href="#cake-builder" className="btn btn-secondary min-h-11! px-5! py-2! text-sm">
            Cinnamon roll cake builder
          </a>
          <a href="#custom" className="btn btn-secondary min-h-11! px-5! py-2! text-sm">
            Something else
          </a>
        </nav>
      </PageHeader>

      {campaign && (
        <section
          id="seasonal"
          aria-labelledby="seasonal-title"
          className="bg-parchment scroll-mt-24 py-20 md:py-28"
        >
          <div className="container-page grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <GinghamMenuCard campaign={campaign} headingLevel={2} />
              <div className="bg-flour shadow-soft mt-10 rounded-[var(--radius-card)] p-6 md:p-8">
                <h3 className="font-display text-2xl">How it works</h3>
                <ul className="mt-4 space-y-3">
                  {campaign.rules.map((r) => (
                    <li key={r} className="flex gap-3">
                      <span aria-hidden className="bg-wheat mt-2.5 size-1.5 shrink-0 rounded-full" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-crust-soft mt-5 text-sm">
                  Questions?{" "}
                  <a href={`mailto:${business.email}`} className="text-crust font-semibold underline">
                    {business.email}
                  </a>
                </p>
              </div>
            </div>
            <div className="lg:col-span-6">
              <h2 id="seasonal-title" className="sr-only">
                Request a {campaign.shortTitle} order
              </h2>
              <div className="bg-parchment rounded-[var(--radius-card)] lg:sticky lg:top-24">
                <p className="eyebrow text-wheat-ink">Request a {campaign.shortTitle} order</p>
                <p className="font-display mt-3 text-3xl leading-tight">
                  Orders close <em className="italic">midnight Sunday, Nov 22.</em>
                </p>
                <p className="text-crust-soft mt-3">
                  Submitting a request doesn&rsquo;t guarantee your order; it&rsquo;s reserved once you
                  receive my confirmation email.
                </p>
                {hasRealUrl(campaign.formUrl) && (
                  <p className="mt-3">
                    Prefer Google Forms?{" "}
                    <a
                      href={campaign.formUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="decoration-wheat font-semibold underline underline-offset-4"
                    >
                      Use my order form <span aria-hidden>↗</span>
                    </a>
                  </p>
                )}
                <div className="mt-8">
                  <PreorderForm campaign={campaign} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section
        id="cake-builder"
        aria-labelledby="cake-title"
        className="bg-flour scroll-mt-24 py-20 md:py-28"
      >
        <div className="container-page">
          <div className="grid items-end gap-10 md:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="eyebrow text-wheat-ink">{cinnamonRollCake.badge}</p>
              <h2 id="cake-title" className="display-lg mt-4">
                Cinnamon roll <em className="italic">cakes.</em>
              </h2>
              <p className="mt-6 max-w-2xl text-lg">{cinnamonRollCake.description}</p>
            </div>
            <div className="shadow-lift relative ml-auto hidden aspect-[4/5] w-full max-w-[16rem] rotate-2 overflow-hidden rounded-[var(--radius-card)] md:block">
              <Img id={cinnamonRollCake.image} fill sizes="16rem" className="h-full w-full" />
            </div>
          </div>
          <div className="mt-16">
            <CakeBuilder />
          </div>
        </div>
      </section>

      <section
        id="custom"
        aria-labelledby="custom-title"
        className="bg-parchment scroll-mt-24 py-20 md:py-28"
      >
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-wheat-ink">Something else?</p>
            <h2 id="custom-title" className="display-md mt-4">
              Cookie boxes, cookie cakes, a big order for an event…
            </h2>
            <p className="text-crust-soft mt-5 text-lg">
              Send me what you have in mind and I&rsquo;ll let you know what I can do.
            </p>
            {/* [CONFIRM: does she take custom orders beyond cinnamon roll cakes and seasonal menus?] */}
            <ul className="mt-10 grid grid-cols-2 gap-4">
              {pastSpecials.slice(0, 4).map((p) => (
                <li key={p.title}>
                  <div className="shadow-soft relative aspect-square overflow-hidden rounded-[var(--radius-card)]">
                    <Img id={p.image} fill sizes="(min-width: 1024px) 18vw, 45vw" className="h-full w-full" />
                  </div>
                  <p className="mt-2 font-semibold">{p.title}</p>
                  <p className="text-crust-soft text-sm">{p.detail}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <RequestForm
              kind="custom"
              submitLabel="Send my request"
              notesLabel="What do you have in mind?"
              notesRequired
              successNote="Thanks! I'll get back to you by email."
            />
          </div>
        </div>
      </section>
    </>
  );
}
