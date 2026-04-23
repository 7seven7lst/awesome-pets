import { useEffect, useState } from "react";
import { deletePet, deleteRecord } from "../api";
import { apiError } from "../lib/apiError";
import type { MedicalRecord } from "../types";

type Options = {
  petId: string;
  onPetDeleted: () => void;
  onRecordDeleted: () => void;
};

/**
 * Encapsulates the delete-pet, delete-record, and edit-record UI state
 * that would otherwise bloat PetDetailPage.
 */
export function usePetDetailActions({ petId, onPetDeleted, onRecordDeleted }: Options) {
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletePetOpen, setDeletePetOpen] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);

  useEffect(() => {
    setActionError(null);
  }, [petId]);

  async function confirmDeletePet() {
    try {
      await deletePet(petId);
      setDeletePetOpen(false);
      onPetDeleted();
    } catch (e) {
      setActionError(apiError(e));
      setDeletePetOpen(false);
    }
  }

  async function confirmDeleteRecord() {
    if (!deleteRecordId) return;
    try {
      await deleteRecord(deleteRecordId);
      setDeleteRecordId(null);
      onRecordDeleted();
    } catch (e) {
      setActionError(apiError(e));
      setDeleteRecordId(null);
    }
  }

  return {
    actionError,
    deletePetOpen,
    openDeletePet: () => setDeletePetOpen(true),
    closeDeletePet: () => setDeletePetOpen(false),
    confirmDeletePet,
    deleteRecordId,
    openDeleteRecord: (id: string) => setDeleteRecordId(id),
    closeDeleteRecord: () => setDeleteRecordId(null),
    confirmDeleteRecord,
    editingRecord,
    openEditRecord: (record: MedicalRecord) => setEditingRecord(record),
    closeEditRecord: () => setEditingRecord(null),
  };
}
