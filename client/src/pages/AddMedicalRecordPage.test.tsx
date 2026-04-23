import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { usePet } from "../hooks/usePet";
import type { PetDetail } from "../types";
import { AddMedicalRecordPage } from "./AddMedicalRecordPage";

jest.mock("../hooks/usePet");
jest.mock("../components/pet-detail/PetDetailRecordForm", () => ({
  AddMedicalRecordForm: () => <div data-testid="add-record-form">form</div>,
}));
jest.mock("../components/pet-detail/PetMiniSummaryRow", () => ({
  PetMiniSummaryRow: () => <div data-testid="pet-mini">mini</div>,
}));

const mockedUsePet = jest.mocked(usePet);

const pet: PetDetail = {
  id: "p1",
  name: "Rex",
  animalType: "DOG",
  dateOfBirth: "2020-01-01",
  medicalRecords: [],
};

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/pets/:id/records/new" element={<AddMedicalRecordPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("AddMedicalRecordPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state", () => {
    mockedUsePet.mockReturnValue({
      pet: null,
      loading: true,
      error: null,
      refetch: jest.fn(),
    });

    renderAt("/pets/p1/records/new");

    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("shows error when pet cannot be loaded", () => {
    mockedUsePet.mockReturnValue({
      pet: null,
      loading: false,
      error: "Not found",
      refetch: jest.fn(),
    });

    renderAt("/pets/p1/records/new");

    expect(screen.getByText("Not found")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to pets/i })).toBeInTheDocument();
  });

  it("renders heading and form when pet is ready", () => {
    mockedUsePet.mockReturnValue({
      pet,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    renderAt("/pets/p1/records/new");

    expect(screen.getByRole("heading", { name: /add medical record/i })).toBeInTheDocument();
    expect(screen.getByTestId("pet-mini")).toBeInTheDocument();
    expect(screen.getByTestId("add-record-form")).toBeInTheDocument();
  });
});
