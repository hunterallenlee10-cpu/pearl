import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { WheatSprig } from "@/components/ui/Doodle";
import { business, maps } from "@/content/business";
import { navLinks } from "./nav-links";

/** Deep espresso footer, revealed like a curtain as the page lifts away (md+). */
export function SiteFooter() {
  return (
    <footer className="on-dark relative z-0 bg-espresso text-flour md:sticky md:bottom-0">
      <div className="container-page grid gap-12 pt-20 pb-10 md:grid-cols-12 md:pt-24">
        <div className="md:col-span-5">
          <Logo tone="cream" className="h-24 w-auto md:h-28" title="Pearl Bakery" />
          <p className="mt-8 max-w-sm font-display text-3xl leading-tight text-balance md:text-4xl">
            Sold out? Follow on Facebook for next weekend&rsquo;s menu.
          </p>
          <a
            href={business.facebook}
            className="btn btn-light mt-6"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="external"
          >
            Pearl Bakery on Facebook <span aria-hidden>↗</span>
          </a>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 md:col-span-7 md:grid-cols-[1fr_1.35fr_0.8fr]">
          <div>
            <h2 className="eyebrow text-wheat">Hours</h2>
            <p className="mt-3">
              {business.hours.days}
              <br />
              from {business.hours.opens}
              <br />
              {business.hours.closes}
            </p>
          </div>
          <div>
            <h2 className="eyebrow text-wheat">Find us</h2>
            <address className="mt-3 not-italic">
              <a href={maps.google} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                {business.address.street}
                <br />
                {business.address.city}, {business.address.region} {business.address.postalCode}
              </a>
              <br />
              <a href={business.phoneHref} className="mt-3 inline-block hover:underline">
                {business.phone}
              </a>
              <br />
              <a href={`mailto:${business.email}`} className="[overflow-wrap:anywhere] hover:underline">
                {business.email}
              </a>
            </address>
          </div>
          <div>
            <h2 className="eyebrow text-wheat">Around here</h2>
            <ul className="mt-3 space-y-1.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="container-page flex flex-col gap-3 border-t border-flour/12 py-6 text-sm text-flour/70 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2">
          <WheatSprig className="h-5 w-auto text-wheat" />© {new Date().getFullYear()} Pearl Bakery · Leonardtown, Maryland
        </p>
        <p>{/* [SITE CREDIT] */}Made with care in Southern Maryland.</p>
      </div>
    </footer>
  );
}
