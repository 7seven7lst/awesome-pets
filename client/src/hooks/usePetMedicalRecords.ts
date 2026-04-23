import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { getMedicalRecordsByPetId } from "../api";
import { apiError } from "../lib/apiError";
import { MEDICAL_RECORDS_PAGE_SIZE } from "../lib/pagination";
import type { MedicalRecord, MedicalRecordType } from "../types";

export type PetMedicalRecordsPayload = {
  medicalRecords: MedicalRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type PetMedicalRecordsRecordFilter = "" | MedicalRecordType;

export function usePetMedicalRecords(
  petId: string | undefined,
  options: { pageSize?: number } = {},
) {
  const pageSize = options.pageSize ?? MEDICAL_RECORDS_PAGE_SIZE;

  const [page, setPage] = useState(1);
  const [recordFilter, setRecordFilterState] = useState<PetMedicalRecordsRecordFilter>("");

  const [payload, setPayload] = useState<PetMedicalRecordsPayload | null>(null);
  const [loading, setLoading] = useState(Boolean(petId));
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    setPage(1);
    setRecordFilterState("");
  }, [petId]);

  const setRecordFilter = useCallback((value: PetMedicalRecordsRecordFilter) => {
    setRecordFilterState(value);
    setPage(1);
  }, []);

  const refetch = useCallback(async () => {
    if (!petId) {
      setPayload(null);
      setLoading(false);
      setError(null);
      return;
    }
    setPayload(null);
    setLoading(true);
    setError(null);
    try {
      const r = await getMedicalRecordsByPetId(petId, {
        page,
        pageSize,
        recordType: recordFilter || undefined,
      });
      setPayload(r);
      if (r.page !== page) {
        setPage(r.page);
      }
    } catch (e) {
      setError(apiError(e));
      setPayload(null);
    } finally {
      setLoading(false);
    }
  }, [petId, page, pageSize, recordFilter]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return {
    payload,
    loading,
    error,
    refetch,
    page,
    setPage,
    recordFilter,
    setRecordFilter,
    pageSize,
  };
}
