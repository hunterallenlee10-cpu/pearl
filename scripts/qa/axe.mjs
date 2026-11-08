#!/usr/bin/env node
// axe-core accessibility scan of every page at desktop and phone widths.
// node scripts/qa/axe.mjs [baseUrl]
import { createRequire } from "node:module";
import AxeBuilder from "@axe-core/playwright";
const { chromium } = createRequire(import.meta.url)("playwright");
const base = process.argv[2] || "http://localhost:3100";
const routes = ["/", "/menu", "/pre-order", "/visit", "/story", "/this-page-does-not-exist"];
const b = await chromium.launch();
let serious = 0;
for (const width of [1440, 390]) {
  for (const r of routes) {
    const ctx = await b.newContext({ viewport: { width, height: 900 } });
    const p = await ctx.newPage();
    await p.addInitScript(() => sessionStorage.setItem("pearl:proofed", "1"));
    await p.goto(base + r, { waitUntil: "networkidle" });
    await p.evaluate(() =>
      document.querySelectorAll("[data-reveal]").forEach((e) => e.setAttribute("data-revealed", "")),
    );
    await p.waitForTimeout(1200);
    const res = await new AxeBuilder({ page: p })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
      .analyze();
    const bad = res.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    serious += bad.length;
    const summary = res.violations.map((v) => `${v.impact}:${v.id}(${v.nodes.length})`).join(" ") || "none";
    console.log(`${String(width).padEnd(5)} ${r.padEnd(28)} violations: ${summary}`);
    for (const v of bad)
      for (const n of v.nodes.slice(0, 3))
        console.log(`      ${v.id}: ${n.target.join(" ")} — ${n.failureSummary?.split("\n")[1]?.trim()}`);
    await ctx.close();
  }
}
await b.close();
console.log(`serious/critical total: ${serious}`);
process.exit(serious ? 1 : 0);
