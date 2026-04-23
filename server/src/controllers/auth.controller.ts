import type { Request, Response } from "express";
import type { output } from "zod";
import { clearSessionCookie, setSessionCookie } from "@/lib/auth-session";
import { handleRouteError, ok } from "@/lib/http";
import { signInSchema, signUpSchema } from "@novellia/shared/schema/auth";
import AuthService from "@/services/auth.service";

/** When `?is_mobile=1`, the session cookie is not set; the JWT is returned in the JSON body instead. */
function skipSessionCookie(req: Request): boolean {
  const raw = req.query.is_mobile;
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v === "1";
}

export default class AuthController {
  public static async me(req: Request, res: Response) {
    try {
      return ok(res, { user: req.user! });
    } catch (e) {
      return handleRouteError(res, e, "auth me");
    }
  }

  public static async signIn(req: Request, res: Response) {
    try {
      const data = req.validated as output<typeof signInSchema>;
      const { user, token } = await AuthService.signIn(data);
      if (skipSessionCookie(req)) {
        return ok(res, { user, token });
      }
      setSessionCookie(res, token);
      return ok(res, { user });
    } catch (e) {
      return handleRouteError(res, e, "sign-in");
    }
  }

  public static async signUp(req: Request, res: Response) {
    try {
      const data = req.validated as output<typeof signUpSchema>;
      const { user, token } = await AuthService.signUp(data);
      if (skipSessionCookie(req)) {
        return ok(res, { user, token }, 201);
      }
      setSessionCookie(res, token);
      return ok(res, { user }, 201);
    } catch (e) {
      return handleRouteError(res, e, "sign-up");
    }
  }

  public static async signOut(_req: Request, res: Response) {
    try {
      clearSessionCookie(res);
      return ok(res, { success: true });
    } catch (e) {
      return handleRouteError(res, e, "sign-out");
    }
  }
}
