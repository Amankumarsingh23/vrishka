import type { Flower, Stage } from "@/types/flower";
import { STAGES } from "@/lib/stages";

export interface StageDistributionEntry {
  stage: Stage;
  count: number;
  percent: number;
}

export function getStageDistribution(flowers: Flower[]): StageDistributionEntry[] {
  const total = flowers.length || 1;
  return STAGES.map(({ stage }) => {
    const count = flowers.filter((f) => f.stage === stage).length;
    return { stage, count, percent: (count / total) * 100 };
  });
}

export interface GerminationStats {
  sown: number;
  germinated: number;
  rate: number;
}

/** Excludes Group 4 (wrong-season, never sown) from the denominator. */
export function getGerminationStats(flowers: Flower[]): GerminationStats {
  const sown = flowers.filter((f) => f.group !== 4);
  const germinated = sown.filter((f) => f.stage !== "Dormant");
  const rate = sown.length === 0 ? 0 : Math.round((germinated.length / sown.length) * 100);
  return { sown: sown.length, germinated: germinated.length, rate };
}

function parseMaxGerminationDays(range: string): number {
  const numbers = range.match(/\d+/g)?.map(Number) ?? [];
  return numbers.length ? Math.max(...numbers) : Infinity;
}

export interface AttentionItem {
  flower: Flower;
  reason: string;
}

export function getNeedsAttention(flowers: Flower[]): AttentionItem[] {
  return flowers.reduce<AttentionItem[]>((items, flower) => {
    if (flower.group === 4) {
      items.push({ flower, reason: "Wrong season — held dormant until the cool season." });
      return items;
    }
    if (flower.stage === "Dormant") {
      const maxDays = parseMaxGerminationDays(flower.expectedGerminationDays);
      if (flower.daysPlanted > maxDays) {
        items.push({
          flower,
          reason: `No sprout after ${flower.daysPlanted} days — past the expected ${flower.expectedGerminationDays} window.`,
        });
      }
    }
    return items;
  }, []);
}
