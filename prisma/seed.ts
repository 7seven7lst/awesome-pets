import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../server/src/generated/prisma/client.js";
import type { AnimalType } from "../server/src/generated/prisma/browser.js";
import { Pool } from "pg";
import { hashSaltPassword } from "../server/src/lib/password.js";

/** Marks seeded pets so re-running seed can replace fixture data safely. */
const SEED_PET_DESCRIPTION = "seed:fixture";

const ANIMAL_TYPES: AnimalType[] = ["DOG", "CAT", "BIRD", "RABBIT", "OTHER"];

const TEST_OWNERS = [
  { email: "owner@novellia.test", name: "Jamie Rivera" },
  { email: "owner2@novellia.test", name: "Alex Chen" },
  { email: "owner3@novellia.test", name: "Sam Patel" },
  { email: "owner4@novellia.test", name: "Riley Brooks" },
  { email: "owner5@novellia.test", name: "Jordan Lee" },
] as const;

const PETS_PER_OWNER = 11;
const MEDICAL_RECORDS_PER_PET = 11;

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required to run the seed.");
  }

  const pool = new Pool({ connectionString });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const passwordHash = await hashSaltPassword("password");

    await prisma.user.upsert({
      where: { email: "admin@novellia.test" },
      update: { name: "Demo Admin", passwordHash, role: "ADMIN" },
      create: {
        email: "admin@novellia.test",
        name: "Demo Admin",
        passwordHash,
        role: "ADMIN",
      },
    });

    for (const owner of TEST_OWNERS) {
      await prisma.user.upsert({
        where: { email: owner.email },
        update: { name: owner.name, passwordHash, role: "OWNER" },
        create: {
          email: owner.email,
          name: owner.name,
          passwordHash,
          role: "OWNER",
        },
      });
    }

    await prisma.pet.deleteMany({
      where: { description: SEED_PET_DESCRIPTION },
    });

    const owners = await prisma.user.findMany({
      where: { email: { in: [...TEST_OWNERS.map((o) => o.email)] } },
      select: { id: true, email: true },
    });
    const idByEmail = new Map(owners.map((o) => [o.email, o.id]));
    const ownerIds = TEST_OWNERS.map((o) => {
      const id = idByEmail.get(o.email);
      if (!id) throw new Error(`Missing seeded owner: ${o.email}`);
      return id;
    });

    const pets: Awaited<ReturnType<typeof prisma.pet.create>>[] = [];
    let petIndex = 0;
    for (let o = 0; o < ownerIds.length; o++) {
      const ownerId = ownerIds[o]!;
      for (let p = 0; p < PETS_PER_OWNER; p++) {
        petIndex += 1;
        const i = petIndex - 1;
        const pet = await prisma.pet.create({
          data: {
            name: `Seed Pet ${String(petIndex).padStart(3, "0")}`,
            description: SEED_PET_DESCRIPTION,
            animalType: ANIMAL_TYPES[i % ANIMAL_TYPES.length]!,
            dateOfBirth: new Date(Date.UTC(2020 + (i % 4), (i % 12) + 1, 5)),
            ownerId,
          },
        });
        pets.push(pet);
      }
    }

    for (const pet of pets) {
      await prisma.$transaction(async (tx) => {
        const db = tx as PrismaClient;
        for (let i = 0; i < MEDICAL_RECORDS_PER_PET; i++) {
          const isVaccine = i % 2 === 0;
          if (isVaccine) {
            const base = await db.medicalRecord.create({
              data: { petId: pet.id, recordType: "VACCINE" },
            });
            await db.vaccineRecord.create({
              data: {
                medicalRecordId: base.id,
                vaccineName: `Seed vaccine ${i + 1}`,
                administeredAt: new Date(Date.UTC(2022 + (i % 3), (i % 12) + 1, 10)),
                nextDueAt: i % 3 === 0 ? new Date(Date.UTC(2026, (i % 12) + 1, 20)) : null,
              },
            });
          } else {
            const base = await db.medicalRecord.create({
              data: { petId: pet.id, recordType: "ALLERGY" },
            });
            await db.allergyRecord.create({
              data: {
                medicalRecordId: base.id,
                allergyName: `Seed allergy ${i + 1}`,
                reactions: i % 2 === 1 ? "Mild itching" : "Digestive upset",
                severity: i % 4 === 1 ? "SEVERE" : "MILD",
              },
            });
          }
        }
      });
    }

    const totalPets = ownerIds.length * PETS_PER_OWNER;
    const recordCount = totalPets * MEDICAL_RECORDS_PER_PET;
    console.log(
      `Seed OK: admin + ${TEST_OWNERS.length} owners (password: password), ${PETS_PER_OWNER} pets each (${totalPets} total), ${MEDICAL_RECORDS_PER_PET} medical records per pet (${recordCount} total).`,
    );
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
