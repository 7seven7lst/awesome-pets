import type { ChangeEvent, FormEventHandler } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Link } from "react-router-dom";
import { Spinner } from "../Spinner";
import { ANIMAL_TYPES, petCreateApiSchema } from "@novellia/shared/schema/pet";
import type { z } from "zod";
import { PetAvatar } from "../PetAvatar";
import { FieldError } from "../../lib/field-error";
import { animalTypeLabel } from "../../lib/labels";
import { PET_IMAGE_MAX_LABEL } from "../../lib/pet-image-limits";
import {
  btnPrimary,
  card,
  field,
  label,
  link,
  muted,
  row,
  stack,
  textarea,
} from "../../lib/ui-styles";
import type { UserSummary } from "../../types";

export type PetEditorFormValues = z.infer<typeof petCreateApiSchema>;

export type PetEditorFormProps = {
  mode: "create" | "edit";
  petId: string | undefined;
  form: UseFormReturn<PetEditorFormValues>;
  isAdmin: boolean;
  users: UserSummary[];
  photo: File | null;
  previewUrl: string | null;
  savedImageUrl: string | null;
  onPhotoInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export function PetEditorForm({
  mode,
  petId,
  form,
  isAdmin,
  users,
  photo,
  previewUrl,
  savedImageUrl,
  onPhotoInputChange,
  onSubmit,
}: PetEditorFormProps) {
  const { register, watch, formState } = form;
  const { errors, isSubmitting } = formState;
  const displayName = watch("name").trim() || "Pet";

  return (
    <form className={`${card} ${stack}`} onSubmit={onSubmit} noValidate>
      <div className={`${row} items-start gap-4`}>
        <PetAvatar name={displayName} imageUrl={previewUrl ?? savedImageUrl} size={64} />
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm font-medium text-zinc-700">Photo (optional)</p>
          <input
            className={`${field} w-60 cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-200`}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onPhotoInputChange}
          />
          <p className="text-xs text-zinc-500">JPEG, PNG, or WebP · max {PET_IMAGE_MAX_LABEL}</p>
        </div>
      </div>

      <label className={label}>
        Name
        <input className={field} {...register("name")} maxLength={100} />
        <FieldError message={errors.name?.message} />
      </label>

      <label className={label}>
        Animal type
        <select className={field} {...register("animalType")}>
          {ANIMAL_TYPES.map((t) => (
            <option key={t} value={t}>
              {animalTypeLabel(t)}
            </option>
          ))}
        </select>
        <FieldError message={errors.animalType?.message} />
      </label>

      {isAdmin ? (
        <label className={label}>
          Owner
          <select className={field} {...register("ownerId")}>
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
          <FieldError message={errors.ownerId?.message} />
        </label>
      ) : (
        <p className={muted}>Pets you create are assigned to you as the owner.</p>
      )}

      <label className={label}>
        Date of birth
        <input className={field} type="date" {...register("dateOfBirth")} />
        <FieldError message={errors.dateOfBirth?.message} />
      </label>

      <label className={label}>
        Description (optional)
        <textarea className={textarea} {...register("description")} maxLength={20000} />
        <FieldError message={errors.description?.message} />
      </label>

      {photo ? (
        <p className={muted}>
          New photo selected: <strong className="text-zinc-800">{photo.name}</strong> (uploads when you save)
        </p>
      ) : null}

      <div className={`${row} gap-3 pt-2`}>
        <button className={`${btnPrimary} gap-2`} type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner size="sm" tone="onDark" decorative />
              Saving…
            </>
          ) : (
            "Save"
          )}
        </button>
        <Link to={mode === "edit" && petId ? `/pets/${petId}` : "/pets"} className={link}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
