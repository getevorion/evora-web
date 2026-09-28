import { apiUrl } from "@/lib/api";

export type BillingTier = "platinum" | "obsidian" | "ultra_plus";
export type BillingCadence = "monthly" | "annual" | "lifetime";

export type SitePromo = {
  code: string;
  percent_off: number;
  ends_at: string | null;
  description: string | null;
};

async function billingGet<T>(path: string): Promise<T> {
  const res = await fetch(apiUrl(path), {
    credentials: "include",
    headers: { "X-Requested-With": "XMLHttpRequest" },
  });
  const data = await res.json().catch(() => ({}));
  return (data.data ?? data) as T;
}

export function fetchPromo(): Promise<{ promo: SitePromo | null }> {
  return billingGet("/api/billing/promo");
}
