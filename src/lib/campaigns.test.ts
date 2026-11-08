import { describe, expect, it } from "vitest";
import { getActiveCampaign, hasRealUrl } from "./campaigns";

describe("pre-order auto-swap", () => {
  it("Thanksgiving 2026 is live today (Nov 8)", () => {
    expect(getActiveCampaign(new Date("2026-11-08T12:00:00-05:00"))?.id).toBe("thanksgiving-2026");
  });
  it("still live one second before midnight Sunday 11/22 ET", () => {
    expect(getActiveCampaign(new Date("2026-11-22T23:59:59-05:00"))?.id).toBe("thanksgiving-2026");
  });
  it("closed at midnight (start of Mon 11/23 ET) → evergreen cake", () => {
    expect(getActiveCampaign(new Date("2026-11-23T00:00:00-05:00"))).toBeNull();
    expect(getActiveCampaign(new Date("2026-11-23T05:00:00Z"))).toBeNull();
  });
  it("still closed after pick-up day", () => {
    expect(getActiveCampaign(new Date("2026-11-26T09:00:00-05:00"))).toBeNull();
  });
  it("not open before opensAt", () => {
    expect(getActiveCampaign(new Date("2026-09-15T12:00:00-04:00"))).toBeNull();
  });
});

describe("form url placeholder", () => {
  it("treats [PLACEHOLDER] as missing", () => {
    expect(hasRealUrl("[THANKSGIVING_FORM_URL]")).toBe(false);
    expect(hasRealUrl("https://forms.gle/abc")).toBe(true);
  });
});
