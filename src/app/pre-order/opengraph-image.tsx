import { renderOg, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "A three-tier cinnamon roll cake with sprinkles";

export default function Image() {
  return renderOg({
    photo: "pre-order",
    title: "Pre-orders & cinnamon roll cakes",
    sub: "Thanksgiving pre-orders and custom cakes · Pearl Bakery",
  });
}
