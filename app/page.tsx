import { listFlowers } from "@/lib/data/flowers";
import { getStageDistribution, getGerminationStats, getNeedsAttention } from "@/lib/dashboard";
import { getStageToken } from "@/lib/stages";
import { getMonsoonWeather } from "@/lib/weather";
import { StatCard } from "@/components/ui/StatCard";
import { StageDistribution } from "@/components/dashboard/StageDistribution";
import { GerminationRing } from "@/components/dashboard/GerminationRing";
import { NeedsAttentionList } from "@/components/dashboard/NeedsAttentionList";
import { MonsoonWeatherCard } from "@/components/dashboard/MonsoonWeatherCard";

// Always render fresh from Supabase — this page shows live garden data
// (and Quick Log mutations call revalidatePath on it), so it shouldn't be
// frozen at whatever existed during the Vercel build.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [flowers, weather] = await Promise.all([listFlowers(), getMonsoonWeather()]);

  if (flowers.length === 0) {
    return (
      <div>
        <h1 className="font-serif text-h1 text-ink">Dashboard</h1>
        <div className="mt-6 rounded-card border border-border bg-surface p-10 text-center">
          <p className="font-serif text-h3 text-ink">No buckets yet</p>
          <p className="mx-auto mt-2 max-w-sm font-sans text-sm text-body">
            Your Supabase <code className="rounded bg-track px-1 py-0.5 text-xs">flowers</code>{" "}
            table is empty. Run{" "}
            <code className="rounded bg-track px-1 py-0.5 text-xs">supabase/seed.sql</code> to load
            this season&apos;s buckets, or log your first one with the Quick Log button.
          </p>
        </div>
      </div>
    );
  }

  const stageDistribution = getStageDistribution(flowers);
  const germinationStats = getGerminationStats(flowers);
  const attentionItems = getNeedsAttention(flowers);
  const dormantCount = flowers.filter((f) => f.stage === "Dormant").length;
  const oldest = flowers.reduce((max, f) => (!max || f.daysPlanted > max.daysPlanted ? f : max), flowers[0]);

  return (
    <div>
      <h1 className="font-serif text-h1 text-ink">Dashboard</h1>
      <p className="mt-2 font-sans text-body">
        Tracking {flowers.length} buckets across this monsoon&apos;s planting guide.
      </p>

      <div
        className="mt-6 grid gap-3.5"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))" }}
      >
        <StatCard
          label="Total Buckets"
          value={flowers.length}
          subLabel="in the guide"
          dotColor="#2C4A38"
          delay={0}
        />
        <StatCard
          label="Germinated"
          value={germinationStats.germinated}
          subLabel={`of ${flowers.length} buckets`}
          dotColor={getStageToken("Germinated").fill}
          delay={0.06}
        />
        <StatCard
          label="Dormant"
          value={dormantCount}
          subLabel="not yet sprouted"
          dotColor={getStageToken("Dormant").fill}
          delay={0.12}
        />
        <StatCard
          label="Needs Attention"
          value={attentionItems.length}
          subLabel="flagged today"
          dotColor="#C1573E"
          delay={0.18}
        />
        <StatCard
          label="Oldest Bucket"
          value={oldest.daysPlanted}
          subLabel={oldest.commonName}
          dotColor="#CE9243"
          delay={0.24}
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[3fr_2fr]">
        <StageDistribution data={stageDistribution} delay={0.4} />
        <GerminationRing stats={germinationStats} delay={0.45} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <NeedsAttentionList items={attentionItems} delay={0.55} />
        <MonsoonWeatherCard weather={weather} delay={0.6} />
      </div>
    </div>
  );
}
