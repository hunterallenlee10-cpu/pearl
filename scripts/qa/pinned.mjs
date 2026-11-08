#!/usr/bin/env node
// Screenshots through a pinned/scrubbed section: node scripts/qa/pinned.mjs <selector> <outPrefix> <fractions> [width]
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
const [sel, out, fr = "0,0.5,1", w = "1440"] = process.argv.slice(2);
const width = Number(w), height = width < 600 ? 844 : 900;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width, height } });
await p.addInitScript(() => sessionStorage.setItem("pearl:proofed", "1"));
await p.goto(process.argv[6] || "http://localhost:3000/", { waitUntil: "networkidle" });
await p.waitForTimeout(1200);
const { top, h } = await p.evaluate((s) => {
  const el = document.querySelector(s);
  const pin = el.closest(".pin-spacer") || el;
  return { top: pin.getBoundingClientRect().top + scrollY, h: pin.offsetHeight };
}, sel);
let cur = 0;
for (const f of fr.split(",").map(Number)) {
  const y = top + f * Math.max(0, h - height);
  for (let i = 1; i <= 10; i++) {
    await p.evaluate((yy) => scrollTo(0, yy), cur + ((y - cur) * i) / 10);
    await p.waitForTimeout(40);
  }
  cur = y;
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${out}-${f}.png` });
}
console.log("section", sel, "top", top, "height", h);
await b.close();
