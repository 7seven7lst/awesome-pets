import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ServerError } from "@/lib/server-error";
import { PET_IMAGE_MAX_BYTES, PET_IMAGE_MAX_LABEL } from "@/lib/pet-image-limits";

const libDir = dirname(fileURLToPath(import.meta.url));

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function extForMime(mime: string): string | null {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return null;
}

/** Writes under `server/public/uploads/pets/<UTC-date>/`; returns public URL path. */
export async function savePetUploadedImageBuffer(
  petId: string,
  buffer: Buffer,
  mimeType: string,
): Promise<string> {
  if (buffer.length > PET_IMAGE_MAX_BYTES) {
    throw new ServerError(`Image too large (max ${PET_IMAGE_MAX_LABEL})`, 413);
  }
  if (!ALLOWED_TYPES.has(mimeType)) {
    throw new ServerError("Use JPEG, PNG, or WebP", 400);
  }
  const ext = extForMime(mimeType);
  if (!ext) {
    throw new ServerError("Use JPEG, PNG, or WebP", 400);
  }

  const dayFolder = new Date().toISOString().slice(0, 10);
  const dir = join(libDir, "../../public/uploads/pets", dayFolder);
  await mkdir(dir, { recursive: true });
  const filename = `${petId}-${randomUUID()}.${ext}`;
  await writeFile(join(dir, filename), buffer);
  return `/uploads/pets/${dayFolder}/${filename}`;
}
