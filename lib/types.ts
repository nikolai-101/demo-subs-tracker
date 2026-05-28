export type Period = "monthly" | "yearly";
export type SubscriptionStatus = "active" | "cancelled";

export interface Category {
  id: number;
  name: string;
  color: string | null;
}

export interface Subscription {
  id: number;
  name: string;
  amount: number;
  currency: string;
  period: Period;
  next_charge_date: string;
  category_id: number | null;
  note: string | null;
  status: SubscriptionStatus;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionWithCategory extends Subscription {
  category_name: string | null;
  category_color: string | null;
}

export interface PaymentEvent {
  id: number;
  subscription_id: number;
  amount: number;
  currency: string;
  charged_at: string;
  created_at: string;
}
