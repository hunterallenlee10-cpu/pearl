"use client";
import { useEffect, useState } from "react";
import { business } from "@/content/business";
import { getStatus, STATUS_FALLBACK, type Status } from "@/lib/status";

/**
 * Live open/closed status. Rendered on the client so cached pages never show a stale time;
 * the server renders a fallback that is always true.
 */
export function StatusPill({
  tone = "light",
  className = "",
}: {
  tone?: "light" | "dark" | "glass";
  className?: string;
}) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const tick = () =>
      setStatus(
        getStatus(new Date(), {
          lat: business.sunGeo.lat,
          lng: business.sunGeo.lng,
          override: business.statusOverride,
        }),
      );
    tick();
    const id = window.setInterval(tick, 60_000);
    const onVis = () => document.visibilityState === "visible" && tick();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const open = status?.isOpen;
  const tones = {
    light: "bg-parchment/90 text-crust ring-1 ring-crust/15",
    dark: "bg-white/10 text-flour ring-1 ring-flour/20",
    glass: "bg-flour/80 text-crust ring-1 ring-crust/10 backdrop-blur-md",
  };

  return (
    <p
      className={`inline-flex min-h-9 items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap ${tones[tone]} ${className}`}
      title={status?.sunset ? `Sunset today: ${status.sunset}` : undefined}
    >
      <span
        aria-hidden
        className={`size-2 shrink-0 rounded-full ${
          open
            ? "animate-pulse-dot bg-wheat"
            : status?.kind === "override"
              ? "bg-[#b4553a]"
              : "bg-current opacity-45"
        }`}
      />
      <span aria-live="polite" aria-atomic="true">
        {status ? status.label : STATUS_FALLBACK}
      </span>
    </p>
  );
}
