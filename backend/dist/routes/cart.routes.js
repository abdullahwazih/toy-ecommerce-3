"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/cart.routes.ts
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const cart_1 = __importDefault(require("../models/cart"));
const router = express_1.default.Router();
router.use(auth_middleware_1.protect);
function sendCartError(res, message, err) {
    console.error(`[cart] ${message}`, err);
    const isProd = process.env.NODE_ENV === "production";
    const details = err instanceof Error ? err.message : typeof err === "string" ? err : undefined;
    return res.status(500).json({
        message,
        details: isProd ? undefined : details,
    });
}
// GET /api/cart
router.get("/", async (req, res) => {
    if (!req.user)
        return res.status(401).json({ message: "No token" });
    if (!mongoose_1.default.isValidObjectId(req.user.userId)) {
        return res.status(401).json({ message: "Invalid token" });
    }
    const userObjectId = new mongoose_1.default.Types.ObjectId(req.user.userId);
    try {
        const cart = await cart_1.default.findOne({ user: userObjectId }).populate("items.product");
        res.status(200).json({ cart: cart ?? { items: [] } });
    }
    catch (err) {
        return sendCartError(res, "Failed to fetch cart", err);
    }
});
// POST /api/cart  { productId, quantity }
router.post("/", async (req, res) => {
    if (!req.user)
        return res.status(401).json({ message: "No token" });
    if (!mongoose_1.default.isValidObjectId(req.user.userId)) {
        return res.status(401).json({ message: "Invalid token" });
    }
    const userObjectId = new mongoose_1.default.Types.ObjectId(req.user.userId);
    const { productId, quantity = 1 } = req.body;
    if (!productId || !mongoose_1.default.isValidObjectId(productId)) {
        return res.status(400).json({ message: "Invalid productId" });
    }
    const productObjectId = new mongoose_1.default.Types.ObjectId(productId);
    const quantityNumber = Number(quantity);
    if (!Number.isFinite(quantityNumber) || quantityNumber < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
    }
    try {
        let cart = await cart_1.default.findOne({ user: userObjectId });
        if (!cart) {
            cart = await cart_1.default.create({
                user: userObjectId,
                items: [{ product: productObjectId, quantity: quantityNumber }],
            });
        }
        else {
            const existing = cart.items.find((i) => i.product.toString() === productId);
            if (existing) {
                existing.quantity += quantityNumber;
            }
            else {
                cart.items.push({ product: productObjectId, quantity: quantityNumber });
            }
            await cart.save();
        }
        await cart.populate("items.product");
        res.status(200).json({ cart });
    }
    catch (err) {
        return sendCartError(res, "Failed to add to cart", err);
    }
});
// PATCH /api/cart/:itemId  { quantity }
router.patch("/:itemId", async (req, res) => {
    if (!req.user)
        return res.status(401).json({ message: "No token" });
    const { quantity } = req.body;
    try {
        if (!mongoose_1.default.isValidObjectId(req.user.userId)) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const userObjectId = new mongoose_1.default.Types.ObjectId(req.user.userId);
        const cart = await cart_1.default.findOne({ user: userObjectId });
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });
        const item = cart.items.find((i) => i._id?.toString() === req.params.itemId);
        if (!item)
            return res.status(404).json({ message: "Item not found" });
        if (quantity < 1) {
            cart.items = cart.items.filter((i) => i._id?.toString() !== req.params.itemId);
        }
        else {
            item.quantity = quantity;
        }
        await cart.save();
        await cart.populate("items.product");
        res.status(200).json({ cart });
    }
    catch (err) {
        return sendCartError(res, "Failed to update quantity", err);
    }
});
// DELETE /api/cart/:itemId
router.delete("/:itemId", async (req, res) => {
    if (!req.user)
        return res.status(401).json({ message: "No token" });
    try {
        if (!mongoose_1.default.isValidObjectId(req.user.userId)) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const userObjectId = new mongoose_1.default.Types.ObjectId(req.user.userId);
        const cart = await cart_1.default.findOne({ user: userObjectId });
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });
        cart.items = cart.items.filter((i) => i._id?.toString() !== req.params.itemId);
        await cart.save();
        await cart.populate("items.product");
        res.status(200).json({ cart });
    }
    catch (err) {
        return sendCartError(res, "Failed to remove item", err);
    }
});
exports.default = router;
