// Live "are they open?" status, computed in America/New_York.
// Pure and deterministic: pass in `now` so it can be unit-tested across every case.
import SunCalc from "suncalc";
import type { StatusOverride } from "@/content/business";

export const TZ = "America/New_York";
const OPEN_HOUR = 9;

export type StatusKind = "open" | "opens-today" | "opens-tomorrow" | "opens-saturday" | "override";
export type Status = {
  kind: StatusKind;
  label: string;
  isOpen: boolean;
  /** Sunset today in ET, e.g. "5:04 PM" (only on open days). */
  sunset?: string;
};

/** Fallback for server rendering: always true, never stale. */
export const STATUS_FALLBACK = "Open Sat & Sun from 9 AM";

const partsFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  weekday: "short",
  hourCycle: "h23",
});

export function etParts(date: Date) {
  const p = Object.fromEntries(partsFmt.formatToParts(date).map((x) => [x.type, x.value]));
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday);
  return {
    ymd: `${p.year}-${p.month}-${p.day}`,
    year: Number(p.year),
    month: Number(p.month),
    day: Number(p.day),
    weekday,
    minutes: Number(p.hour) * 60 + Number(p.minute),
  };
}

/** Sunset for the ET calendar day containing `date`. */
export function sunsetFor(date: Date, lat: number, lng: number): Date {
  const { year, month, day } = etParts(date);
  // Midday ET of that calendar day (17:00 UTC is 12:00 EST / 13:00 EDT).
  const midday = new Date(Date.UTC(year, month - 1, day, 17));
  return SunCalc.getTimes(midday, lat, lng).sunset;
}

const timeFmt = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" });

export function getStatus(
  now: Date,
  opts: { lat: number; lng: number; override?: StatusOverride | null },
): Status {
  const t = etParts(now);

  const o = opts.override;
  if (o && t.ymd < o.until && (!o.from || t.ymd >= o.from)) {
    return { kind: "override", label: o.label, isOpen: false };
  }

  const isSat = t.weekday === 6;
  const isSun = t.weekday === 0;
  if (!isSat && !isSun) {
    return { kind: "opens-saturday", label: "Opens Saturday 9 AM", isOpen: false };
  }

  const sunset = sunsetFor(now, opts.lat, opts.lng);
  const sunsetLabel = timeFmt.format(sunset);

  if (t.minutes < OPEN_HOUR * 60) {
    return { kind: "opens-today", label: "Opens today at 9 AM", isOpen: false, sunset: sunsetLabel };
  }
  if (now.getTime() < sunset.getTime()) {
    return { kind: "open", label: "Open now · until sold out or sunset", isOpen: true, sunset: sunsetLabel };
  }
  return isSat
    ? { kind: "opens-tomorrow", label: "Opens tomorrow at 9 AM", isOpen: false }
    : { kind: "opens-saturday", label: "Opens Saturday 9 AM", isOpen: false };
}
