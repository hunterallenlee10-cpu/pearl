import { renderOg, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "The white Pearl Bakery farmstand shed by a field";

export default function Image() {
  return renderOg({
    photo: "visit",
    title: "Find the farmstand",
    sub: "40960 Medley’s Neck Rd, Leonardtown, MD · Sat & Sun from 9 AM",
  });
}
