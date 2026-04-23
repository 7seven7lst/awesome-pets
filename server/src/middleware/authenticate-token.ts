import type { NextFunction, Request, Response } from "express";
import {
  SESSION_COOKIE,
  extractBearerToken,
  verifySessionToken,
} from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { fail } from "@/lib/http";

/**
 * Reads JWT from httpOnly session cookie, then `Authorization: Bearer <token>`.
 * Verifies the token, loads the user from the DB, and sets `req.user`.
 */
export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const cookieToken = req.cookies?.[SESSION_COOKIE] as string | undefined;
  const bearer = extractBearerToken(req.headers.authorization);
  const token = cookieToken ?? bearer ?? null;

  if (!token) {
    return fail(res, "Access denied. No token provided.", 401);
  }

  let payload: ReturnType<typeof verifySessionToken>;
  try {
    payload = verifySessionToken(token);
  } catch {
    return fail(res, "Invalid or expired token.", 403);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    if (!user) {
      return fail(res, "Access denied. User not found.", 401);
    }

    req.user = user;
    return next();
  } catch (e) {
    return next(e instanceof Error ? e : new Error(String(e)));
  }
}
