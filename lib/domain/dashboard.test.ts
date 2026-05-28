import { describe, it, expect } from "vitest";
import { classifyUpcoming } from "./dashboard";
import type { Subscription } from "@/lib/types";

function sub(partial: Partial<Subscription> & { id: number; next_charge_date: string }): Subscription {
  return {
    name: "X",
    amount: 100,
    currency: "RUB",
    period: "monthly",
    category_id: null,
    note: null,
    status: "active",
    created_at: "",
    updated_at: "",
    ...partial,
  };
}

describe("classifyUpcoming", () => {
  const today = new Date(2026, 4, 28); // 2026-05-28

  it("splits into overdue and upcoming within 7 days, ignores cancelled and far-future", () => {
    const subs = [
      sub({ id: 1, next_charge_date: "2026-05-26" }), // overdue -2
      sub({ id: 2, next_charge_date: "2026-05-28" }), // today
      sub({ id: 3, next_charge_date: "2026-06-04" }), // +7 (boundary, included)
      sub({ id: 4, next_charge_date: "2026-06-05" }), // +8 (excluded)
      sub({ id: 5, next_charge_date: "2026-05-29", status: "cancelled" }), // ignored
    ];
    const result = classifyUpcoming(subs, today);
    expect(result.overdue.map((i) => i.subscription.id)).toEqual([1]);
    expect(result.upcoming.map((i) => i.subscription.id)).toEqual([2, 3]);
  });

  it("sorts overdue by ascending daysUntil (most negative first)", () => {
    const subs = [
      sub({ id: 1, next_charge_date: "2026-05-27" }), // -1
      sub({ id: 2, next_charge_date: "2026-05-20" }), // -8
      sub({ id: 3, next_charge_date: "2026-05-25" }), // -3
    ];
    const result = classifyUpcoming(subs, today);
    expect(result.overdue.map((i) => i.subscription.id)).toEqual([2, 3, 1]);
  });
});
