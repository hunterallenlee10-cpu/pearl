import { renderOg, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Rosemary garlic parmesan sourdough on a wooden board";

export default function Image() {
  return renderOg({
    photo: "menu",
    title: "This weekend’s menu",
    sub: "Sourdough, cinnamon rolls, cookies & more · Pearl Bakery",
  });
}
