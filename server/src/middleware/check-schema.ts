import { fail } from "@/lib/http";
import type { RequestHandler } from "express";
import type { ZodType } from "zod";

type RequestPayloadKey = "body" | "query" | "params";
type SchemaMap = Partial<Record<RequestPayloadKey, ZodType<unknown>>>;

type FormattedValidationError = {
  field: string;
  message: string;
};

/**
 * Validates request payloads with the given schema map.
 * Example: `checkSchema({ body: schemaA, query: schemaB })`
 *
 * - On success:
 *   - if one payload key is provided, `req.validated` is that parsed payload (backward-compatible).
 *   - if multiple payload keys are provided, `req.validated` is an object keyed by payload name.
 * - On failure: returns `{ errors: FormattedValidationError[] }` with all issues.
 */
export function checkSchema(schemaMap: SchemaMap): RequestHandler {
  return (req, res, next) => {
    const keys = Object.keys(schemaMap) as RequestPayloadKey[];
    const validationErrors: FormattedValidationError[] = [];
    const validatedByPayload: Partial<Record<RequestPayloadKey, unknown>> = {};

    for (const key of keys) {
      const schema = schemaMap[key];
      if (!schema) continue;

      const result = schema.safeParse(req[key]);
      if (!result.success) {
        const formattedErrors = result.error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        validationErrors.push(...formattedErrors);
        continue;
      }

      validatedByPayload[key] = result.data;
    }

    if (validationErrors.length > 0) {
      return fail(res, { errors: validationErrors }, 400);
    }

    if (validatedByPayload.body !== undefined) {
      // attach validated body as validated property on request
      req.validated = validatedByPayload.body;
    }
    next();
  };
}
