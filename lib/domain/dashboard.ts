import { differenceInCalendarDays, parseISO } from "date-fns";
import type { Subscription } from "@/lib/types";

export interface UpcomingItem<T extends Subscription = Subscription> {
  subscription: T;
  daysUntil: number;
}

export function classifyUpcoming<T extends Subscription>(
  subs: T[],
  today: Date,
  windowDays = 7,
): { overdue: UpcomingItem<T>[]; upcoming: UpcomingItem<T>[] } {
  const overdue: UpcomingItem<T>[] = [];
  const upcoming: UpcomingItem<T>[] = [];
  for (const s of subs) {
    if (s.status !== "active") continue;
    const days = differenceInCalendarDays(parseISO(s.next_charge_date), today);
    if (days < 0) overdue.push({ subscription: s, daysUntil: days });
    else if (days <= windowDays) upcoming.push({ subscription: s, daysUntil: days });
  }
  overdue.sort((a, b) => a.daysUntil - b.daysUntil);
  upcoming.sort((a, b) => a.daysUntil - b.daysUntil);
  return { overdue, upcoming };
}
