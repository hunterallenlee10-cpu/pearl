import { PageHeader } from "@/components/ui/PageHeader";
import { ChalkboardWeekend } from "@/components/sections/ChalkboardWeekend";
import { MenuFilter } from "@/components/menu/MenuFilter";
import { Img } from "@/components/ui/Img";
import { menu, menuCategories } from "@/content/menu";
import { business } from "@/content/business";
import { hasImage } from "@/lib/images";
import { pageMeta } from "@/lib/seo";

export const revalidate = 300;

export const metadata = pageMeta({
  title: "Menu: sourdough, cinnamon rolls & cookies",
  description:
    "This weekend's menu at Pearl Bakery's farmstand in Leonardtown, MD, plus the full rotating list: sourdough loaves, bagels, cinnamon rolls, cookies, scones, cakes, local honey and eggs.",
  path: "/menu",
});

export default function MenuPage() {
  return (
    <>
      <PageHeader
        eyebrow="The menu"
        title={
          <>
            What&rsquo;s <em className="italic">baking.</em>
          </>
        }
        intro="Everything rotates. Here's what's at the stand this weekend, and below it, the whole cast of things I bake."
      />

      <div className="-mt-10">
        <ChalkboardWeekend />
      </div>

      <section aria-labelledby="library-title" className="bg-flour pb-28">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-crust/15 pt-16">
            <h2 id="library-title" className="display-md">
              The rotating menu
            </h2>
            <p className="max-w-sm text-crust-soft">
              Not everything is out every weekend. Check the board above or{" "}
              <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="font-semibold text-crust underline">
                Facebook
              </a>{" "}
              for what&rsquo;s on now.
            </p>
          </div>

          <MenuFilter categories={menuCategories.map((c) => ({ id: c.id, label: c.label }))}>
            {menuCategories.map((cat) => {
              const items = menu.filter((m) => m.category === cat.id);
              const pictured = items.filter((i) => hasImage(i.image));
              const plain = items.filter((i) => !hasImage(i.image));
              return (
                <section
                  key={cat.id}
                  id={cat.id}
                  data-category={cat.id}
                  aria-labelledby={`cat-${cat.id}`}
                  className="menu-cat scroll-mt-28 pt-16"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 id={`cat-${cat.id}`} className="font-display text-4xl md:text-5xl">
                      {cat.label}
                    </h3>
                    <p className="text-crust-soft">{cat.blurb}</p>
                  </div>

                  {pictured.length > 0 && (
                    <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                      {pictured.map((it) => (
                        <li key={it.name} className="group">
                          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-parchment shadow-soft" data-cursor="view">
                            <Img
                              id={it.image!}
                              fill
                              sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 46vw"
                              className="h-full w-full transition-transform duration-[1.2s] ease-(--ease-dough) group-hover:scale-[1.04]"
                            />
                            {it.badge && (
                              <span className="absolute top-3 left-3 rounded-full bg-flour/95 px-3 py-1 text-xs font-semibold tracking-wide uppercase shadow-soft">
                                {it.badge}
                              </span>
                            )}
                          </div>
                          <p className="mt-3 flex items-baseline justify-between gap-2 font-semibold">
                            <span>{it.name}</span>
                            {typeof it.price === "number" && <span className="font-display text-lg">${it.price}</span>}
                          </p>
                          {it.note && <p className="text-sm text-crust-soft">{it.note}</p>}
                        </li>
                      ))}
                    </ul>
                  )}

                  {plain.length > 0 && (
                    <ul className="mt-8 grid gap-x-10 border-t border-crust/10 sm:grid-cols-2 lg:grid-cols-3">
                      {plain.map((it) => (
                        <li key={it.name} className="flex items-baseline justify-between gap-3 border-b border-crust/10 py-3.5">
                          <span>
                            <span className="font-medium">{it.name}</span>
                            {it.note && <span className="block text-sm text-crust-soft">{it.note}</span>}
                          </span>
                          {it.badge && (
                            <span className="shrink-0 rounded-full bg-parchment px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase">
                              {it.badge}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })}
          </MenuFilter>
        </div>
      </section>
    </>
  );
}
