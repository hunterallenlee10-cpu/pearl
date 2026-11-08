import { mapBox, mapLocalRoads, mapMajorRoads, mapMedleysNeck, mapPoints, mapWater } from "./map-data";
import { maps, business } from "@/content/business";
import { MapEmbedToggle } from "./MapEmbedToggle";

/**
 * Hand-drawn style map from real road and shoreline geometry (Census TIGER). The whole map links
 * to Google Maps; the interactive embed only loads when asked (no third-party requests before).
 */
export function IllustratedMap() {
  const [fx, fy] = mapPoints.farmstand;
  const [tx, ty] = mapPoints.leonardtown;
  const [bx, by] = mapPoints.bretonBay;
  return (
    <div className="illustrated-map">
      <MapEmbedToggle>
        <a
          href={maps.googlePlace}
          target="_blank"
          rel="noopener noreferrer"
          className="group shadow-lift ring-crust/10 block overflow-hidden rounded-[var(--radius-card)] bg-[#fbf6ee] ring-1"
          data-cursor="external"
        >
          <span className="sr-only">
            Open {business.address.oneLine} in Google Maps. The farmstand is on Medley&rsquo;s Neck Road, just
            off Route 5 southeast of downtown Leonardtown, across Breton Bay.
          </span>
          <svg
            viewBox={`120 40 ${mapBox.width - 160} ${mapBox.height - 110}`}
            className="block h-auto w-full"
            aria-hidden
          >
            <defs>
              <pattern
                id="water-hatch"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(-30)"
              >
                <path d="M0 5h10" stroke="#8EA4BC" strokeWidth="1.2" strokeOpacity=".55" />
              </pattern>
              <filter id="wobble" x="-5%" y="-5%" width="110%" height="110%">
                <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="4" />
                <feDisplacementMap in="SourceGraphic" scale="3.5" />
              </filter>
            </defs>
            <rect x="0" y="0" width={mapBox.width} height={mapBox.height} fill="#FBF6EE" />
            <g filter="url(#wobble)">
              <path d={mapWater} fill="#E6EEF2" fillRule="evenodd" />
              <path d={mapWater} fill="url(#water-hatch)" fillRule="evenodd" />
              <path d={mapWater} fill="none" stroke="#8EA4BC" strokeWidth="1.6" />
              <path
                className="map-draw"
                pathLength={1}
                d={mapLocalRoads}
                fill="none"
                stroke="#5B3A24"
                strokeOpacity=".35"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className="map-draw"
                pathLength={1}
                d={mapMajorRoads}
                fill="none"
                stroke="#5B3A24"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className="map-draw map-draw-late"
                pathLength={1}
                d={mapMedleysNeck}
                fill="none"
                stroke="#C99A5B"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* labels */}
            <g fontFamily="var(--font-display), Georgia, serif" fill="#5B3A24">
              <text x={tx - 70} y={ty - 36} fontSize="30" fontStyle="italic">
                Leonardtown
              </text>
              <circle cx={tx} cy={ty} r="6" fill="#5B3A24" />
              <text x={bx} y={by} fontSize="26" fontStyle="italic" fill="#5f7894" letterSpacing="2">
                Breton Bay
              </text>
            </g>
            <g fontFamily="var(--font-hand), cursive" fill="#5B3A24" fontSize="26">
              <text x="770" y="600" transform="rotate(60 770 600)">
                Rt. 5
              </text>
              <text x={fx - 10} y={fy + 270} transform={`rotate(-68 ${fx - 10} ${fy + 270})`}>
                Medley&rsquo;s Neck Rd
              </text>
            </g>

            {/* the farmstand */}
            <g transform={`translate(${fx} ${fy})`}>
              <circle className="map-pulse" r="18" fill="#C99A5B" />
              <g transform="translate(-26 -70)">
                <path
                  d="M4 26 L26 8 L48 26 V54 H4 Z"
                  fill="#FBF6EE"
                  stroke="#5B3A24"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path
                  d="M0 28 L26 6 L52 28"
                  fill="none"
                  stroke="#5B3A24"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="18"
                  y="32"
                  width="16"
                  height="22"
                  fill="#C99A5B"
                  stroke="#5B3A24"
                  strokeWidth="2.5"
                />
              </g>
              <circle r="7" fill="#5B3A24" stroke="#FBF6EE" strokeWidth="3" />
              <g transform="translate(34 -28)">
                <rect x="0" y="-26" width="196" height="64" rx="12" fill="#2A1B12" />
                <text
                  x="14"
                  y="0"
                  fill="#FBF6EE"
                  fontFamily="var(--font-display), Georgia, serif"
                  fontSize="22"
                >
                  Pearl Bakery
                </text>
                <text
                  x="14"
                  y="26"
                  fill="#C99A5B"
                  fontFamily="var(--font-sans), sans-serif"
                  fontSize="15"
                  fontWeight="600"
                >
                  40960 Medley&rsquo;s Neck Rd
                </text>
              </g>
            </g>
          </svg>
        </a>
      </MapEmbedToggle>
      <style>{`
        .map-draw { stroke-dasharray: 1; stroke-dashoffset: 0; }
        html.js .illustrated-map:not(.is-in) .map-draw { stroke-dashoffset: 1; }
        .illustrated-map.is-in .map-draw { animation: map-draw 1.8s var(--ease-soft) both; }
        .illustrated-map.is-in .map-draw-late { animation-delay: .7s; animation-duration: 1.2s; }
        @keyframes map-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        .map-pulse { transform-box: fill-box; transform-origin: center; animation: map-pulse 2.2s var(--ease-soft) infinite; opacity: .5; }
        @keyframes map-pulse { 0% { transform: scale(.6); opacity: .6; } 100% { transform: scale(2.4); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          html.js .illustrated-map .map-draw { stroke-dashoffset: 0 !important; animation: none !important; }
          .map-pulse { animation: none; opacity: .35; }
        }
      `}</style>
    </div>
  );
}
