import { Link } from "react-router-dom";
import type { PetListMeta } from "../../hooks/usePetList";
import { PaginationBar } from "../PaginationBar";
import { QueryState } from "../QueryState";
import { PetAvatar } from "../PetAvatar";
import { animalTypeLabel } from "../../lib/labels";
import { ROUTES } from "../../lib/routes";
import { link, muted, pill, table, tableWrap, td, th } from "../../lib/ui-styles";
import { formatDate } from "../../lib/timezone";
import type { PetSummary } from "../../types";

export type PetListResultsProps = {
  pets: PetSummary[];
  listMeta: PetListMeta;
  loading: boolean;
  error: string | null;
  onPageChange: (page: number) => void;
};

export function PetListResults({ pets, listMeta, loading, error, onPageChange }: PetListResultsProps) {
  const rangeStart = (listMeta.page - 1) * listMeta.pageSize + 1;
  const rangeEnd = Math.min(listMeta.page * listMeta.pageSize, listMeta.total);

  return (
    <QueryState
      loading={loading}
      loadingText="Loading pets…"
      error={error}
      empty={listMeta.total === 0}
      emptyText="No pets match your filters."
    >
      <>
        <p className={muted}>
          Showing {rangeStart}–{rangeEnd} of {listMeta.total}
        </p>
        <div className={tableWrap}>
          <table className={table}>
            <thead>
              <tr>
                <th className={`${th} w-14`} />
                <th className={th}>Name</th>
                <th className={th}>Type</th>
                <th className={th}>Owner</th>
                <th className={th}>Date of birth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white">
              {pets.map((p) => (
                <tr key={p.id}>
                  <td className={td}>
                    <PetAvatar name={p.name} imageUrl={p.imageUrl} size={40} />
                  </td>
                  <td className={td}>
                    <Link to={ROUTES.petDetail(p.id)} className={link}>
                      {p.name}
                    </Link>
                  </td>
                  <td className={td}>
                    <span className={pill}>{animalTypeLabel(p.animalType)}</span>
                  </td>
                  <td className={td}>{p.owner?.name ?? "—"}</td>
                  <td className={td}>{formatDate(p.dateOfBirth)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationBar
          currentPage={listMeta.page}
          totalPages={listMeta.totalPages}
          ariaLabel="Pet list pages"
          onPageChange={onPageChange}
        />
      </>
    </QueryState>
  );
}
