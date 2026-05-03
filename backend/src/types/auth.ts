import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";

export type UserRole = "admin" | "user";

export interface AuthTokenPayload extends JwtPayload {
  userId: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: AuthTokenPayload;
}

