import type { Stage } from "@/types/flower";
import { STAGES, getStageToken } from "@/lib/stages";
import { cn } from "@/lib/utils";

export function ProgressDots({ stage, className }: { stage: Stage; className?: string }) {
  const token = getStageToken(stage);
  const filled = token.index + 1;

  return (
    <div className={cn("flex gap-[5px]", className)}>
      {STAGES.map((s, i) => (
        <span
          key={s.stage}
          className="h-[7px] w-[7px] rounded-full border"
          style={
            i < filled
              ? { backgroundColor: token.fill, borderColor: token.fill }
              : { backgroundColor: "transparent", borderColor: "#D9CFB2" }
          }
        />
      ))}
    </div>
  );
}
