"use client";
import { useId, useState } from "react";
import { CakeSvg, type Sprinkles } from "./CakeSvg";
import { RequestForm } from "./RequestForm";

const FROSTINGS = [
  { name: "Classic cream", hex: "#FBF4E6" },
  { name: "Blush pink", hex: "#F4C6CF" },
  { name: "Baby blue", hex: "#BFD7EA" },
  { name: "Lavender", hex: "#D9C8EC" },
  { name: "Mint", hex: "#C9E8D2" },
  { name: "Buttercup", hex: "#F7E3A3" },
];

const SPRINKLES: { id: Sprinkles; label: string }[] = [
  { id: "rainbow", label: "Rainbow" },
  { id: "nonpareils", label: "Nonpareils" },
  { id: "pearls", label: "Pearls" },
  { id: "seasonal", label: "Seasonal shapes" },
];

const OCCASIONS = ["Birthday", "Baby shower", "Holiday", "Office party", "Just because", "Something else"];

/** Pick frosting, sprinkles and occasion; the cake redraws live; send the build as a request. */
export function CakeBuilder() {
  const [frosting, setFrosting] = useState(FROSTINGS[0]);
  const [custom, setCustom] = useState("#E8B4C8");
  const [useCustom, setUseCustom] = useState(false);
  const [sprinkles, setSprinkles] = useState<Sprinkles>("rainbow");
  const [occasion, setOccasion] = useState("Birthday");
  const [date, setDate] = useState("");
  const ids = { occ: useId(), date: useId(), custom: useId() };

  const color = useCustom ? custom : frosting.hex;
  const colorName = useCustom ? `Custom (${custom.toUpperCase()})` : frosting.name;
  const sprinkleName = SPRINKLES.find((s) => s.id === sprinkles)!.label;
  const details = [
    `Frosting: ${colorName}`,
    `Sprinkles: ${sprinkleName}`,
    `Occasion: ${occasion}`,
    date && `Date needed: ${date}`,
  ]
    .filter(Boolean)
    .join("\n");

  const swatch =
    "relative grid size-12 cursor-pointer place-items-center rounded-full ring-1 ring-crust/25 transition-transform duration-300 ease-(--ease-dough) peer-checked:scale-110 peer-checked:ring-[3px] peer-checked:ring-crust peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-wheat";

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="relative rounded-[var(--radius-card)] bg-[radial-gradient(circle_at_50%_40%,#fffaf1,#f1e4cf)] p-6 shadow-soft ring-1 ring-crust/10">
          <CakeSvg frosting={color} sprinkles={sprinkles} accent={occasion === "Holiday" ? "#B4553A" : "#C99A5B"} />
          <p className="mt-2 text-center font-hand text-2xl" aria-live="polite">
            {colorName} frosting · {sprinkleName.toLowerCase()} · {occasion.toLowerCase()}
          </p>
        </div>
        <p className="mt-3 text-center text-sm text-crust-soft">An illustration, not a photo. Every real cake is made by hand.</p>
      </div>

      <div>
        <fieldset>
          <legend className="font-display text-2xl">1. Frosting colour</legend>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {FROSTINGS.map((f) => (
              <label key={f.name} className="inline-flex">
                <input
                  type="radio"
                  name="frosting"
                  className="peer sr-only"
                  checked={!useCustom && frosting.name === f.name}
                  onChange={() => {
                    setUseCustom(false);
                    setFrosting(f);
                  }}
                />
                <span className={swatch} style={{ background: f.hex }} title={f.name}>
                  <span className="sr-only">{f.name}</span>
                </span>
              </label>
            ))}
            <label className="inline-flex">
              <input type="radio" name="frosting" className="peer sr-only" checked={useCustom} onChange={() => setUseCustom(true)} />
              <span className={swatch} style={{ background: "conic-gradient(#f4c6cf,#f7e3a3,#c9e8d2,#bfd7ea,#d9c8ec,#f4c6cf)" }} title="Custom colour">
                <span className="sr-only">Custom colour</span>
              </span>
            </label>
            {useCustom && (
              <span className="inline-flex items-center gap-2">
                <label htmlFor={ids.custom} className="text-sm font-semibold">
                  Pick a colour
                </label>
                <input id={ids.custom} type="color" value={custom} onChange={(e) => setCustom(e.target.value)} className="h-11 w-14 cursor-pointer rounded-lg border-0 bg-transparent" />
              </span>
            )}
          </div>
        </fieldset>

        <fieldset className="mt-10">
          <legend className="font-display text-2xl">2. Sprinkles</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {SPRINKLES.map((s) => (
              <label key={s.id} className="inline-flex">
                <input type="radio" name="sprinkles" className="peer sr-only" checked={sprinkles === s.id} onChange={() => setSprinkles(s.id)} />
                <span className="inline-flex min-h-11 cursor-pointer items-center rounded-full px-4 font-semibold ring-1 ring-crust/25 peer-checked:bg-crust peer-checked:text-flour peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-wheat">
                  {s.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={ids.occ} className="font-display text-2xl">
              3. Occasion
            </label>
            <select
              id={ids.occ}
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="mt-3 w-full rounded-xl bg-flour px-4 py-3 shadow-[inset_0_0_0_1.5px_rgb(91_58_36/0.25)]"
            >
              {OCCASIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={ids.date} className="font-display text-2xl">
              4. When <span className="font-sans text-base font-normal text-crust-soft">(optional)</span>
            </label>
            <input
              id={ids.date}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-3 w-full rounded-xl bg-flour px-4 py-3 shadow-[inset_0_0_0_1.5px_rgb(91_58_36/0.25)]"
            />
          </div>
        </div>

        <div className="mt-12 border-t border-crust/15 pt-10">
          <h3 className="font-display text-2xl">5. Send it to me</h3>
          <p className="mt-2 text-crust-soft">
            I&rsquo;ll get back to you about the date and price. It&rsquo;s confirmed once you hear back from me.
          </p>
          <div className="mt-6">
            <RequestForm
              kind="cake"
              submitLabel="Request this cake"
              successNote="I'll get back to you about your cinnamon roll cake. It's confirmed once you hear back from me."
            >
              <input type="hidden" name="details" value={details} />
            </RequestForm>
          </div>
        </div>
      </div>
    </div>
  );
}
