"use client";
import { useState } from "react";
import type { Campaign } from "@/content/preorders";
import { RequestForm } from "./RequestForm";

/** Mirrors her Google Form: pick quantities, add contact details, send the request. */
export function PreorderForm({ campaign }: { campaign: Campaign }) {
  const all = campaign.sections.flatMap((s) => s.items.map((i) => ({ ...i, section: s.heading })));
  const [qty, setQty] = useState<Record<string, number>>({});
  const set = (name: string, n: number) => setQty((q) => ({ ...q, [name]: Math.max(0, Math.min(12, n)) }));
  const chosen = all.filter((i) => (qty[i.name] ?? 0) > 0);
  const total = chosen.reduce((s, i) => s + i.price * qty[i.name], 0);
  const itemsText = chosen.map((i) => `${qty[i.name]} × ${i.name}${i.detail ? ` (${i.detail})` : ""} — $${i.price} each`).join("\n");

  return (
    <RequestForm
      kind="preorder"
      campaign={campaign.title}
      submitLabel="Send my order request"
      successNote="I'll review your request and confirm quantities. Your order is officially reserved once you get my confirmation email."
    >
      <fieldset>
        <legend className="font-display text-2xl">What would you like?</legend>
        <div className="mt-4 space-y-6">
          {campaign.sections.map((sec) => (
            <div key={sec.heading}>
              <p className="eyebrow text-wheat-ink">{sec.heading}</p>
              <ul className="mt-2 divide-y divide-crust/10 border-y border-crust/10">
                {sec.items.map((it) => {
                  const n = qty[it.name] ?? 0;
                  const id = `q-${it.name.replace(/\W+/g, "-")}`;
                  return (
                    <li key={it.name} className="flex items-center justify-between gap-4 py-3">
                      <label htmlFor={id} className="min-w-0">
                        <span className="font-semibold">{it.name}</span> <span className="font-display">${it.price}</span>
                        {it.detail && <span className="block text-sm text-crust-soft">{it.detail}</span>}
                      </label>
                      <div className="flex shrink-0 items-center rounded-full bg-flour ring-1 ring-crust/20">
                        <button type="button" onClick={() => set(it.name, n - 1)} className="grid size-11 place-items-center rounded-full text-xl" aria-label={`One fewer ${it.name}`}>
                          −
                        </button>
                        <input
                          id={id}
                          type="number"
                          inputMode="numeric"
                          min={0}
                          max={12}
                          value={n}
                          onChange={(e) => set(it.name, Number(e.target.value) || 0)}
                          className="w-10 appearance-none bg-transparent text-center font-semibold [-moz-appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
                          aria-label={`Quantity of ${it.name}`}
                        />
                        <button type="button" onClick={() => set(it.name, n + 1)} className="grid size-11 place-items-center rounded-full text-xl" aria-label={`One more ${it.name}`}>
                          +
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </fieldset>
      <input type="hidden" name="items" value={itemsText} />
      <p className="rounded-xl bg-flour p-4 text-lg" aria-live="polite">
        {chosen.length ? (
          <>
            <span className="font-semibold">Estimated total: ${total}</span>
            <span className="text-crust-soft"> · paid at pick-up (cash, Venmo, or PayPal)</span>
          </>
        ) : (
          <span className="text-crust-soft">Add a few things above and your estimate shows here.</span>
        )}
      </p>
    </RequestForm>
  );
}
