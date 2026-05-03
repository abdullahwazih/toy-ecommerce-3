// src/routes/auth.routes.ts
import express from "express";
import { login, logout, register } from "../controllers/auth.controller";
import { protect, requireAdmin } from "../middleware/auth.middleware";
import User from "../models/user.model";
import type { AuthRequest } from "../types/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/profile", protect, async (req, res) => {
  const payload = (req as AuthRequest).user;
  if (!payload?.userId) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const user = await User.findById(payload.userId).select("email role");
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

router.get("/admin", protect, requireAdmin, (_req, res) => {
  res.json({ message: "Admin route accessed" });
});

export default router;
