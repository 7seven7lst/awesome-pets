import { Link } from "react-router-dom";
import type { DashboardUpcomingVaccineRow } from "../../api";
import { ROUTES } from "../../lib/routes";
import { PetAvatar } from "../PetAvatar";
import { SpinnerInline } from "../Spinner";
import { PaginationBar } from "../PaginationBar";
import { animalTypeLabel } from "../../lib/labels";
import { card, h2, link, muted, table, tableWrap, td, th } from "../../lib/ui-styles";
import { DashboardErrorAlert } from "./DashboardErrorAlert";
import { formatDate } from "../../lib/timezone";
import type { AnimalType } from "../../types";

export type DashboardUpcomingDosesPayload = {
  vaccines: DashboardUpcomingVaccineRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type DashboardUpcomingDosesListProps = {
  payload: DashboardUpcomingDosesPayload | null;
  loading: boolean;
  error: string | null;
  onPageChange: (page: number) => void;
};

export function DashboardUpcomingDosesList({
  payload,
  loading,
  error,
  onPageChange,
}: DashboardUpcomingDosesListProps) {
  const total = payload?.total ?? 0;
  const rangeStart = payload ? (payload.page - 1) * payload.pageSize + 1 : 0;
  const rangeEnd = payload ? Math.min(payload.page * payload.pageSize, total) : 0;

  return (
    <div className={card}>
      <h2 className={h2}>Upcoming doses (list)</h2>
      <DashboardErrorAlert message={error} className="mt-2" />
      {loading ? <SpinnerInline message="Loading list…" className="mt-3" /> : null}
      {!loading && !error && payload !== null && total === 0 ? (
        <p className={`${muted} mt-2`}>No rows in this window.</p>
      ) : payload !== null && total > 0 ? (
        <>
          <p className={`${muted} mt-2`}>
            Showing {rangeStart}–{rangeEnd} of {total}
          </p>
          <div className={`${tableWrap} mt-3 ${loading ? "opacity-60" : ""}`}>
            <table className={table}>
              <thead>
                <tr>
                  <th className={th}>Pet</th>
                  <th className={th}>Type</th>
                  <th className={th}>Vaccine</th>
                  <th className={th}>Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white">
                {payload.vaccines.map((v) => (
                  <tr key={v.medicalRecordId}>
                    <td className={td}>
                      <div className="flex min-w-0 items-center gap-3">
                        <PetAvatar
                          name={v.medicalRecord.pet.name}
                          imageUrl={v.medicalRecord.pet.imageUrl}
                          size={36}
                        />
                        <Link to={ROUTES.petDetail(v.medicalRecord.pet.id)} className={`${link} min-w-0 truncate`}>
                          {v.medicalRecord.pet.name}
                        </Link>
                      </div>
                    </td>
                    <td className={td}>{animalTypeLabel(v.medicalRecord.pet.animalType as AnimalType)}</td>
                    <td className={td}>{v.vaccineName}</td>
                    <td className={td}>{v.nextDueAt ? formatDate(v.nextDueAt) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationBar
            currentPage={payload.page}
            totalPages={payload.totalPages}
            ariaLabel="Upcoming vaccine pages"
            onPageChange={onPageChange}
          />
        </>
      ) : null}
    </div>
  );
}
