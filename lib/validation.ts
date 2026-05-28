import { z } from "zod";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export const subscriptionSchema = z.object({
  name: z.string().trim().min(1, "Укажи название").max(120),
  amount: z.coerce.number().positive("Сумма должна быть больше 0"),
  currency: z
    .string()
    .trim()
    .min(3, "ISO-код валюты, 3 буквы")
    .max(3)
    .transform((s) => s.toUpperCase()),
  period: z.enum(["monthly", "yearly"]),
  next_charge_date: z.string().regex(ISO_DATE, "Дата в формате YYYY-MM-DD"),
  category_id: z
    .union([z.coerce.number().int().positive(), z.literal(""), z.null(), z.undefined()])
    .transform((v) => (typeof v === "number" ? v : null)),
  note: z
    .union([z.string().trim().max(500), z.null(), z.undefined()])
    .transform((v) => (v && v.length > 0 ? v : null)),
});

export type SubscriptionFormValues = z.input<typeof subscriptionSchema>;
export type SubscriptionParsed = z.output<typeof subscriptionSchema>;

const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Укажи название").max(60),
  color: z
    .union([z.string().trim().regex(HEX_COLOR, "HEX-цвет, например #16a34a"), z.literal(""), z.null(), z.undefined()])
    .transform((v) => (typeof v === "string" && v.length > 0 ? v : null)),
});

export type CategoryFormValues = z.input<typeof categorySchema>;
export type CategoryParsed = z.output<typeof categorySchema>;
