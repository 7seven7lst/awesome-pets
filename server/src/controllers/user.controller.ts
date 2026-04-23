import type { Request, Response } from "express";
import { handleRouteError, ok } from "@/lib/http";
import UserService from "@/services/user.service";

export default class UserController {
  public static async list(req: Request, res: Response) {
    try {
      const users = await UserService.listUsersForActor(req.user!);
      return ok(res, { users });
    } catch (e) {
      return handleRouteError(res, e, "list users");
    }
  }
}
