# QA report

Run on the production build (`next build && next start`) in headless Chromium, Nov 8, 2026.
Screenshots are in [`docs/qa/`](qa/). Re-run any check with the scripts in `scripts/qa/`.

## Lighthouse

Mobile uses Lighthouse's default simulated Moto G Power on slow 4G; desktop uses the desktop preset.
Columns: Performance · Accessibility · Best Practices · SEO · LCP · CLS · TBT.

| Page      | Mobile P | A   | BP  | SEO | LCP   | CLS | TBT    | Desktop P | A   | BP  | SEO | LCP   | CLS   | TBT   |
| --------- | -------- | --- | --- | --- | ----- | --- | ------ | --------- | --- | --- | --- | ----- | ----- | ----- |
| home      | 76       | 100 | 100 | 100 | 5.0 s | 0   | 110 ms | 95        | 100 | 100 | 100 | 1.1 s | 0     | 20 ms |
| menu      | 85       | 100 | 100 | 100 | 4.3 s | 0   | 100 ms | 99        | 100 | 100 | 100 | 0.9 s | 0.005 | 10 ms |
| pre-order | 87       | 100 | 100 | 100 | 3.9 s | 0   | 70 ms  | 99        | 100 | 100 | 100 | 0.8 s | 0     | 0 ms  |
| visit     | 85       | 100 | 100 | 100 | 4.2 s | 0   | 90 ms  | 99        | 100 | 100 | 100 | 0.9 s | 0     | 0 ms  |
| story     | 87       | 100 | 100 | 100 | 4.0 s | 0   | 50 ms  | 99        | 100 | 100 | 100 | 0.9 s | 0     | 0 ms  |

**Accessibility, Best Practices and SEO hit 100 everywhere. Desktop performance is 95–99. Mobile performance
(76–87) is under the 95 target.** The real, unthrottled LCP is about 0.2–0.4 s on every page (it's the first paint);
the 4–5 s figures are Lighthouse's slow-4G simulation, which counts every byte requested before first paint.

What's already been done to get here (mobile home started at 65, LCP 6.2 s):

- Above-the-fold text is visible from the first paint (scroll reveals only hide content below the fold).
- Logo served as a cached SVG file instead of 30 KB of inline path data (page HTML halved).
- Fonts slimmed: dropped Fraunces' optical-size axis (−50% file size), Caveat no longer preloaded.
- GSAP and the flour particles start when the browser is idle; particles count drops on low-end phones.
- An 828 px size of the hero photo for phones; everything below the fold is lazy and low priority.

Fix list for the remaining gap (in order of impact):

1. **The "Proofing…" preloader** (brief §5.0) covers the home page for up to 1.8 s on a first visit, and Lighthouse
   always measures a first visit. It's the main reason home scores ~10 points below the inner pages. Options: keep it
   (it's a deliberate brand moment and only plays once per session), shorten it, or skip it on slow connections
   (`navigator.connection.effectiveType`).
2. **Fonts**: Fraunces still ships two files (upright + italic, ~60 KB each). Self-hosting a subset with only the
   weights in use, or dropping the italic in favour of the upright SOFT/WONK cut, would save ~60–90 KB.
3. **Below-the-fold photos** on the home page start downloading early because Chrome's lazy-load distance on slow
   connections is ~2,500 px. Rendering the loaf and "cut it open" photos only when their section approaches would
   take ~250 KB out of the critical window.
4. Re-measure on the real Vercel deployment (HTTP/2, edge caching, Brotli), which usually adds a few points.

## JavaScript budget (target < 180 KB gzipped)

| Page                             | Initial JS (gzip) | After scrolling the whole page                   |
| -------------------------------- | ----------------- | ------------------------------------------------ |
| home                             | 150 KB            | 210 KB                                           |
| menu / pre-order / visit / story | 146–151 KB        | not measured (fewer animated sections than home) |

Initial JS is under budget on every page. On the home page, GSAP + ScrollTrigger (~45 KB) load lazily once the
browser is idle, bringing the total to ~210 KB, so **the total is ~30 KB over the budget**. Getting under would
mean replacing GSAP with hand-written scroll code for the four pinned scenes. That's possible but a sizeable
rewrite with more risk than benefit; flagged here as a decision.

## Accessibility: axe-core

`node scripts/qa/axe.mjs` (WCAG 2.0/2.1/2.2 A + AA + best-practice) on all 6 pages (incl. 404) at 1440 and 390 px:
**0 violations of any severity.** One serious issue found during QA (the map link's name didn't include its visible
labels) was fixed.

## Keyboard-only walkthrough

`node scripts/qa/keyboard.mjs <url>` tabs through each page and checks every stop is on screen with a visible focus
ring:

| Page      | Tab stops                                                            | Result                                  |
| --------- | -------------------------------------------------------------------- | --------------------------------------- |
| home      | 43                                                                   | all on screen with a visible focus ring |
| menu      | 23                                                                   | all on screen with a visible focus ring |
| pre-order | 70 (incl. the cake builder: colour, sprinkles, occasion, date, form) | all on screen with a visible focus ring |
| visit     | 29                                                                   | all on screen with a visible focus ring |
| story     | 17                                                                   | all on screen with a visible focus ring |

The pinned horizontal loaf section is fully keyboard-reachable: each loaf is a focus stop and focusing it scrolls
the track so that loaf sits exactly in view (checked: focused panel left edge = 0 px for all four). A "Skip the
loaves" link comes first. See `qa/17-keyboard-loaf-focus.jpg`.

## Reduced motion

With `prefers-reduced-motion: reduce`: no preloader, no pinning (0 pin spacers), no Lenis, no custom cursor,
particles never start, the loaves stack vertically, the farmstand shows its night state with the lights on, and the
testimonial marquee is replaced by a static grid. See `qa/16-reduced-motion-home.jpg`.

## Breakpoints and devices

`node scripts/qa/breakpoints.mjs` on every page at 360, 390, 768, 1024, 1440, 1920 and emulated iPhone 15,
Pixel 8 (Playwright's Pixel 7 profile, same 412 px width) and iPad: **no horizontal overflow and no page errors
anywhere.** One issue found and fixed: on short phone screens (iPhone 15) the hero text ran up under the logo; the
hero now grows with its content.

## Unit tests (`npm test`, 28 passing)

- **Status pill**: every weekday, Saturday/Sunday before 9, exactly 9:00, one minute either side of sunset,
  summer late sunset, server-in-UTC, both 2026 DST weekends (Mar 8 spring forward, Nov 1 fall back),
  and the manual override (before/after `until`, optional `from`).
- **Pre-order auto-swap**: Thanksgiving is live on Nov 8; still live at 11:59:59 PM ET on Sun Nov 22; gone at
  12:00 AM ET Mon Nov 23 (the homepage then shows the Cinnamon Roll Cake); not live before `opensAt`.
- **Menu sheet**: CSV parsing (quotes, commas, CRLF, BOM), the starter sheet, sold-out rows, and falling back
  to the built-in menu when the sheet is missing or malformed.

## Forms

Tested in the browser against the production build without `RESEND_API_KEY`: an empty submit shows field errors;
a valid submit falls back to a prefilled email to pearlbakerymd@gmail.com; the Thanksgiving quantity steppers
total correctly ($45 for 2 classic loaves + 1 apple pie). A hidden honeypot field and a per-IP rate limit
(5 per 10 minutes) guard against spam.

## Content

Every `[CONFIRM]`, `[PRICE]` and `TODO` is collected in [`CONTENT-TODO.md`](../CONTENT-TODO.md) (generated by
`npm run todo`).
