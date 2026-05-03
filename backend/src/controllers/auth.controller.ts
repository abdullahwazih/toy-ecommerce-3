// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken";

function setAuthCookie(res: Response, token: string) {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 1000,
  });
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      role: "user",
    });

    const token = generateToken(user._id.toString(), user.role ?? "user");
    setAuthCookie(res, token);

    res.status(201).json({
      message: "User registered",
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.role) {
      user.role = "user";
      await user.save();
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString(), user.role ?? "user");
    setAuthCookie(res, token);

    res.json({
      message: "Login successful",
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (_req: Request, res: Response) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
  });
  res.json({ message: "Logged out" });
};
