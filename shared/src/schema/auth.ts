import { z } from "zod";

enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
} 

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
