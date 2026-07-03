"use server";

import { revalidatePath } from "next/cache";
import { createFlower, type NewFlowerInput } from "@/lib/data/flowers";

export type { NewFlowerInput };

export async function addFlower(input: NewFlowerInput): Promise<{ id: string }> {
  const commonName = input.commonName.trim();
  if (!commonName) {
    throw new Error("Give it a name before adding it.");
  }

  const flower = await createFlower({ ...input, commonName, latinName: input.latinName?.trim() });

  revalidatePath("/");
  revalidatePath("/gallery");

  return { id: flower.id };
}
