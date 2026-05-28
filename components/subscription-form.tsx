"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Category, SubscriptionWithCategory } from "@/lib/types";
import type { ActionResult } from "@/lib/actions/subscriptions";

interface Props {
  action: (prev: ActionResult | undefined, fd: FormData) => Promise<ActionResult>;
  categories: Category[];
  initial?: SubscriptionWithCategory | null;
  submitLabel?: string;
}

export function SubscriptionForm({ action, categories, initial, submitLabel = "Сохранить" }: Props) {
  const [state, formAction, pending] = useActionState<ActionResult | undefined, FormData>(
    action,
    undefined,
  );
  const e = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Название" error={e.name}>
        <Input
          name="name"
          defaultValue={initial?.name ?? ""}
          placeholder="Netflix"
          required
          maxLength={120}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Сумма" error={e.amount}>
          <Input
            name="amount"
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            defaultValue={initial?.amount ?? ""}
            required
          />
        </Field>
        <Field label="Валюта" error={e.currency}>
          <Input
            name="currency"
            defaultValue={initial?.currency ?? "RUB"}
            placeholder="RUB"
            maxLength={3}
            required
            className="uppercase"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Период" error={e.period}>
          <Select name="period" defaultValue={initial?.period ?? "monthly"} required>
            <option value="monthly">Месячный</option>
            <option value="yearly">Годовой</option>
          </Select>
        </Field>
        <Field label="Следующее списание" error={e.next_charge_date}>
          <Input
            name="next_charge_date"
            type="date"
            defaultValue={initial?.next_charge_date ?? ""}
            required
          />
        </Field>
      </div>

      <Field label="Категория" error={e.category_id}>
        <Select
          name="category_id"
          defaultValue={initial?.category_id ? String(initial.category_id) : ""}
        >
          <option value="">— Без категории —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Заметка" error={e.note}>
        <Textarea
          name="note"
          defaultValue={initial?.note ?? ""}
          placeholder="Опционально"
          maxLength={500}
        />
      </Field>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Сохранение…" : submitLabel}
        </Button>
        <Link href="/subscriptions" className="text-sm text-muted hover:text-fg">
          Отмена
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
