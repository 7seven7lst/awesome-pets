import { MedicalRecordType as MedicalRecordTypeEnum } from "@novellia/shared/prisma/browser";
import { animalTypeLabel, recordTypeLabel, severityLabel } from "./labels";
import type { AnimalType } from "../types";

describe("animalTypeLabel", () => {
  it.each<[AnimalType, string]>([
    ["DOG", "Dog"],
    ["CAT", "Cat"],
    ["BIRD", "Bird"],
    ["RABBIT", "Rabbit"],
    ["OTHER", "Other"],
  ])("maps %s to %s", (value, expected) => {
    expect(animalTypeLabel(value)).toBe(expected);
  });
});

describe("recordTypeLabel", () => {
  it("labels vaccine records", () => {
    expect(recordTypeLabel(MedicalRecordTypeEnum.VACCINE)).toBe("Vaccine");
  });

  it("labels allergy records", () => {
    expect(recordTypeLabel(MedicalRecordTypeEnum.ALLERGY)).toBe("Allergy");
  });
});

describe("severityLabel", () => {
  it("maps known severities", () => {
    expect(severityLabel("MILD")).toBe("Mild");
    expect(severityLabel("SEVERE")).toBe("Severe");
  });
});
