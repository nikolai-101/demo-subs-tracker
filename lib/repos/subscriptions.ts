import { getDb } from "@/lib/db";
import type {
  Subscription,
  SubscriptionStatus,
  SubscriptionWithCategory,
  Period,
} from "@/lib/types";

export interface SubscriptionInput {
  name: string;
  amount: number;
  currency: string;
  period: Period;
  next_charge_date: string;
  category_id: number | null;
  note: string | null;
}

const SELECT_WITH_CATEGORY = `
  SELECT
    s.id, s.name, s.amount, s.currency, s.period, s.next_charge_date,
    s.category_id, s.note, s.status, s.created_at, s.updated_at,
    c.name AS category_name,
    c.color AS category_color
  FROM subscriptions s
  LEFT JOIN categories c ON c.id = s.category_id
`;

export interface ListFilter {
  status?: SubscriptionStatus | "all";
  categoryId?: number | "uncategorized";
  sort?: "next_charge_date" | "amount" | "name";
}

export function listSubscriptions(filter: ListFilter = {}): SubscriptionWithCategory[] {
  const where: string[] = [];
  const params: (string | number)[] = [];

  if (filter.status && filter.status !== "all") {
    where.push("s.status = ?");
    params.push(filter.status);
  }
  if (filter.categoryId === "uncategorized") {
    where.push("s.category_id IS NULL");
  } else if (typeof filter.categoryId === "number") {
    where.push("s.category_id = ?");
    params.push(filter.categoryId);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const sort = filter.sort ?? "next_charge_date";
  const orderSql =
    sort === "amount"
      ? "ORDER BY s.amount DESC"
      : sort === "name"
        ? "ORDER BY s.name COLLATE NOCASE ASC"
        : "ORDER BY s.next_charge_date ASC";

  return getDb()
    .prepare<typeof params, SubscriptionWithCategory>(
      `${SELECT_WITH_CATEGORY} ${whereSql} ${orderSql}`,
    )
    .all(...params);
}

export function getSubscription(id: number): SubscriptionWithCategory | null {
  return (
    getDb()
      .prepare<[number], SubscriptionWithCategory>(
        `${SELECT_WITH_CATEGORY} WHERE s.id = ?`,
      )
      .get(id) ?? null
  );
}

export function getSubscriptionPlain(id: number): Subscription | null {
  return (
    getDb()
      .prepare<[number], Subscription>(
        `SELECT id, name, amount, currency, period, next_charge_date,
                category_id, note, status, created_at, updated_at
         FROM subscriptions WHERE id = ?`,
      )
      .get(id) ?? null
  );
}

export function createSubscription(input: SubscriptionInput): number {
  const info = getDb()
    .prepare(
      `INSERT INTO subscriptions
         (name, amount, currency, period, next_charge_date, category_id, note)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      input.name,
      input.amount,
      input.currency,
      input.period,
      input.next_charge_date,
      input.category_id,
      input.note,
    );
  return Number(info.lastInsertRowid);
}

export function updateSubscription(id: number, input: SubscriptionInput): void {
  getDb()
    .prepare(
      `UPDATE subscriptions
       SET name = ?, amount = ?, currency = ?, period = ?,
           next_charge_date = ?, category_id = ?, note = ?,
           updated_at = datetime('now')
       WHERE id = ?`,
    )
    .run(
      input.name,
      input.amount,
      input.currency,
      input.period,
      input.next_charge_date,
      input.category_id,
      input.note,
      id,
    );
}

export function setSubscriptionStatus(id: number, status: SubscriptionStatus): void {
  getDb()
    .prepare(
      "UPDATE subscriptions SET status = ?, updated_at = datetime('now') WHERE id = ?",
    )
    .run(status, id);
}

export function setNextChargeDate(id: number, date: string): void {
  getDb()
    .prepare(
      "UPDATE subscriptions SET next_charge_date = ?, updated_at = datetime('now') WHERE id = ?",
    )
    .run(date, id);
}

export function deleteSubscription(id: number): void {
  getDb().prepare("DELETE FROM subscriptions WHERE id = ?").run(id);
}
