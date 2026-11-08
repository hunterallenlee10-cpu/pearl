#!/usr/bin/env node
// Keyboard-only walkthrough: Tab through a page, checking every stop is on screen and has a
// visible focus indicator. node scripts/qa/keyboard.mjs <url> <shotDir> [maxTabs]
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
const { chromium } = createRequire(import.meta.url)("playwright");
const [url, dir, max = "120"] = process.argv.slice(2);
mkdirSync(dir, { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.addInitScript(() => sessionStorage.setItem("pearl:proofed", "1"));
await p.goto(url, { waitUntil: "networkidle" });
await p.waitForTimeout(2500);
const problems = [];
let stops = 0;
const seen = [];
for (let i = 0; i < Number(max); i++) {
  await p.keyboard.press("Tab");
  await p.waitForTimeout(140);
  const info = await p.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const ring = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0;
    const shadow = cs.boxShadow && cs.boxShadow !== "none";
    // radio/checkbox inputs are sr-only; their styled sibling shows the ring
    const peer =
      el.matches("input.peer") && el.nextElementSibling
        ? getComputedStyle(el.nextElementSibling).outlineStyle !== "none"
        : false;
    const peerRect =
      el.matches("input.peer") && el.nextElementSibling ? el.nextElementSibling.getBoundingClientRect() : r;
    const rr = el.matches("input.peer") ? peerRect : r;
    return {
      label: (el.getAttribute("aria-label") || el.textContent || el.getAttribute("name") || el.tagName)
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 50),
      tag: el.tagName.toLowerCase(),
      onScreen: rr.bottom > 0 && rr.top < innerHeight && rr.right > 0 && rr.left < innerWidth && rr.width > 0,
      visibleRing: ring || shadow || peer,
    };
  });
  if (!info) break;
  stops++;
  seen.push(`${info.tag}:${info.label}`);
  if (!info.onScreen) problems.push(`off-screen: ${info.tag} "${info.label}"`);
  if (!info.visibleRing) problems.push(`no focus ring: ${info.tag} "${info.label}"`);
  if ([1, 6, 12, 20, 30, 45].includes(stops))
    await p.screenshot({ path: `${dir}/tab-${String(stops).padStart(2, "0")}.png` });
}
console.log(
  `${url}: ${stops} tab stops; ${problems.length ? problems.length + " problems" : "all on screen with a visible focus ring"}`,
);
problems.slice(0, 15).forEach((x) => console.log("   " + x));
console.log("   first stops: " + seen.slice(0, 14).join(" → "));
await b.close();
