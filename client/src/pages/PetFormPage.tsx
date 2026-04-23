import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { petCreateFormSchema, petUpdateFormSchema } from "@novellia/shared/schema/pet";
import { AnimalType as AnimalTypeEnum, UserRole } from "@novellia/shared/prisma/browser";
import { useAuth } from "../auth/AuthContext";
import { createPet, updatePet, uploadPetPhoto } from "../api";
import { PetEditorForm, type PetEditorFormValues } from "../components/pet-form/PetEditorForm";
import { PetFormPageHeader } from "../components/pet-form/PetFormPageHeader";
import { QueryState } from "../components/QueryState";
import { usePetEditorPhoto } from "../hooks/usePetEditorPhoto";
import { usePet } from "../hooks/usePet";
import { useUsersList } from "../hooks/useUsersList";
import { isoToLocalDateInput } from "../lib/calendar-date";
import { apiError } from "../lib/apiError";
import { ROUTES } from "../lib/routes";
import { banner, stack } from "../lib/ui-styles";

export function PetFormPage({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  const petQuery = usePet(mode === "edit" ? id : undefined);
  const usersQuery = useUsersList(isAdmin && Boolean(user));

  const [submitError, setSubmitError] = useState<string | null>(null);
  const loading = mode === "edit" && petQuery.loading;
  const error = submitError ?? usersQuery.error ?? petQuery.error;

  const { photo, previewUrl, savedImageUrl, setSavedImageUrl, handlePhotoInputChange } =
    usePetEditorPhoto({ onFileValidationMessage: setSubmitError });

  const resolver = useMemo(() => {
    const schema = mode === "create" ? petCreateFormSchema : petUpdateFormSchema;
    return zodResolver(schema as never) as Resolver<PetEditorFormValues>;
  }, [mode]);

  const form = useForm<PetEditorFormValues>({
    resolver,
    defaultValues: {
      name: "",
      description: "",
      animalType: AnimalTypeEnum.DOG,
      dateOfBirth: "",
      ownerId: "",
    },
  });

  const { handleSubmit, reset, setValue, watch } = form;

  useEffect(() => {
    if (!user) return;
    if (!isAdmin) setValue("ownerId", user.id);
  }, [isAdmin, user, setValue]);

  useEffect(() => {
    if (mode !== "edit" || !petQuery.pet) return;
    const loaded = petQuery.pet;
    reset({
      name: loaded.name,
      description: loaded.description ?? "",
      animalType: loaded.animalType,
      dateOfBirth: isoToLocalDateInput(loaded.dateOfBirth),
      ownerId: loaded.ownerId ?? "",
    });
    setSavedImageUrl(loaded.imageUrl ?? null);
  }, [mode, petQuery.pet, reset, setSavedImageUrl]);

  async function onValid(data: PetEditorFormValues) {
    if (!user) {
      setSubmitError("You must be signed in.");
      return;
    }
    setSubmitError(null);

    const descriptionNorm = data.description?.trim() ? data.description.trim() : null;
    const payload: Record<string, unknown> = {
      name: data.name.trim(),
      description: descriptionNorm,
      animalType: data.animalType,
      dateOfBirth: data.dateOfBirth,
    };

    if (mode === "create" || isAdmin) {
      payload.ownerId = isAdmin ? data.ownerId ?? null : user.id;
    }

    try {
      if (mode === "create") {
        const { pet } = await createPet(payload);
        if (photo) {
          try {
            await uploadPetPhoto(pet.id, photo);
          } catch (upErr) {
            setSubmitError(apiError(upErr));
          }
        }
        navigate(ROUTES.petDetail(pet.id));
      } else if (id) {
        await updatePet(id, payload);
        if (photo) {
          try {
            const { imageUrl } = await uploadPetPhoto(id, photo);
            setSavedImageUrl(imageUrl);
          } catch (upErr) {
            setSubmitError(apiError(upErr));
          }
        }
        navigate(ROUTES.petDetail(id));
      }
    } catch (err) {
      setSubmitError(apiError(err));
    }
  }

  return (
    <QueryState loading={loading} loadingText="Loading pet…">
      <div className={stack}>
        <PetFormPageHeader mode={mode} petId={id} watchedDateOfBirth={watch("dateOfBirth")} />
        {error ? <div className={banner}>{error}</div> : null}
        <PetEditorForm
          mode={mode}
          petId={id}
          form={form}
          isAdmin={isAdmin}
          users={usersQuery.users}
          photo={photo}
          previewUrl={previewUrl}
          savedImageUrl={savedImageUrl}
          onPhotoInputChange={handlePhotoInputChange}
          onSubmit={handleSubmit(onValid)}
        />
      </div>
    </QueryState>
  );
}
