import { supabase } from "@/lib/supabase/client";

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;
const BUCKET = "grow-photos";

/**
 * Downscales and re-encodes an image in the browser before it ever hits
 * the network — phone camera photos are routinely 3-10MB, and nothing in
 * this app needs more than ~1600px on the long edge.
 *
 * `imageOrientation: "from-image"` matters specifically for phone camera
 * shots: many phones write image data in landscape regardless of how you
 * held the phone and rely on EXIF orientation metadata to display it
 * upright. Without this option some browsers ignore that metadata during
 * decode and the compressed output comes out sideways.
 */
async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });

  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Your browser can't process images.");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Couldn't compress that image."))),
      "image/jpeg",
      JPEG_QUALITY,
    );
  });
}

function randomId(): string {
  return Math.random().toString(36).slice(2, 8);
}

/** Compresses `file`, uploads it under the flower's id, and returns its public URL. */
export async function uploadFlowerPhoto(flowerId: string, file: File): Promise<string> {
  const compressed = await compressImage(file);
  const path = `${flowerId}/${Date.now()}-${randomId()}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, compressed, { contentType: "image/jpeg", upsert: false });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
