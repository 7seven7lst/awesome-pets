import { z } from "zod";

const medicalRecordTypeZ = z.enum(["VACCINE", "ALLERGY"]);
const allergySeverityZ = z.enum(["MILD", "SEVERE"]);
const isoDateTimeZ = z.string().datetime({ offset: true });

const medicalRecordFormBaseSchema = z.object({
  recordType: medicalRecordTypeZ,
  vaccineName: z.string().optional(),
  administeredAt: isoDateTimeZ.optional(),
  nextDueAt: isoDateTimeZ.optional(),
  allergyName: z.string().optional(),
  reactions: z.string().optional(),
  severity: allergySeverityZ.optional(),
});

function refineMedicalRecordFormFields(
  value: z.infer<typeof medicalRecordFormBaseSchema>,
  ctx: z.RefinementCtx,
) {
  if (value.recordType === "VACCINE") {
    if (!value.vaccineName || value.vaccineName.length < 1) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Vaccine name is required", path: ["vaccineName"] });
    }
    if (!value.administeredAt || value.administeredAt.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Administered date is required",
        path: ["administeredAt"],
      });
    }
  }

  if (value.recordType === "ALLERGY") {
    if (!value.allergyName || value.allergyName.length < 1) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Allergy name is required", path: ["allergyName"] });
    }
    if (!value.reactions || value.reactions.length < 1) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Reactions are required", path: ["reactions"] });
    }
    if (!value.severity) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Severity is required", path: ["severity"] });
    }
  }
}

export const medicalRecordCreateApiSchema = medicalRecordFormBaseSchema.superRefine(refineMedicalRecordFormFields);

/** RHF date inputs use `""` when empty; Zod `.optional()` only skips `undefined`, not empty strings. */
function dateOnlyInputToIsoDatetime(raw: unknown): unknown {
  if (raw === "" || raw === undefined) return undefined;
  if (typeof raw !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const [year, month, day] = raw.split("-").map((n) => Number.parseInt(n, 10));
  return new Date(year, month - 1, day).toISOString();
}

function updateFormNextDueAt(raw: unknown): unknown {
  if (raw === null) return null;
  return dateOnlyInputToIsoDatetime(raw);
}

/** Client RHF: convert date input values to ISO datetime strings. */
export const medicalRecordCreateFormSchema = z.preprocess((val) => {
  if (typeof val !== "object" || val === null) return val;
  const o = { ...(val as Record<string, unknown>) };
  return {
    ...o,
    administeredAt: dateOnlyInputToIsoDatetime(o.administeredAt),
    nextDueAt: dateOnlyInputToIsoDatetime(o.nextDueAt),
  };
}, medicalRecordCreateApiSchema);

export const medicalRecordUpdateSchema = z.object({
  vaccineName: z.string().min(1).max(120).optional(),
  administeredAt: isoDateTimeZ.optional(),
  nextDueAt: isoDateTimeZ.nullable().optional(),
  allergyName: z.string().min(1).max(120).optional(),
  reactions: z.string().min(1).max(500).optional(),
  severity: allergySeverityZ.optional(),
});

export const medicalRecordUpdateApiSchema = medicalRecordUpdateSchema;

export const medicalRecordUpdateFormSchema = z.preprocess((val) => {
  if (typeof val !== "object" || val === null) return val;
  const o = { ...(val as Record<string, unknown>) };
  return {
    ...o,
    administeredAt: dateOnlyInputToIsoDatetime(o.administeredAt),
    nextDueAt: updateFormNextDueAt(o.nextDueAt),
  };
}, medicalRecordUpdateApiSchema);
