import type { AnimalType } from "@/generated/prisma/browser";
import { UserRole } from "@/generated/prisma/browser";
import { prisma } from "@/lib/prisma";
import {
  clampPage,
  MEDICAL_RECORDS_PAGE_SIZE,
  totalPages as totalPagesFromCount,
} from "@/lib/pagination";
import type { SessionUser } from "@/types/session-user";

export type DashboardPart<T> =
  | { status: "success"; data: T }
  | { status: "error"; data: null; error: string };

export type PetsByTypeDatum = { animalType: AnimalType; count: number };

function rejectionMessage(reason: unknown): string {
  return reason instanceof Error
    ? reason.message
    : typeof reason === "string"
      ? reason
      : "Request failed";
}

function upcomingVaccineWindowWhere(petScope: Record<string, unknown>) {
  const now = new Date();
  const horizon = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  return {
    nextDueAt: {
      gte: now,
      lte: horizon,
    },
    medicalRecord: { pet: petScope },
  };
}

export default class DashboardService {
  public static async getDashboardForUser(user: SessionUser) {
    const petScope = user.role === UserRole.ADMIN ? {} : { ownerId: user.id };
    const vaccineWhere = upcomingVaccineWindowWhere(petScope);

    const [totalPetsResult, petsByTypeResult, chartDatesResult] = await Promise.allSettled([
      prisma.pet.count({ where: petScope }),
      prisma.pet.groupBy({
        by: ["animalType"],
        where: petScope,
        _count: { _all: true },
      }),
      prisma.vaccineRecord.findMany({
        where: vaccineWhere,
        select: { nextDueAt: true },
        orderBy: { nextDueAt: "asc" },
      }),
    ]);

    let totalPets: DashboardPart<number>;

    if (totalPetsResult.status === "fulfilled") {
      totalPets = {
        status: "success",
        data: totalPetsResult.value,
      };
    } else {
      console.error("dashboard partial failure", "totalPets", totalPetsResult.reason);
      totalPets = {
        status: "error",
        data: null,
        error: rejectionMessage(totalPetsResult.reason),
      };
    }

    let petsByType: DashboardPart<PetsByTypeDatum[]>;
    if (petsByTypeResult.status === "fulfilled") {
      petsByType = {
        status: "success",
        data: petsByTypeResult.value.map((entry) => ({
          animalType: entry.animalType,
          count: entry._count._all,
        })),
      };
    } else {
      console.error("dashboard partial failure", "petsByType", petsByTypeResult.reason);
      petsByType = {
        status: "error",
        data: null,
        error: rejectionMessage(petsByTypeResult.reason),
      };
    }

    let upcomingVaccinesChartDates: DashboardPart<string[]>;
    if (chartDatesResult.status === "fulfilled") {
      upcomingVaccinesChartDates = {
        status: "success",
        data: chartDatesResult.value
          .map((row) => row.nextDueAt?.toISOString() ?? "")
          .filter(Boolean),
      };
    } else {
      console.error("dashboard partial failure", "upcomingVaccinesChartDates", chartDatesResult.reason);
      upcomingVaccinesChartDates = {
        status: "error",
        data: null,
        error: rejectionMessage(chartDatesResult.reason),
      };
    }

    return {
      totalPets,
      petsByType,
      upcomingVaccinesChartDates,
    };
  }

  public static async listUpcomingVaccinesForUser(
    user: SessionUser,
    filters: { page: number; pageSize: number },
  ) {
    const petScope = user.role === UserRole.ADMIN ? {} : { ownerId: user.id };
    const vaccineWhere = upcomingVaccineWindowWhere(petScope);

    const total = await prisma.vaccineRecord.count({ where: vaccineWhere });
    const totalPg = totalPagesFromCount(total, filters.pageSize);
    const page = clampPage(filters.page, totalPg);
    const skip = (page - 1) * filters.pageSize;

    const rows = await prisma.vaccineRecord.findMany({
      where: vaccineWhere,
      include: {
        medicalRecord: {
          select: {
            pet: {
              select: { id: true, name: true, animalType: true, imageUrl: true },
            },
          },
        },
      },
      orderBy: { nextDueAt: "asc" },
      skip,
      take: filters.pageSize,
    });

    return {
      vaccines: rows.map((row) => ({
        medicalRecordId: row.medicalRecordId,
        vaccineName: row.vaccineName,
        nextDueAt: row.nextDueAt,
        medicalRecord: row.medicalRecord,
      })),
      total,
      page,
      pageSize: filters.pageSize,
      totalPages: totalPg,
    };
  }
}
