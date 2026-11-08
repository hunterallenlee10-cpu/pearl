#!/usr/bin/env node
// Full-page screenshot with every scroll reveal forced on and lazy images loaded.
// node scripts/qa/fullpage.mjs <url> <out.png> [width] [--reduced]
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
const [url, out, w = "1440", flag] = process.argv.slice(2);
const width = Number(w);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width, height: width < 600 ? 844 : 900 } });
if (flag === "--reduced") await p.emulateMedia({ reducedMotion: "reduce" });
await p.addInitScript(() => sessionStorage.setItem("pearl:proofed", "1"));
await p.goto(url, { waitUntil: "networkidle" });
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 600) {
  await p.evaluate((yy) => scrollTo(0, yy), y);
  await p.waitForTimeout(80);
}
await p.evaluate(() => {
  document.querySelectorAll("[data-reveal]").forEach((e) => e.setAttribute("data-revealed", ""));
  document.querySelectorAll(".chalk-reveal,.illustrated-map").forEach((e) => e.classList.add("is-in"));
  document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager"));
  scrollTo(0, 0);
});
await p.waitForLoadState("networkidle");
await p.waitForTimeout(1500);
await p.screenshot({ path: out, fullPage: true });
await b.close();
