"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    ageRange: { type: String, required: true, trim: true },
    material: { type: String, required: true, trim: true },
    dimensions: { type: String, required: true, trim: true },
    weight: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    colors: { type: [String], default: [] },
    imageUrl: { type: String, required: true, trim: true },
    imageUrls: { type: [String], default: [] },
    rating: { type: Number, required: true, min: 0, max: 5 },
    category: { type: String, required: true, trim: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Product", productSchema);
