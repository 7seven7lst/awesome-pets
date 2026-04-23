import { Router } from "express";
import AuthController from "@/controllers/auth.controller";
import { signInSchema, signUpSchema } from "@novellia/shared/schema/auth";
import { authenticateToken } from "@/middleware/authenticate-token";
import { checkSchema } from "@/middleware/check-schema";
import { fail } from "@/lib/http";

export const authRouter = Router();

authRouter.get("/me", authenticateToken, AuthController.me);
authRouter.post(
  "/sign-in",
  checkSchema({ body: signInSchema }),
  AuthController.signIn,
);
authRouter.post(
  "/sign-up",
  checkSchema({ body: signUpSchema }),
  AuthController.signUp,
);
authRouter.post("/sign-out", AuthController.signOut);

authRouter.all("/{*splat}", (req, res) => {
  return fail(res, "invalid route", 404);
});
