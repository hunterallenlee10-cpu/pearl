#!/usr/bin/env node
// Gets Pearl Bakery's original photos into _source-photos/<folder>/<filename>.
//
//   node scripts/fetch-photos.mjs            download from Drive (folder must be shared "Anyone with the link")
//   node scripts/fetch-photos.mjs --zip x.zip  unzip a Drive "Download" zip instead
//   node scripts/fetch-photos.mjs --verify   only check counts
//
// Uses scripts/drive-manifest.json (folder, filename, id, size) and verifies the
// per-folder counts against the brief: 9 / 22 / 30 / 25 / 8 / 52 / 3 = 149.

import { readFile, mkdir, writeFile, stat, readdir, rm, rename } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "_source-photos");

export const EXPECTED = {
  "01-brand-logo-graphics": 9,
  "02-bread-and-savory": 22,
  "03-sweets-cookies": 30,
  "04-sweets-rolls-cakes-pastries": 25,
  "05-farmstand-new-shed-2026": 8,
  "06-farmstand-original-trailer": 52,
  "07-people-farm-seasonal": 3,
};

const args = process.argv.slice(2);

async function verify() {
  let ok = true;
  let total = 0;
  for (const [folder, want] of Object.entries(EXPECTED)) {
    const dir = path.join(outDir, folder);
    const have = existsSync(dir)
      ? (await readdir(dir)).filter((f) => /\.(jpe?g|png|webp|heic)$/i.test(f)).length
      : 0;
    total += have;
    const mark = have === want ? "ok " : "!! ";
    if (have !== want) ok = false;
    console.log(`${mark}${folder.padEnd(34)} ${String(have).padStart(3)} / ${want}`);
  }
  console.log(`${ok ? "ok " : "!! "}total ${total} / 149`);
  return ok;
}

async function fromZip(zipPath) {
  const tmp = path.join(outDir, ".unzip");
  await rm(tmp, { recursive: true, force: true });
  await mkdir(tmp, { recursive: true });
  execFileSync("unzip", ["-q", "-o", path.resolve(zipPath), "-d", tmp], { stdio: "inherit" });
  // Drive zips may nest as photos/<folder>/file or <folder>/file; find each folder by name.
  const walk = async (dir) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (!entry.isDirectory()) continue;
      if (EXPECTED[entry.name] !== undefined) {
        const dest = path.join(outDir, entry.name);
        await mkdir(dest, { recursive: true });
        for (const f of await readdir(p)) await rename(path.join(p, f), path.join(dest, f));
      } else await walk(p);
    }
  };
  await walk(tmp);
  await rm(tmp, { recursive: true, force: true });
}

async function fromDrive() {
  const manifest = JSON.parse(await readFile(path.join(root, "scripts/drive-manifest.json"), "utf8"));
  let done = 0;
  const queue = [...manifest];
  const worker = async () => {
    while (queue.length) {
      const f = queue.shift();
      const dest = path.join(outDir, f.folder, f.filename);
      await mkdir(path.dirname(dest), { recursive: true });
      if (existsSync(dest) && (await stat(dest)).size === f.size) { done++; continue; }
      const url = `https://drive.usercontent.google.com/download?id=${f.id}&export=download&confirm=t`;
      for (let attempt = 1; ; attempt++) {
        try {
          const res = await fetch(url, { redirect: "follow" });
          const type = res.headers.get("content-type") || "";
          if (!res.ok || type.includes("text/html")) {
            throw new Error(`${res.status} ${type} — is the folder shared "Anyone with the link"?`);
          }
          const buf = Buffer.from(await res.arrayBuffer());
          if (f.size && buf.length !== f.size) throw new Error(`size ${buf.length} != ${f.size}`);
          await writeFile(dest, buf);
          done++;
          process.stdout.write(`\r${done}/${manifest.length} ${f.folder}/${f.filename}`.padEnd(100));
          break;
        } catch (err) {
          if (attempt >= 4) { console.error(`\nFAILED ${f.folder}/${f.filename}: ${err.message}`); break; }
          await new Promise((r) => setTimeout(r, 2 ** attempt * 1000));
        }
      }
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  console.log();
}

if (args[0] === "--zip") await fromZip(args[1]);
else if (args[0] !== "--verify") await fromDrive();
const ok = await verify();
process.exit(ok ? 0 : 1);
