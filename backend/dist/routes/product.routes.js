"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const product_model_1 = __importDefault(require("../models/product.model"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// ➕ Create a new product (Admin only)
router.post("/", auth_middleware_1.protect, auth_middleware_1.requireAdmin, async (req, res) => {
    try {
        const product = await product_model_1.default.create(req.body);
        res.status(201).json({ product });
    }
    catch (err) {
        const isValidationError = err instanceof mongoose_1.default.Error.ValidationError;
        res.status(400).json({
            message: isValidationError ? "Validation failed" : "Invalid product data",
            errors: isValidationError ? err.errors : undefined,
        });
    }
});
// 📦 Get all products 
router.get("/", async (req, res) => {
    try {
        const products = await product_model_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({
            count: products.length,
            products,
        });
    }
    catch {
        res.status(500).json({
            message: "Failed to fetch products",
        });
    }
});
// 📦 Get a single product by ID
router.get("/:id", async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        const product = await product_model_1.default.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ product });
    }
    catch {
        res.status(500).json({ message: "Failed to fetch product" });
    }
});
// ✏️ Update a product (Admin only)
router.patch("/:id", auth_middleware_1.protect, auth_middleware_1.requireAdmin, async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        const updates = req.body ?? {};
        if (typeof updates !== "object" ||
            Array.isArray(updates) ||
            Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No updates provided" });
        }
        const product = await product_model_1.default.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ product });
    }
    catch (err) {
        const isValidationError = err instanceof mongoose_1.default.Error.ValidationError;
        res.status(400).json({
            message: isValidationError ? "Validation failed" : "Invalid product data",
            errors: isValidationError ? err.errors : undefined,
        });
    }
});
// 🗑️ Delete a product (Admin only)
router.delete("/:id", auth_middleware_1.protect, auth_middleware_1.requireAdmin, async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        const product = await product_model_1.default.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted", productId: product._id });
    }
    catch {
        res.status(500).json({ message: "Failed to delete product" });
    }
});
exports.default = router;
