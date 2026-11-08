// "This Weekend" menu, read from a Google Sheet the owner edits on her phone.
// Sheet columns: category, item, note, available (yes/no), badge
// Optional row: category "updated", item "2026-11-14" (otherwise the fetch date is used).
// Falls back to src/content/menu.ts if the env var is missing or anything goes wrong.
import { weekendFallback, type WeekendBoard, type WeekendGroup, type WeekendItem } from "@/content/menu";

/** RFC 4180-ish CSV parser: handles quoted fields, escaped quotes, commas and newlines in quotes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const src = text.replace(/^﻿/, "");
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

const GROUPS: Record<string, WeekendGroup> = {
  sourdough: "Sourdough",
  bread: "Sourdough",
  "baked goods": "Baked goods",
  sweets: "Baked goods",
  "also at the stand": "Also at the stand",
  farm: "Also at the stand",
  "farm: eggs & honey": "Also at the stand",
  eggs: "Also at the stand",
  honey: "Also at the stand",
};

const truthy = (v: string) => !/^(no|n|false|0|sold out|x)$/i.test(v.trim());

export function csvToBoard(text: string, today: string): WeekendBoard | null {
  const rows = parseCsv(text);
  if (!rows.length) return null;
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const col = (name: string) => header.indexOf(name);
  const ci = col("category");
  const ii = col("item");
  if (ci < 0 || ii < 0) return null;
  const ni = col("note");
  const ai = col("available");
  const bi = col("badge");

  let updated = today;
  const items: WeekendItem[] = [];
  for (const r of rows.slice(1)) {
    const cat = (r[ci] ?? "").trim().toLowerCase();
    const item = (r[ii] ?? "").trim();
    if (!item) continue;
    if (cat === "updated") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(item)) updated = item;
      continue;
    }
    const group = GROUPS[cat];
    if (!group) continue;
    items.push({
      group,
      item: item.slice(0, 80),
      note: ni >= 0 && r[ni]?.trim() ? r[ni].trim().slice(0, 120) : undefined,
      badge: bi >= 0 && r[bi]?.trim() ? r[bi].trim().slice(0, 24) : undefined,
      available: ai >= 0 ? truthy(r[ai] ?? "yes") : true,
    });
  }
  if (!items.length) return null;
  return { updated, items, source: "sheet" };
}

export async function getWeekendBoard(): Promise<WeekendBoard> {
  const url = process.env.WEEKEND_MENU_CSV_URL;
  if (!url) return weekendFallback;
  try {
    const res = await fetch(url, { next: { revalidate: 300 }, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return weekendFallback;
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
    return csvToBoard(await res.text(), today) ?? weekendFallback;
  } catch {
    return weekendFallback;
  }
}

export function formatUpdated(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
}
