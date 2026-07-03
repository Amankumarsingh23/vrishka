import type { FlowerEvent } from "@/types/flower";
import { getEventMarkerColor, getStageToken } from "@/lib/stages";
import { cn } from "@/lib/utils";

function gapLabel(gapDays: number): string | null {
  if (gapDays <= 0) return null;
  return `${gapDays} day${gapDays === 1 ? "" : "s"} later`;
}

export function GrowthTimeline({ events }: { events: FlowerEvent[] }) {
  if (events.length === 0) {
    return <p className="font-sans text-sm text-muted">No milestones logged yet.</p>;
  }

  const now = Date.now();

  return (
    <div className="relative">
      <div className="absolute bottom-0 left-[11px] top-0 w-[2px] bg-track" />
      <div
        className="animate-growDown absolute left-[11px] top-0 w-[2px]"
        style={{ backgroundColor: "#3E7A4B", animationDelay: "0.3s" }}
      />

      <ol className="relative">
        {events.map((event, index) => {
          const isFuture = new Date(event.date).getTime() > now;
          const gap = index > 0 ? gapLabel(event.dayNumber - events[index - 1].dayNumber) : null;
          const markerColor = event.toStage
            ? getStageToken(event.toStage).fill
            : getEventMarkerColor(event.type);
          const delay = 0.5 + index * 0.12;

          return (
            <li
              key={`${event.type}-${event.dayNumber}-${index}`}
              className={cn("relative pb-[26px] pl-[30px] last:pb-0", isFuture && "opacity-[0.45]")}
            >
              <span
                className="animate-fadeUp absolute left-[5px] top-0 h-[14px] w-[14px] rounded-full border-[3px] border-surface"
                style={{
                  backgroundColor: markerColor,
                  boxShadow: `0 0 0 2px ${markerColor}`,
                  animationDelay: `${delay}s`,
                }}
              />

              <div className="animate-fadeUp" style={{ animationDelay: `${delay}s` }}>
                {gap && <p className="mb-1 font-sans text-[12.5px] italic text-muted">{gap}</p>}
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-sans text-[14.5px] font-semibold text-ink">{event.label}</p>
                  <p className="shrink-0 font-sans text-xs font-medium text-muted">{event.date}</p>
                </div>
                <p className="mt-0.5 font-sans text-xs text-muted">
                  Day {event.dayNumber}
                  {isFuture && " · expected"}
                </p>
                {event.notes && (
                  <p className="mt-1 font-sans text-sm text-body">{event.notes}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
