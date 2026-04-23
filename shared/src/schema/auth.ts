import { z } from "zod";
import { UserRole } from "../generated/prisma/browser";

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(100),
});

export const signUpSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  password: z.string().min(8).max(100),
  role: z.nativeEnum(UserRole).optional(),
});
