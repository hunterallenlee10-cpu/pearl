#!/usr/bin/env node
// Generates the tiling paper-grain texture used site-wide (public/textures/grain.png).
import sharp from "sharp";
import { mkdirSync } from "node:fs";
mkdirSync("public/textures", { recursive: true });
const size = 160;
// Gaussian noise, softened slightly so it reads as paper fibre rather than digital static.
const noise = await sharp({ create: { width: size, height: size, channels: 3, noise: { type: "gaussian", mean: 128, sigma: 48 } } })
  .greyscale()
  .blur(0.45)
  .png()
  .toBuffer();
await sharp(noise).png({ compressionLevel: 9, palette: true, colours: 32 }).toFile("public/textures/grain.png");
console.log("wrote public/textures/grain.png");
