import { zodResolver } from "@hookform/resolvers/zod";
import {
  AllergySeverity as AllergySeverityEnum,
  MedicalRecordType as MedicalRecordTypeEnum,
} from "@novellia/shared/prisma/browser";
import { useEffect, useMemo, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import {
  medicalRecordCreateFormSchema,
  medicalRecordUpdateFormSchema,
} from "@novellia/shared/schema/medical-record";
import type { z } from "zod";
import { createRecord, updateRecord } from "../../api";
import { isoToLocalDateInput } from "../../lib/calendar-date";
import { Spinner } from "../Spinner";
import { FieldError } from "../../lib/field-error";
import { buildCreateMedicalRecordBody, buildUpdateMedicalRecordBody } from "../../lib/medical-record-request-body";
import { banner, btnOutline, btnPrimary, field, label, stack } from "../../lib/ui-styles";
import type { AllergySeverity, MedicalRecord, MedicalRecordType } from "../../types";
import { MedicalRecordAllergyFields, MedicalRecordVaccineFields } from "./MedicalRecordFormFields";

type CreateRecordValues = z.infer<typeof medicalRecordCreateFormSchema>;

export function AddMedicalRecordForm({
  petId,
  onCreated,
}: {
  petId: string;
  onCreated: () => void;
}) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateRecordValues>({
    resolver: zodResolver(medicalRecordCreateFormSchema as never) as Resolver<CreateRecordValues>,
    defaultValues: {
      recordType: MedicalRecordTypeEnum.VACCINE,
      vaccineName: "",
      administeredAt: "",
      nextDueAt: "",
      allergyName: "",
      reactions: "",
      severity: AllergySeverityEnum.MILD,
    },
  });

  const recordType = watch("recordType") as MedicalRecordType;

  useEffect(() => {
    if (recordType === MedicalRecordTypeEnum.VACCINE) {
      setValue("allergyName", "");
      setValue("reactions", "");
      setValue("severity", AllergySeverityEnum.MILD);
    } else {
      setValue("vaccineName", "");
      setValue("administeredAt", "");
      setValue("nextDueAt", "");
    }
  }, [recordType, setValue]);

  async function onValid(data: CreateRecordValues) {
    setFormError(null);
    try {
      await createRecord(petId, buildCreateMedicalRecordBody(data));
      reset();
      onCreated();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <>
      {formError ? <div className={banner}>{formError}</div> : null}
      <form className={`${stack} max-w-2xl`} onSubmit={handleSubmit(onValid)} noValidate>
        <div className="flex flex-wrap gap-4">
          <label className={label}>
            Record type
            <select className={field} {...register("recordType")}>
              <option value={MedicalRecordTypeEnum.VACCINE}>Vaccine</option>
              <option value={MedicalRecordTypeEnum.ALLERGY}>Allergy</option>
            </select>
            <FieldError message={errors.recordType?.message} />
          </label>
        </div>

        {recordType === MedicalRecordTypeEnum.VACCINE ? (
          <MedicalRecordVaccineFields register={register} errors={errors} />
        ) : (
          <MedicalRecordAllergyFields register={register} errors={errors} />
        )}

        <button className={`${btnPrimary} w-fit gap-2`} type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner size="sm" tone="onDark" decorative />
              Saving…
            </>
          ) : (
            "Add record"
          )}
        </button>
      </form>
    </>
  );
}

type UpdateRecordValues = z.infer<typeof medicalRecordUpdateFormSchema>;

export function EditMedicalRecordForm({
  record,
  onSuccess,
  onCancel,
}: {
  record: MedicalRecord;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [formError, setFormError] = useState<string | null>(null);

  const defaultValues = useMemo((): UpdateRecordValues => {
    if (record.recordType === MedicalRecordTypeEnum.VACCINE && record.vaccineRecord) {
      return {
        vaccineName: record.vaccineRecord.vaccineName,
        administeredAt: isoToLocalDateInput(record.vaccineRecord.administeredAt),
        nextDueAt: record.vaccineRecord.nextDueAt ? isoToLocalDateInput(record.vaccineRecord.nextDueAt) : "",
      };
    }
    if (record.recordType === MedicalRecordTypeEnum.ALLERGY && record.allergyRecord) {
      return {
        allergyName: record.allergyRecord.allergyName,
        reactions: record.allergyRecord.reactions,
        severity: record.allergyRecord.severity as AllergySeverity,
      };
    }
    return {};
  }, [record]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateRecordValues>({
    resolver: zodResolver(medicalRecordUpdateFormSchema as never) as Resolver<UpdateRecordValues>,
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [record.id, defaultValues, reset]);

  async function onValid(data: UpdateRecordValues) {
    setFormError(null);
    try {
      await updateRecord(record.id, buildUpdateMedicalRecordBody(record.recordType, data));
      onSuccess();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <form className={`${stack} mt-4 max-w-lg`} onSubmit={handleSubmit(onValid)} noValidate>
      {formError ? <div className={banner}>{formError}</div> : null}
      {record.recordType === MedicalRecordTypeEnum.VACCINE ? (
        <MedicalRecordVaccineFields register={register} errors={errors} datesLayout="stacked" />
      ) : (
        <MedicalRecordAllergyFields register={register} errors={errors} />
      )}
      <div className="mt-2 flex justify-end gap-2">
        <button type="button" className={btnOutline} onClick={onCancel}>
          Cancel
        </button>
        <button className={`${btnPrimary} gap-2`} type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner size="sm" tone="onDark" decorative />
              Saving…
            </>
          ) : (
            "Save changes"
          )}
        </button>
      </div>
    </form>
  );
}
