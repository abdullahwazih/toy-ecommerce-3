// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { AuthRequest, AuthTokenPayload, UserRole } from "../types/auth";

function getCookie(req: Request, name: string): string | undefined {
    
    const header = req.headers.cookie;
    if (!header) return undefined;

    const parts = header.split(";");
    for (const part of parts) {
        const [rawKey, ...rest] = part.trim().split("=");
        if (rawKey === name) return decodeURIComponent(rest.join("="));
    }
    return undefined;
}

export const protect = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        token = getCookie(req, "token");
    }

    if (!token) {
        return res.status(401).json({ message: "No token" });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string,
        ) as AuthTokenPayload;

        const role: UserRole = decoded.role === "admin" ? "admin" : "user";

        req.user = { ...decoded, role };
        next();
    } catch {
        return res.status(401).json({ message: "Not authorized" });
    }
};

export const requireAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }

    next();
};
