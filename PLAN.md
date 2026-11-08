# Pearl Bakery — Build Plan

> Status: **waiting on two things from the owner/client before build starts**
> 1. A "go" on this plan (and answers to the open questions in §11).
> 2. Access to the photos (see §0). Nothing visual gets built until the real photos are local.

Concept: **"Slow-made in Medley's Neck."** Everything moves like dough on a weekend morning — soft, elastic, a little weighted. Warm cream paper, crust-brown ink, one wheat-gold accent, a pearl sheen used almost never.

---

## 0. Photos: status and pipeline

**Status.** `scripts/drive-manifest.json` now lists all **149 files, and every folder count matches the appendix** (9 / 22 / 30 / 25 / 8 / 52 / 3; 50.7 MB, all JPEG). The folders are private, though: a plain download returns Google's sign-in page, and the Drive connector only hands files back as base64 text inside the conversation, which isn't workable for 149 full-res images. Two ways to unblock, either works:

- **B. Temporary link sharing (fastest, ~30 seconds).** In Drive, open `Pearl Bakery Website` → right-click `photos` → Share → General access: "Anyone with the link" (Viewer). Then I run `node scripts/fetch-photos.mjs`, which downloads every file by ID and checks sizes and counts. Switch sharing back to Restricted afterwards.
- **A. Upload to the repo (most private).** Download `photos` from Drive and unzip it. On GitHub, open branch `claude/serene-hawking-l9y1r7` → Add file → Upload files, and drag in the 7 unzipped folders, keeping their names, under `_source-photos/`. Each photo is under 1 MB, so GitHub's 25 MB-per-file limit isn't a problem, but the whole zip (≈50 MB) is too big to upload as one file. Once processed, the originals get removed from git and only the optimized versions ship.

Manifest notes: `03-sweets-cookies/dubai-pistachio-cookie-split-alt.jpg` is the same byte size as the HERO version (likely a duplicate; the pipeline will hash-check and skip true duplicates). `fig-walnut-sourdough-and-cider-donuts.jpg` and `pretzel-bites-brownies-packaged.jpg` show items from two categories; they're tagged for both in `image-meta.ts`.

**Pipeline** (`scripts/process-images.mjs`, `sharp`):

| Step | Detail |
|---|---|
| Verify | Per-folder count against the appendix (9 / 22 / 30 / 25 / 8 / 52 / 3 = 149). Script fails loudly on a mismatch. |
| Normalize | `.rotate()` (auto-orient), strip all EXIF/GPS (sharp drops metadata unless asked to keep it). |
| Grade | One config object in `scripts/grade.config.mjs`: `{ warmth: +4%, shadowLift: +6%, saturation: +5%, gamma: 0.98 }`. Implemented as a sharp `recomb` warmth matrix, `linear()` toe lift, `modulate({ saturation })`. Clamped so the bread doesn't go orange. **Applied to 4 photos first, shown as a before/after sheet for sign-off, then to all.** Graphics (`01-brand-logo-graphics`) are never graded. |
| Output | AVIF + WebP at 640 / 1080 / 1600 / 2400 widths (never upscaled past the original) → `public/images/<folder>/<slug>-<w>.<ext>`. |
| Data | `src/data/images.json`: `{ src, folder, slug, width, height, alt, blurDataURL (16px WebP base64), dominantColor, isHero, objectPosition }`. Alt text and `objectPosition` live in a hand-written `src/data/image-meta.ts` and get merged in, so re-running the pipeline never wipes them. |
| Contact sheet | `scripts/contact-sheet.mjs` → one JPG grid of every HERO image I'll use, for review. |

Rule enforced in code: images from `06-farmstand-original-trailer` carry `era: "past"`. The `<VisitImage>` component only accepts `era: "present"`, so a trailer photo can't end up representing today's location.

---

## 1. Stack (pinned at build time)

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 | Static generation for every page except the ISR menu fetch |
| Scroll | Lenis 1.3 (desktop pointer only, off under reduced motion) + GSAP 3 / ScrollTrigger | GSAP covers all choreography; **no framer-motion** (one motion lib only) |
| Particles | Hand-written WebGL2 points shader (~6 KB), Canvas2D fallback | Well under the 40 KB budget; no OGL or three.js needed |
| Sunset | `suncalc` (~3 KB) | Status pill |
| Email | Resend via a server action, `mailto:` fallback | Per brief |
| Analytics | `@vercel/analytics` | No cookie banner needed |
| Fonts | `next/font/google`: Fraunces (variable, `opsz` / `SOFT` / `WONK`), Instrument Sans, Caveat | Self-hosted, subset, `display: swap` |
| Tests | Vitest (status pill, campaign switching, CSV parsing) + Playwright (screenshots, keyboard, axe) | |

GSAP and ScrollTrigger are dynamic-imported after first paint. The particle canvas is dynamic-imported and only mounts on capable devices (no `saveData`, at least 4 GB `deviceMemory`, not reduced motion).

---

## 2. Design tokens

```css
--flour:#FBF6EE; --parchment:#F3EADB; --crust:#5B3A24; --espresso:#2A1B12;
--wheat:#C99A5B; --linen-blue:#8EA4BC; --chalk:#F4F1EA; --chalkboard:#232624;
--pearl: linear-gradient(115deg,#FFFDF8,#EFE6F0 45%,#E6EEF2);
--shadow-soft: 0 8px 30px -12px rgba(91,58,36,.22), 0 2px 6px rgba(91,58,36,.08);
--ease-dough: cubic-bezier(.22,1,.36,1);  /* entrances */
--ease-squish: elastic.out(1,.45);       /* presses only (GSAP) */
```

Contrast pre-check (WCAG AA):
- crust on flour ≈ 9.4:1 ✅
- crust on parchment ≈ 8.4:1 ✅
- chalk on chalkboard ≈ 13:1 ✅
- flour on espresso ≈ 15:1 ✅
- **wheat on flour ≈ 2.3:1 ❌ → wheat is never used for text on light backgrounds.** It's only for focus rings (3px, non-text contrast ≥ 3:1 against crust and espresso), dots, sprigs and borders. On espresso, wheat text is ≈ 6.5:1 ✅.
- A darker `--wheat-ink #8A6131` (≈ 5.0:1 on flour) covers small accent text on light backgrounds.

Type scale (fluid `clamp()`): display `clamp(3rem, 8vw + 1rem, 9.5rem)` with Fraunces `opsz 144, SOFT 100, WONK 1`, leading 0.92. Body 17→18px Instrument Sans, leading 1.6. `text-wrap: balance` on headings, `pretty` on paragraphs.

Texture: an SVG `feTurbulence` grain baked to a 128px tiling PNG at build time, applied as a fixed overlay at 3.5% opacity, `pointer-events: none`, `mix-blend-mode: multiply`.

---

## 3. Information architecture

```
/            Home — the scroll story
/menu        This Weekend board + filterable menu library
/pre-order   Active campaign (Thanksgiving 2026) + Cinnamon Roll Cake Builder + custom request
/visit       Address, hours, illustrated map, how the stand works, payment, FAQ
/story       Timeline, the baker, the community
not-found    "This one sold out."
```

Generated routes: `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, `opengraph-image` per route (`next/og`), `icon.svg` / `apple-icon.png`.

---

## 4. Component tree

```
src/
  app/
    layout.tsx                 fonts, <Grain/>, <SmoothScroll/>, <Cursor/>, <SiteNav/>, <SiteFooter/>, JSON-LD, Analytics
    page.tsx                   ordered list of home sections (reorder = move one line)
    menu/page.tsx  pre-order/page.tsx  visit/page.tsx  story/page.tsx  not-found.tsx
    actions/send-request.ts    server action: Resend + honeypot + rate limit
    opengraph-image.tsx (+ per route)  sitemap.ts  robots.ts  manifest.ts
  components/
    sections/                  Preloader, Hero, ChalkboardWeekend, LoafCarousel, CutItOpen,
                               SweetBento, TrailerToFarmstand, StepInside, NeighborsSay,
                               PreorderTeaser, FindTheFarmstand
    nav/                       SiteNav, MobileMenu (kraft-bag open), StatusPill
    ui/                        Button (magnetic + pearl glint), Sticker, KraftCard, GinghamCard,
                               RevealText, Img (wraps next/image + images.json), ScrollSquiggle,
                               Doodle (wheat, loaf, swirl, arrow, qr), Marquee
    preorder/                  CampaignCard, PreorderForm, CakeBuilder, CakeSvg
    visit/                     IllustratedMap, LazyMapEmbed, HowItWorks, Faq
    motion/                    SmoothScroll (Lenis), useGsap (dynamic import), useReducedMotion,
                               FlourParticles (WebGL2/Canvas), Cursor, PageTransition
  content/                     business.ts, menu.ts, preorders.ts, testimonials.ts, timeline.ts, faq.ts
  lib/                         status.ts (pure, tested), campaigns.ts (pure, tested),
                               weekend-menu.ts (CSV fetch + parse + fallback), maps.ts, seo.ts
  data/                        images.json (generated), image-meta.ts (alt text, crops)
scripts/                       fetch-photos.mjs, process-images.mjs, grade.config.mjs,
                               contact-sheet.mjs, vectorize-logo.mjs, drive-manifest.json
```

---

## 5. Homepage: section-by-section animation plan

All entrances use `--ease-dough`. "RM" is the `prefers-reduced-motion` fallback. Every section is self-contained: it owns its ScrollTriggers and kills them on unmount.

| # | Section | Trigger | Motion (duration / ease) | RM fallback | Mobile |
|---|---|---|---|---|---|
| 5.0 | **Preloader "Proofing…"** | First visit per session (`sessionStorage`) | Dough SVG `scaleY .82→1.04→1` (elastic, 1.0s); counter 0→100 (1.1s); score line `stroke-dashoffset` (0.35s); dough morphs into the wheat sprig (0.25s); clip-path split along a curved score (0.45s). **Hard cap 1.8s, then click, Esc or any key skips.** The hero image loads underneath so LCP isn't blocked. Preloader is SSR-rendered and removed by an inline script if the flag is set (no flash). | Not rendered | Same, 1.4s cap |
| 5.1 | **Hero** | Load | Ken Burns `scale 1→1.06` over 20s (CSS, linear, alternate). Headline words rise `y 110%→0` with a 0.06s stagger and 0.9s duration, plus blur 6px→0. Sub and buttons follow at +0.35s. Flour particles: ~120 points in a diagonal light beam, cursor parallax (desktop) or gyroscope (only after a permission tap on iOS), paused off-screen and on `visibilitychange`. Scroll squiggle redraws on a 3s loop. | Static image, no particles, text visible immediately | Particles at 60 points; tap-free drift |
| 5.2 | **Chalkboard "This Weekend"** | Section enters (top 70%), once | Each line is revealed by a left-to-right mask (`clip-path inset`, 0.7s, 0.12s stagger) with a chalk-dust smear. Doodles (loaf, swirl) draw via `stroke-dashoffset` (1.2s). | Fully drawn, fades in 0.3s | Same, single column |
| 5.3 | **The Loaves** (signature) | Pinned, scrubbed, `end: +=300%` | Horizontal track `x: 0 → -(n-1)·100vw`. Each circular-masked loaf rotates `0→180°` across its slot, like a record. Giant outlined flavor names run at 1.4× parallax. A per-loaf note and a "Rotates weekly" sticker fade in at slot center. The finale card is a slow CSS marquee. Keyboard: the section is a labelled region; ←/→ and Tab on each loaf call `lenis.scrollTo` for the matching slot. | No pin: vertical stack of the four loaves, no rotation | **No pin**: `scroll-snap-type: x mandatory` row, rotation tied to `scrollLeft` (rAF) |
| 5.4 | **Cut it open** | Pinned briefly, scrubbed `+=120%` | An SVG lame path draws across the crust (`dashoffset`), then a `clip-path: path()` opening along the score reveals the sliced cinnamon-swirl loaf under the scored boule. Copy lines rise once. | Both images side by side, copy visible | Unpinned; the score draws on enter (time-based, 1.2s) |
| 5.5 | **The Sweet Side** bento | Tiles enter, once, 0.08s stagger | Tiles fade and rise 24px. Sticker peel on hover: `rotateX(18deg) rotateZ(-6deg)` with a pearl sheen sweep (0.5s). Press: `scale .98` then `elastic.out` return (0.6s). | No peel or squish transforms; hover shows an outline only | 2-column masonry; stickers static |
| 5.6 | **Trailer → Farmstand** timeline | Vertical, each node on enter | A dotted path draws as you scroll (scrubbed). Photos un-blur and rise. Final step: the trailer photo crossfades into the shed photo (scrubbed 0→1), with a hand-drawn "a couple houses down the road" arrow. | Static list with both photos shown | Same, narrower |
| 5.7 | **Step inside** (wow #2) | Pinned, scrubbed `+=200%` | Page background tweens `--flour → --espresso`. Photo `filter: brightness(1 → .72)`. String-light glows (absolutely positioned, % coordinates hand-tuned per bulb after I see the photo) go `opacity 0→1` in a rolling wave, with `mix-blend-mode: screen` bloom and a CSS flicker keyframe. Copy fades in, then three cards rise. | Night state shown statically, lights on, no flicker | Unpinned, time-based 1.5s on enter |
| 5.8 | **Neighbors say** | Always on | Two CSS marquees in opposite directions, 60s and 70s loops. `animation-play-state: paused` on hover and on focus-within. A pause button (WCAG 2.2.2). Duplicate track is `aria-hidden`; a visually hidden `<ul>` carries the quotes for screen readers. | Static wrapped grid | Same, one row |
| 5.9 | **Pre-order teaser** | Enter, once | Gingham card drops in with a gentle tilt `rotate -2°→0` (0.8s). Shows Thanksgiving 2026 until `closesAt`, then the Cinnamon Roll Cake teaser. | Fade | Same |
| 5.10 | **Find the farmstand** | Enter | Map roads draw in (`dashoffset`, 1.6s), pin pulses (CSS). Click loads the interactive Google embed (no third-party request before that). | Map static, pin static | Map stacks under the address |
| 5.11 | **Footer curtain** | Always | Footer is `position: sticky; bottom: 0` under a main with `z-index: 1` and a margin, so the page lifts away to reveal it. No JS. | Same (no motion involved) | Same |

**Global micro-interactions:** custom cursor (desktop fine pointer only; "view" over images, "↗" over external links); magnetic buttons (≤ 6px, `quickTo`); `RevealText` (line split via `Intl.Segmenter` words + measured lines, runs once); View Transitions API "flour sweep" wipe between routes, falling back to a plain navigation. **No sound** (the brief makes it optional; skipping removes risk).

---

## 6. Data model (`src/content/*.ts`, all typed)

```ts
// business.ts
export const business = {
  name: "Pearl Bakery", fbName: "Pearl Bakery - Maryland",
  address: { street: "40960 Medley's Neck Rd", city: "Leonardtown", region: "MD", zip: "20650" },
  geo: { lat: 38.29 /*[CONFIRM exact pin]*/, lng: -76.64 },
  phone: "(443) 624-8782", email: "pearlbakerymd@gmail.com",
  facebook: "https://www.facebook.com/profile.php?id=61575042512947",
  reviews: { recommendPct: 100, count: 11 },
  hours: { days: ["Sat", "Sun"], opens: "09:00", closes: "until sold out or sunset" },
  payment: ["Cash", "Venmo", "PayPal"], openedOn: "2025-03-15",
  statusOverride: null as null | { label: string; until: string /* ISO, ET */ },
  bakerFirstName: null, // [BAKER FIRST NAME — confirm]; never rendered while null
};

// menu.ts
type MenuCategory = "sourdough" | "bagels-pretzels" | "rolls-buns" | "cookies" | "scones-cakes" | "farm";
interface MenuItem { id: string; name: string; category: MenuCategory; note?: string;
  seasonal?: "fall" | "winter" | "spring" | "summer" | "holiday"; badge?: "fan-favorite" | "best-seller" | "new";
  price?: number /* only Butter Pecan Sticky Buns $12 is shown */; priceTodo?: "[PRICE]"; image?: string; confirm?: string }
interface WeekendBoard { updated: string; items: { category: "Sourdough" | "Baked goods" | "Also at the stand";
  item: string; note?: string; available: boolean; badge?: string }[] }

// preorders.ts
interface Campaign { id: string; title: string; opensAt: string; closesAt: string /* ISO with -05:00 */;
  pickup: { date: string; window: string; place: string }; formUrl: string /* [THANKSGIVING_FORM_URL] */;
  sections: { heading: string; items: { name: string; desc?: string; price: number; unit?: string }[] }[];
  rules: string[]; image: string }
// Thanksgiving 2026 closesAt = "2026-11-23T00:00:00-05:00" (midnight ending Sunday 11/22, ET)

// testimonials.ts — { quote, name: "Kathy H.", topic? }  // TODO: confirm permission with owner
// timeline.ts — { date, label, title, body?, images: string[], quote? }
```

**Weekly menu from a Google Sheet:** `lib/weekend-menu.ts` fetches `WEEKEND_MENU_CSV_URL` with `next: { revalidate: 300 }`. It uses a small RFC-4180 parser (quoted commas), validates rows, and falls back to `content/menu.ts` on a missing env var, non-200 response, or zero valid rows. "Updated" comes from an optional `updated` row, else the fetch time. Ships with `content/weekend-menu.starter.csv` and `HOW-TO-UPDATE-THE-MENU.md`.

**Status pill (`lib/status.ts`, pure function `getStatus(now: Date, override)`):** converts to `America/New_York` with `Intl.DateTimeFormat`. Sunset comes from `suncalc` at 38.2915, -76.6358, computed for the local ET calendar day. Returns one of `open | opens-today | opens-tomorrow | opens-saturday | override`. Rendered client-side after hydration, with SSR fallback text "Open Sat & Sun from 9 AM" (always true). Re-evaluates every 60s; `aria-live="polite"` announces only changes. Unit tests cover every weekday, 8:59 / 9:00, sunset ±1 min, Sunday after sunset → "Opens Saturday 9 AM", both DST transition weekends (Mar 8 and Nov 1, 2026), and override before and after `until`.

**Forms (server action):** `zod` validation, honeypot field `company`, an in-memory sliding-window rate limit per IP (5 per 10 min; best-effort on serverless, noted in the README). Uses Resend if `RESEND_API_KEY` is set, otherwise returns a prefilled `mailto:` the client opens. Submitting never claims an order is confirmed: the copy repeats her rule verbatim.

**Cake builder:** 6 frosting swatches + a custom color input (with `aria-label` and the hex announced), 4 sprinkle styles, an occasion select and a free-text note. The live SVG is a 3-tier stack of cinnamon swirls built from the same `<SwirlRoll>` symbol. Frosting fill tweens (0.4s); sprinkles fall in with a seeded random scatter, and RM shows them without the fall. Radio groups are native `<input type=radio>`, so arrow keys work. Output goes to the same server action, or a prefilled email.

---

## 7. Copy direction (her voice, nothing invented)

- **Hero headline A/B** (I'll render all three and pick with you):
  - A. **"Sourdough, slow-made in Medley's Neck."** (default)
  - B. "Fresh bread. Country road. Every weekend."
  - C. "Baked this morning, a couple houses down."
- Sub, buttons, chalkboard heading, loaf notes and timeline copy are taken directly from the brief.
- Loaf notes stay honest. Rosemary uses Kathy H.'s olive-oil line; the others get plain descriptions of what's visible in the photo or the flavor name only.
- Anything about fermentation time, flour, "organic", etc. → `[CONFIRM]` and kept out of the UI.
- Prices: only the Thanksgiving menu prices and the $12 sticky buns are shown.

---

## 8. SEO, accessibility, performance

- **SEO:** `Bakery` JSON-LD (subtype of LocalBusiness) with address, geo, phone, email, `openingHoursSpecification` (Saturday and Sunday, opens 09:00; closing omitted because "until sold out or sunset" has no fixed time), `paymentAccepted`, `sameAs`, and `aggregateRating` **left out** (Facebook "recommends" aren't star ratings; adding one would invent a number). Per-page titles target the four keyword phrases. Canonical URLs come from `NEXT_PUBLIC_SITE_URL`.
- **Accessibility:** skip link; landmarks; one `<h1>` per page; 3px `--wheat` focus ring with a 2px crust offset; every pinned section is still fully reachable by Tab and has a "skip section" link; marquee pause; status `aria-live`; real alt text on every image; under RM, no Lenis, no pinning, no particles, no cursor, no preloader, and fades only.
- **Performance:** hero `next/image priority` with `fetchPriority="high"` and AVIF; everything else lazy. GSAP is dynamic-imported. Target homepage JS < 180 KB gz (budget: Next runtime ~90, GSAP+ST ~45, Lenis ~5, app ~30). Animations pause off-screen via IntersectionObserver. CLS guarded by fixed aspect ratios from `images.json`.

---

## 9. QA evidence I'll hand back

Lighthouse mobile and desktop on every route · axe-core (Playwright) with 0 serious/critical · a keyboard-only walkthrough recording (Playwright trace plus focused-element screenshots) · reduced-motion screenshots · screenshots at 360 / 390 / 768 / 1024 / 1440 / 1920 with an automated `scrollWidth <= innerWidth` check · iPhone 15 / Pixel 8 / iPad emulation · Vitest output for status pill and campaign swap (mocked 2026-11-22 23:59 ET vs 2026-11-23 00:00 ET) · `CONTENT-TODO.md` generated by a grep script so it can't drift.

---

## 10. Risks & how I'll handle them

| Risk | Mitigation |
|---|---|
| Photos not reachable | Blocked until §0 A or B. No stock, no AI images, ever. |
| Logo trace quality (script lettering) | `potrace` (npm) at 1600px after a threshold. Sprig and wordmark are split by connected-component bounding boxes. 400% side-by-side diff. If it's blobby, ship a knocked-out transparent PNG and flag that the SVG needs a manual pass. |
| String-light bulb coordinates | Hand-placed after viewing the photo at full size; stored as % in `StepInside.lights.ts`. |
| Pinned horizontal scroll + keyboard/screen readers | Native DOM order is vertical-reading; a skip link per pinned section; on mobile there's no pin at all. |
| 60fps on mid-range phones | Only `transform`/`opacity`/`clip-path` animate; particles capped and paused; pinning disabled < 768px. |
| Repo/deploy target | This session can only push to `hunterallenlee10-cpu/pearl` (branch `claude/serene-hawking-l9y1r7`). I can't create a new `pearl-bakery-site` repo from here. Proposal: build in this repo; you rename it on GitHub to `pearl-bakery-site` if you like (GitHub redirects the old URL). Vercel: I have a Vercel connector and will try a preview deploy from this repo; if it needs a dashboard step (linking the Git repo), I'll give you the exact clicks. |
| Thanksgiving dates | Today is Nov 8, 2026, so the campaign is live. The swap logic is date-driven and tested; after Nov 22 the teaser switches automatically. |
| Resend domain | Without a verified sending domain, Resend sends only from `onboarding@resend.dev` to the account owner. Documented in the README; the `mailto:` fallback always works. |

---

## 11. Questions for you (defaults in bold if you don't answer)

1. **Photos:** option A (zip into repo) or B (temporarily share the Drive folder)?
2. **Repo:** OK to build in `hunterallenlee10-cpu/pearl` rather than a new `pearl-bakery-site` repo? (**yes**)
3. **Thanksgiving Google Form URL:** paste when you have it (**`[THANKSGIVING_FORM_URL]` placeholder, button hidden until set**).
4. **Hero headline:** **A**, unless you want to see all three rendered first.
5. **Baker's first name:** stays out of all copy until confirmed (**out**).
