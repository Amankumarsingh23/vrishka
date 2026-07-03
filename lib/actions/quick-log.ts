"use server";

import { revalidatePath } from "next/cache";
import { appendFlowerEvent, listFlowers, setFlowerStage } from "@/lib/data/flowers";
import type { Flower, FlowerEvent, FlowerEventType, Stage } from "@/types/flower";

export type QuickLogAction = "watered" | "photo" | "stage-change" | "note" | "disease-spotted";

export interface QuickLogInput {
  action: QuickLogAction;
  flowerIds: string[];
  note?: string;
  toStage?: Stage;
  photoUrl?: string;
}

const ACTION_LABELS: Record<QuickLogAction, string> = {
  watered: "Watered",
  photo: "Photo added",
  "stage-change": "Stage change",
  note: "Note",
  "disease-spotted": "Disease spotted",
};

function buildEvent(input: QuickLogInput, flower: Flower): FlowerEvent {
  const today = new Date().toISOString().slice(0, 10);
  const dayNumber = flower.daysPlanted;
  const type = input.action as FlowerEventType;

  if (input.action === "stage-change") {
    return {
      type,
      date: today,
      label: `Moved to ${input.toStage}`,
      dayNumber,
      notes: input.note,
      toStage: input.toStage,
    };
  }

  return {
    type,
    date: today,
    label: ACTION_LABELS[input.action],
    dayNumber,
    notes: input.note,
    photoUrl: input.action === "photo" ? input.photoUrl : undefined,
  };
}

function revalidateAffected(flowerIds: string[]) {
  revalidatePath("/");
  revalidatePath("/gallery");
  for (const id of flowerIds) {
    revalidatePath(`/flower/${id}`);
  }
}

export async function submitQuickLog(input: QuickLogInput): Promise<{ count: number }> {
  const flowers = await listFlowers();
  const targets = input.flowerIds
    .map((id) => flowers.find((f) => f.id === id))
    .filter((f): f is Flower => f !== undefined);

  // Promise.allSettled rather than sequential awaits: with up to 35 buckets
  // in a single "water all outdoor" batch, one transient write failure
  // shouldn't abort every bucket after it in the loop — each write stands
  // on its own, and we report however many actually succeeded.
  const results = await Promise.allSettled(
    targets.map(async (flower) => {
      await appendFlowerEvent(flower.id, buildEvent(input, flower));
      if (input.action === "stage-change" && input.toStage) {
        await setFlowerStage(flower.id, input.toStage);
      }
    }),
  );

  const count = results.filter((r) => r.status === "fulfilled").length;

  revalidateAffected(input.flowerIds);

  if (count === 0 && targets.length > 0) {
    throw new Error("Couldn't save any of that — check your connection and try again.");
  }

  return { count };
}

export async function waterAllOutdoorBuckets(): Promise<{ count: number }> {
  const flowers = await listFlowers();
  const outdoorIds = flowers.filter((f) => f.group === 1 || f.group === 3).map((f) => f.id);
  return submitQuickLog({ action: "watered", flowerIds: outdoorIds });
}
