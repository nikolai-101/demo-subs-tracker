import { describe, it, expect } from "vitest";
import { monthlyEquivalent, totalsByCurrency } from "./normalize";

describe("monthlyEquivalent", () => {
  it("returns amount as-is for monthly", () => {
    expect(monthlyEquivalent(799, "monthly")).toBe(799);
  });

  it("divides by 12 for yearly", () => {
    expect(monthlyEquivalent(1200, "yearly")).toBe(100);
  });
});

describe("totalsByCurrency", () => {
  it("sums active subscriptions per currency, mixing periods", () => {
    const totals = totalsByCurrency([
      { amount: 500, currency: "RUB", period: "monthly", status: "active" },
      { amount: 1200, currency: "RUB", period: "yearly", status: "active" },
      { amount: 10, currency: "USD", period: "monthly", status: "active" },
      { amount: 100, currency: "USD", period: "monthly", status: "cancelled" },
    ]);
    expect(totals).toEqual({ RUB: 600, USD: 10 });
  });

  it("returns empty when nothing active", () => {
    expect(
      totalsByCurrency([
        { amount: 100, currency: "RUB", period: "monthly", status: "cancelled" },
      ]),
    ).toEqual({});
  });
});
