// The story, from opening day to the new farmstand. Real dates only.

export type TimelineEntry = {
  id: string;
  when: string;
  title: string;
  body?: string;
  quote?: string;
  images: string[];
  era: "past" | "present";
};

export const timeline: TimelineEntry[] = [
  {
    id: "opening",
    when: "March 15, 2025",
    title: "Opening day",
    body: "A little trailer, a few shelves of sourdough, and the very first weekend at the stand.",
    images: ["opening-day-march-15-2025"],
    era: "past",
  },
  {
    id: "trailer",
    when: "Spring–Summer 2025",
    title: "The little trailer on the farm road",
    body: "Weekend mornings by the fields, with the bread bagged up and the cooler out front.",
    images: ["HERO-trailer-wide-green-field", "trailer-breton-bay-farm-sign"],
    era: "past",
  },
  {
    id: "seasons",
    when: "Every season",
    title: "Every season at the stand",
    body: "Bunting for the Fourth of July, a scarecrow in a Pearl apron for fall, and cold, bright winter mornings.",
    images: ["trailer-patriotic-bunting", "scarecrow-pearl-apron-pumpkins", "trailer-open-sign-winter"],
    era: "past",
  },
  {
    id: "one-year",
    when: "March 2026",
    title: "One year",
    quote: "I truly never imagined how much it would grow in just one year.",
    body: "One year ago today I opened Pearl Bakery.",
    images: ["HERO-baker-with-bread-at-farmstand"],
    era: "past",
  },
  {
    id: "moved",
    when: "Fall 2026",
    title: "We moved!",
    body: "Just a couple houses down the road, with a new look: a white shed with string lights, a checkered floor, a white hutch and whiskey barrels.",
    images: ["we-moved-announcement-40960-medleys-neck", "HERO-shed-exterior-fall-field"],
    era: "present",
  },
];
