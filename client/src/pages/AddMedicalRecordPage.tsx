import { Link, useNavigate, useParams } from "react-router-dom";
import { SpinnerWithLabel } from "../components/Spinner";
import { AddMedicalRecordForm } from "../components/pet-detail/PetDetailRecordForm";
import { PetMiniSummaryRow } from "../components/pet-detail/PetMiniSummaryRow";
import { usePet } from "../hooks/usePet";
import { ROUTES } from "../lib/routes";
import { banner, card, h1, link, muted, stack } from "../lib/ui-styles";

export function AddMedicalRecordPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pet, loading, error } = usePet(id);

  if (!id) {
    return <div className={banner}>Missing pet id.</div>;
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <SpinnerWithLabel message="Loading…" />
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className={stack}>
        <div className={banner}>{error ?? "Pet not found"}</div>
        <Link to={ROUTES.petList} className={link}>Back to pets</Link>
      </div>
    );
  }

  return (
    <div className={stack}>
      <h1 className={h1}>Add medical record</h1>

      <p className={muted}>
        New record types can be added later by extending the{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800">MedicalRecordType</code>{" "}
        enum and adding a dedicated table, similar to vaccines and allergies.
      </p>

      <div className={`${card} ${stack} gap-6`}>
        <PetMiniSummaryRow name={pet.name} imageUrl={pet.imageUrl} animalType={pet.animalType} />
        <div className="border-t border-zinc-200 pt-6">
          <AddMedicalRecordForm petId={id} onCreated={() => navigate(ROUTES.petDetail(id))} />
        </div>
      </div>
    </div>
  );
}
