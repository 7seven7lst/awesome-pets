import { MedicalRecordType } from "@novellia/shared/prisma/browser";
import { exportPetMedicalRecords } from "../api";
import type { PetDetail } from "../types";
import { animalTypeLabel } from "./labels";
import { formatDate } from "./timezone";

function escapeCsv(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

export function petMedicalRecordsCsv(pet: PetDetail): string {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const lines: string[] = [];
  lines.push(["pet_name", "animal_type", "owner", "record_type", "details"].map(escapeCsv).join(","));
  const owner = pet.owner?.name ?? "";
  for (const r of pet.medicalRecords) {
    if (r.recordType === MedicalRecordType.VACCINE && r.vaccineRecord) {
      const v = r.vaccineRecord;
      const details = [
        `vaccine=${v.vaccineName}`,
        `administered=${formatDate(v.administeredAt, tz)}`,
        v.nextDueAt ? `next_due=${formatDate(v.nextDueAt, tz)}` : "next_due=",
      ].join("; ");
      lines.push(
        [pet.name, animalTypeLabel(pet.animalType), owner, MedicalRecordType.VACCINE, details]
          .map((c) => escapeCsv(c))
          .join(","),
      );
    }
    if (r.recordType === MedicalRecordType.ALLERGY && r.allergyRecord) {
      const a = r.allergyRecord;
      const details = `allergy=${a.allergyName}; reactions=${a.reactions}; severity=${a.severity}`;
      lines.push(
        [pet.name, animalTypeLabel(pet.animalType), owner, MedicalRecordType.ALLERGY, details]
          .map((c) => escapeCsv(c))
          .join(","),
      );
    }
  }
  return lines.join("\n");
}

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadPetCsv(pet: PetDetail) {
  const safe = pet.name.replaceAll(/[^\w\-]+/g, "_").slice(0, 60);
  downloadTextFile(`${safe}_medical_records.csv`, petMedicalRecordsCsv(pet));
}

/** Fetches all records from the server, then downloads CSV (pet list pages only include a slice). */
export async function downloadPetMedicalRecordsCsv(pet: PetDetail) {
  const { medicalRecords } = await exportPetMedicalRecords(pet.id);
  const full: PetDetail = { ...pet, medicalRecords };
  const safe = pet.name.replaceAll(/[^\w\-]+/g, "_").slice(0, 60);
  downloadTextFile(`${safe}_medical_records.csv`, petMedicalRecordsCsv(full));
}
