import Link from "next/link";
import type { FlowerGroup } from "@/types/flower";
import { cn } from "@/lib/utils";

const FILTERS: Array<{ key: FlowerGroup | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: 1, label: "Group 1" },
  { key: 2, label: "Group 2" },
  { key: 3, label: "Group 3" },
  { key: 4, label: "Group 4" },
];

export function FilterChips({ active }: { active: FlowerGroup | undefined }) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const isActive = filter.key === "all" ? active === undefined : active === filter.key;
        const href = filter.key === "all" ? "/gallery" : `/gallery?group=${filter.key}`;

        return (
          <Link
            key={filter.key}
            href={href}
            className={cn(
              "rounded-full px-4 py-2 font-sans text-sm font-semibold transition-colors",
              isActive
                ? "bg-primary text-paper"
                : "border border-border bg-surface text-body hover:border-border-alt hover:text-ink",
            )}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
