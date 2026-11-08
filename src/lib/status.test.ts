import { describe, expect, it } from "vitest";
import { getStatus, sunsetFor, etParts } from "./status";

const geo = { lat: 38.2915, lng: -76.6358 };
const at = (iso: string, override?: Parameters<typeof getStatus>[1]["override"]) =>
  getStatus(new Date(iso), { ...geo, override });

describe("status pill", () => {
  // Week of Nov 2–8, 2026 (EST, UTC-5). Sat = Nov 7, Sun = Nov 8.
  it.each([
    ["2026-11-02T12:00:00-05:00", "Mon"],
    ["2026-11-03T08:00:00-05:00", "Tue"],
    ["2026-11-04T23:59:00-05:00", "Wed"],
    ["2026-11-05T09:30:00-05:00", "Thu"],
    ["2026-11-06T20:00:00-05:00", "Fri evening"],
  ])("weekday %s (%s) → Opens Saturday 9 AM", (iso) => {
    expect(at(iso)).toMatchObject({ kind: "opens-saturday", label: "Opens Saturday 9 AM", isOpen: false });
  });

  it("Saturday before 9 → Opens today at 9 AM", () => {
    expect(at("2026-11-07T08:59:00-05:00")).toMatchObject({
      kind: "opens-today",
      label: "Opens today at 9 AM",
    });
    expect(at("2026-11-07T00:00:00-05:00").kind).toBe("opens-today");
  });

  it("Saturday at exactly 9 → open", () => {
    expect(at("2026-11-07T09:00:00-05:00")).toMatchObject({
      kind: "open",
      label: "Open now · until sold out or sunset",
      isOpen: true,
    });
  });

  it("Saturday sunset boundary", () => {
    const sunset = sunsetFor(new Date("2026-11-07T12:00:00-05:00"), geo.lat, geo.lng);
    // Leonardtown sunset in early November is just before 5 PM EST.
    const et = etParts(sunset);
    expect(et.minutes).toBeGreaterThan(16 * 60 + 40);
    expect(et.minutes).toBeLessThan(17 * 60 + 5);
    expect(getStatus(new Date(sunset.getTime() - 60_000), geo).kind).toBe("open");
    expect(getStatus(new Date(sunset.getTime() + 60_000), geo)).toMatchObject({
      kind: "opens-tomorrow",
      label: "Opens tomorrow at 9 AM",
    });
  });

  it("Sunday before 9 → Opens today; daytime → open; after sunset → Opens Saturday", () => {
    expect(at("2026-11-08T07:15:00-05:00").kind).toBe("opens-today");
    expect(at("2026-11-08T13:00:00-05:00").kind).toBe("open");
    expect(at("2026-11-08T19:00:00-05:00")).toMatchObject({
      kind: "opens-saturday",
      label: "Opens Saturday 9 AM",
    });
  });

  it("summer sunset is late (open at 8 PM on a June Saturday)", () => {
    expect(at("2026-06-20T20:00:00-04:00").kind).toBe("open");
    expect(at("2026-06-20T21:00:00-04:00").kind).toBe("opens-tomorrow");
  });

  it("server time zone doesn't matter: UTC instants map to ET", () => {
    // 2026-11-07 13:59 UTC = 8:59 EST Saturday
    expect(at("2026-11-07T13:59:00Z").kind).toBe("opens-today");
    // 2026-11-07 14:00 UTC = 9:00 EST
    expect(at("2026-11-07T14:00:00Z").kind).toBe("open");
    // 2026-11-07 03:00 UTC is still Friday 10 PM EST
    expect(at("2026-11-07T03:00:00Z").kind).toBe("opens-saturday");
  });

  describe("DST edges", () => {
    it("spring forward: Sunday Mar 8, 2026 opens at 9 AM EDT (13:00 UTC)", () => {
      expect(at("2026-03-08T12:59:00Z").kind).toBe("opens-today");
      expect(at("2026-03-08T13:00:00Z").kind).toBe("open");
    });
    it("fall back: Sunday Nov 1, 2026 opens at 9 AM EST (14:00 UTC)", () => {
      expect(at("2026-11-01T13:30:00Z").kind).toBe("opens-today");
      expect(at("2026-11-01T14:00:00Z").kind).toBe("open");
    });
    it("Saturday before spring forward still opens at 9 local", () => {
      expect(at("2026-03-07T13:59:00Z").kind).toBe("opens-today");
      expect(at("2026-03-07T14:00:00Z").kind).toBe("open");
    });
  });

  describe("manual override", () => {
    const override = { label: "Closed this weekend: see you 12/5!", until: "2026-12-01" };
    it("shows the override label before `until`, even during open hours", () => {
      expect(at("2026-11-28T11:00:00-05:00", override)).toMatchObject({
        kind: "override",
        label: "Closed this weekend: see you 12/5!",
        isOpen: false,
      });
      expect(at("2026-11-30T23:59:00-05:00", override).kind).toBe("override");
    });
    it("stops at the start of `until` (ET)", () => {
      expect(at("2026-12-01T00:00:00-05:00", override).kind).toBe("opens-saturday");
      expect(at("2026-12-05T10:00:00-05:00", override).kind).toBe("open");
    });
    it("respects an optional `from`", () => {
      const o = { ...override, from: "2026-11-27" };
      expect(at("2026-11-22T10:00:00-05:00", o).kind).toBe("open");
      expect(at("2026-11-27T00:00:00-05:00", o).kind).toBe("override");
    });
  });
});
