export function StatCard({
  label,
  value,
  subLabel,
  dotColor,
  delay = 0,
}: {
  label: string;
  value: string | number;
  subLabel?: string;
  dotColor: string;
  delay?: number;
}) {
  return (
    <div
      className="animate-fadeUp min-w-[150px] rounded-card-sm border border-border bg-surface p-4 pb-[14px] shadow-card"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="mb-[14px] flex items-center justify-between">
        <p className="font-sans text-caption uppercase text-muted">{label}</p>
        <span
          className="h-[9px] w-[9px] shrink-0 rounded-full"
          style={{ backgroundColor: dotColor }}
        />
      </div>
      <p className="font-serif text-stat leading-none text-ink">{value}</p>
      {subLabel && <p className="mt-[6px] font-sans text-xs text-muted">{subLabel}</p>}
    </div>
  );
}
