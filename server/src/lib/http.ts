import type { Response } from "express";
import { ServerError } from "@/lib/server-error";

export function ok(res: Response, data: unknown, status = 200) {
  return res.status(status).json(data);
}

export function fail(res: Response, message: any, status = 400) {
  return res.status(status).json({ error: message });
}

/** Maps {@link ServerError} to `fail`; logs and returns 500 for anything else. */
export function handleRouteError(res: Response, err: unknown, logLabel: string) {
  if (err instanceof ServerError) {
    return fail(res, err.message, err.statusCode);
  }
  console.error(logLabel, err);
  return fail(res, err instanceof Error ? err.message : String(err), 500);
}
