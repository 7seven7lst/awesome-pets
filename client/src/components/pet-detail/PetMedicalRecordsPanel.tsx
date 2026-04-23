import { MedicalRecordType as MedicalRecordTypeEnum } from "@novellia/shared/prisma/browser";
import { Link } from "react-router-dom";
import { ROUTES } from "../../lib/routes";
import type {
  PetMedicalRecordsPayload,
  PetMedicalRecordsRecordFilter,
} from "../../hooks/usePetMedicalRecords";
import { SpinnerInline } from "../Spinner";
import { PaginationBar } from "../PaginationBar";
import { recordTypeLabel, severityLabel } from "../../lib/labels";
import {
  banner,
  btnDanger,
  btnOutline,
  btnPrimary,
  card,
  field,
  h2,
  label,
  muted,
  row,
  stack,
  table,
  tableWrap,
  td,
  th,
} from "../../lib/ui-styles";
import { formatDate } from "../../lib/timezone";
import type { MedicalRecord } from "../../types";

export type PetMedicalRecordsPanelProps = {
  petId: string;
  pageSize: number;
  payload: PetMedicalRecordsPayload | null;
  loading: boolean;
  error: string | null;
  recordFilter: PetMedicalRecordsRecordFilter;
  setRecordFilter: (value: PetMedicalRecordsRecordFilter) => void;
  onPageChange: (page: number) => void;
  onEditRecord: (record: MedicalRecord) => void;
  onDeleteRecord: (recordId: string) => void;
};

export function PetMedicalRecordsPanel({
  petId,
  pageSize,
  payload,
  loading,
  error,
  recordFilter,
  setRecordFilter,
  onPageChange,
  onEditRecord,
  onDeleteRecord,
}: PetMedicalRecordsPanelProps) {
  const recordPagination = payload ?? {
    total: 0,
    page: 1,
    pageSize,
    totalPages: 1,
  };
  const rangeStart =
    payload && payload.total > 0 ? (payload.page - 1) * payload.pageSize + 1 : 0;
  const rangeEnd = payload ? Math.min(payload.page * payload.pageSize, payload.total) : 0;
  const pagedRecords = payload?.medicalRecords ?? [];

  return (
    <div className={`${card} ${stack}`}>
      <div className={`${row} flex-wrap items-start justify-between gap-4`}>
        <h2 className={h2}>Medical records</h2>
        <div className={`${row} flex-wrap items-end gap-3`}>
          <Link to={ROUTES.petRecordNew(petId)} className={`${btnPrimary} no-underline`}>
            Add medical record
          </Link>
          <label className={`${label} ${row} items-end gap-2 text-sm`}>
            <span className={muted}>Filter</span>
            <select
              className={`${field} w-auto min-w-[140px]`}
              value={recordFilter}
              onChange={(e) => setRecordFilter(e.target.value as PetMedicalRecordsRecordFilter)}
            >
              <option value="">All</option>
              <option value={MedicalRecordTypeEnum.VACCINE}>Vaccines</option>
              <option value={MedicalRecordTypeEnum.ALLERGY}>Allergies</option>
            </select>
          </label>
        </div>
      </div>

      {error ? <div className={banner}>{error}</div> : null}
      {loading ? <SpinnerInline message="Updating records…" className="mt-2" /> : null}

      {recordPagination.total === 0 && !loading && !error ? (
        <p className={muted}>No records for this filter.</p>
      ) : (
        <>
          <p className={muted}>
            Showing {rangeStart}–{rangeEnd} of {recordPagination.total}
          </p>
          <div className={`${tableWrap} ${loading ? "opacity-60" : ""}`}>
            <table className={table}>
              <thead>
                <tr>
                  <th className={th}>Type</th>
                  <th className={th}>Details</th>
                  <th className={`${th} w-52`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white">
                {pagedRecords.map((r) => (
                  <tr key={r.id}>
                    <td className={td}>{recordTypeLabel(r.recordType)}</td>
                    <td className={td}>
                      {r.recordType === MedicalRecordTypeEnum.VACCINE && r.vaccineRecord ? (
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="font-medium text-zinc-900">{r.vaccineRecord.vaccineName}</div>
                          <div className={muted}>
                            Administered {formatDate(r.vaccineRecord.administeredAt)}
                            {r.vaccineRecord.nextDueAt ? (
                              <> · Next due {formatDate(r.vaccineRecord.nextDueAt)}</>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                      {r.recordType === MedicalRecordTypeEnum.ALLERGY && r.allergyRecord ? (
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="font-medium text-zinc-900">
                            {r.allergyRecord.allergyName} ({severityLabel(r.allergyRecord.severity)})
                          </div>
                          <div className={muted}>{r.allergyRecord.reactions}</div>
                        </div>
                      ) : null}
                    </td>
                    <td className={td}>
                      <div className={`${row} gap-2`}>
                        <button type="button" className={btnOutline} onClick={() => onEditRecord(r)}>
                          Edit
                        </button>
                        <button type="button" className={btnDanger} onClick={() => onDeleteRecord(r.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationBar
            currentPage={recordPagination.page}
            totalPages={recordPagination.totalPages}
            ariaLabel="Medical record pages"
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
}
