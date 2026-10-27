import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

export function Button({ variant = "ghost", className = "", ...props }: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-ink-900 text-white hover:bg-ink-800"
      : "border border-ink-200 bg-white text-ink-700 hover:bg-ink-50";
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${styles} ${className}`}
      {...props}
    />
  );
}
