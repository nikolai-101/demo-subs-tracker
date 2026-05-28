"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/types";
import type { ActionResult } from "@/lib/actions/categories";

interface Props {
  action: (prev: ActionResult | undefined, fd: FormData) => Promise<ActionResult>;
  initial?: Category | null;
  submitLabel?: string;
  onCancelHref?: string;
}

export function CategoryForm({
  action,
  initial,
  submitLabel = "Сохранить",
  onCancelHref = "/categories",
}: Props) {
  const [state, formAction, pending] = useActionState<ActionResult | undefined, FormData>(
    action,
    undefined,
  );
  const e = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div className="grow space-y-1.5">
        <Label>Название</Label>
        <Input
          name="name"
          defaultValue={initial?.name ?? ""}
          placeholder="Например, Развлечения"
          required
          maxLength={60}
        />
        {e.name && <p className="text-xs text-danger">{e.name}</p>}
      </div>
      <div className="w-32 space-y-1.5">
        <Label>Цвет</Label>
        <Input
          name="color"
          type="text"
          defaultValue={initial?.color ?? ""}
          placeholder="#16a34a"
          maxLength={7}
        />
        {e.color && <p className="text-xs text-danger">{e.color}</p>}
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "…" : submitLabel}
        </Button>
        {initial && (
          <Link href={onCancelHref} className="text-sm text-muted hover:text-fg">
            Отмена
          </Link>
        )}
      </div>
    </form>
  );
}
