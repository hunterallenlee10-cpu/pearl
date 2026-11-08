#!/usr/bin/env node
// Social-preview source images (JPEG, since the OG renderer can't read AVIF/WebP):
// 1200×630 graded crops of real photos in public/og/, plus a cream logo PNG for dark backgrounds.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { applyGrade } from "./process-images.mjs";

const SRC = "_source-photos";
const picks = {
  home: ["02-bread-and-savory/HERO-golden-boules-pile.jpg", "50% 70%"],
  menu: ["02-bread-and-savory/HERO-rosemary-loaf-styled.jpg", "50% 50%"],
  "pre-order": ["04-sweets-rolls-cakes-pastries/HERO-cinnamon-roll-cake.jpg", "50% 60%"],
  visit: ["05-farmstand-new-shed-2026/HERO-shed-exterior-fall-field.jpg", "40% 70%"],
  story: ["05-farmstand-new-shed-2026/HERO-shed-interior-hutch-string-lights.jpg", "50% 35%"],
};
mkdirSync("public/og", { recursive: true });
for (const [name, [file, pos]] of Object.entries(picks)) {
  const [folder] = file.split("/");
  const [px, py] = pos.split(" ").map((v) => parseFloat(v) / 100);
  const img = applyGrade(sharp(`${SRC}/${file}`).rotate(), folder);
  const meta = await sharp(`${SRC}/${file}`).metadata();
  const scale = Math.max(1200 / meta.width, 630 / meta.height);
  const w = Math.round(meta.width * scale),
    h = Math.round(meta.height * scale);
  const left = Math.round((w - 1200) * px),
    top = Math.round((h - 630) * py);
  await img
    .resize(w, h)
    .extract({ left, top, width: 1200, height: 630 })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(`public/og/${name}.jpg`);
  console.log(`public/og/${name}.jpg`);
}
await sharp("public/brand/logo-cream.svg", { density: 300 })
  .resize({ width: 520 })
  .png()
  .toFile("public/og/logo-cream.png");
console.log("public/og/logo-cream.png");
