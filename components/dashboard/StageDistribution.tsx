import type { StageDistributionEntry } from "@/lib/dashboard";
import { getStageToken } from "@/lib/stages";

const BASE_DELAY = 0.2;
const STEP_DELAY = 0.07;

export function StageDistribution({
  data,
  delay = 0,
}: {
  data: StageDistributionEntry[];
  delay?: number;
}) {
  return (
    <div
      className="animate-fadeUp rounded-card border border-border bg-surface p-6 shadow-card"
      style={{ animationDelay: `${delay}s` }}
    >
      <h2 className="font-serif text-h3 text-ink">Growth Stage Distribution</h2>

      <div className="mt-5 space-y-4">
        {data.map((entry, index) => {
          const token = getStageToken(entry.stage);
          const barDelay = delay + BASE_DELAY + index * STEP_DELAY;

          return (
            <div key={entry.stage}>
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="font-sans text-sm font-medium text-body">{entry.stage}</span>
                <span className="font-sans text-xs text-muted">{entry.count}</span>
              </div>
              <div className="h-[10px] w-full overflow-hidden rounded-full bg-track">
                <div
                  className="animate-growBar h-full origin-left rounded-full"
                  style={{
                    width: `${entry.percent}%`,
                    backgroundColor: token.fill,
                    animationDelay: `${barDelay}s`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
