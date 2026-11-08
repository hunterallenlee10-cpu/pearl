import type { Metadata, Viewport } from "next";
import { Caveat, Fraunces, Instrument_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SiteNav } from "@/components/nav/SiteNav";
import { SiteFooter } from "@/components/nav/SiteFooter";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Cursor } from "@/components/motion/Cursor";
import { bakeryJsonLd, siteUrl } from "@/lib/seo";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pearl Bakery · Sourdough farmstand in Leonardtown, MD",
    template: "%s · Pearl Bakery, Leonardtown MD",
  },
  description:
    "Fresh sourdough, cinnamon rolls and sweet things at a self-serve farmstand on Medley's Neck Rd in Leonardtown, MD. Open Saturdays & Sundays from 9 AM until sold out or sunset.",
  applicationName: "Pearl Bakery",
  alternates: { canonical: "/" },
  openGraph: { siteName: "Pearl Bakery", locale: "en_US", type: "website" },
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport: Viewport = {
  themeColor: "#FBF6EE",
  width: "device-width",
  initialScale: 1,
};

// Runs before paint: marks JS as available and skips the preloader if it already played this
// session or the visitor prefers reduced motion.
const boot = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('pearl:proofed')||matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('proofed')}catch(e){d.classList.add('proofed')}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${instrument.variable} ${caveat.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bakeryJsonLd()) }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only-focusable fixed top-3 left-3 z-[100] rounded-full bg-crust px-5 py-3 font-semibold text-flour"
        >
          Skip to content
        </a>
        <SiteNav />
        <main id="main" tabIndex={-1} className="relative z-10 bg-flour outline-none md:mb-0">
          {children}
        </main>
        <SiteFooter />
        <div className="grain" aria-hidden />
        <MotionProvider />
        <Cursor />
        <Analytics />
      </body>
    </html>
  );
}
