import { renderOg, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Golden sourdough boules from Pearl Bakery, Leonardtown MD";

export default function Image() {
  return renderOg({
    photo: "home",
    title: "Sourdough, slow-made in Medley’s Neck.",
    sub: "Farmstand bakery · Leonardtown, MD · Sat & Sun from 9 AM",
  });
}
