import { UserRole } from "@/generated/prisma/browser";
import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/types/session-user";
import PetService from "./pet.service";

jest.mock("@/lib/pet-image-upload", () => ({
  savePetUploadedImageBuffer: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    pet: {
      findUnique: jest.fn(),
    },
  },
}));

const findUniqueMock = prisma.pet.findUnique as jest.Mock;

const ownerUser: SessionUser = {
  id: "owner-1",
  name: "Owner",
  email: "owner@example.com",
  role: UserRole.OWNER,
  createdAt: new Date("2024-01-01"),
};

const adminUser: SessionUser = {
  id: "admin-1",
  name: "Admin",
  email: "admin@example.com",
  role: UserRole.ADMIN,
  createdAt: new Date("2024-01-01"),
};

describe("PetService.getPetById", () => {
  beforeEach(() => {
    findUniqueMock.mockReset();
  });

  it("throws 404 when the pet does not exist", async () => {
    findUniqueMock.mockResolvedValueOnce(null);

    await expect(PetService.getPetById(ownerUser, "pet-missing")).rejects.toMatchObject({
      message: "Pet not found",
      statusCode: 404,
    });

    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { id: "pet-missing" },
      include: {
        owner: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  });

  it("throws 403 when the pet exists but belongs to another user", async () => {
    findUniqueMock.mockResolvedValueOnce({
      id: "pet-1",
      name: "Rex",
      ownerId: "other-owner",
      owner: { id: "other-owner", name: "Other", email: "other@example.com", role: UserRole.OWNER },
    });

    await expect(PetService.getPetById(ownerUser, "pet-1")).rejects.toMatchObject({
      message: "Forbidden",
      statusCode: 403,
    });
  });

  it("returns the pet when the owner accesses their own pet", async () => {
    const row = {
      id: "pet-1",
      name: "Rex",
      animalType: "DOG",
      dateOfBirth: new Date("2020-01-01"),
      ownerId: ownerUser.id,
      owner: { id: ownerUser.id, name: ownerUser.name, email: ownerUser.email, role: ownerUser.role },
    };
    findUniqueMock.mockResolvedValueOnce(row);

    const result = await PetService.getPetById(ownerUser, "pet-1");

    expect(result).toEqual(row);
  });

  it("returns the pet for an admin regardless of ownership", async () => {
    const row = {
      id: "pet-1",
      name: "Rex",
      animalType: "DOG",
      dateOfBirth: new Date("2020-01-01"),
      ownerId: "some-other-owner",
      owner: { id: "some-other-owner", name: "Other", email: "other@example.com", role: UserRole.OWNER },
    };
    findUniqueMock.mockResolvedValueOnce(row);

    const result = await PetService.getPetById(adminUser, "pet-1");

    expect(result).toEqual(row);
  });
});
