import type { FlowerEvent } from "@/types/flower";
import { getEventMarkerColor, getStageToken } from "@/lib/stages";

export function CareLogFeed({ events }: { events: FlowerEvent[] }) {
  const sorted = [...events].sort((a, b) => b.dayNumber - a.dayNumber);

  if (sorted.length === 0) {
    return <p className="font-sans text-sm text-muted">No care log entries yet.</p>;
  }

  return (
    <ul className="divide-y divide-border rounded-card border border-border bg-surface shadow-card">
      {sorted.map((event, i) => (
        <li key={`${event.type}-${event.dayNumber}-${i}`} className="flex items-start gap-3 px-5 py-4">
          <span
            className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
            style={{
              backgroundColor: event.toStage
                ? getStageToken(event.toStage).fill
                : getEventMarkerColor(event.type),
            }}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-sans text-sm font-semibold text-ink">{event.label}</p>
              <p className="shrink-0 font-sans text-xs text-muted">{event.date}</p>
            </div>
            {event.notes && <p className="mt-0.5 font-sans text-sm text-body">{event.notes}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
