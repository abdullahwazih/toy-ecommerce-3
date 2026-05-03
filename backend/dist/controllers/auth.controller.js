"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = require("../utils/generateToken");
function setAuthCookie(res, token) {
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 1000,
    });
}
const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExists = await user_model_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await user_model_1.default.create({
            email,
            password: hashedPassword,
            role: "user",
        });
        const token = (0, generateToken_1.generateToken)(user._id.toString(), user.role ?? "user");
        setAuthCookie(res, token);
        res.status(201).json({
            message: "User registered",
        });
    }
    catch {
        res.status(500).json({ message: "Server error" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        if (!user.role) {
            user.role = "user";
            await user.save();
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = (0, generateToken_1.generateToken)(user._id.toString(), user.role ?? "user");
        setAuthCookie(res, token);
        res.json({
            message: "Login successful",
        });
    }
    catch {
        res.status(500).json({ message: "Server error" });
    }
};
exports.login = login;
const logout = async (_req, res) => {
    const isProd = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
    });
    res.json({ message: "Logged out" });
};
exports.logout = logout;
