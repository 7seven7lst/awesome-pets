import { Router } from "express";
import MedicalRecordController from "@/controllers/medical-record";
import { medicalRecordUpdateApiSchema } from "@novellia/shared/schema/medical-record";
import { idParamSchema } from "@novellia/shared/schema/route-params";
import { checkSchema } from "@/middleware/check-schema";

export const medicalRecordsRouter = Router();

medicalRecordsRouter.patch(
  "/:id",
  checkSchema({ params: idParamSchema, body: medicalRecordUpdateApiSchema }),
  MedicalRecordController.update,
);
medicalRecordsRouter.delete("/:id", checkSchema({ params: idParamSchema }), MedicalRecordController.remove);
