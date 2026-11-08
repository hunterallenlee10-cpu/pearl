// The rotating menu library: everything Pearl Bakery has made, grouped for /menu.
// Not everything is available every weekend. "This Weekend" comes from the Google Sheet
// (see HOW-TO-UPDATE-THE-MENU.md), with `weekendFallback` below used if the sheet can't be reached.
//
// Prices: only the Butter Pecan Sticky Buns ($12, from the chalkboard at the stand) are shown.
// Every other item has `price: "[PRICE]"`, which the UI never displays.

export type MenuCategoryId = "sourdough" | "bagels-pretzels" | "rolls-buns" | "cookies" | "scones-cakes" | "farm";

export const menuCategories: { id: MenuCategoryId; label: string; blurb: string; image: string }[] = [
  {
    id: "sourdough",
    label: "Sourdough",
    blurb: "Rotating flavors every weekend, plus sandwich loaves almost every week.",
    image: "HERO-wheat-scored-boule",
  },
  {
    id: "bagels-pretzels",
    label: "Bagels & Pretzels",
    blurb: "Sourdough bagels, soft pretzels and pretzel bites.",
    image: "sourdough-bagels-bowl",
  },
  {
    id: "rolls-buns",
    label: "Cinnamon Rolls & Buns",
    blurb: "The best-seller, nearly every weekend, plus rotating twists.",
    image: "cinnamon-rolls-sprinkles-tray",
  },
  {
    id: "cookies",
    label: "Cookies",
    blurb: "A rotating cast, led by the brown butter chocolate chip.",
    image: "four-specialty-cookies",
  },
  {
    id: "scones-cakes",
    label: "Scones & Cakes",
    blurb: "Scones, coffee cakes, cupcakes, brownies and the odd surprise.",
    image: "blueberry-coffee-cake-slice",
  },
  {
    id: "farm",
    label: "Farm: Eggs & Honey",
    blurb: "Also at the stand.",
    image: "local-honey-display",
  },
];

export type MenuItem = {
  name: string;
  category: MenuCategoryId;
  note?: string;
  badge?: "Best-seller" | "Fan favorite" | "Signature" | "Fall staple" | "Seasonal" | "Holiday";
  /** Shown only when it's a number. */
  price?: number | "[PRICE]";
  image?: string;
  confirm?: string;
};

const P = "[PRICE]" as const;

export const menu: MenuItem[] = [
  // Sourdough loaves (rotating flavors)
  { name: "Classic", category: "sourdough", price: P, image: "HERO-classic-loaf-styled" },
  {
    name: "Rosemary Garlic Parmesan",
    category: "sourdough",
    badge: "Fan favorite",
    note: "The one regulars dip in good olive oil.",
    price: P,
    image: "HERO-rosemary-loaf-styled",
  },
  { name: "Italian Herbs & Cheese", category: "sourdough", price: P },
  { name: "Jalapeño Cheddar", category: "sourdough", price: P, image: "HERO-jalapeno-cheddar-loaf-styled" },
  { name: "White Cheddar", category: "sourdough", price: P },
  { name: "Triple Cheddar", category: "sourdough", price: P },
  {
    name: "White Cheddar Old Bay",
    category: "sourdough",
    note: "A \"Maryland Summer\" weekend special.",
    badge: "Seasonal",
    price: P,
    image: "sandwich-loaves-on-crate",
  },
  { name: "Lemon Poppy Seed", category: "sourdough", price: P },
  { name: "Blueberry Lemon", category: "sourdough", price: P, image: "HERO-blueberry-lemon-loaf-styled" },
  {
    name: "Pumpkin Spice",
    category: "sourdough",
    badge: "Seasonal",
    price: P,
    image: "HERO-pumpkin-spice-sourdough-loaves",
  },
  { name: "Cinnamon Raisin", category: "sourdough", price: P },
  { name: "Honey Whole Wheat", category: "sourdough", price: P },
  { name: "Fig & Walnut", category: "sourdough", price: P, image: "fig-walnut-sourdough-and-cider-donuts" },
  {
    name: "Strawberry Chocolate Chip",
    category: "sourdough",
    note: "A Valentine's special.",
    badge: "Holiday",
    price: P,
    image: "HERO-heart-scored-loaf",
  },
  {
    name: "Sandwich loaves: Classic & Cinnamon Swirl",
    category: "sourdough",
    note: "A staple almost every week.",
    price: P,
    image: "loaves-in-coca-cola-crate",
  },
  { name: "Bread bowls (and minis)", category: "sourdough", price: P },
  { name: "Dinner rolls", category: "sourdough", price: P, image: "pearl-bags-dinner-rolls" },

  // Bagels & pretzels
  {
    name: "Sourdough bagels",
    category: "bagels-pretzels",
    note: "Classic, everything, blueberry, chocolate chip, asiago.",
    price: P,
    image: "asiago-sourdough-bagels",
  },
  {
    name: "Sourdough soft pretzels",
    category: "bagels-pretzels",
    price: P,
    image: "HERO-soft-pretzels-pearl-sugar",
  },
  {
    name: "Sourdough pretzel bites",
    category: "bagels-pretzels",
    price: P,
    image: "sourdough-pretzel-bites-salted",
  },

  // Cinnamon rolls & buns
  {
    name: "Cinnamon rolls",
    category: "rolls-buns",
    badge: "Best-seller",
    note: "Nearly every weekend.",
    price: P,
    image: "cinnamon-rolls-singles-crate",
  },
  { name: "Apple cinnamon rolls", category: "rolls-buns", price: P },
  { name: "Caramel apple cinnamon rolls", category: "rolls-buns", price: P, image: "caramel-apple-cinnamon-rolls" },
  { name: "Peach cobbler cinnamon rolls", category: "rolls-buns", price: P, image: "peach-cobbler-cinnamon-rolls" },
  { name: "Summer berry sweet rolls", category: "rolls-buns", price: P },
  { name: "Cookies & cream sweet rolls", category: "rolls-buns", price: P },
  {
    name: "Butter pecan sticky buns",
    category: "rolls-buns",
    price: 12,
    image: "butter-pecan-sticky-buns-chalk-price",
  },
  {
    name: "Apple cider donuts",
    category: "rolls-buns",
    badge: "Fall staple",
    note: "A weekly staple in the stand this time of year.",
    price: P,
    image: "HERO-apple-cider-donuts",
  },

  // Cookies
  {
    name: "Brown butter chocolate chip",
    category: "cookies",
    badge: "Signature",
    note: "The signature cookie.",
    price: P,
    image: "pearl-bag-cookies-in-hand",
  },
  {
    name: "Dubai-style pistachio chocolate stuffed",
    category: "cookies",
    price: P,
    image: "HERO-dubai-pistachio-cookie-split",
  },
  { name: "Banana cream", category: "cookies", price: P },
  { name: "Biscoff-stuffed banana cream", category: "cookies", price: P },
  { name: "Cookie butter stuffed", category: "cookies", price: P, image: "stuffed-cookies-clamshells" },
  { name: "S'mores sandwich", category: "cookies", price: P, image: "smores-sandwich-cookies" },
  { name: "Mini oatmeal cream pies", category: "cookies", price: P, image: "mini-oatmeal-cream-pies-crate" },
  { name: "Carrot cake", category: "cookies", price: P },
  { name: "Strawberry crunch", category: "cookies", price: P },
  { name: "Almond croissant", category: "cookies", price: P, image: "almond-croissant-strawberry-crunch-cookies" },
  { name: "Kitchen sink", category: "cookies", price: P },
  { name: "Cornbread", category: "cookies", price: P },
  { name: "Double chocolate", category: "cookies", price: P, image: "drizzled-cookies-tray" },
  { name: "Fruity Pebbles", category: "cookies", price: P },
  { name: "Pumpkin marshmallow oatmeal sandwich", category: "cookies", price: P },
  { name: "Brown butter coconut toffee chip", category: "cookies", price: P },
  { name: "Caramel coconut chocolate chip", category: "cookies", price: P },
  { name: "Salted caramel snickerdoodle cookie cups", category: "cookies", price: P },

  // Scones & cakes
  {
    name: "Dark chocolate espresso scones",
    category: "scones-cakes",
    badge: "Fan favorite",
    note: "A cult favorite.",
    price: P,
  },
  { name: "Blueberry scones", category: "scones-cakes", price: P, image: "packaged-scones-labeled" },
  { name: "Cherry pistachio scones", category: "scones-cakes", price: P },
  { name: "Birthday cake scones", category: "scones-cakes", price: P },
  {
    name: "Coffee cakes",
    category: "scones-cakes",
    note: "Blueberry, butter pecan, blueberry lemon crumb.",
    price: P,
    image: "blueberry-coffee-cake-slice",
  },
  { name: "Coconut mini bundt cakes", category: "scones-cakes", price: P },
  {
    name: "Cupcakes",
    category: "scones-cakes",
    note: "Key lime, coconut cream, strawberries & cream, s'mores, Oreo, red velvet and more. Often 4-packs in the cooler.",
    price: P,
    image: "key-lime-coconut-cupcakes",
  },
  { name: "Fudge \"cosmic\" brownies", category: "scones-cakes", price: P, image: "cosmic-brownie-in-hand" },
  { name: "Double chocolate sourdough brownies", category: "scones-cakes", price: P },
  { name: "Cake pops", category: "scones-cakes", price: P, image: "cake-pops" },
  { name: "Strawberry white chocolate pop tarts", category: "scones-cakes", price: P, image: "strawberry-pop-tarts" },
  {
    name: "Rice Krispie treats",
    category: "scones-cakes",
    note: "S'mores, key lime, Lucky Charms.",
    price: P,
    image: "smores-rice-krispy-treats",
  },
  { name: "Homemade fudge rounds", category: "scones-cakes", price: P },

  // Farm
  {
    name: "Local honey",
    category: "farm",
    price: P,
    image: "local-honey-display",
  },
  {
    name: "Chicken & duck eggs",
    category: "farm",
    price: P,
    image: "chicken-duck-eggs",
    confirm: "[CONFIRM: eggs still available]",
  },
];

// ── This Weekend ───────────────────────────────────────────────────────────

export type WeekendGroup = "Sourdough" | "Baked goods" | "Also at the stand";
export type WeekendItem = { group: WeekendGroup; item: string; note?: string; badge?: string; available: boolean };
export type WeekendBoard = { updated: string; items: WeekendItem[]; source: "sheet" | "fallback" };

/** Used when the Google Sheet isn't set up or can't be reached. Keep it roughly current. */
export const weekendFallback: WeekendBoard = {
  updated: "2026-11-07",
  source: "fallback",
  items: [
    { group: "Sourdough", item: "Classic", available: true },
    { group: "Sourdough", item: "Italian Herbs & Cheese", available: true },
    { group: "Sourdough", item: "Rosemary Garlic Parmesan", available: true, badge: "Fan favorite" },
    { group: "Baked goods", item: "Sourdough bagels", available: true },
    { group: "Baked goods", item: "Cinnamon rolls", available: true, badge: "Best-seller" },
    { group: "Baked goods", item: "Fudge \"cosmic\" brownies", available: true },
    { group: "Baked goods", item: "Apple cider donuts", available: true, badge: "Fall staple" },
    { group: "Baked goods", item: "Brown butter chocolate chip cookies", available: true },
    { group: "Also at the stand", item: "Chicken & duck eggs", available: true }, // [CONFIRM: eggs still available]
    { group: "Also at the stand", item: "Local honey", available: true },
  ],
};
