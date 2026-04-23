import { Link, useNavigate, useParams } from "react-router-dom";
import { PetDetailEditRecordDialog } from "../components/pet-detail/PetDetailEditRecordDialog";
import { PetDetailProfileCard } from "../components/pet-detail/PetDetailProfileCard";
import { PetMedicalRecordsPanel } from "../components/pet-detail/PetMedicalRecordsPanel";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { SpinnerWithLabel } from "../components/Spinner";
import { usePet } from "../hooks/usePet";
import { usePetDetailActions } from "../hooks/usePetDetailActions";
import { usePetMedicalRecords } from "../hooks/usePetMedicalRecords";
import { banner, link, stack } from "../lib/ui-styles";
import { ROUTES } from "../lib/routes";

export function PetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pet, loading, error: petLoadError } = usePet(id);
  const records = usePetMedicalRecords(id);
  const actions = usePetDetailActions({
    petId: id ?? "",
    onPetDeleted: () => navigate(ROUTES.petList),
    onRecordDeleted: () => void records.refetch(),
  });

  if (!id) {
    return <div className={banner}>Missing pet id.</div>;
  }

  if (loading && !pet) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <SpinnerWithLabel message="Loading pet…" />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className={stack}>
        <div className={banner}>{petLoadError ?? "Pet not found"}</div>
        <Link to={ROUTES.petList} className={link}>Back to pets</Link>
      </div>
    );
  }

  return (
    <div className={stack}>
      {actions.actionError ? <div className={banner}>{actions.actionError}</div> : null}

      <PetDetailProfileCard pet={pet} onRequestDelete={actions.openDeletePet} />

      <PetMedicalRecordsPanel
        petId={pet.id}
        pageSize={records.pageSize}
        payload={records.payload}
        loading={records.loading}
        error={records.error}
        recordFilter={records.recordFilter}
        setRecordFilter={records.setRecordFilter}
        onPageChange={records.setPage}
        onEditRecord={actions.openEditRecord}
        onDeleteRecord={actions.openDeleteRecord}
      />

      <ConfirmDialog
        open={actions.deletePetOpen}
        title="Delete this pet?"
        body="This will permanently delete the pet and all of its medical records."
        danger
        onCancel={actions.closeDeletePet}
        onConfirm={actions.confirmDeletePet}
      />

      <ConfirmDialog
        open={Boolean(actions.deleteRecordId)}
        title="Delete this record?"
        body="This action cannot be undone."
        danger
        onCancel={actions.closeDeleteRecord}
        onConfirm={actions.confirmDeleteRecord}
      />

      <PetDetailEditRecordDialog
        record={actions.editingRecord}
        onDismiss={actions.closeEditRecord}
        onSaved={() => void records.refetch()}
      />
    </div>
  );
}
