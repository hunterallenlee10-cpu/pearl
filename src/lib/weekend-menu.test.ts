import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { csvToBoard, parseCsv } from "./weekend-menu";

describe("CSV parsing", () => {
  it("handles quotes, commas and escaped quotes", () => {
    expect(parseCsv('a,b\n"x, y","say ""hi"""\n')).toEqual([
      ["a", "b"],
      ["x, y", 'say "hi"'],
    ]);
  });
  it("handles CRLF and a BOM", () => {
    expect(parseCsv("﻿a,b\r\n1,2\r\n")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });
});

describe("sheet → board", () => {
  it("reads the starter CSV", () => {
    const board = csvToBoard(readFileSync("content/weekend-menu.starter.csv", "utf8"), "2026-11-08");
    expect(board?.source).toBe("sheet");
    expect(board?.items.filter((i) => i.group === "Sourdough").map((i) => i.item)).toEqual([
      "Classic",
      "Italian Herbs & Cheese",
      "Rosemary Garlic Parmesan",
    ]);
    expect(board?.items.filter((i) => i.group === "Also at the stand")).toHaveLength(2);
    expect(board?.updated).toBe("2026-11-07");
  });
  it("marks sold-out items unavailable and is forgiving about case", () => {
    const b = csvToBoard("Category,Item,Note,Available,Badge\nSOURDOUGH,Classic,,NO,\nbaked goods,Rolls,,yes,Best-seller\n", "2026-11-08");
    expect(b?.items).toEqual([
      { group: "Sourdough", item: "Classic", note: undefined, badge: undefined, available: false },
      { group: "Baked goods", item: "Rolls", note: undefined, badge: "Best-seller", available: true },
    ]);
    expect(b?.updated).toBe("2026-11-08");
  });
  it("returns null for a sheet with the wrong columns or no rows (→ fallback)", () => {
    expect(csvToBoard("foo,bar\n1,2\n", "2026-11-08")).toBeNull();
    expect(csvToBoard("category,item\n", "2026-11-08")).toBeNull();
    expect(csvToBoard("<!doctype html><html>", "2026-11-08")).toBeNull();
  });
});
