// Questions for /visit. Answers use only confirmed facts; anything unconfirmed is marked.

export type Faq = { q: string; a: string; confirm?: string };

export const faqs: Faq[] = [
  {
    q: "When are you open?",
    a: "Saturdays and Sundays from 9 AM, until sold out or sunset. The stand is stocked by about 9, and I sometimes restock through the morning.",
  },
  {
    q: "What if I don't see what I'm looking for?",
    a: "Shoot me a message! I'll be restocking throughout the morning, so it might be on its way out.",
  },
  {
    q: "How do I pay?",
    a: "Cash, Venmo, or PayPal. There's a QR code plaque at the stand.",
  },
  {
    q: "Are you ever closed on a weekend?",
    a: "Occasionally, for holidays or weather. Closures and pop-up days are always posted on Facebook first, and the status at the top of this site shows them too.",
  },
  {
    q: "How do I know what's on the menu?",
    a: 'It changes every week. The "This Weekend" board on the menu page is kept up to date, and the full menu goes up on Facebook too.',
  },
  {
    q: "Did you move?",
    a: "Yes! In fall 2026 the farmstand moved just a couple houses down the road to 40960 Medley's Neck Rd, into a new white shed with string lights.",
  },
  {
    q: "Can I order ahead?",
    a: "Cinnamon roll cakes are pre-order only, and there are seasonal pre-order menus for holidays like Thanksgiving and Christmas. Everything's on the Pre-Order page.",
  },
  {
    q: "Do you have eggs and honey?",
    a: "Local honey is at the stand, and fresh chicken and duck eggs have been a regular too.",
    confirm: "[CONFIRM: eggs still available]",
  },
  {
    q: "What about allergies?",
    a: "Every item is labelled with its ingredients. If you have an allergy question, message me before you come.",
    confirm: "[CONFIRM: allergen wording]",
  },
];
