#!/usr/bin/env node
// Turns the originals in _source-photos/ into web images.
//
//   npm run photos:process              process every photo listed in src/data/image-meta.ts
//   npm run photos:process -- --preview write a before/after grading sheet for 4 photos and stop
//   npm run photos:process -- --force   re-encode even if outputs already exist
//
// For each photo: auto-orient, strip all metadata (EXIF/GPS), apply the grade from
// grade.config.mjs, and write AVIF + WebP at each width into public/images/<folder>/.
// Then writes src/data/images.json with sizes, alt text, blur placeholder and dominant colour.

import sharp from "sharp";
import { readdirSync, existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { grade, output } from "./grade.config.mjs";
import { imageMeta } from "../src/data/image-meta.ts";

const SRC = "_source-photos";
const OUT = "public/images";
const DATA = "src/data/images.json";
const args = new Set(process.argv.slice(2));

// filename (no extension) → folder
const index = new Map();
for (const folder of readdirSync(SRC).sort()) {
  if (folder.startsWith(".")) continue;
  for (const file of readdirSync(path.join(SRC, folder))) {
    if (!/\.jpe?g$/i.test(file)) continue;
    index.set(file.replace(/\.jpe?g$/i, ""), { folder, file });
  }
}

/** Apply the grade to a sharp pipeline. */
export function applyGrade(pipeline, folder, g = grade) {
  if (!g.enabled || g.skipFolders.includes(folder)) return pipeline;
  const w = g.warmth;
  const lift = g.shadowLift;
  return pipeline
    .recomb([
      [1 + w, 0, 0],
      [0, 1 + w * 0.25, 0],
      [0, 0, 1 - w],
    ])
    .linear((255 - lift) / 255, lift)
    .modulate({ saturation: g.saturation, brightness: g.brightness });
}

const base = (file) => sharp(file, { failOn: "none" }).rotate(); // rotate() = auto-orient; metadata is dropped by default

async function preview() {
  const picks = [
    "HERO-golden-boules-pile",
    "HERO-rosemary-loaf-styled",
    "HERO-shed-interior-hutch-string-lights",
    "HERO-cinnamon-roll-cake",
  ];
  const H = 520;
  const tiles = [];
  let x = 0;
  const cols = [];
  for (const id of picks) {
    const { folder, file } = index.get(id);
    const src = path.join(SRC, folder, file);
    const before = await base(src).resize({ height: H }).toBuffer({ resolveWithObject: true });
    const after = await applyGrade(base(src), folder).resize({ height: H }).toBuffer();
    cols.push({ before: before.data, after, w: before.info.width, id });
  }
  const totalW = cols.reduce((s, c) => s + c.w + 12, 12);
  const label = (t, w) =>
    Buffer.from(
      `<svg width="${w}" height="30"><text x="4" y="21" font-family="sans-serif" font-size="16" fill="#5B3A24">${t}</text></svg>`,
    );
  x = 12;
  for (const c of cols) {
    tiles.push({ input: label("before", c.w), left: x, top: 6 });
    tiles.push({ input: c.before, left: x, top: 36 });
    tiles.push({ input: label("after", c.w), left: x, top: 36 + H + 6 });
    tiles.push({ input: c.after, left: x, top: 36 + H + 36 });
    x += c.w + 12;
  }
  const out = process.argv.find((a) => a.startsWith("--out="))?.slice(6) ?? "grade-preview.jpg";
  await sharp({ create: { width: totalW, height: 2 * H + 84, channels: 3, background: "#FBF6EE" } })
    .composite(tiles)
    .jpeg({ quality: 88 })
    .toFile(out);
  console.log(`wrote ${out}`);
}

async function processAll() {
  const prev = existsSync(DATA) ? JSON.parse(readFileSync(DATA, "utf8")) : {};
  const result = {};
  const seen = new Map();
  const ids = Object.keys(imageMeta);
  const missing = ids.filter((id) => !index.has(id));
  if (missing.length) {
    console.error(`Missing originals for: ${missing.join(", ")}`);
    process.exit(1);
  }
  let n = 0;
  for (const id of ids) {
    const { folder, file } = index.get(id);
    const src = path.join(SRC, folder, file);
    const buf = readFileSync(src);
    const hash = createHash("sha1").update(buf).digest("hex").slice(0, 10);
    if (seen.has(hash)) console.warn(`  note: ${id} is identical to ${seen.get(hash)}`);
    seen.set(hash, id);

    const meta = await base(src).metadata();
    const width = meta.autoOrient?.width ?? meta.width;
    const height = meta.autoOrient?.height ?? meta.height;
    const graded = await applyGrade(base(src), folder).toBuffer(); // one decode + grade, reused per size
    const widths = [...output.widths, ...(imageMeta[id].extraWidths ?? [])]
      .filter((w) => w < width)
      .concat(width)
      .filter((w, i, a) => a.indexOf(w) === i)
      .sort((a, b) => a - b);
    const outDir = path.join(OUT, folder);
    mkdirSync(outDir, { recursive: true });

    const unchanged =
      prev[id]?.hash === hash &&
      prev[id]?.gradeKey === gradeKey(folder) &&
      prev[id]?.widths?.join() === widths.join() &&
      !args.has("--force");
    if (!unchanged) {
      await Promise.all(
        widths.flatMap((w) => [
          sharp(graded)
            .resize({ width: w })
            .avif(output.avif)
            .toFile(path.join(outDir, `${id}-${w}.avif`)),
          sharp(graded)
            .resize({ width: w })
            .webp(output.webp)
            .toFile(path.join(outDir, `${id}-${w}.webp`)),
        ]),
      );
    }
    const lqip = await sharp(graded).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
    const { dominant } = await sharp(graded).stats();
    const hex =
      "#" + [dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, "0")).join("");
    const m = imageMeta[id];
    result[id] = {
      id,
      folder,
      src: `/images/${folder}/${id}`,
      width,
      height,
      widths,
      alt: m.alt,
      position: m.position ?? "50% 50%",
      era: m.era ?? (folder === "06-farmstand-original-trailer" ? "past" : "present"),
      isHero: id.startsWith("HERO-"),
      blurDataURL: `data:image/webp;base64,${lqip.toString("base64")}`,
      dominantColor: hex,
      hash,
      gradeKey: gradeKey(folder),
    };
    n++;
    process.stdout.write(`\r${n}/${ids.length} ${unchanged ? "kept" : "made"} ${id}`.padEnd(90));
  }
  writeFileSync(DATA, JSON.stringify(result, null, 2) + "\n");
  console.log(`\nwrote ${DATA} (${n} images)`);
}

function gradeKey(folder) {
  if (!grade.enabled || grade.skipFolders.includes(folder)) return "none";
  return JSON.stringify([grade.warmth, grade.shadowLift, grade.saturation, grade.brightness, output]);
}

// Only run when executed directly (make-og-assets.mjs imports applyGrade from here).
if (import.meta.url === `file://${process.argv[1]}`) {
  if (args.has("--preview")) await preview();
  else await processAll();
}
