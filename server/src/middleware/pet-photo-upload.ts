import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { fail } from "@/lib/http";
import { PET_IMAGE_MAX_BYTES, PET_IMAGE_MAX_LABEL } from "@/lib/pet-image-limits";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: PET_IMAGE_MAX_BYTES },
});

const single = upload.single("file");

/** Parses multipart field `file`; responds with 413/400 on multer errors. */
export function petPhotoUploadMiddleware(req: Request, res: Response, next: NextFunction) {
  single(req, res, (err: unknown) => {
    if (!err) {
      return next();
    }
    if (typeof err === "object" && err !== null && "code" in err) {
      const code = String((err as { code: unknown }).code);
      if (code === "LIMIT_FILE_SIZE") {
        return fail(res, `Image too large (max ${PET_IMAGE_MAX_LABEL})`, 413);
      }
      const e = err as unknown as { message?: unknown };
      const msg = typeof e.message === "string" ? e.message : "Upload rejected";
      return fail(res, msg, 400);
    }
    return next(err instanceof Error ? err : new Error(String(err)));
  });
}
