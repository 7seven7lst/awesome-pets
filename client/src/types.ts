import type {
  AllergySeverity,
  AnimalType,
  MedicalRecordType,
  UserRole,
} from "@novellia/shared/prisma/browser";

export type { AllergySeverity, AnimalType, MedicalRecordType, UserRole };

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type UserSummary = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type PaginationMeta = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type PetSummary = {
  id: string;
  name: string;
  animalType: AnimalType;
  dateOfBirth: string;
  imageUrl?: string | null;
  description?: string | null;
  ownerId?: string | null;
  owner?: UserSummary | null;
};

export type VaccineRecord = {
  medicalRecordId: string;
  vaccineName: string;
  administeredAt: string;
  nextDueAt: string | null;
};

export type AllergyRecord = {
  medicalRecordId: string;
  allergyName: string;
  reactions: string;
  severity: AllergySeverity;
};

export type MedicalRecord = {
  id: string;
  petId: string;
  recordType: MedicalRecordType;
  createdAt: string;
  updatedAt: string;
  vaccineRecord: VaccineRecord | null;
  allergyRecord: AllergyRecord | null;
};

export type PetDetail = PetSummary & {
  medicalRecords: MedicalRecord[];
};
