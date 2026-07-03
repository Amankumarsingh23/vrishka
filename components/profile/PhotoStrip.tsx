"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { FlowerEvent } from "@/types/flower";
import { listPhotoEvents } from "@/lib/photos";
import { uploadFlowerPhoto } from "@/lib/upload/uploadFlowerPhoto";
import { submitQuickLog } from "@/lib/actions/quick-log";
import { cn } from "@/lib/utils";

export function PhotoStrip({ flowerId, events }: { flowerId: string; events: FlowerEvent[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Newest first for browsing; listPhotoEvents returns oldest-first.
  const photos = [...listPhotoEvents({ events })].reverse();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);
    setIsUploading(true);
    try {
      const photoUrl = await uploadFlowerPhoto(flowerId, file);
      await submitQuickLog({ action: "photo", flowerIds: [flowerId], photoUrl });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't upload that photo.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFile}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className={cn(
            "flex h-[110px] w-[110px] shrink-0 flex-col items-center justify-center gap-1 rounded-thumb border-2 border-dashed border-border-alt font-sans text-xs font-semibold text-muted transition-colors hover:border-primary hover:text-primary",
            isUploading && "cursor-not-allowed opacity-60",
          )}
        >
          {isUploading ? (
            <span className="animate-pulse">Uploading…</span>
          ) : (
            <>
              <span className="text-xl leading-none">+</span>
              Add photo
            </>
          )}
        </button>

        {photos.map((event, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${event.photoUrl}-${i}`}
            src={event.photoUrl}
            alt="Bucket photo"
            className="h-[110px] w-[110px] shrink-0 rounded-thumb border border-border object-cover"
          />
        ))}

        {photos.length === 0 && !isUploading && (
          <div className="flex h-[110px] w-[110px] shrink-0 items-center justify-center rounded-thumb border border-dashed border-border bg-track/40 font-sans text-xs text-muted">
            No photos yet
          </div>
        )}
      </div>

      {error && <p className="mt-2 font-sans text-xs text-accent">{error}</p>}
    </div>
  );
}
