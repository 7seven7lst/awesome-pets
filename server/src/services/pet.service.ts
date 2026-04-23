import type { output } from "zod";
import { AnimalType, MedicalRecordType, UserRole } from "@/generated/prisma/browser";
import type { PrismaClient } from "@/generated/prisma/client";
import { parseIsoDateTimeToDate } from "@/lib/calendar-date";
import { savePetUploadedImageBuffer } from "@/lib/pet-image-upload";
import { prisma } from "@/lib/prisma";
import { medicalRecordCreateApiSchema } from "@novellia/shared/schema/medical-record";
import { ANIMAL_TYPES, petCreateApiSchema, petUpdateApiSchema } from "@novellia/shared/schema/pet";
import { ServerError } from "@/lib/server-error";
import { clampPage, PETS_PAGE_SIZE, totalPages as totalPagesFromCount } from "@/lib/pagination";
import type { SessionUser } from "@/types/session-user";

export type PetCreateInput = output<typeof petCreateApiSchema>;
export type PetUpdateInput = output<typeof petUpdateApiSchema>;
export type MedicalRecordCreateInput = output<typeof medicalRecordCreateApiSchema>;

/** WHERE clause applied to list/count queries to scope results by ownership. */
function petScopeFor(user: SessionUser) {
  return user.role === UserRole.ADMIN ? {} : { ownerId: user.id };
}

/**
 * Fetches the minimal pet row needed for an access check.
 * Throws 404 when the pet doesn't exist, 403 when it exists but the user doesn't own it.
 * Returns `{ id, ownerId }` so callers can proceed without a second lookup.
 */
async function requirePetAccess(user: SessionUser, petId: string) {
  const pet = await prisma.pet.findUnique({
    where: { id: petId },
    select: { id: true, ownerId: true },
  });

  if (!pet) {
    throw new ServerError("Pet not found", 404);
  }

  if (user.role !== UserRole.ADMIN && pet.ownerId !== user.id) {
    throw new ServerError("Forbidden", 403);
  }

  return pet;
}

export default class PetService {
  public static async listPets(
    user: SessionUser,
    filters: { query: string; animalType: string; page: number; pageSize: number },
  ) {
    const petScope = petScopeFor(user);
    const { query, animalType, pageSize } = filters;

    const where = {
      ...petScope,
      name: { contains: query, mode: "insensitive" as const },
      ...(animalType && (ANIMAL_TYPES as readonly string[]).includes(animalType)
        ? { animalType: animalType as AnimalType }
        : {}),
    };

    const total = await prisma.pet.count({ where });
    const totalPg = totalPagesFromCount(total, pageSize);
    const page = clampPage(filters.page, totalPg);
    const skip = (page - 1) * pageSize;

    const pets = await prisma.pet.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    });

    return { pets, total, page, pageSize, totalPages: totalPg, defaultPageSize: PETS_PAGE_SIZE };
  }

  public static async createPet(user: SessionUser, data: PetCreateInput) {
    const ownerId = user.role === UserRole.ADMIN ? (data.ownerId ?? null) : user.id;

    if (ownerId) {
      const owner = await prisma.user.findUnique({ where: { id: ownerId }, select: { id: true } });
      if (!owner) {
        throw new ServerError("Owner user does not exist", 400);
      }
    }

    const description = !data.description ? null : data.description.trim() || null;

    return prisma.pet.create({
      data: {
        name: data.name,
        description,
        animalType: data.animalType,
        dateOfBirth: parseIsoDateTimeToDate(data.dateOfBirth),
        ownerId,
      },
      include: {
        owner: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  }

  public static async getPetById(user: SessionUser, petId: string) {
    // Single query: fetch full pet then check ownership
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      include: {
        owner: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    if (!pet) {
      throw new ServerError("Pet not found", 404);
    }

    if (user.role !== UserRole.ADMIN && pet.ownerId !== user.id) {
      throw new ServerError("Forbidden", 403);
    }

    return pet;
  }

  /** Paginated medical history for a pet (scoped to the viewer). */
  public static async getMedicalRecordsByPetId(
    user: SessionUser,
    petId: string,
    filters: { page: number; pageSize: number; recordType: string },
  ) {
    await requirePetAccess(user, petId);

    const recordTypeFilter =
      filters.recordType &&
      (Object.values(MedicalRecordType) as readonly string[]).includes(filters.recordType)
        ? { recordType: filters.recordType as MedicalRecordType }
        : {};

    const recordWhere = { petId, ...recordTypeFilter };

    const total = await prisma.medicalRecord.count({ where: recordWhere });
    const totalPg = totalPagesFromCount(total, filters.pageSize);
    const page = clampPage(filters.page, totalPg);
    const skip = (page - 1) * filters.pageSize;

    const medicalRecords = await prisma.medicalRecord.findMany({
      where: recordWhere,
      include: { vaccineRecord: true, allergyRecord: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: filters.pageSize,
    });

    return { medicalRecords, total, page, pageSize: filters.pageSize, totalPages: totalPg };
  }

  /** All medical records for CSV export (not paginated). */
  public static async listAllMedicalRecordsForExport(user: SessionUser, petId: string) {
    await requirePetAccess(user, petId);

    const medicalRecords = await prisma.medicalRecord.findMany({
      where: { petId },
      include: { vaccineRecord: true, allergyRecord: true },
      orderBy: { createdAt: "desc" },
    });

    return { medicalRecords };
  }

  public static async updatePet(user: SessionUser, petId: string, data: PetUpdateInput) {
    await requirePetAccess(user, petId);

    if (Object.hasOwn(data, "ownerId")) {
      if (user.role !== UserRole.ADMIN) {
        throw new ServerError("Forbidden", 403);
      }
      const nextOwner = data.ownerId;
      if (nextOwner) {
        const owner = await prisma.user.findUnique({ where: { id: nextOwner }, select: { id: true } });
        if (!owner) {
          throw new ServerError("Owner user does not exist", 400);
        }
      }
    }

    const ownerPatch =
      user.role === UserRole.ADMIN && Object.hasOwn(data, "ownerId") ? { ownerId: data.ownerId ?? null } : {};

    const descriptionPatch = Object.hasOwn(data, "description")
      ? { description: !data.description ? null : String(data.description).trim() || null }
      : {};

    return prisma.pet.update({
      where: { id: petId },
      data: {
        ...(data.name ? { name: data.name } : {}),
        ...descriptionPatch,
        ...(data.animalType ? { animalType: data.animalType } : {}),
        ...(data.dateOfBirth ? { dateOfBirth: parseIsoDateTimeToDate(data.dateOfBirth) } : {}),
        ...ownerPatch,
      },
      include: {
        owner: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  }

  public static async deletePet(user: SessionUser, petId: string) {
    await requirePetAccess(user, petId);
    await prisma.pet.delete({ where: { id: petId } });
  }

  public static async createMedicalRecordForPet(
    user: SessionUser,
    petId: string,
    data: MedicalRecordCreateInput,
  ) {
    await requirePetAccess(user, petId);

    return prisma.$transaction(async (tx) => {
      const db = tx as PrismaClient;
      const base = await db.medicalRecord.create({
        data: { petId, recordType: data.recordType },
      });

      if (data.recordType === MedicalRecordType.VACCINE) {
        await db.vaccineRecord.create({
          data: {
            medicalRecordId: base.id,
            vaccineName: data.vaccineName!,
            administeredAt: parseIsoDateTimeToDate(data.administeredAt!),
            nextDueAt: data.nextDueAt ? parseIsoDateTimeToDate(data.nextDueAt) : null,
          },
        });
      }

      if (data.recordType === MedicalRecordType.ALLERGY) {
        await db.allergyRecord.create({
          data: {
            medicalRecordId: base.id,
            allergyName: data.allergyName!,
            reactions: data.reactions!,
            severity: data.severity!,
          },
        });
      }

      return db.medicalRecord.findUnique({
        where: { id: base.id },
        include: { vaccineRecord: true, allergyRecord: true },
      });
    });
  }

  public static async uploadPetPhoto(
    user: SessionUser,
    petId: string,
    file: { buffer: Buffer; mimetype: string },
  ) {
    await requirePetAccess(user, petId);

    const imageUrl = await savePetUploadedImageBuffer(petId, file.buffer, file.mimetype);
    await prisma.pet.update({ where: { id: petId }, data: { imageUrl } });
    return { imageUrl };
  }
}
