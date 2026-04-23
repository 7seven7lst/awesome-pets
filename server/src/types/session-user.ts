import type { UserRole } from "@/generated/prisma/browser";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
};
