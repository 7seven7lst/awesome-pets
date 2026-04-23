import { Router } from "express";
import PetController from "@/controllers/pet.controller";
import { medicalRecordCreateApiSchema } from "@novellia/shared/schema/medical-record";
import { petCreateApiSchema, petUpdateApiSchema } from "@novellia/shared/schema/pet";
import { idParamSchema } from "@novellia/shared/schema/route-params";
import { checkSchema } from "@/middleware/check-schema";
import { petPhotoUploadMiddleware } from "@/middleware/pet-photo-upload";

export const petsRouter = Router();

petsRouter.get("/:id/records/export", checkSchema({ params: idParamSchema }), PetController.exportMedicalRecords);
petsRouter.get("/:id/records", checkSchema({ params: idParamSchema }), PetController.getMedicalRecordsByPetId);
petsRouter.post("/:id/photo", checkSchema({ params: idParamSchema }), petPhotoUploadMiddleware, PetController.uploadPhoto);
petsRouter.post(
  "/:id/records",
  checkSchema({ params: idParamSchema, body: medicalRecordCreateApiSchema }),
  PetController.createMedicalRecordForPet,
);
petsRouter.get("/:id", checkSchema({ params: idParamSchema }), PetController.getPetById);
petsRouter.patch("/:id", checkSchema({ params: idParamSchema, body: petUpdateApiSchema }), PetController.update);
petsRouter.delete("/:id", checkSchema({ params: idParamSchema }), PetController.remove);
petsRouter.get("/", PetController.list);
petsRouter.post("/", checkSchema({ body: petCreateApiSchema }), PetController.create);