import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

const JWT_SECRET =
  process.env["JWT_SECRET"] ||
  (process.env["NODE_ENV"] === "production"
    ? ""
    : randomBytes(32).toString("hex"));

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in production");
}

const COOKIE_NAME = "auth_token";
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export type AuthPayload = {
  id: number;
  email: string;
  role: "member" | "organizer" | "admin";
};

export const hashPassword = (plain: string) => bcrypt.hash(plain, 10);
export const verifyPassword = (plain: string, hash: string) =>
  bcrypt.compare(plain, hash);

export const signToken = (payload: AuthPayload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

export const verifyToken = (token: string): AuthPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    if (
      typeof decoded === "object" &&
      typeof decoded["id"] === "number" &&
      typeof decoded["email"] === "string" &&
      typeof decoded["role"] === "string"
    ) {
      return {
        id: decoded["id"],
        email: decoded["email"],
        role: decoded["role"] as AuthPayload["role"],
      };
    }
    return null;
  } catch {
    return null;
  }
};

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env["NODE_ENV"] === "production",
    maxAge: COOKIE_MAX_AGE_MS,
    path: "/",
  });
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
};

export const readAuthFromRequest = (req: Request): AuthPayload | null => {
  const cookies = (req as Request & { cookies?: Record<string, string> })
    .cookies;
  const token = cookies?.[COOKIE_NAME];
  if (!token) return null;
  return verifyToken(token);
};

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = readAuthFromRequest(req);
  if (!auth) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  (req as Request & { auth: AuthPayload }).auth = auth;
  next();
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = readAuthFromRequest(req);
  if (!auth) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  if (auth.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  (req as Request & { auth: AuthPayload }).auth = auth;
  next();
};

export const generateUserId = () => {
  return `NJBSICT-${randomBytes(4).toString("hex").toUpperCase()}`;
};
