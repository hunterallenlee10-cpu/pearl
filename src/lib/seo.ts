import type { Metadata } from "next";
import { business } from "@/content/business";

export const siteUrl = business.siteUrl.replace(/\/$/, "");

export function pageMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: "Pearl Bakery", type: "website", locale: "en_US" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function bakeryJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "@id": `${siteUrl}/#bakery`,
    name: business.name,
    alternateName: business.facebookName,
    description:
      "Fresh sourdough, cinnamon rolls and sweet things from a self-serve farmstand in Leonardtown, Maryland. Open Saturdays and Sundays from 9 AM until sold out or sunset.",
    url: siteUrl,
    image: [`${siteUrl}/opengraph-image`],
    logo: `${siteUrl}/brand/icon-512.png`,
    telephone: "+1-443-624-8782",
    email: business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: business.geo.lat, longitude: business.geo.lng },
    areaServed: ["Leonardtown", "St. Mary's County", "Southern Maryland"],
    // Closing time is "until sold out or sunset", so only the opening time is listed.
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: "https://schema.org/Saturday", opens: "09:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "https://schema.org/Sunday", opens: "09:00" },
    ],
    paymentAccepted: "Cash, Venmo, PayPal",
    servesCuisine: "Bakery",
    sameAs: [business.facebook],
    foundingDate: business.openedOn,
  };
}
