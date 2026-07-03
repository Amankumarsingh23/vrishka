import type { Stage } from "@/types/flower";
import { getStageToken } from "@/lib/stages";
import { cn } from "@/lib/utils";

export function StagePill({
  stage,
  size = "compact",
  className,
}: {
  stage: Stage;
  size?: "compact" | "large";
  className?: string;
}) {
  const token = getStageToken(stage);
  const isLarge = size === "large";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-sans font-semibold",
        isLarge
          ? "gap-2.5 py-[9px] pl-[10px] pr-4 text-[15px]"
          : "gap-1.5 py-[5px] pl-[9px] pr-3 text-xs",
        className,
      )}
      style={{ backgroundColor: token.fill, color: token.fg }}
    >
      <span
        className={cn("shrink-0 rounded-full", isLarge ? "h-2 w-2" : "h-[7px] w-[7px]")}
        style={{ backgroundColor: token.fg, opacity: 0.55 }}
      />
      {stage}
    </span>
  );
}
