import { campaigns as allCampaigns, type Campaign } from "@/content/preorders";

/** The pre-order campaign open at `now`, or null (then the site shows the Cinnamon Roll Cake). */
export function getActiveCampaign(now: Date, campaigns: Campaign[] = allCampaigns): Campaign | null {
  const t = now.getTime();
  return (
    campaigns.find((c) => new Date(c.opensAt).getTime() <= t && t < new Date(c.closesAt).getTime()) ?? null
  );
}

/** Whether a form link has been filled in (placeholders look like "[THANKSGIVING_FORM_URL]"). */
export function hasRealUrl(url: string | undefined): url is string {
  return !!url && /^https?:\/\//.test(url);
}

export function formatPrice(n: number) {
  return `$${n % 1 === 0 ? n : n.toFixed(2)}`;
}
