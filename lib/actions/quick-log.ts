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

  for (const id of input.flowerIds) {
    const flower = flowers.find((f) => f.id === id);
    if (!flower) continue;

    await appendFlowerEvent(id, buildEvent(input, flower));

    if (input.action === "stage-change" && input.toStage) {
      await setFlowerStage(id, input.toStage);
    }
  }

  revalidateAffected(input.flowerIds);
  return { count: input.flowerIds.length };
}

export async function waterAllOutdoorBuckets(): Promise<{ count: number }> {
  const flowers = await listFlowers();
  const outdoorIds = flowers.filter((f) => f.group === 1 || f.group === 3).map((f) => f.id);
  return submitQuickLog({ action: "watered", flowerIds: outdoorIds });
}
