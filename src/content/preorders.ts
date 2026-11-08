// Seasonal pre-order campaigns. The site shows whichever campaign is open right now
// (between opensAt and closesAt, Eastern time). When none is open, it shows the evergreen
// Cinnamon Roll Cake instead.
//
// To add a campaign (e.g. Christmas): copy the Thanksgiving block, change the dates, items and
// form link, and drop the menu graphic into _source-photos/01-brand-logo-graphics.
// Dates use an explicit -05:00 (EST) or -04:00 (EDT) offset.

export type PreorderItem = { name: string; detail?: string; price: number; unit?: string };
export type Campaign = {
  id: string;
  title: string;
  shortTitle: string;
  opensAt: string;
  closesAt: string;
  closesLabel: string;
  pickup: { label: string; date: string; window: string; place: string };
  formUrl: string;
  sections: { heading: string; items: PreorderItem[] }[];
  rules: string[];
  menuImage?: string;
};

export const THANKSGIVING_FORM_URL = "[THANKSGIVING_FORM_URL]";

export const campaigns: Campaign[] = [
  {
    id: "thanksgiving-2026",
    title: "Thanksgiving Pre-orders",
    shortTitle: "Thanksgiving",
    opensAt: "2026-10-01T00:00:00-04:00", // [CONFIRM: date the Thanksgiving menu was posted]
    // "Orders close at midnight Sunday 11/22": the end of Sunday, Eastern time.
    closesAt: "2026-11-23T00:00:00-05:00",
    closesLabel: "Orders close midnight Sunday, Nov 22",
    pickup: {
      label: "Pick up Wed, Nov 25, 4–7 PM",
      date: "Wednesday, November 25",
      window: "4–7 PM",
      place: "At the stand, 40960 Medley's Neck Rd",
    },
    formUrl: THANKSGIVING_FORM_URL,
    sections: [
      {
        heading: "Sourdough",
        items: [
          { name: "Classic Sourdough Loaf", price: 10 },
          { name: "Rosemary Garlic Parmesan", price: 12 },
          { name: "Sourdough Dinner Rolls", detail: "1 dozen", price: 18 },
        ],
      },
      {
        heading: "Specialty Cakes",
        items: [
          { name: "Pumpkin Spice Cupcakes", detail: "1 dozen, cream cheese frosting", price: 36 },
          {
            name: "Brown Sugar Cake",
            detail: "8-inch, 3 layers, apple butter filling, cinnamon buttercream",
            price: 60,
          },
        ],
      },
      {
        heading: "Desserts",
        items: [
          { name: "Apple Pie", price: 25 },
          {
            name: "Cookie Pie",
            detail: '10" chocolate chip cookie decorated with buttercream frosting',
            price: 30,
          },
        ],
      },
      {
        heading: "Cookies",
        items: [
          { name: "Brown Butter Chocolate Chip Cookies", detail: "1 dozen", price: 30 },
          { name: "Oatmeal Cream Pies", detail: "1 dozen mini cookie sandwiches", price: 32 },
        ],
      },
    ],
    rules: [
      "Orders close at midnight Sunday 11/22, no exceptions.",
      "Payment is due at pick-up: cash, Venmo, or PayPal only.",
      "Pick-up is Wednesday 11/25, 4–7 PM at the stand (40960 Medleys Neck Rd).",
      "After I review your request and confirm quantities, you'll get a confirmation email from me personally.",
      "Submitting a request doesn't guarantee your order. It's officially reserved once you get my confirmation email.",
      "Quantities are limited.",
    ],
    menuImage: "thanksgiving-2026-preorder-menu-CURRENT",
  },
];

export const cinnamonRollCake = {
  title: "Cinnamon Roll Cakes",
  badge: "Pre-order only",
  // Her description, verbatim.
  description:
    "Each cake is made with 10 of our classic, best-selling cinnamon rolls, stacked into layers and finished with sweet creamy frosting. Perfect for birthdays, baby showers, holidays, office parties, or just because! The frosting color and sprinkle colors/styles can be customized to fit your theme.",
  howToOrder: "Ordered by messaging me. Build yours below and send the request.",
  price: "[PRICE]" as const,
  image: "HERO-cinnamon-roll-cake",
};

/** Past seasonal offers, shown on /pre-order as examples of what comes around. */
export const pastSpecials = [
  {
    title: "Christmas pre-orders",
    detail: "Cookie boxes and a Christmas Morning Brunch Box (2025)",
    image: "christmas-2025-preorder-menu",
  },
  {
    title: "Christmas in July",
    detail: "Gingerbread blondies, peppermint mocha cookies, tree cake sugar cookies",
    image: "christmas-in-july-flyer",
  },
  { title: "Valentine's", detail: "Heart cookie cakes", image: "valentines-heart-cookie-cake" },
  {
    title: "Fourth of July",
    detail: "Cookie cakes, plus a Friday pop-up",
    image: "HERO-fourth-of-july-cookie-cakes",
  },
  { title: "Super Bowl", detail: "Pretzel bites and football cake pops", image: "football-cake-pops" },
];
