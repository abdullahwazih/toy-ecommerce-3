"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.routes.ts
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_model_1 = __importDefault(require("../models/user.model"));
const router = express_1.default.Router();
router.post("/register", auth_controller_1.register);
router.post("/login", auth_controller_1.login);
router.post("/logout", auth_controller_1.logout);
router.get("/profile", auth_middleware_1.protect, async (req, res) => {
    const payload = req.user;
    if (!payload?.userId) {
        return res.status(401).json({ message: "Not authorized" });
    }
    const user = await user_model_1.default.findById(payload.userId).select("email role");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json({
        message: "Protected route accessed",
        user: {
            email: user.email,
            role: user.role ?? "user",
        },
    });
});
router.get("/admin", auth_middleware_1.protect, auth_middleware_1.requireAdmin, (_req, res) => {
    res.json({ message: "Admin route accessed" });
});
exports.default = router;
