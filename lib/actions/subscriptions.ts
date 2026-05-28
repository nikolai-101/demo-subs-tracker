"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { subscriptionSchema } from "@/lib/validation";
import {
  createSubscription,
  updateSubscription,
  setSubscriptionStatus,
  setNextChargeDate,
  deleteSubscription,
  getSubscriptionPlain,
} from "@/lib/repos/subscriptions";
import { createPaymentEvent } from "@/lib/repos/events";
import { shiftNextChargeDate, todayISO } from "@/lib/domain/next-date";

export interface ActionResult {
  ok: boolean;
  fieldErrors?: Record<string, string>;
  error?: string;
}

function parseFormData(formData: FormData) {
  return subscriptionSchema.safeParse({
    name: formData.get("name"),
    amount: formData.get("amount"),
    currency: formData.get("currency"),
    period: formData.get("period"),
    next_charge_date: formData.get("next_charge_date"),
    category_id: formData.get("category_id"),
    note: formData.get("note"),
  });
}

export async function createSubscriptionAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: flattenErrors(parsed.error.flatten().fieldErrors),
    };
  }
  createSubscription(parsed.data);
  revalidatePath("/");
  revalidatePath("/subscriptions");
  redirect("/subscriptions");
}

export async function updateSubscriptionAction(
  id: number,
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: flattenErrors(parsed.error.flatten().fieldErrors),
    };
  }
  updateSubscription(id, parsed.data);
  revalidatePath("/");
  revalidatePath("/subscriptions");
  revalidatePath(`/subscriptions/${id}/edit`);
  redirect("/subscriptions");
}

export async function cancelSubscriptionAction(id: number): Promise<void> {
  setSubscriptionStatus(id, "cancelled");
  revalidatePath("/");
  revalidatePath("/subscriptions");
}

export async function restoreSubscriptionAction(id: number): Promise<void> {
  setSubscriptionStatus(id, "active");
  revalidatePath("/");
  revalidatePath("/subscriptions");
}

export async function deleteSubscriptionAction(id: number): Promise<void> {
  deleteSubscription(id);
  revalidatePath("/");
  revalidatePath("/subscriptions");
}

export async function markChargedAction(id: number): Promise<void> {
  const sub = getSubscriptionPlain(id);
  if (!sub) return;
  createPaymentEvent({
    subscription_id: id,
    amount: sub.amount,
    currency: sub.currency,
    charged_at: todayISO(),
  });
  const nextDate = shiftNextChargeDate(sub.next_charge_date, sub.period);
  setNextChargeDate(id, nextDate);
  revalidatePath("/");
  revalidatePath("/subscriptions");
}

function flattenErrors(
  fieldErrors: Record<string, string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(fieldErrors)) {
    if (v && v.length > 0) out[k] = v[0];
  }
  return out;
}
