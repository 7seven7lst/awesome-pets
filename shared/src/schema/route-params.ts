import { z } from "zod";

/** Express 5 types `req.params` values as `string | string[]`. */
export function routeParamString(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0] ?? "";
  return "";
}

export const idParamSchema = z.object({
  id: z.string().uuid("Invalid id"),
});
