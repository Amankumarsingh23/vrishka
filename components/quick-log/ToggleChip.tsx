"use client";

import { cn } from "@/lib/utils";

export function ToggleChip({
  label,
  selected,
  onClick,
  color,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-full border px-3.5 py-1.5 font-sans text-sm font-medium transition-colors",
        selected
          ? "border-transparent text-paper"
          : "border-border bg-surface text-body hover:border-border-alt hover:text-ink",
      )}
      style={selected ? { backgroundColor: color ?? "#2C4A38" } : undefined}
    >
      {label}
    </button>
  );
}
