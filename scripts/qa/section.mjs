#!/usr/bin/env node
// Screenshot one section element: node scripts/qa/section.mjs <selector> <out.png> [width] [--reduced]
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
const [sel, out, w = "1440", flag] = process.argv.slice(2);
const width = Number(w);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width, height: width < 600 ? 844 : 900 } });
if (flag === "--reduced") await p.emulateMedia({ reducedMotion: "reduce" });
await p.addInitScript(() => sessionStorage.setItem("pearl:proofed", "1"));
await p.goto(process.argv[6] || "http://localhost:3000/", { waitUntil: "networkidle" });
const el = p.locator(sel).first();
await el.scrollIntoViewIfNeeded();
// reveal everything in the section
await p.evaluate(
  (s) =>
    document
      .querySelector(s)
      ?.querySelectorAll("[data-reveal]")
      .forEach((e) => e.setAttribute("data-revealed", "")),
  sel,
);
await p.waitForTimeout(1600);
await el.screenshot({ path: out });
await b.close();
