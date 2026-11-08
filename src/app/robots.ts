import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

// Search engines are kept out until the real domain is set (NEXT_PUBLIC_SITE_URL), so the
// pre-launch vercel.app address with unconfirmed content never gets indexed.
export const launched = Boolean(process.env.NEXT_PUBLIC_SITE_URL);

export default function robots(): MetadataRoute.Robots {
  if (!launched) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${siteUrl}/sitemap.xml`, host: siteUrl };
}
