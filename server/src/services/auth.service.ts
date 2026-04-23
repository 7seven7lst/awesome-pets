import type { output } from "zod";
import { UserRole } from "@/generated/prisma/browser";
import { signSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { hashSaltPassword, verifyPassword } from "@/lib/password";
import { signInSchema, signUpSchema } from "@novellia/shared/schema/auth";
import { ServerError } from "@/lib/server-error";

export type SignInBody = output<typeof signInSchema>;
export type SignUpBody = output<typeof signUpSchema>;

export type SessionUserResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
};


export default class AuthService {
  public static async signIn(data: SignInBody): Promise<{ user: SessionUserResponse; token: string }> {
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });
  
    if (!user) {
      throw new ServerError("Invalid credentials", 401);
    }
  
    const passwordMatches = await verifyPassword(data.password, user.passwordHash);
    if (!passwordMatches) {
      throw new ServerError("Invalid credentials", 401);
    }
  
    const token = signSession({ sub: user.id, role: user.role });
  
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }
  
  public static async signUp(data: SignUpBody): Promise<{ user: SessionUserResponse; token: string }> {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
      select: { id: true },
    });
  
    if (existing) {
      throw new ServerError("Email already taken", 409);
    }
  
    const passwordHash = await hashSaltPassword(data.password);
    const role = UserRole.OWNER;
  
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash,
        role: data.role ?? UserRole.OWNER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  
    const token = signSession({ sub: user.id, role: user.role });
  
    return { user, token };
  }
}

