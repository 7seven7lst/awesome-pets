import type { FormEvent } from "react";
import { AnimalType as AnimalTypeEnum } from "@novellia/shared/prisma/browser";
import { animalTypeLabel } from "../../lib/labels";
import { btnOutline, card, field, row } from "../../lib/ui-styles";
import type { AnimalType } from "../../types";

const ANIMAL_TYPES: AnimalType[] = Object.values(AnimalTypeEnum);

export type PetListFilterCardProps = {
  nameDraft: string;
  onNameDraftChange: (value: string) => void;
  onSearchSubmit: (e: FormEvent<HTMLFormElement>) => void;
  animalType: AnimalType | "";
  onAnimalTypeChange: (value: AnimalType | "") => void;
};

export function PetListFilterCard({
  nameDraft,
  onNameDraftChange,
  onSearchSubmit,
  animalType,
  onAnimalTypeChange,
}: PetListFilterCardProps) {
  return (
    <div className={`${card} ${row} items-end gap-4`}>
      <form
        className="min-w-[200px] flex-1 flex flex-col gap-1.5"
        onSubmit={onSearchSubmit}
      >
        <label htmlFor="pet-list-name-search" className="text-sm font-medium text-zinc-700">
          Search by name
        </label>
        <div className={`${row} gap-2`}>
          <input
            id="pet-list-name-search"
            className={`${field} min-w-0 flex-1`}
            value={nameDraft}
            onChange={(e) => onNameDraftChange(e.target.value)}
            placeholder="e.g. Luna"
            autoComplete="off"
          />
          <button type="submit" className={`${btnOutline} shrink-0`}>
            Search
          </button>
        </div>
      </form>
      <label className="w-full max-w-[200px] flex flex-col gap-1.5 text-sm font-medium text-zinc-700">
        Animal type
        <select
          className={field}
          value={animalType}
          onChange={(e) => onAnimalTypeChange(e.target.value as AnimalType | "")}
        >
          <option value="">All</option>
          {ANIMAL_TYPES.map((t) => (
            <option key={t} value={t}>
              {animalTypeLabel(t)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
