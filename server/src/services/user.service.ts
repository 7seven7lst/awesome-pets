import { UserRole } from "@/generated/prisma/browser";
import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/types/session-user";

export default class UserService {
  public static async listUsersForActor(actor: SessionUser) {
    if (actor.role === UserRole.ADMIN) {
      return prisma.user.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, email: true, role: true },
      });
    }
    return [
      {
        id: actor.id,
        name: actor.name,
        email: actor.email,
        role: actor.role,
      },
    ];
  }
}
