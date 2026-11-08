import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pearl Bakery",
    short_name: "Pearl Bakery",
    description: "Sourdough farmstand in Leonardtown, MD. Saturdays & Sundays from 9 AM.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF6EE",
    theme_color: "#FBF6EE",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
