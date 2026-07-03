import type { Flower } from "@/types/flower";
import { getStageToken } from "@/lib/stages";
import { getLatestPhotoUrl } from "@/lib/photos";
import { StageIllustration } from "@/components/ui/StageIllustration";

export function ProfileHero({ flower }: { flower: Flower }) {
  const token = getStageToken(flower.stage);
  const photoUrl = getLatestPhotoUrl(flower);

  return (
    <div
      className="relative flex h-[240px] items-center justify-center overflow-hidden rounded-flower-card shadow-frame sm:h-[280px]"
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
        <StageIllustration stage={flower.stage} size={160} />
      )}
      <span
        className="absolute left-4 top-4 rounded-full px-[11px] py-[5px] font-sans text-xs font-bold text-ink"
        style={{ backgroundColor: "#FBF6EAe6" }}
      >
        Bucket {String(flower.bucketNo).padStart(2, "0")}
      </span>
    </div>
  );
}
