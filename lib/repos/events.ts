import { getDb } from "@/lib/db";
import type { PaymentEvent } from "@/lib/types";

export function createPaymentEvent(input: {
  subscription_id: number;
  amount: number;
  currency: string;
  charged_at: string;
}): number {
  const info = getDb()
    .prepare(
      `INSERT INTO payment_events (subscription_id, amount, currency, charged_at)
       VALUES (?, ?, ?, ?)`,
    )
    .run(input.subscription_id, input.amount, input.currency, input.charged_at);
  return Number(info.lastInsertRowid);
}

export function listEventsForSubscription(subscriptionId: number): PaymentEvent[] {
  return getDb()
    .prepare<[number], PaymentEvent>(
      `SELECT id, subscription_id, amount, currency, charged_at, created_at
       FROM payment_events
       WHERE subscription_id = ?
       ORDER BY charged_at DESC, id DESC`,
    )
    .all(subscriptionId);
}
