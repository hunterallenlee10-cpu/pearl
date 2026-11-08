import type { Campaign } from "@/content/preorders";
import { formatPrice } from "@/lib/campaigns";
import { Logo } from "@/components/brand/Logo";

/**
 * The printed-menu card: brown gingham border with a lace-scallop edge, echoing her real
 * Thanksgiving menu.
 */
export function GinghamMenuCard({ campaign, headingLevel = 3 }: { campaign: Campaign; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="gingham rounded-[6px] p-4 shadow-lift md:p-6">
      <div className="lace p-[7px]">
        <div className="bg-[#fffdf8] px-6 py-8 text-crust md:px-10 md:py-10">
          <div className="text-center">
            <Logo className="mx-auto h-14 w-auto" title="Pearl Bakery" />
            <H className="mt-3 font-display text-4xl leading-none italic md:text-5xl">{campaign.title}</H>
          </div>
          <div className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {campaign.sections.map((sec) => (
              <div key={sec.heading}>
                <p className="eyebrow border-b border-crust/20 pb-1.5 text-[0.75rem]">{sec.heading}</p>
                <ul className="mt-3 space-y-2.5">
                  {sec.items.map((it) => (
                    <li key={it.name} className="text-[0.95rem] leading-snug">
                      <span className="flex items-baseline gap-2">
                        <span className="font-semibold">{it.name}</span>
                        <span aria-hidden className="mb-1 flex-1 border-b border-dotted border-crust/40" />
                        <span className="font-display text-lg">{formatPrice(it.price)}</span>
                      </span>
                      {it.detail && <span className="block text-sm text-crust-soft">{it.detail}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-dashed border-crust/30 pt-5 text-center text-sm">
            <p className="font-semibold">{campaign.closesLabel} · no exceptions</p>
            <p className="mt-1">
              {campaign.pickup.label} · {campaign.pickup.place}
            </p>
            <p className="mt-1 text-crust-soft">Payment due at pick-up: cash, Venmo, or PayPal.</p>
          </div>
        </div>
      </div>
      <style>{`
        .lace {
          background:
            radial-gradient(circle, #fffdf8 5.5px, transparent 6px) -7px -7px / 14px 14px;
          filter: drop-shadow(0 1px 0 rgb(91 58 36 / .25));
        }
      `}</style>
    </div>
  );
}
