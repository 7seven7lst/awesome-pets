import { Link } from "react-router-dom";
import { PetAvatar } from "../PetAvatar";
import { downloadPetMedicalRecordsCsv } from "../../lib/csv";
import { animalTypeLabel } from "../../lib/labels";
import { ROUTES } from "../../lib/routes";
import { btnDanger, btnOutline, card, h1, muted, pill } from "../../lib/ui-styles";
import { formatDate } from "../../lib/timezone";
import type { PetDetail } from "../../types";

export type PetDetailProfileCardProps = {
  pet: PetDetail;
  onRequestDelete: () => void;
};

export function PetDetailProfileCard({ pet, onRequestDelete }: PetDetailProfileCardProps) {
  return (
    <div className={`${card} grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-6`}>
      <div className="flex min-w-0 gap-4 lg:col-start-1 lg:row-start-1">
        <PetAvatar name={pet.name} imageUrl={pet.imageUrl} size={64} />
        <div className="min-w-0 flex-1">
          <h1 className={`${h1} break-words`}>{pet.name}</h1>
          <div className="mt-3 space-y-1.5 text-sm text-zinc-600">
            <div>
              <span className={pill}>{animalTypeLabel(pet.animalType)}</span>
            </div>
            <div>
              Owner: <strong className="text-zinc-700">{pet.owner?.name ?? "Unassigned"}</strong>
            </div>
            <div>DOB: {formatDate(pet.dateOfBirth)}</div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-2 lg:col-start-2 lg:row-start-1 lg:w-auto lg:justify-end">
        <button
          type="button"
          className={`${btnOutline} w-full justify-center sm:min-w-0 sm:flex-1 lg:w-auto lg:flex-initial`}
          onClick={() => void downloadPetMedicalRecordsCsv(pet)}
        >
          Export CSV
        </button>
        <Link
          to={ROUTES.petEdit(pet.id)}
          className={`${btnOutline} inline-flex w-full justify-center no-underline sm:min-w-0 sm:flex-1 lg:w-auto lg:flex-initial`}
        >
          Edit
        </Link>
        <button
          type="button"
          className={`${btnDanger} w-full justify-center sm:min-w-0 sm:flex-1 lg:w-auto lg:flex-initial`}
          onClick={onRequestDelete}
        >
          Delete
        </button>
      </div>

      <div className="border-t border-zinc-200 pt-4 lg:col-span-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Description</p>
        {pet.description ? (
          <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-800">{pet.description}</p>
        ) : (
          <p className={`${muted} mt-2`}>No description added.</p>
        )}
      </div>
    </div>
  );
}
