import { renderHook, waitFor } from "@testing-library/react";
import { getPet } from "../api";
import type { PetDetail } from "../types";
import { usePet } from "./usePet";

jest.mock("../api");

const mockedGetPet = jest.mocked(getPet);

const samplePet: PetDetail = {
  id: "p1",
  name: "Rex",
  animalType: "DOG",
  dateOfBirth: "2020-01-01",
  medicalRecords: [],
};

describe("usePet", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("stays idle when petId is undefined", () => {
    const { result } = renderHook(() => usePet(undefined));

    expect(result.current.loading).toBe(false);
    expect(result.current.pet).toBeNull();
    expect(result.current.error).toBeNull();
    expect(mockedGetPet).not.toHaveBeenCalled();
  });

  it("loads pet when petId is set", async () => {
    mockedGetPet.mockResolvedValueOnce(samplePet);

    const { result } = renderHook(() => usePet("p1"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.pet).toEqual(samplePet);
    expect(result.current.error).toBeNull();
    expect(mockedGetPet).toHaveBeenCalledWith("p1");
  });

  it("surfaces errors from getPet", async () => {
    mockedGetPet.mockRejectedValueOnce(new Error("boom"));

    const { result } = renderHook(() => usePet("p1"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.pet).toBeNull();
    expect(result.current.error).toBe("boom");
  });
});
