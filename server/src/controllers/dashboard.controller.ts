import type { Request, Response } from "express";
import { handleRouteError, ok } from "@/lib/http";
import { MEDICAL_RECORDS_PAGE_SIZE, parsePageParam, parsePageSizeParam } from "@/lib/pagination";
import DashboardService from "@/services/dashboard.service";

export default class DashboardController {
  public static async get(req: Request, res: Response) {
    try {
      const payload = await DashboardService.getDashboardForUser(req.user!);
      return ok(res, payload);
    } catch (e) {
      return handleRouteError(res, e, "dashboard");
    }
  }

  public static async listUpcomingVaccines(req: Request, res: Response) {
    try {
      const page = parsePageParam(typeof req.query.page === "string" ? req.query.page : undefined);
      const pageSize = parsePageSizeParam(
        typeof req.query.pageSize === "string" ? req.query.pageSize : undefined,
        MEDICAL_RECORDS_PAGE_SIZE,
      );
      const result = await DashboardService.listUpcomingVaccinesForUser(req.user!, { page, pageSize });
      return ok(res, result);
    } catch (e) {
      return handleRouteError(res, e, "dashboard upcoming vaccines");
    }
  }
}

