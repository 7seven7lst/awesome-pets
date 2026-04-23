import { MedicalRecordType as MedicalRecordTypeEnum } from "@novellia/shared/prisma/browser";
import {
  medicalRecordCreateFormSchema,
  medicalRecordUpdateFormSchema,
} from "@novellia/shared/schema/medical-record";
import type { z } from "zod";
import { localDateInputToIso } from "./calendar-date";

type CreateRecordValues = z.infer<typeof medicalRecordCreateFormSchema>;
type UpdateRecordValues = z.infer<typeof medicalRecordUpdateFormSchema>;

/** Create API: ISO datetimes for vaccine dates; optional next due → omit when empty. */
export function buildCreateMedicalRecordBody(data: CreateRecordValues): Record<string, unknown> {
  return {
    ...data,
    administeredAt:
      data.recordType === MedicalRecordTypeEnum.VACCINE && data.administeredAt
        ? localDateInputToIso(data.administeredAt)
        : data.administeredAt,
    nextDueAt:
      data.recordType === MedicalRecordTypeEnum.VACCINE && data.nextDueAt
        ? localDateInputToIso(data.nextDueAt)
        : undefined,
  };
}

/** Update API: vaccine branch converts date inputs; cleared next due → `null`. */
export function buildUpdateMedicalRecordBody(
  recordType: MedicalRecordTypeEnum,
  data: UpdateRecordValues,
): Record<string, unknown> {
  const body: Record<string, unknown> = { ...data };
  if (recordType === MedicalRecordTypeEnum.VACCINE) {
    body.administeredAt = data.administeredAt ? localDateInputToIso(data.administeredAt) : undefined;
    body.nextDueAt = data.nextDueAt ? localDateInputToIso(data.nextDueAt) : null;
  }
  return body;
}
