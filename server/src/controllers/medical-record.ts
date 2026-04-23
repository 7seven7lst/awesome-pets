import type { Request, Response } from "express";
import type { output } from "zod";
import { handleRouteError, ok } from "@/lib/http";
import { routeParamString } from "@novellia/shared/schema/route-params";
import { medicalRecordUpdateApiSchema } from "@novellia/shared/schema/medical-record";
import MedicalRecordService from "@/services/medical-record";

export default class MedicalRecordController {
  public static async update(req: Request, res: Response) {
    try {
      const id = routeParamString(req.params.id);
      const data = req.validated as output<typeof medicalRecordUpdateApiSchema>;
      const payload = await MedicalRecordService.updateMedicalRecord(req.user!, id, data);
      return ok(res, payload);
    } catch (e) {
      return handleRouteError(res, e, "update record");
    }
  }
  
  public static async remove(req: Request, res: Response) {
    try {
      const id = routeParamString(req.params.id);
      await MedicalRecordService.deleteMedicalRecord(req.user!, id);
      return ok(res, { success: true });
    } catch (e) {
      return handleRouteError(res, e, "delete record");
    }
  }
}

