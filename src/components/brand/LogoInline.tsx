import type { CSSProperties } from "react";
import { logoColors, logoParts, logoViewBox, sprigOrigin } from "./LogoPaths";

export type LogoTone = "crust" | "cream";

export type LogoProps = {
  className?: string;
  /** Ink colour for "Pearl" + "BAKERY": crust #5B3A24 (light bg) or cream #FBF6EE (dark bg). */
  tone?: LogoTone;
  /** Accessible name. */
  title?: string;
  /** Class for the sprig `<g data-sprig>` — hook for animating the sprig on its own. */
  sprigClassName?: string;
};

const ink: Record<LogoTone, string> = { crust: logoColors.crust, cream: logoColors.flour };

// Rotating the sprig pivots it where its stem leaves the "l".
const sprigStyle: CSSProperties = {
  transformBox: "view-box",
  transformOrigin: `${sprigOrigin.x}px ${sprigOrigin.y}px`,
};

/**
 * Pearl Bakery logo, traced from the client's artwork (see scripts/vectorize-logo.mjs).
 * Server-compatible: no hooks, no client JS. Never stretch it — size it by width
 * or height only (the viewBox keeps the aspect ratio).
 */
export function LogoInline({ className, tone = "crust", title = "Pearl Bakery", sprigClassName }: LogoProps) {
  return (
    <svg
      viewBox={logoViewBox}
      role="img"
      className={className}
      style={{ color: ink[tone] }}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <g data-sprig="" className={sprigClassName} style={sprigStyle}>
        {/* watercolor wash: wheat in both tones */}
        <path fill={logoColors.wheat} fillRule="evenodd" d={logoParts.sprig} />
        {/* stem: continues the "l" exit stroke, so it takes the ink colour */}
        <path fillRule="evenodd" d={logoParts.sprigInk} />
      </g>
      <path fillRule="evenodd" d={logoParts.wordmark} />
      <path fillRule="evenodd" d={logoParts.bakery} />
    </svg>
  );
}

export default LogoInline;
