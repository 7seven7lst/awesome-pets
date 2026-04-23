import { Router } from "express";
import DashboardController from "@/controllers/dashboard.controller";

export const dashboardRouter = Router();

dashboardRouter.get("/upcoming-vaccines", DashboardController.listUpcomingVaccines);
dashboardRouter.get("/", DashboardController.get);
