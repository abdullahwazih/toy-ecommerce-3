import * as React from "react";
import Link from "next/link";

export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

function buttonClasses({
  variant,
  size,
  className,
}: {
  variant: ButtonVariant;
  size: ButtonSize;
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950/20 dark:focus-visible:ring-white/20",
    "disabled:pointer-events-none disabled:opacity-50",
    size === "sm" ? "h-9 px-3 text-sm" : "h-10 px-4 text-sm",
    variant === "primary" &&
      "bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200",
    variant === "secondary" &&
      "bg-zinc-100 text-zinc-950 hover:bg-zinc-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/15",
    variant === "ghost" &&
      "bg-transparent text-zinc-950 hover:bg-zinc-100 dark:text-white dark:hover:bg-white/10",
    variant === "danger" &&
      "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
    className,
  );
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      className={buttonClasses({ variant, size, className })}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof Link>, "className"> & {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <Link
      className={buttonClasses({ variant, size, className })}
      {...props}
    />
  );
}

export function Card({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-950/10 bg-white/70 shadow-sm backdrop-blur",
        "dark:border-white/10 dark:bg-white/5",
        className,
      )}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"input">) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-lg border border-zinc-950/10 bg-white px-3 text-sm text-zinc-950",
        "placeholder:text-zinc-500",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950/15",
        "dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/50 dark:focus-visible:ring-white/15",
        className,
      )}
      {...props}
    />
  );
}
