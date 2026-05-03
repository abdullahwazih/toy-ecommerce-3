// src/utils/generateToken.ts
import jwt from "jsonwebtoken";
import type { UserRole } from "../types/auth";

export const generateToken = (userId: string, role: UserRole) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};
