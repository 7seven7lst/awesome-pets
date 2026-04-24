import { z } from "zod";
enum  AnimalType {
  DOG = 'DOG',
  CAT = 'CAT',
  BIRD = 'BIRD',
  RABBIT = 'RABBIT',
  OTHER = 'OTHER'
}

export const ANIMAL_TYPES = Object.values(AnimalType);
const AnimalTypeZ = z.enum(AnimalType);
const isoDateTimeZ = z.string().datetime({ offset: true });

const petCoreSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(20_000).nullable().optional(),
  animalType: AnimalTypeZ,
  dateOfBirth: isoDateTimeZ,
  ownerId: z.uuid().nullable().optional(),
});

function refineDateOfBirthNotFuture(dateOfBirthIso: string, ctx: z.RefinementCtx) {
  const date = new Date(dateOfBirthIso);
  if (Number.isNaN(date.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Date of birth must be a valid ISO datetime",
      path: ["dateOfBirth"],
    });
    return;
  }
  if (date.getTime() > Date.now()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Date of birth cannot be in the future",
      path: ["dateOfBirth"],
    });
  }
}

export const petCreateApiSchema = petCoreSchema
  .superRefine((data, ctx) => refineDateOfBirthNotFuture(data.dateOfBirth, ctx));

const petUpdateFieldsSchema = z.object({
  name: petCoreSchema.shape.name.optional(),
  description: petCoreSchema.shape.description.optional(),
  animalType: petCoreSchema.shape.animalType.optional(),
  dateOfBirth: petCoreSchema.shape.dateOfBirth.optional(),
  ownerId: petCoreSchema.shape.ownerId.optional(),
});

export const petUpdateApiSchema = petUpdateFieldsSchema.superRefine((data, ctx) => {
  if (data.dateOfBirth === undefined) return;
  refineDateOfBirthNotFuture(data.dateOfBirth, ctx);
});

function normalizeOwnerId(o: Record<string, unknown>) {
  if (typeof o.ownerId === "string" && o.ownerId.trim() === "") {
    o.ownerId = null;
  }
}

function toLocalMidnightIso(raw: unknown): unknown {
  if (typeof raw !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const [year, month, day] = raw.split("-").map((n) => Number.parseInt(n, 10));
  return new Date(year, month - 1, day).toISOString();
}

/** Client RHF: normalize owner id and convert date input to ISO datetime. */
export const petCreateFormSchema = z.preprocess((val) => {
  if (typeof val !== "object" || val === null) return val;
  const o = { ...(val as Record<string, unknown>) };
  normalizeOwnerId(o);
  return { ...o, dateOfBirth: toLocalMidnightIso(o.dateOfBirth) };
}, petCreateApiSchema);

/** Client RHF: normalize owner id and convert date input to ISO datetime. */
export const petUpdateFormSchema = z.preprocess((val) => {
  if (typeof val !== "object" || val === null) return val;
  const o = { ...(val as Record<string, unknown>) };
  normalizeOwnerId(o);
  return { ...o, dateOfBirth: toLocalMidnightIso(o.dateOfBirth) };
}, petUpdateApiSchema);
