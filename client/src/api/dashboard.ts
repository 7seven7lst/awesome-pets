import { API_V1_PREFIX } from "../lib/apiBase";
import { apiGet } from "./base";
import type { AnimalType, PetSummary } from "../types";

export type DashboardPart<T> =
  | { status: "success"; data: T }
  | { status: "error"; data: null; error: string };

export type DashboardUpcomingVaccineRow = {
  medicalRecordId: string;
  vaccineName: string;
  nextDueAt: string | null;
  medicalRecord: {
    pet: Pick<PetSummary, "id" | "name" | "animalType" | "description"> & { imageUrl?: string | null };
  };
};

export function getDashboard() {
  return apiGet<{
    totalPets: DashboardPart<number>;
    petsByType: DashboardPart<{ animalType: AnimalType; count: number }[]>;
    upcomingVaccinesChartDates: DashboardPart<string[]>;
  }>(`${API_V1_PREFIX}/dashboard`);
}

export function getDashboardUpcomingVaccines(params?: { page?: number; pageSize?: number }) {
  const sp = new URLSearchParams();
  if (params?.page != null && params.page > 1) sp.set("page", String(params.page));
  if (params?.pageSize != null) sp.set("pageSize", String(params.pageSize));
  const q = sp.toString();
  return apiGet<{
    vaccines: DashboardUpcomingVaccineRow[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>(`${API_V1_PREFIX}/dashboard/upcoming-vaccines${q ? `?${q}` : ""}`);
}
