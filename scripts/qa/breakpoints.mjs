#!/usr/bin/env node
// Every page at every breakpoint + emulated devices: checks for horizontal overflow and console
// errors, and saves a first-screen screenshot. node scripts/qa/breakpoints.mjs <outDir> [baseUrl]
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
const { chromium, devices } = createRequire(import.meta.url)("playwright");
const [dir, base = "http://localhost:3100"] = process.argv.slice(2);
mkdirSync(dir, { recursive: true });
const routes = ["/", "/menu", "/pre-order", "/visit", "/story"];
const targets = [
  ...[360, 390, 768, 1024, 1440, 1920].map((w) => ({
    name: `${w}`,
    opts: { viewport: { width: w, height: w < 600 ? 800 : 900 } },
  })),
  { name: "iPhone-15", opts: devices["iPhone 15"] },
  { name: "Pixel-8", opts: devices["Pixel 7"] }, // Playwright has no "Pixel 8" profile; Pixel 7 has the same 412px CSS width
  { name: "iPad", opts: devices["iPad (gen 7)"] },
];
const b = await chromium.launch();
let issues = 0;
for (const t of targets) {
  const row = [];
  for (const r of routes) {
    const ctx = await b.newContext({ ...t.opts, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    await p.addInitScript(() => sessionStorage.setItem("pearl:proofed", "1"));
    const errs = [];
    p.on("pageerror", (e) => errs.push(e.message));
    await p.goto(base + r, { waitUntil: "networkidle" });
    await p.waitForTimeout(900);
    // scroll through so pinned sections and lazy content initialise
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 900) await p.evaluate((yy) => scrollTo(0, yy), y);
    await p.waitForTimeout(600);
    const over = await p.evaluate(() => {
      const w = document.documentElement.clientWidth;
      return Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - w;
    });
    await p.evaluate(() => scrollTo(0, 0));
    await p.waitForTimeout(500);
    if (r === "/" || r === "/pre-order")
      await p.screenshot({ path: `${dir}/${t.name}${r.replace(/\//g, "_") || "_home"}.png` });
    if (over > 0 || errs.length) issues++;
    row.push(
      `${r === "/" ? "home" : r.slice(1)}:${over > 0 ? `OVERFLOW ${over}px` : "ok"}${errs.length ? ` ERR ${errs[0]}` : ""}`,
    );
    await ctx.close();
  }
  console.log(t.name.padEnd(10), row.join("  "));
}
await b.close();
console.log(issues ? `${issues} issues` : "no horizontal overflow, no page errors");
