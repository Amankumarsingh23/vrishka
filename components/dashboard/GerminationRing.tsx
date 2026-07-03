import type { CSSProperties } from "react";
import type { GerminationStats } from "@/lib/dashboard";

const SIZE = 140;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function GerminationRing({
  stats,
  delay = 0,
}: {
  stats: GerminationStats;
  delay?: number;
}) {
  const target = CIRCUMFERENCE * (1 - stats.rate / 100);
  const ringStyle = {
    animation: "drawRing 1.1s cubic-bezier(.22,.9,.3,1) both",
    animationDelay: `${delay + 0.3}s`,
    "--ring-target": `${target}`,
  } as CSSProperties;

  return (
    <div
      className="animate-fadeUp flex flex-col items-center rounded-card border border-border bg-surface p-6 shadow-card"
      style={{ animationDelay: `${delay}s` }}
    >
      <h2 className="self-start font-serif text-h3 text-ink">Germination Rate</h2>

      <div className="relative mt-4">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#EFE7D3"
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#3E7A4B"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            style={ringStyle}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-serif text-stat leading-none text-ink">{stats.rate}%</p>
          <p className="mt-1 font-sans text-xs text-muted">germinated</p>
        </div>
      </div>

      <p className="mt-4 font-sans text-xs text-muted">
        {stats.germinated} of {stats.sown} sown buckets
      </p>
    </div>
  );
}
