// Everything about the business in one place. Edit here and the whole site updates.
// Facts only: anything not confirmed by the owner is marked [CONFIRM: …] and kept out of the UI.

export type StatusOverride = {
  /** Shown in the status pill instead of the computed status, e.g. "Closed this weekend: see you 12/5!" */
  label: string;
  /** The override stops showing at the start of this day (America/New_York), e.g. "2026-12-01". */
  until: string;
  /** Optional: when the override starts (America/New_York date). Defaults to immediately. */
  from?: string;
};

export const business = {
  name: "Pearl Bakery",
  facebookName: "Pearl Bakery - Maryland",
  tagline: "Sourdough, slow-made in Medley's Neck.",

  address: {
    street: "40960 Medley's Neck Rd",
    city: "Leonardtown",
    region: "MD",
    postalCode: "20650",
    country: "US",
    oneLine: "40960 Medley's Neck Rd, Leonardtown, MD 20650",
  },
  // US Census geocoder match for the street address. [CONFIRM: exact pin at the farmstand]
  geo: { lat: 38.27239, lng: -76.61549 },
  // Used for sunset times (Leonardtown).
  sunGeo: { lat: 38.2915, lng: -76.6358 },

  phone: "(443) 624-8782",
  phoneHref: "tel:+14436248782",
  email: "pearlbakerymd@gmail.com",
  facebook: "https://www.facebook.com/profile.php?id=61575042512947",
  facebookReviews: "https://www.facebook.com/profile.php?id=61575042512947&sk=reviews",
  // Messenger link for the page. [CONFIRM: page username for m.me link]
  messenger: "https://www.facebook.com/profile.php?id=61575042512947",

  reviews: { recommendPercent: 100, count: 11 },

  hours: {
    days: "Saturdays & Sundays",
    short: "Sat & Sun · 9 AM",
    opens: "9 AM",
    closes: "until sold out or sunset",
    line: "Saturdays & Sundays · from 9 AM · until sold out or sunset",
    note: "Stocked by about 9 AM. I sometimes restock through the morning, so if you don't see what you're looking for, shoot me a message!",
  },

  payment: ["Cash", "Venmo", "PayPal"] as const,
  paymentNote: "Cash, Venmo, or PayPal. There's a QR code plaque at the stand.",

  openedOn: "2025-03-15",

  /** Set this when the stand is closed for weather or a holiday. `null` = normal hours. */
  statusOverride: null as StatusOverride | null,

  // [BAKER FIRST NAME — confirm]. Stays out of all copy while null.
  bakerFirstName: null as string | null,

  // Real domain once there is one ([CONFIRM: domain]); until then Vercel's production URL, then localhost.
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
};

export const maps = {
  google: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.address.oneLine)}`,
  googlePlace: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address.oneLine)}`,
  apple: `https://maps.apple.com/?daddr=${encodeURIComponent(business.address.oneLine)}&dirflg=d`,
  embed: `https://www.google.com/maps?q=${encodeURIComponent(business.address.oneLine)}&z=14&output=embed`,
};
