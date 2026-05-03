"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
// src/utils/generateToken.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ userId, role }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
};
exports.generateToken = generateToken;
