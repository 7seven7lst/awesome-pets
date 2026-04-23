import { render, screen } from "@testing-library/react";
import { PetMiniSummaryRow } from "./PetMiniSummaryRow";

describe("PetMiniSummaryRow", () => {
  it("renders pet name and animal type label", () => {
    render(<PetMiniSummaryRow name="Rex" animalType="DOG" />);

    expect(screen.getByText("Rex")).toBeInTheDocument();
    expect(screen.getByText("Dog")).toBeInTheDocument();
  });

  it("shows initial when there is no photo", () => {
    render(<PetMiniSummaryRow name="ada" animalType="CAT" />);

    expect(screen.getByText("A")).toBeInTheDocument();
  });
});
