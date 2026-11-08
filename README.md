# Pearl Bakery website

Sourdough farmstand in Leonardtown, MD: 40960 Medley's Neck Rd, Saturdays & Sundays from 9 AM until sold out or sunset.

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis · Vercel.

## Run it locally

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000. Other commands:

| Command                                                       | What it does                                                                                |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `npm run build` / `npm start`                                 | Production build / serve it                                                                 |
| `npm test`                                                    | Unit tests (status pill, pre-order deadline swap, menu sheet parsing)                       |
| `npm run lint` · `npm run typecheck` · `npm run format:check` | Code checks                                                                                 |
| `npm run photos:fetch`                                        | Download the original photos from Drive into `_source-photos/` (folder must be link-shared) |
| `npm run photos:process`                                      | Turn originals into web images (`public/images/`) + `src/data/images.json`                  |
| `npm run logo`                                                | Re-trace the logo SVGs and favicons from the original artwork                               |
| `npm run todo`                                                | Regenerate `CONTENT-TODO.md` from every placeholder in the code                             |

## Environment variables

Copy `.env.example` to `.env.local` for local work; set the same keys in Vercel → Settings → Environment Variables.

| Variable               | Needed?         | What it's for                                                                                                                                                                                                      |
| ---------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | Yes, for launch | The real domain. Used for canonical links, sitemap and social previews. **Until it's set, the site asks search engines not to index it** (pre-launch safety).                                                      |
| `WEEKEND_MENU_CSV_URL` | Optional        | Google Sheet published as CSV, read every 5 minutes for the "This Weekend" board. Without it the site uses `weekendFallback` in `src/content/menu.ts`. See [HOW-TO-UPDATE-THE-MENU.md](HOW-TO-UPDATE-THE-MENU.md). |
| `RESEND_API_KEY`       | Optional        | Sends pre-order, cake and custom requests to pearlbakerymd@gmail.com. Without it, forms open the visitor's email app with everything filled in.                                                                    |
| `RESEND_FROM`          | With Resend     | Sender, e.g. `Pearl Bakery <orders@yourdomain.com>`. Until a domain is verified in Resend, Resend only delivers to the account owner's own address.                                                                |

## Where things live

```
src/content/        everything a non-developer edits
  business.ts       address, phone, hours, payment, statusOverride (closures), domain
  menu.ts           full rotating menu + "This Weekend" fallback
  preorders.ts      seasonal pre-order campaigns, Cinnamon Roll Cake copy, past specials
  testimonials.ts   customer quotes
  timeline.ts       the story timeline
  faq.ts            Visit page questions
src/data/image-meta.ts   alt text + crop for every photo used
src/components/sections/ one file per homepage section (reorder them in src/app/page.tsx)
scripts/            photo pipeline, logo tracer, map builder, QA scripts
```

## Common jobs

**Update the weekend menu** → see [HOW-TO-UPDATE-THE-MENU.md](HOW-TO-UPDATE-THE-MENU.md).

**Closed this weekend?** In `src/content/business.ts` set
`statusOverride: { label: "Closed this weekend: see you 12/5!", until: "2026-12-01" }`. The status pill shows it
until that date (Eastern time), then goes back to normal by itself.

**Add a new pre-order campaign** (e.g. Christmas): in `src/content/preorders.ts`, copy the Thanksgiving block
into the `campaigns` array and change `id`, `title`, `opensAt`, `closesAt` (with `-05:00` for winter dates),
`pickup`, `formUrl`, `sections` (items + prices) and `rules`. The homepage and `/pre-order` show whichever campaign
is open right now and switch back to the Cinnamon Roll Cake automatically when it closes. If you have a menu
graphic, add it as a photo (below) and set `menuImage`.

**Swap or add a photo:**

1. Put the original JPEG in `_source-photos/<folder>/` (the 7 folders from Drive).
2. Add an entry to `src/data/image-meta.ts` keyed by the filename (without `.jpg`): real alt text, and
   optionally `position` (what to keep in frame when cropped) and `era` (`"past"` for the original trailer).
3. Run `npm run photos:process`, then use it with `<Img id="your-file-name" … />`.
   Trailer photos are marked "past" and the site refuses to use them for "where to go today".

**Tweak the photo grade:** edit `scripts/grade.config.mjs`, preview with `npm run photos:process -- --preview`,
then run `npm run photos:process -- --force`.

## Deploying

The site is a standard Next.js app: import this GitHub repo in Vercel (New Project → Import), add the env vars
above, and deploy. Every push to the branch creates a preview; production deploys from the main branch.

## Content still to confirm

See [CONTENT-TODO.md](CONTENT-TODO.md). Nothing unconfirmed is shown as fact on the site.
