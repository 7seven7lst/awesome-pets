import {
  AllergySeverity as AllergySeverityEnum,
  MedicalRecordType as MedicalRecordTypeEnum,
} from "@novellia/shared/prisma/browser";
import type { AllergySeverity, AnimalType, MedicalRecordType } from "../types";

export function animalTypeLabel(t: AnimalType): string {
  const map: Record<AnimalType, string> = {
    DOG: "Dog",
    CAT: "Cat",
    BIRD: "Bird",
    RABBIT: "Rabbit",
    OTHER: "Other",
  };
  return map[t];
}

export function recordTypeLabel(t: MedicalRecordType): string {
  return t === MedicalRecordTypeEnum.VACCINE ? "Vaccine" : "Allergy";
}

export function severityLabel(s: AllergySeverity): string {
  return s === AllergySeverityEnum.MILD ? "Mild" : "Severe";
}
