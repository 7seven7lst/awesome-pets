import { API_V1_PREFIX } from "../lib/apiBase";
import { PET_IMAGE_MAX_BYTES, PET_IMAGE_MAX_LABEL } from "../lib/pet-image-limits";
import { apiGet, apiSend } from "./base";
import type { AnimalType, MedicalRecord, MedicalRecordType, PetDetail, PetSummary } from "../types";

export function listPets(params: {
  query?: string;
  animalType?: AnimalType | "";
  page?: number;
  pageSize?: number;
}) {
  const sp = new URLSearchParams();
  if (params.query) sp.set("query", params.query);
  if (params.animalType) sp.set("animalType", params.animalType);
  if (params.page != null && params.page > 1) sp.set("page", String(params.page));
  if (params.pageSize != null) sp.set("pageSize", String(params.pageSize));
  const q = sp.toString();
  return apiGet<{
    pets: PetSummary[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>(`${API_V1_PREFIX}/pets${q ? `?${q}` : ""}`);
}

export function getPet(id: string) {
  return apiGet<PetDetail>(`${API_V1_PREFIX}/pets/${id}`);
}

export function getMedicalRecordsByPetId(
  petId: string,
  params?: { page?: number; pageSize?: number; recordType?: MedicalRecordType | "" },
) {
  const sp = new URLSearchParams();
  if (params?.page != null && params.page > 1) sp.set("page", String(params.page));
  if (params?.pageSize != null) sp.set("pageSize", String(params.pageSize));
  if (params?.recordType) sp.set("recordType", params.recordType);
  const q = sp.toString();
  return apiGet<{
    medicalRecords: MedicalRecord[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>(`${API_V1_PREFIX}/pets/${petId}/records${q ? `?${q}` : ""}`);
}

export function exportPetMedicalRecords(petId: string) {
  return apiGet<{ medicalRecords: MedicalRecord[] }>(`${API_V1_PREFIX}/pets/${petId}/records/export`);
}

export function createPet(body: unknown) {
  return apiSend<{ pet: PetSummary }>(`${API_V1_PREFIX}/pets`, "POST", body);
}

export function updatePet(id: string, body: unknown) {
  return apiSend<{ pet: PetSummary }>(`${API_V1_PREFIX}/pets/${id}`, "PATCH", body);
}

export function deletePet(id: string) {
  return apiSend<{ success: boolean }>(`${API_V1_PREFIX}/pets/${id}`, "DELETE");
}

/** Multipart upload; uses `fetch` so axios default JSON headers do not apply. */
export async function uploadPetPhoto(petId: string, file: File): Promise<{ imageUrl: string }> {
  if (file.size > PET_IMAGE_MAX_BYTES) {
    throw new Error(`Image too large (max ${PET_IMAGE_MAX_LABEL})`);
  }
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${API_V1_PREFIX}/pets/${petId}/photo`, {
    method: "POST",
    body: fd,
    credentials: "include",
  });
  const body = (await res.json().catch(() => ({}))) as { error?: string; imageUrl?: string };
  if (!res.ok) {
    throw new Error(typeof body.error === "string" ? body.error : "Photo upload failed");
  }
  if (typeof body.imageUrl !== "string") {
    throw new Error("Photo upload failed");
  }
  return { imageUrl: body.imageUrl };
}

export function createRecord(petId: string, body: unknown) {
  return apiSend<{ record: unknown }>(`${API_V1_PREFIX}/pets/${petId}/records`, "POST", body);
}

export function updateRecord(recordId: string, body: unknown) {
  return apiSend<unknown>(`${API_V1_PREFIX}/records/${recordId}`, "PATCH", body);
}

export function deleteRecord(recordId: string) {
  return apiSend<{ success: boolean }>(`${API_V1_PREFIX}/records/${recordId}`, "DELETE");
}
