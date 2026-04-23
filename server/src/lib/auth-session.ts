import type { Response } from "express";
import jwt from "jsonwebtoken";
import type { UserRole } from "@/generated/prisma/browser";

export const SESSION_COOKIE = "novellia_submission_session";

const TOKEN_OPTIONS: jwt.SignOptions = { expiresIn: "1h" };

export type JwtSessionPayload = {
  sub: string;
  role: UserRole;
};

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
}

export function signSession(payload: JwtSessionPayload): string {
  return jwt.sign(payload, getJwtSecret(), TOKEN_OPTIONS);
}

export function verifySessionToken(token: string): JwtSessionPayload {
  const decoded = jwt.verify(token, getJwtSecret()) as jwt.JwtPayload & { role?: UserRole };
  if (!decoded?.sub || !decoded.role) {
    throw new Error("Invalid token payload");
  }
  return { sub: decoded.sub, role: decoded.role };
}

export function setSessionCookie(res: Response, token: string) {
  const maxAgeMs = 60 * 60 * 1000;
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeMs,
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export function extractBearerToken(authorization: string | undefined): string | null {
  if (!authorization) return null;
  const m = authorization.match(/^\s*Bearer\s+(\S+)/i);
  return m?.[1] ?? null;
}
