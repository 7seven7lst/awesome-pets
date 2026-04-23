import { Link } from "react-router-dom";
import { ROUTES } from "../../lib/routes";
import { h1, linkMuted, muted, row } from "../../lib/ui-styles";
import { formatDate } from "../../lib/timezone";

export type PetFormPageHeaderProps = {
  mode: "create" | "edit";
  petId: string | undefined;
  watchedDateOfBirth: string;
};

export function PetFormPageHeader({ mode, petId, watchedDateOfBirth }: PetFormPageHeaderProps) {
  return (
    <>
      <div className={`${row} justify-between`}>
        <h1 className={h1}>{mode === "create" ? "Add pet" : "Edit pet"}</h1>
        {mode === "edit" && petId ? (
          <Link className={linkMuted} to={ROUTES.petDetail(petId)}>
            Back to profile
          </Link>
        ) : (
          <Link className={linkMuted} to={ROUTES.petList}>
            Back to list
          </Link>
        )}
      </div>

      {mode === "edit" && petId ? (
        <p className={muted}>
          Current DOB display:{" "}
          <strong className="text-zinc-700">
            {watchedDateOfBirth ? formatDate(watchedDateOfBirth) : "—"}
          </strong>
        </p>
      ) : (
        <p className={muted}>Date values are converted to ISO datetime before submit.</p>
      )}
    </>
  );
}
