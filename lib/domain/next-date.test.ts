import { describe, it, expect } from "vitest";
import { shiftNextChargeDate } from "./next-date";

describe("shiftNextChargeDate", () => {
  it("adds one month to a regular date", () => {
    expect(shiftNextChargeDate("2026-03-15", "monthly")).toBe("2026-04-15");
  });

  it("caps to last day when target month is shorter (Jan 31 -> Feb 28 non-leap)", () => {
    expect(shiftNextChargeDate("2026-01-31", "monthly")).toBe("2026-02-28");
  });

  it("caps to last day in a leap February (Jan 31 -> Feb 29)", () => {
    expect(shiftNextChargeDate("2024-01-31", "monthly")).toBe("2024-02-29");
  });

  it("rolls over the year for December monthly", () => {
    expect(shiftNextChargeDate("2026-12-10", "monthly")).toBe("2027-01-10");
  });

  it("adds one year for yearly period", () => {
    expect(shiftNextChargeDate("2026-05-28", "yearly")).toBe("2027-05-28");
  });

  it("handles yearly Feb 29 by capping to Feb 28", () => {
    expect(shiftNextChargeDate("2024-02-29", "yearly")).toBe("2025-02-28");
  });
});
