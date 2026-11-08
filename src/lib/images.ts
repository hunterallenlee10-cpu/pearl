import data from "@/data/images.json";

export type ImageData = {
  id: string;
  folder: string;
  src: string;
  width: number;
  height: number;
  widths: number[];
  alt: string;
  position: string;
  era: "past" | "present";
  isHero: boolean;
  blurDataURL: string;
  dominantColor: string;
};

const images = data as unknown as Record<string, ImageData>;

export function getImage(id: string): ImageData {
  const img = images[id];
  if (!img) throw new Error(`Unknown image "${id}". Add it to src/data/image-meta.ts and run npm run photos:process.`);
  return img;
}

/**
 * For anything that says "this is where to go today". Throws at build time if someone
 * tries to use a photo of the original trailer.
 */
export function getPresentImage(id: string): ImageData {
  const img = getImage(id);
  if (img.era !== "present") {
    throw new Error(`"${id}" shows the original trailer (past). Use a photo of the new farmstand shed here.`);
  }
  return img;
}

export function hasImage(id: string | undefined): id is string {
  return !!id && id in images;
}
