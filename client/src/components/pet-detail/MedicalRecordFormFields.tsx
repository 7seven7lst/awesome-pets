import { AllergySeverity as AllergySeverityEnum } from "@novellia/shared/prisma/browser";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { FieldError } from "../../lib/field-error";
import { field, label, textarea } from "../../lib/ui-styles";

/** RHF generics are invariant; create vs update forms use different value types for the same field names. */
type VaccineFieldsProps = {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  /** Add form: dates on one row. Edit dialog: stacked fields. */
  datesLayout?: "row" | "stacked";
};

export function MedicalRecordVaccineFields({
  register,
  errors,
  datesLayout = "row",
}: VaccineFieldsProps) {
  const dateFields = (
    <>
      <label className={label}>
        Administered
        <input className={field} type="date" {...register("administeredAt")} />
        <FieldError message={errors.administeredAt?.message} />
      </label>
      <label className={label}>
        Next due (optional)
        <input className={field} type="date" {...register("nextDueAt")} />
        <FieldError message={errors.nextDueAt?.message} />
      </label>
    </>
  );

  return (
    <>
      <label className={label}>
        Vaccine name
        <input className={field} {...register("vaccineName")} />
        <FieldError message={errors.vaccineName?.message} />
      </label>
      {datesLayout === "row" ? (
        <div className="flex flex-wrap items-end gap-4">{dateFields}</div>
      ) : (
        dateFields
      )}
    </>
  );
}

type AllergyFieldsProps = {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
};

export function MedicalRecordAllergyFields({ register, errors }: AllergyFieldsProps) {
  return (
    <>
      <label className={label}>
        Allergy name
        <input className={field} {...register("allergyName")} />
        <FieldError message={errors.allergyName?.message} />
      </label>
      <label className={label}>
        Reactions
        <textarea className={textarea} {...register("reactions")} />
        <FieldError message={errors.reactions?.message} />
      </label>
      <label className={label}>
        Severity
        <select className={field} {...register("severity")}>
          <option value={AllergySeverityEnum.MILD}>Mild</option>
          <option value={AllergySeverityEnum.SEVERE}>Severe</option>
        </select>
        <FieldError message={errors.severity?.message} />
      </label>
    </>
  );
}
