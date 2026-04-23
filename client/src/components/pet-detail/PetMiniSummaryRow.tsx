import { memo } from "react";
import { PetAvatar } from "../PetAvatar";
import { animalTypeLabel } from "../../lib/labels";
import { muted } from "../../lib/ui-styles";
import type { AnimalType } from "../../types";

export type PetMiniSummaryRowProps = {
  name: string;
  imageUrl?: string | null;
  animalType: AnimalType;
  avatarSize?: number;
};

export const PetMiniSummaryRow = memo(function PetMiniSummaryRow({
  name,
  imageUrl,
  animalType,
  avatarSize = 48,
}: PetMiniSummaryRowProps) {
  return (
    <div className="flex flex-row items-center gap-4">
      <PetAvatar name={name} imageUrl={imageUrl} size={avatarSize} />
      <div>
        <p className="text-sm font-medium text-zinc-900">{name}</p>
        <p className={muted}>{animalTypeLabel(animalType)}</p>
      </div>
    </div>
  );
});
