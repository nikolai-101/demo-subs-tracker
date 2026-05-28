import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "warn";
type Size = "sm" | "md";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent/90 dark:text-zinc-900 dark:hover:bg-accent/80",
  secondary:
    "bg-card border border-border text-fg hover:bg-border/40",
  ghost: "text-fg hover:bg-border/40",
  danger:
    "bg-danger text-white hover:bg-danger/90",
  warn: "bg-warn text-white hover:bg-warn/90 dark:text-zinc-900",
};

const SIZE: Record<Size, string> = {
  sm: "h-8 px-2.5 text-xs",
  md: "h-10 px-4 text-sm",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
        VARIANT[variant],
        SIZE[size],
        className,
      )}
      {...props}
    />
  );
});
