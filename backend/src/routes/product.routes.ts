import express from "express";
import mongoose from "mongoose";
import Product from "../models/product.model";
import { protect, requireAdmin } from "../middleware/auth.middleware";

const router = express.Router();

// ➕ Create a new product (Admin only)

router.post("/", protect, requireAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (err: unknown) {
    const isValidationError = err instanceof mongoose.Error.ValidationError;
    res.status(400).json({
      message: isValidationError ? "Validation failed" : "Invalid product data",
      errors: isValidationError ? err.errors : undefined,
    });
  }
});

// 📦 Get all products 

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch {
    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
});

// 📦 Get a single product by ID

router.get("/:id", async (req, res) => {
  try {
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch {
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

// ✏️ Update a product (Admin only)

router.patch("/:id", protect, requireAdmin, async (req, res) => {
  try {
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const updates = req.body ?? {};
    if (
      typeof updates !== "object" ||
      Array.isArray(updates) ||
      Object.keys(updates).length === 0
    ) {
      return res.status(400).json({ message: "No updates provided" });
    }

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (err: unknown) {
    const isValidationError = err instanceof mongoose.Error.ValidationError;
    res.status(400).json({
      message: isValidationError ? "Validation failed" : "Invalid product data",
      errors: isValidationError ? err.errors : undefined,
    });
  }
});

// 🗑️ Delete a product (Admin only)

router.delete("/:id", protect, requireAdmin, async (req, res) => {
  try {
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted", productId: product._id });
  } catch {
    res.status(500).json({ message: "Failed to delete product" });
  }
});

export default router;
