/*
  Warnings:

  - The primary key for the `allergy_records` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `allergyName` on the `allergy_records` table. All the data in the column will be lost.
  - You are about to drop the column `medicalRecordId` on the `allergy_records` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `medical_records` table. All the data in the column will be lost.
  - You are about to drop the column `petId` on the `medical_records` table. All the data in the column will be lost.
  - You are about to drop the column `recordType` on the `medical_records` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `medical_records` table. All the data in the column will be lost.
  - You are about to drop the column `animalType` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - The primary key for the `vaccine_records` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `administeredAt` on the `vaccine_records` table. All the data in the column will be lost.
  - You are about to drop the column `medicalRecordId` on the `vaccine_records` table. All the data in the column will be lost.
  - You are about to drop the column `nextDueAt` on the `vaccine_records` table. All the data in the column will be lost.
  - You are about to drop the column `vaccineName` on the `vaccine_records` table. All the data in the column will be lost.
  - Added the required column `allergy_name` to the `allergy_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medical_record_id` to the `allergy_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pet_id` to the `medical_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `record_type` to the `medical_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `medical_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `animal_type` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_of_birth` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `administered_at` to the `vaccine_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medical_record_id` to the `vaccine_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vaccine_name` to the `vaccine_records` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "allergy_records" DROP CONSTRAINT "allergy_records_medicalRecordId_fkey";

-- DropForeignKey
ALTER TABLE "medical_records" DROP CONSTRAINT "medical_records_petId_fkey";

-- DropForeignKey
ALTER TABLE "pets" DROP CONSTRAINT "pets_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "vaccine_records" DROP CONSTRAINT "vaccine_records_medicalRecordId_fkey";

-- DropIndex
DROP INDEX "medical_records_petId_idx";

-- DropIndex
DROP INDEX "medical_records_recordType_idx";

-- DropIndex
DROP INDEX "pets_animalType_idx";

-- DropIndex
DROP INDEX "pets_ownerId_idx";

-- AlterTable
ALTER TABLE "allergy_records" DROP CONSTRAINT "allergy_records_pkey",
DROP COLUMN "allergyName",
DROP COLUMN "medicalRecordId",
ADD COLUMN     "allergy_name" TEXT NOT NULL,
ADD COLUMN     "medical_record_id" UUID NOT NULL,
ADD CONSTRAINT "allergy_records_pkey" PRIMARY KEY ("medical_record_id");

-- AlterTable
ALTER TABLE "medical_records" DROP COLUMN "createdAt",
DROP COLUMN "petId",
DROP COLUMN "recordType",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "pet_id" UUID NOT NULL,
ADD COLUMN     "record_type" "MedicalRecordType" NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "pets" DROP COLUMN "animalType",
DROP COLUMN "createdAt",
DROP COLUMN "dateOfBirth",
DROP COLUMN "imageUrl",
DROP COLUMN "ownerId",
DROP COLUMN "updatedAt",
ADD COLUMN     "animal_type" "AnimalType" NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date_of_birth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "image_url" VARCHAR(512),
ADD COLUMN     "owner_id" UUID,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
DROP COLUMN "passwordHash",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "vaccine_records" DROP CONSTRAINT "vaccine_records_pkey",
DROP COLUMN "administeredAt",
DROP COLUMN "medicalRecordId",
DROP COLUMN "nextDueAt",
DROP COLUMN "vaccineName",
ADD COLUMN     "administered_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "medical_record_id" UUID NOT NULL,
ADD COLUMN     "next_due_at" TIMESTAMP(3),
ADD COLUMN     "vaccine_name" TEXT NOT NULL,
ADD CONSTRAINT "vaccine_records_pkey" PRIMARY KEY ("medical_record_id");

-- CreateIndex
CREATE INDEX "medical_records_pet_id_idx" ON "medical_records"("pet_id");

-- CreateIndex
CREATE INDEX "medical_records_record_type_idx" ON "medical_records"("record_type");

-- CreateIndex
CREATE INDEX "pets_animal_type_idx" ON "pets"("animal_type");

-- CreateIndex
CREATE INDEX "pets_owner_id_idx" ON "pets"("owner_id");

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vaccine_records" ADD CONSTRAINT "vaccine_records_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "medical_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allergy_records" ADD CONSTRAINT "allergy_records_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "medical_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;
