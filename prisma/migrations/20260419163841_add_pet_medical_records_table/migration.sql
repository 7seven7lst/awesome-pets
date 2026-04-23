-- CreateEnum
CREATE TYPE "MedicalRecordType" AS ENUM ('VACCINE', 'ALLERGY');

-- CreateEnum
CREATE TYPE "AllergySeverity" AS ENUM ('MILD', 'SEVERE');

-- CreateTable
CREATE TABLE "medical_records" (
    "id" UUID NOT NULL,
    "petId" UUID NOT NULL,
    "recordType" "MedicalRecordType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vaccine_records" (
    "medicalRecordId" UUID NOT NULL,
    "vaccineName" TEXT NOT NULL,
    "administeredAt" TIMESTAMP(3) NOT NULL,
    "nextDueAt" TIMESTAMP(3),

    CONSTRAINT "vaccine_records_pkey" PRIMARY KEY ("medicalRecordId")
);

-- CreateTable
CREATE TABLE "allergy_records" (
    "medicalRecordId" UUID NOT NULL,
    "allergyName" TEXT NOT NULL,
    "reactions" TEXT NOT NULL,
    "severity" "AllergySeverity" NOT NULL,

    CONSTRAINT "allergy_records_pkey" PRIMARY KEY ("medicalRecordId")
);

-- CreateIndex
CREATE INDEX "medical_records_petId_idx" ON "medical_records"("petId");

-- CreateIndex
CREATE INDEX "medical_records_recordType_idx" ON "medical_records"("recordType");

-- AddForeignKey
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccine_records" ADD CONSTRAINT "vaccine_records_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "medical_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allergy_records" ADD CONSTRAINT "allergy_records_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "medical_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;
