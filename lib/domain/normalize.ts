import type { Period, Subscription } from "@/lib/types";

export function monthlyEquivalent(amount: number, period: Period): number {
  return period === "monthly" ? amount : amount / 12;
}

export function totalsByCurrency(
  subscriptions: Pick<Subscription, "amount" | "currency" | "period" | "status">[],
): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const s of subscriptions) {
    if (s.status !== "active") continue;
    const value = monthlyEquivalent(s.amount, s.period);
    totals[s.currency] = (totals[s.currency] ?? 0) + value;
  }
  return totals;
}
