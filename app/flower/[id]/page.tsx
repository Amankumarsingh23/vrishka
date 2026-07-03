import Link from "next/link";
import { notFound } from "next/navigation";
import { getFlower } from "@/lib/data/flowers";
import { getStageToken } from "@/lib/stages";
import { StagePill } from "@/components/ui/StagePill";
import { StatCard } from "@/components/ui/StatCard";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { CareSheet } from "@/components/profile/CareSheet";
import { GrowthTimeline } from "@/components/profile/GrowthTimeline";
import { PhotoStrip } from "@/components/profile/PhotoStrip";
import { CareLogFeed } from "@/components/profile/CareLogFeed";

// Explicit alongside the implicit dynamic behavior from a param route with
// no generateStaticParams — see app/page.tsx for why this matters here.
export const dynamic = "force-dynamic";

export default async function FlowerProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const flower = await getFlower(params.id);

  if (!flower) {
    notFound();
  }

  const token = getStageToken(flower.stage);

  return (
    <div>
      <Link
        href="/gallery"
        className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-muted transition-colors hover:text-ink"
      >
        ← Back to Gallery
      </Link>

      <div className="mt-4">
        <ProfileHero flower={flower} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-track px-3 py-1 font-sans text-xs font-semibold text-body">
          {flower.groupLabel}
        </span>
        <span className="font-sans text-caption uppercase text-gold-dark">
          Group {flower.group}
        </span>
      </div>

      <h1 className="mt-2 font-serif text-h1 text-ink">{flower.commonName}</h1>
      <p className="mt-1 font-serif text-[15px] italic text-muted">{flower.latinName}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <StagePill stage={flower.stage} size="large" />
        <span className="font-sans text-sm font-medium text-muted">Day {flower.daysPlanted}</span>
      </div>

      <div
        className="mt-6 grid gap-3.5"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))" }}
      >
        <StatCard label="Day" value={flower.daysPlanted} subLabel="since sowing" dotColor={token.fill} delay={0} />
        <StatCard label="Bucket" value={flower.bucketNo} subLabel="of 35" dotColor={token.fill} delay={0.06} />
        <StatCard label="Group" value={flower.group} subLabel="of 4" dotColor={token.fill} delay={0.12} />
        <StatCard label="Logged" value={flower.events.length} subLabel="milestones" dotColor={token.fill} delay={0.18} />
      </div>

      <div className="mt-8">
        <CareSheet flower={flower} />
      </div>

      <h2 className="mt-10 font-serif text-h2 text-ink">Growth Timeline</h2>
      <div className="mt-5">
        <GrowthTimeline events={flower.events} />
      </div>

      <h2 className="mt-10 font-serif text-h2 text-ink">Photo Journey</h2>
      <div className="mt-4">
        <PhotoStrip flowerId={flower.id} events={flower.events} />
      </div>

      <h2 className="mt-10 font-serif text-h2 text-ink">Care Log</h2>
      <div className="mt-4">
        <CareLogFeed events={flower.events} />
      </div>
    </div>
  );
}
