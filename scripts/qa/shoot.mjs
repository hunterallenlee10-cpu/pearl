#!/usr/bin/env node
// Viewport screenshots at scroll positions, for checking sections in a real browser.
//
//   node scripts/qa/shoot.mjs --url http://localhost:3000/ --widths 1440,390 --at 0,0.5,1,2 --out shots/
//   --at       scroll positions in viewport heights (0.5 = half a screen down), or #selector
//   --reduced  emulate prefers-reduced-motion
//   --preloader  don't skip the preloader
//   --full     one full-page screenshot instead
import { createRequire } from "node:module";
const { chromium, devices } = createRequire(import.meta.url)("playwright");
import { mkdirSync } from "node:fs";
import path from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith("--")) acc.push([a.slice(2), arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : true]);
    return acc;
  }, []),
);
const url = args.url || "http://localhost:3000/";
const widths = String(args.widths || "1440,390").split(",");
const at = String(args.at || "0").split(",");
const out = args.out || "shots";
const wait = Number(args.wait || 1300);
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
for (const w of widths) {
  const device = devices[w];
  const width = device ? device.viewport.width : Number(w);
  const ctx = await browser.newContext(
    device
      ? { ...device }
      : { viewport: { width, height: width < 600 ? 844 : width < 1100 ? 1024 : 900 }, deviceScaleFactor: 1 },
  );
  if (args.reduced) await ctx.emulateMedia?.({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  if (args.reduced) await page.emulateMedia({ reducedMotion: "reduce" });
  if (!args.preloader) await page.addInitScript(() => sessionStorage.setItem("pearl:proofed", "1"));
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(wait);
  const tag = String(w).replace(/\s+/g, "-");
  if (args.full) {
    await page.screenshot({ path: path.join(out, `${tag}-full.png`), fullPage: true });
  } else {
    const vh = await page.evaluate(() => window.innerHeight);
    for (const a of at) {
      let y;
      if (a.startsWith("#") || a.startsWith("[") || a.startsWith(".")) {
        y = await page.evaluate((s) => {
          const el = document.querySelector(s);
          return el ? el.getBoundingClientRect().top + window.scrollY : 0;
        }, a);
      } else y = Math.round(Number(a) * vh);
      // step there so scroll-linked animations see intermediate positions
      const from = await page.evaluate(() => window.scrollY);
      const steps = 8;
      for (let i = 1; i <= steps; i++) {
        await page.evaluate((yy) => window.scrollTo(0, yy), from + ((y - from) * i) / steps);
        await page.waitForTimeout(60);
      }
      await page.waitForTimeout(wait);
      const name = `${tag}-${a.replace(/[^a-z0-9.]+/gi, "_")}.png`;
      await page.screenshot({ path: path.join(out, name) });
    }
  }
  const hscroll = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(`${w}: ${errors.length ? "ERRORS: " + errors.join(" | ") : "no console errors"}; horizontal overflow ${hscroll}px`);
  await ctx.close();
}
await browser.close();
