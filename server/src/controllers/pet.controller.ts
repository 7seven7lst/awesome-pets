import type { Request, Response } from "express";
import type { output } from "zod";
import { MedicalRecordType } from "@/generated/prisma/browser";
import { fail, handleRouteError, ok } from "@/lib/http";
import { routeParamString } from "@novellia/shared/schema/route-params";
import { medicalRecordCreateApiSchema } from "@novellia/shared/schema/medical-record";
import { petCreateApiSchema, petUpdateApiSchema } from "@novellia/shared/schema/pet";
import { MEDICAL_RECORDS_PAGE_SIZE, PETS_PAGE_SIZE, parsePageParam, parsePageSizeParam } from "@/lib/pagination";
import PetService from "@/services/pet.service";

export default class PetController {
  public static async list(req: Request, res: Response) {
    try {
      const query = typeof req.query.query === "string" ? req.query.query : "";
      const animalType = typeof req.query.animalType === "string" ? req.query.animalType : "";
      const page = parsePageParam(typeof req.query.page === "string" ? req.query.page : undefined);
      const pageSize = parsePageSizeParam(
        typeof req.query.pageSize === "string" ? req.query.pageSize : undefined,
        PETS_PAGE_SIZE,
      );
      const result = await PetService.listPets(req.user!, { query, animalType, page, pageSize });
      return ok(res, result);
    } catch (e) {
      return handleRouteError(res, e, "list pets");
    }
  }
  
  public static async create(req: Request, res: Response) {
    try {
      const data = req.validated as output<typeof petCreateApiSchema>;
      const pet = await PetService.createPet(req.user!, data);
      return ok(res, { pet }, 201);
    } catch (e) {
      return handleRouteError(res, e, "create pet");
    }
  }
  
  public static async exportMedicalRecords(req: Request, res: Response) {
    try {
      const id = routeParamString(req.params.id);
      const result = await PetService.listAllMedicalRecordsForExport(req.user!, id);
      return ok(res, result);
    } catch (e) {
      return handleRouteError(res, e, "export medical records");
    }
  }

  public static async getMedicalRecordsByPetId(req: Request, res: Response) {
    try {
      const id = routeParamString(req.params.id);
      const page = parsePageParam(typeof req.query.page === "string" ? req.query.page : undefined);
      const pageSize = parsePageSizeParam(
        typeof req.query.pageSize === "string" ? req.query.pageSize : undefined,
        MEDICAL_RECORDS_PAGE_SIZE,
      );
      const recordTypeRaw = typeof req.query.recordType === "string" ? req.query.recordType : "";
      const recordType =
        recordTypeRaw && (Object.values(MedicalRecordType) as string[]).includes(recordTypeRaw)
          ? recordTypeRaw
          : "";
      const result = await PetService.getMedicalRecordsByPetId(req.user!, id, {
        page,
        pageSize,
        recordType,
      });
      return ok(res, result);
    } catch (e) {
      return handleRouteError(res, e, "list pet medical records");
    }
  }

  public static async getPetById(req: Request, res: Response) {
    try {
      const id = routeParamString(req.params.id);
      const result = await PetService.getPetById(req.user!, id);
      return ok(res, result);
    } catch (e) {
      return handleRouteError(res, e, "get pet");
    }
  }
  
  public static async update(req: Request, res: Response) {
    try {
      const id = routeParamString(req.params.id);
      const data = req.validated as output<typeof petUpdateApiSchema>;
      const pet = await PetService.updatePet(req.user!, id, data);
      return ok(res, { pet });
    } catch (e) {
      return handleRouteError(res, e, "update pet");
    }
  }
  
  public static async remove(req: Request, res: Response) {
    try {
      const id = routeParamString(req.params.id);
      await PetService.deletePet(req.user!, id);
      return ok(res, { success: true });
    } catch (e) {
      return handleRouteError(res, e, "delete pet");
    }
  }
  
  public static async createMedicalRecordForPet(req: Request, res: Response) {
    try {
      const id = routeParamString(req.params.id);
      const data = req.validated as output<typeof medicalRecordCreateApiSchema>;
      const record = await PetService.createMedicalRecordForPet(req.user!, id, data);
      return ok(res, { record }, 201);
    } catch (e) {
      return handleRouteError(res, e, "create record");
    }
  }
  
  public static async uploadPhoto(req: Request, res: Response) {
    try {
      const id = routeParamString(req.params.id);
      const file = req.file;
      if (!file?.buffer) {
        return fail(res, 'Expected multipart field "file"', 400);
      }
      const payload = await PetService.uploadPetPhoto(req.user!, id, {
        buffer: file.buffer,
        mimetype: file.mimetype,
      });
      return ok(res, payload);
    } catch (e) {
      return handleRouteError(res, e, "upload pet photo");
    }
  }
}
