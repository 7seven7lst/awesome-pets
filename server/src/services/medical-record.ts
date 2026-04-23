import type { output } from "zod";
import { MedicalRecordType, UserRole } from "@/generated/prisma/browser";
import { parseIsoDateTimeToDate } from "@/lib/calendar-date";
import { prisma } from "@/lib/prisma";
import { medicalRecordUpdateApiSchema } from "@novellia/shared/schema/medical-record";
import { ServerError } from "@/lib/server-error";
import type { SessionUser } from "@/types/session-user";

export type MedicalRecordUpdateInput = output<typeof medicalRecordUpdateApiSchema>;

export default class MedicalRecordService {
  public static async updateMedicalRecord(user: SessionUser, recordId: string, data: MedicalRecordUpdateInput) {
    const existing = await prisma.medicalRecord.findUnique({
      where: { id: recordId },
      include: {
        vaccineRecord: true,
        allergyRecord: true,
        pet: { select: { ownerId: true } },
      },
    });

    if (!existing) {
      throw new ServerError("Record not found", 404);
    }

    if (user.role !== UserRole.ADMIN && existing.pet.ownerId !== user.id) {
      throw new ServerError("Forbidden", 403);
    }

    if (existing.recordType === MedicalRecordType.VACCINE) {
      const updated = await prisma.vaccineRecord.update({
        where: { medicalRecordId: recordId },
        data: {
          ...(data.vaccineName ? { vaccineName: data.vaccineName } : {}),
          ...(data.administeredAt ? { administeredAt: parseIsoDateTimeToDate(data.administeredAt) } : {}),
          ...(Object.hasOwn(data, "nextDueAt")
            ? { nextDueAt: data.nextDueAt ? parseIsoDateTimeToDate(data.nextDueAt) : null }
            : {}),
        },
      });

      return { recordType: existing.recordType, vaccineRecord: updated };
    }

    const updated = await prisma.allergyRecord.update({
      where: { medicalRecordId: recordId },
      data: {
        ...(data.allergyName ? { allergyName: data.allergyName } : {}),
        ...(data.reactions ? { reactions: data.reactions } : {}),
        ...(data.severity ? { severity: data.severity } : {}),
      },
    });

    return { recordType: existing.recordType, allergyRecord: updated };
  }

  public static async deleteMedicalRecord(user: SessionUser, recordId: string) {
    const existing = await prisma.medicalRecord.findUnique({
      where: { id: recordId },
      select: { id: true, pet: { select: { ownerId: true } } },
    });

    if (!existing) {
      throw new ServerError("Record not found", 404);
    }

    if (user.role !== UserRole.ADMIN && existing.pet.ownerId !== user.id) {
      throw new ServerError("Forbidden", 403);
    }

    await prisma.medicalRecord.delete({ where: { id: recordId } });
  }
}
