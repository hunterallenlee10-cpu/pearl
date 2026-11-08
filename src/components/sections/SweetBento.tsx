import Link from "next/link";
import { Img } from "@/components/ui/Img";

type Tile = { id: string; name: string; href: string; span: string; sizes: string; position?: string };

// Asymmetric 12-column bento, packed with grid-flow-dense. Every two-row band adds up to 12 columns.
type Cell = Tile | { callout: "best" | "fall"; span: string };
const CELLS: Cell[] = [
  { callout: "best", span: "col-span-2 md:col-span-4" },
  {
    id: "HERO-cinnamon-roll-cake",
    name: "Cinnamon roll cake",
    href: "/pre-order#cake-builder",
    span: "col-span-2 row-span-2 md:col-span-5 md:row-span-2",
    sizes: "(min-width: 768px) 40vw, 92vw",
  },
  {
    id: "HERO-dubai-pistachio-cookie-split",
    name: "Dubai pistachio cookie",
    href: "/menu#cookies",
    span: "row-span-2 md:col-span-3 md:row-span-2",
    sizes: "(min-width: 768px) 25vw, 46vw",
  },
  { callout: "fall", span: "col-span-1 md:col-span-4" },
  {
    id: "HERO-apple-cider-donuts",
    name: "Apple cider donuts",
    href: "/menu#rolls-buns",
    span: "row-span-2 md:col-span-4 md:row-span-2",
    sizes: "(min-width: 768px) 33vw, 46vw",
  },
  {
    id: "HERO-butter-pecan-sticky-buns-trays",
    name: "Butter pecan sticky buns",
    href: "/menu#rolls-buns",
    span: "row-span-2 md:col-span-4 md:row-span-2",
    sizes: "(min-width: 768px) 33vw, 46vw",
  },
  {
    id: "smores-sandwich-cookies",
    name: "S'mores sandwich cookies",
    href: "/menu#cookies",
    span: "md:col-span-4",
    sizes: "(min-width: 768px) 33vw, 46vw",
  },
  {
    id: "HERO-soft-pretzels-pearl-sugar",
    name: "Soft pretzels",
    href: "/menu#bagels-pretzels",
    span: "col-span-2 md:col-span-4",
    sizes: "(min-width: 768px) 33vw, 46vw",
  },
  {
    id: "key-lime-coconut-cupcakes",
    name: "Key lime & coconut cupcakes",
    href: "/menu#scones-cakes",
    span: "col-span-2 md:col-span-5",
    sizes: "(min-width: 768px) 40vw, 92vw",
  },
  {
    id: "cosmic-brownie-in-hand",
    name: "Cosmic brownie",
    href: "/menu#scones-cakes",
    span: "row-span-2 md:col-span-3 md:row-span-2",
    sizes: "(min-width: 768px) 25vw, 46vw",
  },
  {
    id: "HERO-fourth-of-july-cookie-cakes",
    name: "Cookie cakes",
    href: "/pre-order",
    span: "row-span-2 md:col-span-4 md:row-span-2",
    sizes: "(min-width: 768px) 33vw, 46vw",
  },
  {
    id: "mini-oatmeal-cream-pies-crate",
    name: "Mini oatmeal cream pies",
    href: "/menu#cookies",
    span: "col-span-2 md:col-span-5",
    sizes: "(min-width: 768px) 40vw, 92vw",
  },
];

function Sticker({ name }: { name: string }) {
  return (
    <span className="peel absolute top-2.5 left-2.5 grid size-[4.75rem] place-items-center rounded-full text-center md:top-4 md:left-4 md:size-28">
      <span className="peel-face grid size-full place-items-center rounded-full px-2">
        <span>
          <span className="font-display block text-[0.8rem] leading-none italic md:text-sm">Pearl</span>
          <span className="mt-0.5 block text-[0.6rem] leading-tight font-semibold tracking-wide uppercase md:mt-1 md:text-[0.72rem]">
            {name}
          </span>
        </span>
      </span>
    </span>
  );
}

export function SweetBento() {
  return (
    <section aria-labelledby="sweet-title" className="bg-flour relative pt-10 pb-28 md:pb-36">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-wheat-ink" data-reveal>
              The sweet side
            </p>
            <h2 id="sweet-title" className="display-lg mt-4 max-w-[14ch]" data-reveal>
              Cinnamon rolls, cookies &amp; <em className="italic">things you&rsquo;ll go back for.</em>
            </h2>
          </div>
          <Link href="/menu" className="btn btn-secondary" data-reveal>
            The full rotating menu <span aria-hidden>→</span>
          </Link>
        </div>

        <ul className="mt-14 grid grid-flow-dense auto-rows-[minmax(9rem,42vw)] grid-cols-2 gap-3 md:auto-rows-[minmax(10rem,15vw)] md:grid-cols-12 md:gap-4">
          {CELLS.map((c, i) =>
            "callout" in c ? (
              c.callout === "best" ? (
                <li
                  key="best"
                  className={`kraft flex flex-col justify-between rounded-[var(--radius-card)] p-5 md:p-8 ${c.span}`}
                  data-reveal
                >
                  <p className="eyebrow text-wheat-ink">The best-seller</p>
                  <p className="font-display text-[1.6rem] leading-[1.05] md:text-[2.1rem]">
                    Cinnamon rolls, <em className="italic">nearly every weekend.</em>
                  </p>
                </li>
              ) : (
                <li
                  key="fall"
                  className={`bg-espresso text-flour flex flex-col justify-between rounded-[var(--radius-card)] p-5 md:p-8 ${c.span}`}
                  data-reveal
                >
                  <p className="eyebrow text-wheat">Fall staple</p>
                  <p className="font-display text-[1.35rem] leading-[1.05] md:text-[2.1rem]">
                    Apple cider donuts. <em className="italic">They sell out.</em>
                  </p>
                </li>
              )
            ) : (
              <BentoTile key={c.id} t={c} i={i} />
            ),
          )}
        </ul>
      </div>

      <style>{`
        .bento-tile { transition: transform .7s cubic-bezier(.34,1.56,.64,1); }
        .bento-tile:active { transform: scale(.98); transition-duration: .12s; transition-timing-function: ease-out; }
        .bento-tile img { transition: transform 1.2s var(--ease-dough); }
        .bento-tile:hover img, .bento-tile:focus-visible img { transform: scale(1.045); }
        .peel { perspective: 600px; }
        .peel-face {
          background: radial-gradient(circle at 30% 25%, #fff 0%, var(--color-flour) 55%, #efe4d2 100%);
          color: var(--color-crust);
          box-shadow: 0 6px 14px -6px rgb(42 27 18 / .5), inset 0 0 0 1.5px rgb(91 58 36 / .2), inset 0 0 0 5px #fbf6ee, inset 0 0 0 6px rgb(91 58 36 / .3);
          transform-origin: 85% 85%;
          transition: transform .6s var(--ease-dough), box-shadow .6s var(--ease-dough);
          position: relative; overflow: hidden;
        }
        .peel-face::after {
          content: ""; position: absolute; inset: 0; border-radius: inherit;
          background: var(--pearl); opacity: 0; mix-blend-mode: soft-light; transition: opacity .5s;
          background-size: 200% 200%; background-position: 100% 0;
        }
        .bento-tile:hover .peel-face, .bento-tile:focus-visible .peel-face {
          transform: rotateX(16deg) rotateY(-18deg) rotateZ(-7deg) translate(-2px,-3px);
          box-shadow: 10px 14px 22px -8px rgb(42 27 18 / .55), inset 0 0 0 1.5px rgb(91 58 36 / .2), inset 0 0 0 5px #fbf6ee, inset 0 0 0 6px rgb(91 58 36 / .3);
        }
        .bento-tile:hover .peel-face::after { opacity: .9; animation: sheen 1s var(--ease-dough); }
        @keyframes sheen { from { background-position: 100% 0; } to { background-position: 0 100%; } }
        @media (prefers-reduced-motion: reduce) {
          .bento-tile, .bento-tile:active { transform: none !important; }
          .bento-tile:hover img { transform: none; }
          .bento-tile:hover .peel-face { transform: none; }
          .bento-tile:hover { outline: 2px solid var(--color-wheat); outline-offset: 3px; }
        }
      `}</style>
    </section>
  );
}

function BentoTile({ t, i }: { t: Tile; i: number }) {
  return (
    <li
      className={t.span}
      data-reveal
      style={{ "--reveal-delay": `${(i % 4) * 0.06}s` } as React.CSSProperties}
    >
      <Link
        href={t.href}
        className="bento-tile group bg-parchment shadow-soft relative block h-full overflow-hidden rounded-[var(--radius-card)]"
        data-cursor="view"
      >
        <Img id={t.id} fill sizes={t.sizes} className="h-full w-full" position={t.position} />
        <Sticker name={t.name} />
        <span className="sr-only">: see it on the menu</span>
      </Link>
    </li>
  );
}
