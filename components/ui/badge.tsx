import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "danger" | "warn" | "accent";
const TONE: Record<Tone, string> = {
  neutral: "bg-border/40 text-fg",
  danger: "bg-danger/10 text-danger",
  warn: "bg-warn/10 text-warn",
  accent: "bg-accent/10 text-accent",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
        TONE[tone],
        className,
      )}
      {...props}
    />
  );
}
