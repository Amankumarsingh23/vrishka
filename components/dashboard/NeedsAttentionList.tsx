import Link from "next/link";
import type { AttentionItem } from "@/lib/dashboard";

export function NeedsAttentionList({
  items,
  delay = 0,
}: {
  items: AttentionItem[];
  delay?: number;
}) {
  return (
    <div
      className="animate-fadeUp rounded-card border border-border bg-surface p-6 shadow-card"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-h3 text-ink">Needs Attention Today</h2>
        <span className="font-sans text-xs font-semibold text-muted">{items.length}</span>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 font-sans text-sm text-muted">Nothing needs attention today.</p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {items.map((item, index) => (
            <li
              key={item.flower.id}
              className="animate-fadeUp flex items-start gap-3 py-3 first:pt-0 last:pb-0"
              style={{ animationDelay: `${delay + index * 0.05}s` }}
            >
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/flower/${item.flower.id}`}
                  className="font-sans text-sm font-semibold text-ink hover:underline"
                >
                  {item.flower.commonName}
                </Link>
                <p className="mt-0.5 font-sans text-xs text-muted">{item.reason}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
