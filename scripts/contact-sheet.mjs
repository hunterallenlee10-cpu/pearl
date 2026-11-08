#!/usr/bin/env node
// Labelled contact sheets for reviewing photos.
//   node scripts/contact-sheet.mjs <out.jpg> <file...>       explicit files
//   node scripts/contact-sheet.mjs <outDir> --folder <name>  every photo in a source folder (paged, 12 per sheet)
//   node scripts/contact-sheet.mjs <out.jpg> --heroes        every HERO- photo
import sharp from "sharp";
import { readdirSync, mkdirSync } from "node:fs";
import path from "node:path";

const SRC = "_source-photos";
const [out, ...rest] = process.argv.slice(2);
const CELL = Number(process.env.CELL || 300);
const LABEL = 34;
const COLS = 4;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

async function sheet(files, outFile) {
  const rows = Math.ceil(files.length / COLS);
  const tiles = await Promise.all(
    files.map(async (f, i) => {
      const img = await sharp(f).rotate().resize(CELL, CELL, { fit: "inside" }).toBuffer();
      const meta = await sharp(img).metadata();
      const name = path.basename(f).replace(/\.jpe?g$/i, "");
      const label = Buffer.from(
        `<svg width="${CELL}" height="${LABEL}"><rect width="100%" height="100%" fill="#2A1B12"/><text x="6" y="14" font-family="sans-serif" font-size="11" fill="#FBF6EE">${esc(
          name.slice(0, 46),
        )}</text><text x="6" y="28" font-family="sans-serif" font-size="11" fill="#C99A5B">${esc(name.slice(46, 92))}</text></svg>`,
      );
      const x = (i % COLS) * CELL;
      const y = Math.floor(i / COLS) * (CELL + LABEL);
      return [
        { input: img, left: x + Math.round((CELL - meta.width) / 2), top: y + Math.round((CELL - meta.height) / 2) },
        { input: label, left: x, top: y + CELL },
      ];
    }),
  );
  await sharp({
    create: { width: COLS * CELL, height: rows * (CELL + LABEL), channels: 3, background: "#F3EADB" },
  })
    .composite(tiles.flat())
    .jpeg({ quality: 78 })
    .toFile(outFile);
  console.log(outFile);
}

if (rest[0] === "--folder") {
  const folder = rest[1];
  const files = readdirSync(path.join(SRC, folder)).sort().map((f) => path.join(SRC, folder, f));
  mkdirSync(out, { recursive: true });
  for (let i = 0; i < files.length; i += 12) {
    await sheet(files.slice(i, i + 12), path.join(out, `${folder}-${i / 12 + 1}.jpg`));
  }
} else if (rest[0] === "--heroes") {
  const files = readdirSync(SRC)
    .sort()
    .flatMap((d) => readdirSync(path.join(SRC, d)).filter((f) => f.startsWith("HERO-")).map((f) => path.join(SRC, d, f)));
  await sheet(files, out);
} else {
  await sheet(rest, out);
}
