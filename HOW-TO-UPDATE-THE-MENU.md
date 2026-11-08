# How to update "This Weekend" from your phone

The chalkboard on the website reads from a Google Sheet. Change the sheet and the website updates
within about 5 minutes. No developer needed.

## One-time setup (about 10 minutes)

1. **Make the sheet.** Open Google Sheets and start a new sheet called "Pearl weekend menu".
   Then go to File → Import → Upload and pick `content/weekend-menu.starter.csv` from this project.
   You'll see five columns: `category`, `item`, `note`, `available`, `badge`.
2. **Publish it.** Go to File → Share → Publish to web. Choose the sheet tab, pick "Comma-separated values (.csv)"
   instead of "Web page", and tap Publish. Copy the link it gives you (it ends in `output=csv`).
3. **Give the link to the website.** In Vercel, open the project → Settings → Environment Variables. Add
   `WEEKEND_MENU_CSV_URL` with the link from step 2, then redeploy once. (Or send the link to whoever
   looks after the site.)

## Every week

1. **Open the sheet** in the Google Sheets app on your phone.
2. **Update the rows.** One row per item:
   - `category`: `Sourdough`, `Baked goods`, or `Farm` (eggs, honey, anything else at the stand).
   - `item`: what it's called on the board, e.g. `Rosemary Garlic Parmesan`.
   - `note`: optional, e.g. `cinnamon sugar` or `back by request!`.
   - `available`: `yes`, or `no` to cross it out on the board with "sold out!".
   - `badge`: optional little circled tag, e.g. `Fan favorite`, `New`, `Best-seller`.
3. **Change the date.** The first row is `updated` with the date in the `item` column, written
   `2026-11-14` (year-month-day). That's the "Updated Nov 14" on the board.
4. **Delete rows** for anything not baking this week, and add rows for new things.
5. **Wait about 5 minutes**, then check the website. That's it.

## Good to know

- The order of rows is the order on the board.
- If the sheet ever can't be reached, the site quietly shows the backup menu in `src/content/menu.ts`
  (`weekendFallback`), so the board is never empty.
- Closed for weather or a holiday? Set `statusOverride` in `src/content/business.ts`, e.g.
  `{ label: "Closed this weekend: see you 12/5!", until: "2026-12-01" }`, and the status pill everywhere on the
  site shows it until that date.
