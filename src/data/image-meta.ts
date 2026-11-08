// Hand-written data for every photo the site uses. `scripts/process-images.mjs` reads this file,
// processes only the photos listed here, and merges it into `src/data/images.json`.
//
// To add a photo: put the original in `_source-photos/<folder>/`, add an entry here keyed by its
// filename (without .jpg), then run `npm run photos:process`.
//
// - alt:      what a person would see. Specific, never "bakery image".
// - position: CSS object-position used when the photo is cropped (keeps the bread in frame).
// - era:      "past" for the original trailer. Past photos must never represent where to go today.
//             Photos in 06-farmstand-original-trailer are "past" automatically.
// Keep this file to plain, erasable TypeScript so Node can import it directly.

export type ImageMeta = {
  alt: string;
  position?: string;
  era?: "past" | "present";
};

export const imageMeta: Record<string, ImageMeta> = {
  // ── Brand & graphics (never colour-graded) ──────────────────────────────
  "thanksgiving-2026-preorder-menu-CURRENT": {
    alt: "Pearl Bakery's Thanksgiving 2026 pre-order menu with a brown gingham border and lace edge, listing sourdough, specialty cakes, desserts and cookies with prices, and a QR code to order",
  },
  "we-moved-announcement-40960-medleys-neck": {
    alt: "\"We moved!\" announcement over a photo of the new white farmstand shed with mums by the door, captioned 40960 Medley's Neck Rd.",
    position: "50% 60%",
  },
  "opening-day-march-15-2025": {
    alt: "The original Pearl Bakery trailer stocked with bread on a grey morning, captioned March 15th, 2025",
    era: "past",
  },
  "christmas-2025-preorder-menu": {
    alt: "Christmas 2025 pre-order menu decorated with holly and pine, listing sourdough loaves, cinnamon rolls, a Christmas Morning Brunch Box and cookie boxes",
  },
  "christmas-in-july-flyer": {
    alt: "\"Christmas in July!\" flyer featuring gingerbread blondies, peppermint mocha cookies and Christmas tree cake sugar cookies",
  },
  "closed-next-weekend-chalkboard": {
    alt: "Chalkboard sign reading \"Closed next weekend 5/9 – 5/10. Have a happy Mother's Day!\"",
  },

  // ── Bread & savory ──────────────────────────────────────────────────────
  "HERO-golden-boules-pile": {
    alt: "A pile of golden sourdough boules fresh from the oven, the front loaf split open along a deep score",
    position: "40% 62%",
  },
  "HERO-boule-pile-leaf-scoring": {
    alt: "Sourdough boules heaped together, one in front dusted with flour and scored with a leaf pattern",
    position: "50% 45%",
  },
  "HERO-pumpkin-spice-sourdough-loaves": {
    alt: "Pumpkin spice sourdough loaves scored like pumpkins with deep orange crumb showing through the cuts",
    position: "50% 40%",
  },
  "HERO-classic-loaf-styled": {
    alt: "Classic sourdough loaf with a single curved ear, on a round wooden board over a blue-striped linen",
  },
  "HERO-rosemary-loaf-styled": {
    alt: "Rosemary garlic parmesan sourdough loaf on a round wooden board over a blue-striped linen",
  },
  "HERO-jalapeno-cheddar-loaf-styled": {
    alt: "Jalapeño cheddar sourdough boule studded with green jalapeño slices and melted cheddar, on a round wooden board over a blue-striped linen",
  },
  "HERO-blueberry-lemon-loaf-styled": {
    alt: "Blueberry lemon sourdough loaf with dark blueberries bursting through the crust, on a round wooden board over a blue-striped linen",
  },
  "HERO-cinnamon-swirl-loaf-sliced": {
    alt: "Cinnamon swirl sourdough sandwich loaf cut in half on a cooling rack, showing the cinnamon spiral inside",
    position: "50% 45%",
  },
  "HERO-scored-boule-in-hand": {
    alt: "A hand holding up a tall, deeply browned sourdough boule with a single long score and wheat-stalk cuts",
    position: "50% 40%",
  },
  "HERO-heart-scored-loaf": {
    alt: "Sourdough loaf scored with a heart, sitting on pink gingham paper",
    position: "50% 50%",
  },
  "HERO-wheat-scored-boule": {
    alt: "Round golden sourdough boule scored with a wheat-leaf pattern on a striped towel",
  },
  "HERO-soft-pretzels-pearl-sugar": {
    alt: "Tray of glossy sourdough soft pretzels topped with pearl sugar",
    position: "50% 45%",
  },
  "sandwich-loaves-on-crate": {
    alt: "Two Old Bay cheddar sourdough mini loaves in Pearl Bakery kraft bags on a red Coca-Cola crate",
    position: "50% 60%",
  },
  "loaves-in-coca-cola-crate": {
    alt: "Classic and cinnamon swirl sourdough sandwich bread lined up in a red Coca-Cola crate, with boxed cinnamon rolls below",
    position: "50% 30%",
  },
  "asiago-sourdough-bagels": {
    alt: "Asiago sourdough bagels in a clear bag with a kraft top, an ingredient label and a round Pearl Bakery sticker",
  },
  "sourdough-bagels-bowl": {
    alt: "Three sourdough bagels, one everything-seasoned, in a white bowl",
  },
  "sourdough-pretzel-bites-salted": {
    alt: "A heap of golden sourdough pretzel bites sprinkled with coarse salt",
  },
  "sourdough-pretzel-bites-labeled": {
    alt: "Stacked clamshells of sourdough pretzel bites with round Pearl Bakery labels",
  },
  "pearl-bags-dinner-rolls": {
    alt: "Two kraft-paper Pearl Bakery bags with windows showing sourdough dinner rolls inside",
  },
  "fig-walnut-sourdough-and-cider-donuts": {
    alt: "Fig & walnut sourdough in a labelled kraft bag behind a clamshell of apple cider donuts",
    position: "50% 40%",
  },
  "bagels-gift-basket": {
    alt: "Wicker basket holding bags of sourdough bagels with handwritten labels",
  },

  // ── Cookies ─────────────────────────────────────────────────────────────
  "HERO-dubai-pistachio-cookie-split": {
    alt: "Gloved hand holding a dark chocolate cookie split open to show a green pistachio filling, more drizzled cookies on the tray behind",
    position: "50% 55%",
  },
  "HERO-fourth-of-july-cookie-cakes": {
    alt: "Four chocolate chip cookie cakes in tins, each piped with a red, white and blue buttercream border and topped with festive candies",
  },
  "smores-sandwich-cookies": {
    alt: "S'mores sandwich cookies filled with marshmallow and half-dipped in chocolate with graham crumbs",
    position: "50% 55%",
  },
  "mini-oatmeal-cream-pies-crate": {
    alt: "Clamshells of mini oatmeal cream pies with round Pearl Bakery stickers, stacked in a wooden crate",
  },
  "four-specialty-cookies": {
    alt: "Four big specialty cookies on marble: a cookies-and-cream with a gummy worm, two drizzled cookies and a chocolate chip",
  },
  "stuffed-cookies-clamshells": {
    alt: "Stuffed cookies in clamshells, drizzled with caramel and one topped with a Biscoff cookie",
  },
  "almond-croissant-strawberry-crunch-cookies": {
    alt: "Almond croissant cookies and pink strawberry crunch cookies boxed and labelled at the stand",
  },
  "biscoff-cookie-cups": {
    alt: "Biscoff cookie cups topped with cream cheese frosting, cookie crumbs and a whole Biscoff cookie",
  },
  "cookie-cups-buttercream": {
    alt: "A dozen cookie cups piped with red and blue buttercream swirls",
  },
  "drizzled-cookies-tray": {
    alt: "Tray of double chocolate cookies with white chocolate drizzle and sprinkles",
  },
  "pearl-cookie-bags": {
    alt: "Two kraft Pearl Bakery cookie bags on a striped tablecloth, next to a bagged classic sourdough loaf",
    position: "50% 60%",
  },
  "pearl-bag-cookies-in-hand": {
    alt: "A hand holding a kraft Pearl Bakery bag of chocolate chip cookies",
  },
  "valentines-heart-cookie-cake": {
    alt: "Heart-shaped cookie cake piped with pink and green buttercream rosettes and a Happy Valentine's Day sticker",
  },
  "cookie-boxes": {
    alt: "Two windowed kraft boxes of chocolate chip cookies",
  },

  // ── Rolls, cakes & pastries ─────────────────────────────────────────────
  "HERO-cinnamon-roll-cake": {
    alt: "A cinnamon roll cake: big cinnamon rolls stacked in three tiers with white frosting and rainbow sprinkles, on a picnic table outside",
    position: "50% 55%",
  },
  "HERO-apple-cider-donuts": {
    alt: "Rows of apple cider donuts coated in cinnamon sugar",
    position: "50% 60%",
  },
  "HERO-butter-pecan-sticky-buns-trays": {
    alt: "Trays of butter pecan sticky buns glazed with caramel and covered in toasted pecans",
    position: "50% 65%",
  },
  "butter-pecan-sticky-buns-chalk-price": {
    alt: "Butter pecan sticky buns in a woven basket with a little chalkboard sign reading \"Butter Pecan Sticky Buns $12\"",
    position: "50% 70%",
  },
  "cosmic-brownie-in-hand": {
    alt: "A hand holding a fudgy cosmic brownie with rainbow sprinkles in an open clamshell",
    position: "50% 60%",
  },
  "key-lime-coconut-cupcakes": {
    alt: "Key lime cupcakes with green frosting next to coconut cream cupcakes topped with toasted coconut",
  },
  "cinnamon-rolls-sprinkles-tray": {
    alt: "Cinnamon rolls with vanilla icing and rainbow sprinkles in a foil tray",
  },
  "cinnamon-rolls-singles-crate": {
    alt: "Single frosted cinnamon rolls boxed with Pearl Bakery stickers in a red Coca-Cola crate",
  },
  "caramel-apple-cinnamon-rolls": {
    alt: "Caramel apple cinnamon rolls in a round foil pan with an ingredient label",
  },
  "peach-cobbler-cinnamon-rolls": {
    alt: "Peach cobbler cinnamon rolls in a foil pan with a printed label",
  },
  "packaged-cinnamon-rolls-sticky-buns": {
    alt: "Labelled clamshells of butter pecan sticky buns and apple cider donuts at the stand",
  },
  "packaged-scones-labeled": {
    alt: "Chocolate chip, blueberry and white chocolate cranberry scones in labelled clamshells",
  },
  "scones-packaged": {
    alt: "Blueberry scones in clamshells with Pearl Bakery labels",
  },
  "blueberry-coffee-cake-slice": {
    alt: "Gloved hand holding a square of blueberry coffee cake with a thick crumb topping",
  },
  "crumb-coffee-cake": {
    alt: "A square of glazed crumb coffee cake in a clamshell",
  },
  "cupcakes-pink": {
    alt: "Pink strawberry cupcakes with cream frosting and sprinkles in clamshells",
  },
  "cake-pops": {
    alt: "Chocolate and cookies-and-cream cake pops in clear sleeves on pink gingham",
  },
  "football-cake-pops": {
    alt: "Chocolate football cake pops with white icing laces on yellow gingham paper",
  },
  "strawberry-pop-tarts": {
    alt: "Strawberry white chocolate pop tarts with sprinkles in clear bags on a white shelf",
  },
  "smores-rice-krispy-treats": {
    alt: "S'mores Rice Krispie treats topped with marshmallows and chocolate squares",
  },
  "key-lime-rice-krispy-treats": {
    alt: "Key lime Rice Krispie treats topped with a lime slice in clamshells",
  },
  "mothers-day-cupcakes": {
    alt: "Two boxes of Mother's Day cupcakes in pink and yellow frosting with floral toppers",
  },

  // ── The new farmstand (present day) ─────────────────────────────────────
  "HERO-shed-exterior-fall-field": {
    alt: "The white Pearl Bakery farmstand shed beside a gravel pull-off and a chalkboard sign, fall trees and blue sky behind",
    position: "30% 70%",
    era: "present",
  },
  "HERO-shed-interior-hutch-string-lights": {
    alt: "Inside the new farmstand: string lights across the ceiling, a white hutch stacked with bagged bread, a whiskey barrel, a round Pearl sign and a blue-and-white checkered floor",
    position: "50% 40%",
    era: "present",
  },
  "HERO-shed-interior-barrels": {
    alt: "Inside the farmstand: whiskey barrels, a wooden shelf of packaged treats and a checkered floor under string lights",
    era: "present",
  },
  "shed-doorway-view": {
    alt: "Looking in through the open double doors of the farmstand shed at string lights, a hutch of bread and whiskey barrels",
    era: "present",
  },
  "shed-exterior-blue-sky": {
    alt: "The farmstand shed with its doors open beside a field, a flag and pennant bunting under a bright blue sky",
    position: "35% 60%",
    era: "present",
  },
  "shed-interior-hutch-wide": {
    alt: "The white hutch inside the farmstand, every shelf stacked with kraft bags of bread, under string lights",
    era: "present",
  },
  "local-honey-display": {
    alt: "Jars of local honey on a wooden rack at the farmstand",
    era: "present",
  },

  // ── People, farm & seasonal ─────────────────────────────────────────────
  "HERO-baker-with-bread-at-farmstand": {
    alt: "The baker smiling in front of the original farmstand trailer, holding a basket of sourdough loaves",
    position: "30% 45%",
    era: "past",
  },
  "chicken-duck-eggs": {
    alt: "Cartons of fresh chicken and duck eggs in shades of cream, blue-green and brown, with Farm Fresh Eggs stickers",
    position: "50% 45%",
  },
  "scarecrow-pearl-apron-pumpkins": {
    alt: "A scarecrow wearing a Pearl Bakery apron, holding a basket of pumpkin-shaped sourdough loaves",
    position: "50% 35%",
  },

  // ── The original trailer (past: story only) ─────────────────────────────
  "HERO-trailer-wide-green-field": {
    alt: "The original Pearl Bakery trailer with an OPEN sourdough chalkboard sign and a red cooler, green fields behind",
    position: "50% 60%",
  },
  "trailer-breton-bay-farm-sign": {
    alt: "The original farmstand trailer parked beside a brick sign with a painted Breton Bay farm scene",
  },
  "trailer-patriotic-bunting": {
    alt: "The original trailer decked out in red, white and blue bunting for the Fourth of July",
    position: "50% 55%",
  },
  "trailer-open-sign-winter": {
    alt: "The original trailer on a bright winter morning with bare trees and the OPEN chalkboard out front",
  },
  "trailer-open-sign-fall": {
    alt: "The original trailer in fall, stocked with bread, bunting along the front and the OPEN sign out",
  },
  "trailer-open-chalkboard-winter": {
    alt: "The original trailer stocked with bagged loaves, an OPEN chalkboard and a stop sign behind",
  },
  "trailer-shelves-packed-closeup": {
    alt: "The trailer's shelves packed with labelled clamshells and kraft bags of baked goods",
  },
};
