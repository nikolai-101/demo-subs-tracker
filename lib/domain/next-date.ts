import { addMonths, addYears, format, parseISO } from "date-fns";
import type { Period } from "@/lib/types";

export function shiftNextChargeDate(currentISO: string, period: Period): string {
  const current = parseISO(currentISO);
  const next = period === "monthly" ? addMonths(current, 1) : addYears(current, 1);
  return format(next, "yyyy-MM-dd");
}

export function todayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}
