#!/usr/bin/env node
// Phone QA against a deployed site: node scripts/qa/mobile.mjs <outDir> [baseUrl]
import { createRequire } from "node:module";
const { chromium, devices } = createRequire(import.meta.url)("playwright");
const [dir, base = "https://pearl-bakery-site.vercel.app"] = process.argv.slice(2);
const results = [];
const ok = (name, pass, detail = "") =>
  results.push(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
const b = await chromium.launch();
for (const devName of ["iPhone 15", "Pixel 7"]) {
  const ctx = await b.newContext({ ...devices[devName], deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 120)));
  const tag = devName.replace(/\s/g, "");
  const scrollAll = async () => {
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 500) {
      await p.evaluate((yy) => scrollTo(0, yy), y);
      await p.waitForTimeout(90);
    }
    await p.waitForTimeout(600);
  };
  const overflow = () =>
    p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

  // 1. first visit: preloader plays and clears
  await p.goto(base + "/", { waitUntil: "domcontentloaded" });
  const hadPreloader = await p.locator(".preloader").count();
  await p.waitForTimeout(3500);
  const preloaderGone =
    (await p.locator(".preloader").count()) === 0 || !(await p.locator(".preloader").isVisible());
  ok(`${devName}: preloader plays once and clears`, hadPreloader > 0 && preloaderGone);
  // If React had to throw away the server HTML (hydration error), the boot classes on <html> are lost.
  const hydrated = await p.evaluate(() => document.documentElement.classList.contains("js"));
  ok(`${devName}: home hydrates cleanly (no re-render from scratch)`, hydrated);
  await p.screenshot({ path: `${dir}/${tag}-01-hero.png` });

  // 2. mobile menu opens, traps, closes, navigates
  await p.getByRole("button", { name: "Menu" }).tap();
  await p.waitForTimeout(900);
  const dialogVisible = await p.locator("#mobile-menu").isVisible();
  await p.screenshot({ path: `${dir}/${tag}-02-menu.png` });
  await p.getByRole("button", { name: "Close" }).tap();
  await p.waitForTimeout(400);
  const dialogHidden = !(await p.locator("#mobile-menu").isVisible());
  ok(`${devName}: menu opens and closes`, dialogVisible && dialogHidden);

  // 3. home scroll-through: no overflow, sections render
  await scrollAll();
  ok(`${devName}: home has no sideways scroll`, (await overflow()) <= 0, `${await overflow()}px`);

  // 4. loaf swipe row scrolls horizontally and spins
  const track = p.locator("[data-track]");
  await track.scrollIntoViewIfNeeded();
  await p.waitForTimeout(400);
  const before = await p.evaluate(() => {
    const t = document.querySelector("[data-track]");
    const s = t.querySelector("[data-panel]:nth-child(2) [data-spin]");
    return { left: t.scrollLeft, rot: s.style.transform };
  });
  await p.evaluate(() => {
    const t = document.querySelector("[data-track]");
    t.scrollBy({ left: t.clientWidth * 1.2, behavior: "instant" });
  });
  await p.waitForTimeout(700);
  const after = await p.evaluate(() => {
    const t = document.querySelector("[data-track]");
    const s = t.querySelector("[data-panel]:nth-child(2) [data-spin]");
    return { left: t.scrollLeft, rot: s.style.transform };
  });
  ok(
    `${devName}: loaves swipe sideways and spin`,
    after.left > before.left && after.rot !== before.rot,
    `scroll ${before.left}→${after.left}, ${before.rot || "none"} → ${after.rot}`,
  );
  await track.screenshot({ path: `${dir}/${tag}-03-loaves.png` });

  // 5. cut-it-open plays once in view
  await p.locator(".cut [data-stage]").scrollIntoViewIfNeeded();
  await p.evaluate(() => scrollBy(0, 250));
  await p.waitForTimeout(2600);
  const cutOpen = await p.evaluate(() => {
    const l = document.querySelector(".cut [data-half='l']");
    return getComputedStyle(l).transform !== "none";
  });
  ok(`${devName}: "cut it open" animation plays`, cutOpen);
  await p.locator(".cut [data-stage]").screenshot({ path: `${dir}/${tag}-04-cut.png` });

  // 6. step inside turns to night
  await p.locator(".step-inside").scrollIntoViewIfNeeded();
  await p.evaluate(() => scrollBy(0, 300));
  await p.waitForTimeout(3200);
  const night = await p.evaluate(() => document.querySelector(".step-inside").classList.contains("is-night"));
  ok(`${devName}: farmstand turns to night with lights`, night);
  await p.screenshot({ path: `${dir}/${tag}-05-night.png` });

  // 7. trailer→farmstand wipe completes
  await p.locator("[data-morph]").scrollIntoViewIfNeeded();
  await p.evaluate(() => {
    const m = document.querySelector("[data-morph]").getBoundingClientRect();
    scrollBy(0, m.top + m.height / 2 - innerHeight / 2);
  });
  await p.waitForTimeout(1500);
  const wipe = await p.evaluate(() => getComputedStyle(document.querySelector("[data-morph-to]")).clipPath);
  ok(
    `${devName}: trailer→farmstand wipe completes`,
    /inset\(0(%|px)?\)|inset\(0% 0% 0% 0%\)/.test(wipe),
    wipe,
  );

  // 8. marquee pause button
  const pauseBtn = p.locator("[data-marquee-toggle]");
  await pauseBtn.scrollIntoViewIfNeeded();
  await pauseBtn.tap();
  ok(`${devName}: reviews pause button works`, (await pauseBtn.getAttribute("aria-pressed")) === "true");

  // 9. map: interactive embed loads on request
  await p.getByRole("button", { name: "Load interactive map" }).tap();
  await p.waitForTimeout(800);
  ok(
    `${devName}: interactive map loads on tap`,
    (await p.locator("iframe[title^='Google Map']").count()) === 1,
  );

  // 10. tap targets ≥ 24px (WCAG 2.5.8), checked on every page
  const smallTargets = () =>
    p.evaluate(() =>
      [...document.querySelectorAll("a, button, summary, input:not([type=hidden]), select, textarea")]
        .filter(
          (e) =>
            e.offsetParent !== null &&
            !e.closest("[aria-hidden=true]") &&
            !e.matches(".sr-only-focusable, .sr-only"),
        )
        .map((e) => ({ e, r: e.getBoundingClientRect() }))
        .filter(
          ({ e, r }) =>
            r.width > 0 && (r.height < 24 || r.width < 24) && getComputedStyle(e).display !== "inline",
        )
        .map(
          ({ e, r }) =>
            `${e.tagName.toLowerCase()} "${(e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`,
        ),
    );
  let small = await smallTargets();
  ok(`${devName}: / tap targets ≥ 24px`, small.length === 0, small.slice(0, 5).join("; "));

  // 10b. navigate away from the fully-scrolled home page using the slide-out menu
  // (the header hides while scrolling down; a small scroll up brings it back, as for a real visitor)
  await p.evaluate(() => scrollBy(0, -200));
  await p.waitForTimeout(700);
  await p.getByRole("button", { name: "Menu" }).tap();
  await p.waitForTimeout(800);
  await p.locator("#mobile-menu").getByRole("link", { name: "Pre-Order" }).tap();
  await p.waitForURL("**/pre-order", { timeout: 8000 }).catch(() => {});
  await p.waitForTimeout(900);
  const crashed = /couldn.t load|Application error/i.test((await p.locator("body").textContent()) || "");
  ok(
    `${devName}: menu link from home navigates without crashing`,
    !crashed && new URL(p.url()).pathname === "/pre-order",
  );

  // 11. other pages
  for (const r of ["/menu", "/pre-order", "/visit", "/story"]) {
    await p.goto(base + r, { waitUntil: "networkidle" });
    await scrollAll();
    const o = await overflow();
    ok(`${devName}: ${r} loads, no sideways scroll`, o <= 0, `${o}px`);
    small = await smallTargets();
    ok(`${devName}: ${r} tap targets ≥ 24px`, small.length === 0, small.slice(0, 5).join("; "));
  }

  // 12. menu filter chips
  await p.goto(base + "/menu#cookies", { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  const visibleCats = await p.evaluate(() =>
    [...document.querySelectorAll("[data-category]")].filter((s) => !s.hidden).map((s) => s.id),
  );
  ok(
    `${devName}: menu filter from link (#cookies)`,
    visibleCats.length === 1 && visibleCats[0] === "cookies",
    visibleCats.join(","),
  );
  await p.getByRole("button", { name: "Everything" }).tap();
  await p.waitForTimeout(300);
  const allCats = await p.evaluate(
    () => [...document.querySelectorAll("[data-category]")].filter((s) => !s.hidden).length,
  );
  ok(`${devName}: menu "Everything" chip shows all`, allCats === 6, `${allCats}`);
  await p.screenshot({ path: `${dir}/${tag}-06-menu.png` });

  // 13. pre-order: steppers, cake builder, form validation
  await p.goto(base + "/pre-order", { waitUntil: "networkidle" });
  const pre = p.locator("#seasonal form");
  if (await pre.count()) {
    await pre.getByRole("button", { name: "One more Classic Sourdough Loaf" }).tap();
    await pre.getByRole("button", { name: "One more Apple Pie" }).tap();
    const est = (await pre.locator("p[aria-live]").textContent()).trim();
    ok(`${devName}: Thanksgiving steppers total up`, est.includes("$35"), est);
  }
  await p.locator("#cake-builder").scrollIntoViewIfNeeded();
  await p.locator("#cake-builder label:has(input[name=frosting])").nth(1).tap();
  await p.locator("#cake-builder").getByText("Pearls", { exact: true }).tap();
  await p.waitForTimeout(700);
  const cakeLabel = (await p.locator("#cake-builder [aria-live=polite]").first().textContent()).trim();
  ok(`${devName}: cake builder updates on tap`, /Blush pink.*pearls/i.test(cakeLabel), cakeLabel);
  await p.locator("#cake-builder svg[role=img]").screenshot({ path: `${dir}/${tag}-07-cake.png` });
  const custom = p.locator("#custom form");
  await custom.locator("button[type=submit]").tap();
  await p.waitForTimeout(1500);
  ok(
    `${devName}: form shows errors on empty submit`,
    (await custom.locator("[aria-invalid=true]").count()) >= 2,
  );

  // 14. visit FAQ opens
  await p.goto(base + "/visit", { waitUntil: "networkidle" });
  const faq = p.locator("details.faq").first();
  await faq.locator("summary").tap();
  ok(`${devName}: FAQ opens on tap`, await faq.evaluate((d) => d.open));

  // 15. 404 (the page's own 404 status is expected, so stop counting errors first)
  const errCount = errs.length;
  const r404 = await p.goto(base + "/not-a-page");
  errs.length = errCount;
  ok(`${devName}: 404 page`, r404.status() === 404 && (await p.getByText("This one sold out.").count()) > 0);

  ok(`${devName}: no page errors anywhere`, errs.length === 0, errs.slice(0, 3).join(" | "));
  await ctx.close();
}
await b.close();
console.log(results.join("\n"));
console.log(`\n${results.filter((r) => r.startsWith("FAIL")).length} failed of ${results.length}`);
