import { Router } from "express";
import { dashboardRouter } from "@/routes/dashboard";
import { petsRouter } from "@/routes/pets";
import { medicalRecordsRouter } from "@/routes/medical-records";
import { usersRouter } from "@/routes/users";
import { fail } from "@/lib/http";

export const apiRouter = Router();

apiRouter.use("/dashboard", dashboardRouter);

apiRouter.use("/pets", petsRouter);

apiRouter.use("/records", medicalRecordsRouter);

apiRouter.use("/users", usersRouter);

apiRouter.all("/{*splat}", (req, res) => {
  return fail(res, "invalid route", 404);
});