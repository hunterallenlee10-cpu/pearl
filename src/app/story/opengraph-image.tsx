import { renderOg, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Inside the farmstand under string lights";

export default function Image() {
  return renderOg({
    photo: "story",
    title: "From a trailer to a farmstand",
    sub: "The story of Pearl Bakery, Leonardtown, Maryland",
  });
}
