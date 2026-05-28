"use client";

import { useTransition } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";

interface Props {
  action: () => Promise<void>;
  confirm?: string;
  label: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}

export function ConfirmForm({ action, confirm, label, variant = "secondary", size = "sm" }: Props) {
  const [pending, startTransition] = useTransition();
  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        if (confirm && !window.confirm(confirm)) return;
        startTransition(() => {
          void action();
        });
      }}
    >
      <Button type="submit" variant={variant} size={size} disabled={pending}>
        {pending ? "…" : label}
      </Button>
    </form>
  );
}
