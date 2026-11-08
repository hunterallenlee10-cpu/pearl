#!/usr/bin/env node
// Desktop QA against a deployed site, scrolling with the mouse wheel like a real visitor.
//   node scripts/qa/desktop.mjs <outDir> [baseUrl]
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
const [dir, base = "https://pearl-bakery-site.vercel.app"] = process.argv.slice(2);
const results = [];
const ok = (name, pass, detail = "") =>
  results.push(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
const b = await chromium.launch();

for (const [w, h] of [
  [1440, 900],
  [1920, 1080],
]) {
  const tag = `${w}`;
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  const errs = [];
  const bad = new Set();
  p.on("pageerror", (e) => errs.push(e.message.slice(0, 120)));
  p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 120)));
  p.on(
    "response",
    (r) => r.status() >= 400 && !r.url().includes("not-a-page") && bad.add(`${r.status()} ${r.url()}`),
  );
  const sy = () => p.evaluate(() => scrollY);
  // wheel until an element's top reaches `at` (fraction of viewport), like a person scrolling
  const wheelTo = async (selector, at = 0, max = 400) => {
    for (let i = 0; i < max; i++) {
      const top = await p.evaluate(
        (s) => document.querySelector(s)?.getBoundingClientRect().top ?? 0,
        selector,
      );
      if (top <= at * h) break;
      await p.mouse.wheel(0, Math.min(240, Math.max(60, top - at * h)));
      await p.waitForTimeout(35);
    }
    await p.waitForTimeout(900);
  };
  const wheel = async (px) => {
    for (let d = 0; d < px; d += 200) {
      await p.mouse.wheel(0, 200);
      await p.waitForTimeout(35);
    }
    await p.waitForTimeout(900);
  };
  await p.mouse.move(w / 2, h / 2);

  // 1. first visit: preloader, clean hydration, smooth scroll, cursor
  await p.goto(base + "/", { waitUntil: "domcontentloaded" });
  const hadPreloader = (await p.locator(".preloader").count()) > 0;
  await p.waitForTimeout(3500);
  ok(
    `${tag}: preloader plays once and clears`,
    hadPreloader &&
      !(await p
        .locator(".preloader")
        .isVisible()
        .catch(() => false)),
  );
  const html = await p.evaluate(() => document.documentElement.className);
  ok(`${tag}: home hydrates cleanly`, html.includes("js"));
  ok(`${tag}: smooth scrolling (Lenis) active`, html.includes("lenis"));
  await p.mouse.move(w / 2 + 5, h / 2 + 5);
  await p.waitForTimeout(400);
  ok(
    `${tag}: custom cursor follows the mouse`,
    (await p.locator("div.pointer-events-none.fixed.z-\\[90\\]").count()) === 1,
  );
  await p.screenshot({ path: `${dir}/${tag}-01-hero.png` });

  // 2. nav: transparent over hero, solid + hides when scrolling down, returns on scroll up
  const navClass = () => p.locator("header[data-nav]").getAttribute("class");
  const overHero = !(await navClass()).includes("bg-flour/82");
  await wheel(1400);
  const hiddenDown = (await navClass()).includes("-translate-y-full");
  await p.mouse.wheel(0, -300);
  await p.waitForTimeout(800);
  const backUp =
    !(await navClass()).includes("-translate-y-full") && (await navClass()).includes("bg-flour/82");
  ok(
    `${tag}: nav transparent over hero, hides on scroll down, returns solid on scroll up`,
    overHero && hiddenDown && backUp,
  );

  // 3. chalkboard writes itself in
  await wheelTo("#weekend-title", 0.4);
  ok(`${tag}: chalkboard writes in`, await p.evaluate(() => !!document.querySelector(".chalk-reveal.is-in")));

  // 4. loaves: pinned, track moves sideways, loaves spin, only centred name shows
  await wheelTo(".loaves", 0);
  const t0 = await p.evaluate(() => getComputedStyle(document.querySelector("[data-track]")).transform);
  const pinTop0 = await p.evaluate(
    () => document.querySelector(".loaves [data-track]").getBoundingClientRect().top,
  );
  await wheel(1600);
  const t1 = await p.evaluate(() => getComputedStyle(document.querySelector("[data-track]")).transform);
  const pinTop1 = await p.evaluate(
    () => document.querySelector(".loaves [data-track]").getBoundingClientRect().top,
  );
  const spins = await p.evaluate(() =>
    [...document.querySelectorAll("[data-spin]")].map((s) => getComputedStyle(s).transform),
  );
  ok(
    `${tag}: loaves section pins and slides sideways`,
    t0 !== t1 && Math.abs(pinTop1 - pinTop0) < 4,
    `transform changed: ${t0 !== t1}, pinned: ${Math.abs(pinTop1 - pinTop0) < 4}`,
  );
  ok(`${tag}: loaves spin`, new Set(spins).size > 1);
  // something always on screen: at several points, a loaf disc is visible
  let emptyFrames = 0;
  for (let i = 0; i < 6; i++) {
    const visibleDisc = await p.evaluate(() =>
      [...document.querySelectorAll(".loaf-disc, .loaf-intro h2, .loaf-finale p")].some((d) => {
        const r = d.getBoundingClientRect();
        return r.right > 80 && r.left < innerWidth - 80 && r.width > 0;
      }),
    );
    if (!visibleDisc) emptyFrames++;
    await wheel(500);
  }
  ok(`${tag}: no empty frames while scrolling the loaves`, emptyFrames === 0, `${emptyFrames} empty`);
  await p.screenshot({ path: `${dir}/${tag}-02-loaves.png` });

  // 5. cut it open: blade + halves part
  await wheelTo(".cut", 0);
  await wheel(900);
  const split = await p.evaluate(
    () => getComputedStyle(document.querySelector(".cut [data-half='l']")).transform !== "none",
  );
  ok(`${tag}: cut-it-open parts the loaf`, split);
  await p.screenshot({ path: `${dir}/${tag}-03-cut.png` });

  // 6. bento: sticker peels on hover
  await wheelTo("#sweet-title", 0.15);
  const tile = p.locator(".bento-tile").first();
  await tile.scrollIntoViewIfNeeded();
  await tile.hover();
  await p.waitForTimeout(700);
  const peel = await tile.locator(".peel-face").evaluate((e) => getComputedStyle(e).transform);
  ok(`${tag}: bento sticker peels on hover`, peel !== "none");
  // cursor reads "view" over a photo, and stays correct when the page scrolls under a still mouse
  const cursorBig = () =>
    p.evaluate(() => {
      const c = document.querySelector("div.pointer-events-none.fixed.z-\\[90\\] > div");
      return c ? c.getBoundingClientRect().width > 40 : false;
    });
  await p.waitForTimeout(500);
  const bigOverPhoto = await cursorBig();
  await wheel(1400);
  await p.waitForTimeout(400);
  const box = await tile.boundingBox().catch(() => null);
  const expectBig = await p.evaluate(
    ([x, y]) => !!document.elementFromPoint(x, y)?.closest("[data-cursor]"),
    [(box?.x ?? 0) + (box?.width ?? 0) / 2, (box?.y ?? 0) + (box?.height ?? 0) / 2],
  );
  const mouseAt = await p.evaluate(() => null);
  void mouseAt;
  const bigAfterScroll = await cursorBig();
  ok(
    `${tag}: cursor shows "view" over photos and updates while scrolling`,
    bigOverPhoto &&
      typeof expectBig === "boolean" &&
      bigAfterScroll ===
        (await p.evaluate(() => {
          const c = document.querySelector("div.pointer-events-none.fixed.z-\\[90\\]");
          const m = c ? new DOMMatrix(getComputedStyle(c).transform) : null;
          const el = m ? document.elementFromPoint(m.m41, m.m42) : null;
          return !!el?.closest("[data-cursor]");
        })),
  );

  // 7. timeline: line draws, trailer → farmstand wipe completes
  await wheelTo("[data-morph]", 0.25);
  const wipe = await p.evaluate(() => getComputedStyle(document.querySelector("[data-morph-to]")).clipPath);
  ok(`${tag}: trailer → farmstand wipe completes`, /inset\(0(%|px)?\)$|inset\(0%\)/.test(wipe), wipe);
  const lineDrawn = await p.evaluate(
    () => parseFloat(getComputedStyle(document.querySelector("[data-line]")).strokeDashoffset) < 0.6,
  );
  ok(`${tag}: timeline line draws in`, lineDrawn);

  // 8. step inside: pins, turns to night, lights on
  await wheelTo(".step-inside", 0);
  await wheel(Math.round(h * 2));
  const night = await p.evaluate(() => {
    const s = document.querySelector(".step-inside");
    return s.classList.contains("is-night") && s.classList.contains("is-lit");
  });
  ok(`${tag}: farmstand turns to night and the lights come on`, night);
  await p.screenshot({ path: `${dir}/${tag}-04-night.png` });

  // 9. reviews: pause on hover + pause button
  await wheelTo("#neighbors-title", 0.2);
  const track = p.locator(".marquee .marquee-track").first();
  await track.hover();
  await p.waitForTimeout(300);
  const hoverPaused = (await track.evaluate((e) => getComputedStyle(e).animationPlayState)) === "paused";
  await p.locator("[data-marquee-toggle]").click();
  const btnPaused = (await p.locator("[data-marquee-toggle]").getAttribute("aria-pressed")) === "true";
  ok(`${tag}: reviews pause on hover and with the button`, hoverPaused && btnPaused);

  // 10. map draws in; embed loads on request; footer curtain
  await wheelTo(".illustrated-map", 0.3);
  ok(`${tag}: map draws in`, await p.evaluate(() => !!document.querySelector(".illustrated-map.is-in")));
  await p.getByRole("button", { name: "Load interactive map" }).click();
  await p.waitForTimeout(800);
  ok(
    `${tag}: interactive map loads on request`,
    (await p.locator("iframe[title^='Google Map']").count()) === 1,
  );
  await wheel(4000);
  const footerSticky = await p.evaluate(
    () => getComputedStyle(document.querySelector("footer")).position === "sticky",
  );
  ok(`${tag}: footer curtain reveal`, footerSticky);
  await p.screenshot({ path: `${dir}/${tag}-05-footer.png` });
  ok(
    `${tag}: home has no sideways scroll`,
    (await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)) <=
      0,
  );

  // 11. keyboard: loaf focus centres each loaf
  await p.evaluate(() => scrollTo(0, 0));
  await p.waitForTimeout(800);
  const offsets = [];
  for (let i = 0; i < 25; i++) {
    await p.keyboard.press("Tab");
    await p.waitForTimeout(120);
    const id = await p.evaluate(() => document.activeElement?.getAttribute("aria-labelledby"));
    if (id?.startsWith("loaf-")) {
      await p.waitForTimeout(1100);
      offsets.push(
        await p.evaluate(() => {
          const r = document.activeElement.getBoundingClientRect();
          return Math.round(r.left + r.width / 2 - innerWidth / 2);
        }),
      );
    }
  }
  ok(
    `${tag}: tabbing centres each loaf`,
    offsets.length === 4 && offsets.every((o) => Math.abs(o) <= 3),
    offsets.join(","),
  );

  // 12. nav links navigate (view transition), every page loads, no overflow
  for (const [label, path] of [
    ["Menu", "/menu"],
    ["Pre-Order", "/pre-order"],
    ["Visit", "/visit"],
    ["Our Story", "/story"],
  ]) {
    await p.goto(base + "/", { waitUntil: "networkidle" });
    await p.locator("header nav").getByRole("link", { name: label, exact: true }).click();
    await p.waitForURL("**" + path, { timeout: 8000 }).catch(() => {});
    await p.waitForTimeout(800);
    const at = new URL(p.url()).pathname;
    const h1 = await p
      .locator("h1")
      .first()
      .textContent()
      .catch(() => "");
    const o = await p.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    const crashed = /couldn.t load|Application error/i.test((await p.locator("body").textContent()) || "");
    ok(
      `${tag}: nav "${label}" → ${path}`,
      at === path && !!h1 && !crashed && o <= 0,
      `at ${at}, h1 "${(h1 || "").trim().slice(0, 30)}", overflow ${o}`,
    );
  }

  // 12b. leave the home page *after* scrolling it all (every pin and animation set up), then
  // hop between inner pages via the nav and the footer.
  await p.goto(base + "/", { waitUntil: "networkidle" });
  await wheel(30000);
  await p.mouse.wheel(0, -400);
  await p.waitForTimeout(800);
  await p.locator("header nav").getByRole("link", { name: "Menu", exact: true }).click();
  await p.waitForURL("**/menu", { timeout: 8000 }).catch(() => {});
  await p.waitForTimeout(800);
  let crashed = /couldn.t load|Application error/i.test((await p.locator("body").textContent()) || "");
  ok(`${tag}: leaving a fully-scrolled home page works`, !crashed && new URL(p.url()).pathname === "/menu");
  await p.locator("footer").getByRole("link", { name: "Our Story" }).click();
  await p.waitForURL("**/story", { timeout: 8000 }).catch(() => {});
  await p.locator("header a[aria-label^='Pearl Bakery']").click();
  await p.waitForURL((u) => new URL(u).pathname === "/", { timeout: 8000 }).catch(() => {});
  await p.waitForTimeout(1500);
  crashed = /couldn.t load|Application error/i.test((await p.locator("body").textContent()) || "");
  const homeOk =
    (await p.locator("#hero-title").count()) === 1 &&
    (await p
      .locator(".preloader")
      .isVisible()
      .catch(() => false)) === false;
  ok(`${tag}: menu → story → back home via logo`, !crashed && homeOk);
  await wheelTo(".step-inside", 0);
  await wheel(Math.round(h * 2));
  ok(
    `${tag}: animations still work after navigating back home`,
    await p.evaluate(() => document.querySelector(".step-inside").classList.contains("is-night")),
  );

  // 13. menu filter
  await p.goto(base + "/menu", { waitUntil: "networkidle" });
  await p.getByRole("button", { name: "Cookies", exact: true }).click();
  await p.waitForTimeout(300);
  const vis = await p.evaluate(() =>
    [...document.querySelectorAll("[data-category]")].filter((s) => !s.hidden).map((s) => s.id),
  );
  ok(`${tag}: menu filter chips`, vis.length === 1 && vis[0] === "cookies", vis.join(","));

  // 14. pre-order: steppers, cake builder (mouse + keyboard), validation
  await p.goto(base + "/pre-order", { waitUntil: "networkidle" });
  const pre = p.locator("#seasonal form");
  if (await pre.count()) {
    await pre.getByRole("button", { name: "One more Rosemary Garlic Parmesan" }).click();
    await pre.getByRole("button", { name: "One more Brown Sugar Cake" }).click();
    const est = (await pre.locator("p[aria-live]").textContent()).trim();
    ok(`${tag}: Thanksgiving order estimate`, est.includes("$72"), est);
  }
  await p.locator("#cake-builder label:has(input[name=frosting])").nth(2).click();
  await p.locator("#cake-builder input[name=sprinkles]").first().focus();
  await p.keyboard.press("ArrowRight");
  await p.keyboard.press("ArrowRight");
  await p.waitForTimeout(500);
  const cake = (await p.locator("#cake-builder [aria-live=polite]").first().textContent()).trim();
  ok(`${tag}: cake builder (mouse + arrow keys)`, /Baby blue.*pearls/i.test(cake), cake);
  const custom = p.locator("#custom form");
  await custom.locator("button[type=submit]").click();
  await p.waitForTimeout(1500);
  ok(`${tag}: form validation`, (await custom.locator("[aria-invalid=true]").count()) >= 2);

  // 15. visit FAQ, story page renders its timeline, 404
  await p.goto(base + "/visit", { waitUntil: "networkidle" });
  await p.locator("details.faq summary").first().click();
  ok(
    `${tag}: FAQ opens`,
    await p
      .locator("details.faq")
      .first()
      .evaluate((d) => d.open),
  );
  await p.goto(base + "/story", { waitUntil: "networkidle" });
  ok(`${tag}: story timeline renders`, (await p.locator("ol li").count()) >= 5);
  const n = errs.length;
  const r404 = await p.goto(base + "/not-a-page");
  errs.length = n;
  ok(`${tag}: 404 page`, r404.status() === 404);

  // 16. every internal link on every page resolves
  const links = new Set();
  for (const r of ["/", "/menu", "/pre-order", "/visit", "/story"]) {
    await p.goto(base + r, { waitUntil: "domcontentloaded" });
    for (const href of await p.evaluate(() =>
      [...document.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href")),
    ))
      links.add(href.split("#")[0] || "/");
  }
  const broken = [];
  for (const l of links) {
    const res = await p.request.get(base + l);
    if (res.status() >= 400) broken.push(`${l} ${res.status()}`);
  }
  ok(`${tag}: all ${links.size} internal links resolve`, broken.length === 0, broken.join(", "));

  ok(
    `${tag}: no page errors or failed requests`,
    errs.length === 0 && bad.size === 0,
    [...errs, ...bad].slice(0, 3).join(" | "),
  );
  await ctx.close();
}
await b.close();
console.log(results.join("\n"));
console.log(`\n${results.filter((r) => r.startsWith("FAIL")).length} failed of ${results.length}`);
