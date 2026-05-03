"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getCookie(req, name) {
    const header = req.headers.cookie;
    if (!header)
        return undefined;
    const parts = header.split(";");
    for (const part of parts) {
        const [rawKey, ...rest] = part.trim().split("=");
        if (rawKey === name)
            return decodeURIComponent(rest.join("="));
    }
    return undefined;
}
const protect = (req, res, next) => {
    let token;
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
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const role = decoded.role === "admin" ? "admin" : "user";
        req.user = { ...decoded, role };
        next();
    }
    catch {
        return res.status(401).json({ message: "Not authorized" });
    }
};
exports.protect = protect;
const requireAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
};
exports.requireAdmin = requireAdmin;
