import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Photos are pre-optimized by scripts/process-images.mjs and served through the custom
    // loaders in src/components/ui/Img.tsx; these widths line up with what the script generates.
    deviceSizes: [640, 828, 1080, 1600, 2048],
    imageSizes: [],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
