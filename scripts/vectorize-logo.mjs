#!/usr/bin/env node
/**
 * Pearl Bakery — logo vectorizer.  `npm run logo`
 *
 * Traces the client's logo JPEG with potrace. Nothing is redrawn: every path
 * comes from the source pixels, all parts share one coordinate system, and
 * only uniform scale/translate is ever applied.
 *
 * Source anatomy (checked by eye and by pixel sampling):
 *   - "Pearl" script wordmark: near-black brown ink.
 *   - "BAKERY": charcoal serif caps under the wordmark.
 *   - Wheat sprig: light golden watercolor leaves around a dark-brown stem.
 *     The stem is the continuation of the "l"'s exit stroke, so we cut it
 *     with a straight line perpendicular to the stroke where the leaves
 *     begin. The sprig is therefore two layers:
 *       sprigWash  — watercolor silhouette (wheat #C99A5B)
 *       sprigInk   — the dark stem + darkest veins (same ink as the wordmark)
 *
 * Outputs (see bottom of file for the list).
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import potrace from "potrace";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "_source-photos/01-brand-logo-graphics/HERO-logo-pearl-bakery.jpg");

// ---------------------------------------------------------------- params ---
const P = {
  up: 2, // upscale factor before thresholding (smoother edges)
  kernel: "mitchell", // smooth resampling kernel (less ringing than lanczos)
  blur: 0.9, // gaussian sigma at the upscaled size (ink layers)
  tInk: 150, // luminance threshold: wordmark + sprig stem (ink L≈30, so ~edge midpoint)
  tBakery: 160, // BAKERY is charcoal (L≈70), so its edge midpoint sits a bit higher
  tCore: 50, // "core ink" threshold: stem/l-stroke centre is L≈20–40, leaf shading is 85–130
  coreGrow: 5, // px (upscaled) the core is grown back out to the tInk edge
  washBlur: 1.6, // extra-soft sigma for the watercolor wash (calms brush texture)
  tWash: 234, // luminance threshold: sprig watercolor silhouette
  washGap: 3, // px (upscaled) the wash keeps clear of the wordmark/BAKERY ink
  cutOverlap: 2.5, // source px the stem overlaps the "l" at the cut (hides the AA seam)
  potrace: { turdSize: 24, alphaMax: 1, optCurve: true, optTolerance: 0.2 },
  washTurdSize: 60, // drops brush specks + pinholes in the wash
  washOptTolerance: 0.3, // a touch more curve merging on the soft-edged wash
  decimals: 1,
};

// Geometry, in SOURCE pixels (1600×1600 JPEG).
// Cut across the l-exit-stroke / sprig-stem where the leaves begin.
const CUT = { x: 1082, y: 822, dx: 0.4, dy: -0.92 };
// Where the sprig lives (keeps the "l" ascender out).
const inSprigRegion = (x, y) => y < 995 && (y < 720 ? x > 1065 : x > 1036);
const cutDist = (x, y) => (x - CUT.x) * CUT.dx + (y - CUT.y) * CUT.dy; // >0 = sprig side
// BAKERY = ink components whose top edge is below this line.
const BAKERY_TOP = 950;

// Palette (PLAN.md §2)
const C = { crust: "#5B3A24", wheat: "#C99A5B", flour: "#FBF6EE" };

// ------------------------------------------------------------ raster ops ---
function components(mask, W, H) {
  const lab = new Int32Array(W * H);
  const comps = [];
  const stack = new Int32Array(W * H);
  for (let i = 0; i < W * H; i++) {
    if (!mask[i] || lab[i]) continue;
    const id = comps.length + 1;
    const c = { id, area: 0, x0: W, y0: H, x1: 0, y1: 0 };
    let sp = 0;
    stack[sp++] = i;
    lab[i] = id;
    while (sp) {
      const p = stack[--sp];
      const x = p % W;
      const y = (p - x) / W;
      c.area++;
      if (x < c.x0) c.x0 = x;
      if (x > c.x1) c.x1 = x;
      if (y < c.y0) c.y0 = y;
      if (y > c.y1) c.y1 = y;
      // 8-connectivity, matching how potrace treats diagonal touches
      for (let oy = -1; oy <= 1; oy++) {
        const yy = y + oy;
        if (yy < 0 || yy >= H) continue;
        for (let ox = -1; ox <= 1; ox++) {
          const xx = x + ox;
          if (xx < 0 || xx >= W) continue;
          const q = yy * W + xx;
          if (mask[q] && !lab[q]) {
            lab[q] = id;
            stack[sp++] = q;
          }
        }
      }
    }
    comps.push(c);
  }
  return { lab, comps };
}

function dilate(mask, W, H, r) {
  const tmp = new Uint8Array(W * H);
  const out = new Uint8Array(W * H);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      let v = 0;
      for (let k = Math.max(0, x - r); k <= Math.min(W - 1, x + r) && !v; k++) v = mask[y * W + k];
      tmp[y * W + x] = v;
    }
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      let v = 0;
      for (let k = Math.max(0, y - r); k <= Math.min(H - 1, y + r) && !v; k++) v = tmp[k * W + x];
      out[y * W + x] = v;
    }
  return out;
}

/** Components of `mask` that share at least one pixel with `touch`. */
function keepTouching(mask, touch, W, H) {
  const { lab } = components(mask, W, H);
  const keep = new Set();
  for (let i = 0; i < lab.length; i++) if (lab[i] && touch[i]) keep.add(lab[i]);
  return lab.map((id) => (keep.has(id) ? 1 : 0));
}

const and = (a, b) => a.map((v, i) => v & b[i]);
const andNot = (a, b) => a.map((v, i) => v & (b[i] ^ 1));
const or = (...ms) => ms[0].map((_, i) => ms.reduce((s, m) => s | m[i], 0));

// --------------------------------------------------------------- tracing ---
/** Trace a binary mask (1 = ink) → path d in SOURCE px relative to `origin`. */
async function trace(
  mask,
  W,
  H,
  { origin, crop, turdSize = P.potrace.turdSize, optTolerance = P.potrace.optTolerance },
) {
  // crop (upscaled px) to the ink bbox + padding so potrace has clean borders
  const pad = 8;
  const x0 = Math.max(0, crop.x0 - pad);
  const y0 = Math.max(0, crop.y0 - pad);
  const x1 = Math.min(W - 1, crop.x1 + pad);
  const y1 = Math.min(H - 1, crop.y1 + pad);
  const w = x1 - x0 + 1;
  const h = y1 - y0 + 1;
  const buf = Buffer.alloc(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) buf[y * w + x] = mask[(y + y0) * W + (x + x0)] ? 0 : 255;
  const png = await sharp(buf, { raw: { width: w, height: h, channels: 1 } })
    .png()
    .toBuffer();

  const t = new potrace.Potrace({ ...P.potrace, turdSize, optTolerance, threshold: 128, blackOnWhite: true });
  await new Promise((res, rej) => t.loadImage(png, (err) => (err ? rej(err) : res())));
  t.getPathTag(); // runs the trace
  // Snap every point to the 1/10^decimals grid in ABSOLUTE source px, then emit
  // relative commands from those snapped integers: compact, and no drift.
  const f = 10 ** P.decimals;
  const snap = (p) => [
    Math.round(((p.x + x0) / P.up - origin.x) * f),
    Math.round(((p.y + y0) / P.up - origin.y) * f),
  ];
  let out = "";
  let prevAbs = null; // absolute start of the previous subpath (for "m")
  for (const { curve } of t._pathlist) {
    const start = snap(curve.c[(curve.n - 1) * 3 + 2]);
    // first subpath is absolute; later ones relative to the previous end point
    let cur = start;
    out += prevAbs ? "m" + nums(start[0] - prevAbs[0], start[1] - prevAbs[1]) : "M" + nums(...start);
    curve.tag.forEach((tag, i) => {
      if (tag === "CURVE") {
        const [a, b, c] = [snap(curve.c[i * 3]), snap(curve.c[i * 3 + 1]), snap(curve.c[i * 3 + 2])];
        out +=
          "c" +
          nums(a[0] - cur[0], a[1] - cur[1], b[0] - cur[0], b[1] - cur[1], c[0] - cur[0], c[1] - cur[1]);
        cur = c;
      } else {
        const [b, c] = [snap(curve.c[i * 3 + 1]), snap(curve.c[i * 3 + 2])];
        out += "l" + nums(b[0] - cur[0], b[1] - cur[1], c[0] - b[0], c[1] - b[1]);
        cur = c;
      }
    });
    out += "z";
    // after "z" the current point is the subpath start
    prevAbs = start;
  }
  return out;

  /** Format integers-in-tenths compactly: 12 -> "1.2", -5 -> "-.5", 30 -> "3". */
  function nums(...vals) {
    let str = "";
    let prevHasDot = false;
    vals.forEach((v, k) => {
      let n = (v / f).toFixed(P.decimals).replace(/\.?0+$/, "");
      if (n === "-0" || n === "") n = "0";
      n = n.replace(/^(-?)0\./, "$1.");
      const sep = k === 0 || n.startsWith("-") || (n.startsWith(".") && prevHasDot) ? "" : " ";
      str += sep + n;
      prevHasDot = n.includes(".");
    });
    return str;
  }
}

function bboxOf(mask, W, H) {
  let x0 = W,
    y0 = H,
    x1 = -1,
    y1 = -1;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (mask[y * W + x]) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  return { x0, y0, x1, y1 };
}

// ------------------------------------------------------------------ main ---
async function main() {
  const meta = await sharp(SRC).metadata();
  const W = meta.width * P.up;
  const H = meta.height * P.up;
  const grey = (sigma) =>
    sharp(SRC)
      .greyscale()
      .resize(W, H, { kernel: P.kernel })
      .blur(sigma)
      .raw()
      .toBuffer({ resolveWithObject: true });
  const { data: L, info } = await grey(P.blur);
  const { data: Lw } = await grey(P.washBlur);
  if (info.channels !== 1) throw new Error(`expected 1 channel, got ${info.channels}`);

  const N = W * H;
  const ink = new Uint8Array(N);
  const dark = new Uint8Array(N);
  const wash = new Uint8Array(N);
  const region = new Uint8Array(N);
  const beyond = new Uint8Array(N); // sprig side of the cut (wordmark loses these)
  const stemZone = new Uint8Array(N); // sprig side of the cut, minus the overlap
  const cutBand = new Uint8Array(N); // thin strip along the cut: the stem must touch it
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const sx = (x + 0.5) / P.up;
      const sy = (y + 0.5) / P.up;
      const r = inSprigRegion(sx, sy);
      const d = cutDist(sx, sy);
      ink[i] = L[i] < P.tInk ? 1 : 0;
      dark[i] = L[i] < P.tCore ? 1 : 0;
      wash[i] = Lw[i] < P.tWash ? 1 : 0;
      region[i] = r ? 1 : 0;
      beyond[i] = r && d > 0 ? 1 : 0;
      stemZone[i] = r && d > -P.cutOverlap ? 1 : 0;
      cutBand[i] = r && d > -P.cutOverlap && d < 4 ? 1 : 0;
    }

  // BAKERY: ink components entirely below BAKERY_TOP
  const bInk = L.map((v) => (v < P.tBakery ? 1 : 0));
  const bCC = components(bInk, W, H);
  const bakeryIds = new Set(bCC.comps.filter((c) => c.y0 / P.up > BAKERY_TOP).map((c) => c.id));
  const bakery = bCC.lab.map((id) => (bakeryIds.has(id) ? 1 : 0));
  const bakeryLetters = bakeryIds.size;

  // Inside the sprig region, ink is only trusted near "core" pixels (true ink,
  // not watercolor shading that happens to be dark).
  const near = dilate(dark, W, H, P.coreGrow);
  const regionInk = and(andNot(ink, bakery), and(region, near));
  const outsideInk = andNot(andNot(ink, bakery), region);

  // Wordmark: everything outside the region + the "l" exit stroke up to the cut.
  // Bits lying wholly inside the sprig region are veins: not wordmark.
  const pre = or(outsideInk, andNot(regionInk, beyond));
  const preCC = components(pre, W, H);
  const veinIds = new Set(
    preCC.comps
      .filter((c) => inSprigRegion(c.x0 / P.up, c.y1 / P.up) && inSprigRegion(c.x0 / P.up, c.y0 / P.up))
      .map((c) => c.id),
  );
  const wordmark = preCC.lab.map((id) => (id && !veinIds.has(id) ? 1 : 0));

  // Sprig stem: core ink beyond the cut (with a small overlap), connected to it.
  const sprigInk = keepTouching(and(regionInk, stemZone), cutBand, W, H);

  const keepClear = dilate(or(wordmark, bakery), W, H, P.washGap);
  const sprigWash = andNot(and(wash, region), keepClear);

  // "P" = the leftmost large wordmark component (it stands alone in the source)
  const wmCC = components(wordmark, W, H);
  const pComp = wmCC.comps.filter((c) => c.area > 1000).sort((a, b) => a.x0 - b.x0)[0];
  const letterP = wmCC.lab.map((id) => (id === pComp.id ? 1 : 0));

  // Tight viewBox: bbox of everything that will survive turdSize
  const all = or(wordmark, bakery, sprigInk, sprigWash);
  const allCC = components(all, W, H);
  const big = allCC.comps.filter((c) => c.area > P.potrace.turdSize);
  const bb = {
    x0: Math.min(...big.map((c) => c.x0)),
    y0: Math.min(...big.map((c) => c.y0)),
    x1: Math.max(...big.map((c) => c.x1)),
    y1: Math.max(...big.map((c) => c.y1)),
  };
  const origin = { x: Math.floor(bb.x0 / P.up), y: Math.floor(bb.y0 / P.up) };
  const vbW = Math.ceil((bb.x1 + 1) / P.up) - origin.x;
  const vbH = Math.ceil((bb.y1 + 1) / P.up) - origin.y;

  const tr = (m, opts = {}) => trace(m, W, H, { origin, crop: bboxOf(m, W, H), ...opts });
  const parts = {
    wordmark: await tr(wordmark),
    bakery: await tr(bakery),
    sprig: await tr(sprigWash, { turdSize: P.washTurdSize, optTolerance: P.washOptTolerance }),
    sprigInk: await tr(sprigInk),
  };
  const dP = await tr(letterP);

  const viewBox = `0 0 ${vbW} ${vbH}`;
  const bounds = {
    sprig: rel(bboxOf(or(sprigWash, sprigInk), W, H), origin),
    p: rel(bboxOf(letterP, W, H), origin),
    sprigInkOnly: rel(bboxOf(sprigInk, W, H), origin),
  };

  // --------------------------------------------------------------- write ---
  const out = (p) => path.join(ROOT, p);
  await fs.mkdir(out("public/brand"), { recursive: true });
  await fs.mkdir(out("src/app"), { recursive: true });
  await fs.mkdir(out("src/components/brand"), { recursive: true });

  const svg = (vb, body, extra = "") =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"${extra}>${body}</svg>\n`;
  const path_ = (d, fill) => `<path fill="${fill}" fill-rule="evenodd" d="${d}"/>`;

  const logoBody = (sprigFill, title) =>
    `<title>${title}</title>` +
    `<g id="sprig" data-sprig="">${path_(parts.sprig, sprigFill)}${path_(parts.sprigInk, "currentColor")}</g>` +
    path_(parts.wordmark, "currentColor") +
    path_(parts.bakery, "currentColor");
  const logoSvg = (ink, sprigFill) =>
    svg(viewBox, logoBody(sprigFill, "Pearl Bakery"), ` role="img" color="${ink}" fill="currentColor"`);

  await fs.writeFile(out("public/brand/logo.svg"), logoSvg(C.crust, C.wheat));
  await fs.writeFile(out("public/brand/logo-cream.svg"), logoSvg(C.flour, C.wheat));

  // Sprig alone, cropped tight to its own bounds (same scale/coords as the logo)
  const s = bounds.sprig;
  await fs.writeFile(
    out("public/brand/sprig.svg"),
    svg(
      `${s.x} ${s.y} ${s.w} ${s.h}`,
      // single tone (stem merges into the wash) so it reads as one mark on its own
      `<title>Wheat sprig</title>${path_(parts.sprig, "currentColor")}${path_(parts.sprigInk, "currentColor")}`,
      ` role="img" color="${C.wheat}"`,
    ),
  );

  // Monogram: traced "P" + traced sprig, uniform scale only, on a flour tile.
  const icon = monogram(dP, parts, bounds);
  await fs.writeFile(out("src/app/icon.svg"), icon);
  const iconBuf = Buffer.from(icon);
  const png = (size, file) =>
    sharp(iconBuf, { density: (72 * size) / 512 })
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toFile(out(file));
  await png(180, "src/app/apple-icon.png");
  await png(512, "public/brand/icon-512.png");
  await png(192, "public/brand/icon-192.png");

  // OG / raster logo: 1200px wide, transparent, crust ink + wheat sprig
  const logoBuf = Buffer.from(logoSvg(C.crust, C.wheat).replace(/currentColor/g, C.crust));
  await sharp(logoBuf, { density: (72 * 1200) / vbW })
    .resize(1200)
    .png({ compressionLevel: 9 })
    .toFile(out("public/brand/logo-1200.png"));

  // TS module for React
  const ts =
    `// Generated by scripts/vectorize-logo.mjs — do not edit by hand. Run \`npm run logo\`.\n` +
    `// Traced from _source-photos/01-brand-logo-graphics/HERO-logo-pearl-bakery.jpg.\n` +
    `// All paths use fill-rule="evenodd" and share one coordinate system (source px).\n\n` +
    `export const logoViewBox = "${viewBox}";\n\n` +
    `/** Rotation origin for animating the sprig: the cut where the stem leaves the "l". */\n` +
    `export const sprigOrigin = { x: ${round(CUT.x - origin.x)}, y: ${round(CUT.y - origin.y)} } as const;\n\n` +
    `/** Bounds of the sprig (wash + stem) inside logoViewBox. */\n` +
    `export const sprigBounds = ${JSON.stringify(bounds.sprig)} as const;\n\n` +
    `export const logoParts = {\n` +
    `  /** "Pearl" script wordmark (ink). */\n  wordmark: ${JSON.stringify(parts.wordmark)},\n` +
    `  /** "BAKERY" caps (ink). */\n  bakery: ${JSON.stringify(parts.bakery)},\n` +
    `  /** Wheat sprig watercolor silhouette (wheat #C99A5B). */\n  sprig: ${JSON.stringify(parts.sprig)},\n` +
    `  /** Sprig stem + dark veins (ink); continues the "l" exit stroke. Draw over \`sprig\`. */\n  sprigInk: ${JSON.stringify(parts.sprigInk)},\n` +
    `} as const;\n\n` +
    `export const logoColors = ${JSON.stringify(C)} as const;\n`;
  const tsFile = out("src/components/brand/LogoPaths.ts");
  await fs.writeFile(tsFile, await prettify(ts, tsFile));

  const sizes = {};
  for (const f of [
    "public/brand/logo.svg",
    "public/brand/logo-cream.svg",
    "public/brand/sprig.svg",
    "src/app/icon.svg",
  ])
    sizes[f] = (await fs.stat(out(f))).size;
  console.log(
    JSON.stringify(
      { params: P, bakeryLetters, viewBox, origin, bounds, pComp: rel(pComp, { x: 0, y: 0 }), sizes },
      null,
      2,
    ),
  );
}

/** Format generated TS with the repo's Prettier config so `format:check` stays green. */
async function prettify(code, filepath) {
  try {
    const prettier = await import("prettier");
    const opts = (await prettier.resolveConfig(filepath)) ?? {};
    return await prettier.format(code, { ...opts, filepath });
  } catch (e) {
    console.warn(`prettier skipped: ${e.message}`);
    return code;
  }
}

const round = (v) => Math.round(v * 10) / 10;
function rel(b, origin) {
  const x = b.x0 / P.up - origin.x;
  const y = b.y0 / P.up - origin.y;
  return { x: round(x), y: round(y), w: round((b.x1 + 1 - b.x0) / P.up), h: round((b.y1 + 1 - b.y0) / P.up) };
}

/** Square favicon: P + sprig, side by side as traced, uniform scale. */
function monogram(dP, parts, bounds) {
  const S = 512;
  const rx = Math.round(S * 0.18);
  const p = bounds.p;
  const s = bounds.sprig;
  // Tuck the sprig into the open space right of the P (its lower right is empty)
  // and drop it so its top lines up with the P's top: a compact square mark.
  const overlap = p.w * 0.2;
  const sprigDx = p.x + p.w - overlap - s.x;
  const sprigDy = p.y - s.y;
  const gx0 = p.x;
  const gx1 = s.x + sprigDx + s.w;
  const gy0 = Math.min(p.y, s.y + sprigDy);
  const gy1 = Math.max(p.y + p.h, s.y + sprigDy + s.h);
  const gw = gx1 - gx0;
  const gh = gy1 - gy0;
  const inner = S * 0.84;
  const k = inner / Math.max(gw, gh);
  const tx = (S - gw * k) / 2 - gx0 * k;
  const ty = (S - gh * k) / 2 - gy0 * k;
  const f = (n) => Math.round(n * 1000) / 1000;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}">` +
    `<rect width="${S}" height="${S}" rx="${rx}" fill="${C.flour}"/>` +
    `<g transform="translate(${f(tx)} ${f(ty)}) scale(${f(k)})">` +
    `<g transform="translate(${f(sprigDx)} ${f(sprigDy)})">` +
    `<path fill="${C.wheat}" fill-rule="evenodd" d="${parts.sprig}"/>` +
    `<path fill="${C.crust}" fill-rule="evenodd" d="${parts.sprigInk}"/></g>` +
    `<path fill="${C.crust}" fill-rule="evenodd" d="${dP}"/>` +
    `</g></svg>\n`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
