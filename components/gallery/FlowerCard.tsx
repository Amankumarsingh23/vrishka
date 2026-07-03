import Link from "next/link";
import type { Flower } from "@/types/flower";
import { getStageToken } from "@/lib/stages";
import { getLatestPhotoUrl } from "@/lib/photos";
import { StageIllustration } from "@/components/ui/StageIllustration";
import { StagePill } from "@/components/ui/StagePill";
import { ProgressDots } from "@/components/ui/ProgressDots";

const STAGGER_STEP = 0.035;
const STAGGER_CAP_INDEX = 14;

export function FlowerCard({ flower, index = 0 }: { flower: Flower; index?: number }) {
  const token = getStageToken(flower.stage);
  const delay = Math.min(index, STAGGER_CAP_INDEX) * STAGGER_STEP;
  const photoUrl = getLatestPhotoUrl(flower);

  return (
    <Link
      href={`/flower/${flower.id}`}
      className="animate-fadeUp block overflow-hidden rounded-flower-card border border-border bg-surface shadow-card-lg transition-all duration-[220ms] [transition-timing-function:ease] hover:-translate-y-1.5 hover:border-[#D8C49B] hover:shadow-card-hover active:-translate-y-0.5 active:scale-[0.99] active:shadow-card"
      style={{ animationDuration: "0.45s", animationDelay: `${delay}s` }}
    >
      <div
        className="relative flex h-[180px] items-center justify-center"
        style={{ backgroundColor: token.wash }}
      >
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={flower.commonName}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <StageIllustration stage={flower.stage} size={86} />
        )}
        <span
          className="absolute left-3 top-3 rounded-full px-[11px] py-[5px] font-sans text-xs font-bold text-ink"
          style={{ backgroundColor: "#FBF6EAe6" }}
        >
          Bucket {String(flower.bucketNo).padStart(2, "0")}
        </span>
      </div>

      <div className="px-[19px] pb-[19px] pt-[17px]">
        <p className="font-serif text-[19px] font-medium leading-tight text-ink">
          {flower.commonName}
        </p>
        <p className="mt-[2px] font-serif text-[13px] italic text-muted">
          {flower.latinName}
        </p>

        <div className="mt-[13px] flex items-center justify-between">
          <StagePill stage={flower.stage} />
          <span className="font-sans text-xs font-medium text-muted">
            Day {flower.daysPlanted}
          </span>
        </div>

        <ProgressDots stage={flower.stage} className="mt-[14px]" />
      </div>
    </Link>
  );
}
