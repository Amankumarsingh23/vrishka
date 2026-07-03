import type { Flower, FlowerEvent } from "@/types/flower";

/** All photo events for a flower, oldest first (matches Flower.events order). */
export function listPhotoEvents(flower: Pick<Flower, "events">): FlowerEvent[] {
  return flower.events.filter((e) => e.type === "photo" && e.photoUrl);
}

/** The most recently added photo, if any — used anywhere a single cover image is needed. */
export function getLatestPhotoUrl(flower: Pick<Flower, "events">): string | undefined {
  const photos = listPhotoEvents(flower);
  return photos.length > 0 ? photos[photos.length - 1].photoUrl : undefined;
}
