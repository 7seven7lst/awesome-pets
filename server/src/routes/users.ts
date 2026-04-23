import { Router } from "express";
import UserController from "@/controllers/user.controller";

export const usersRouter = Router();

usersRouter.get("/", UserController.list);
