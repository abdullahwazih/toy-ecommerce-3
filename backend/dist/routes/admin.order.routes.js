"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/admin.order.routes.ts
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const order_model_1 = __importDefault(require("../models/order.model"));
const router = express_1.default.Router();
router.use(auth_middleware_1.protect, auth_middleware_1.requireAdmin);
const ALLOWED_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
// GET /api/admin/orders — get all orders (admin)
router.get("/", async (_req, res) => {
    try {
        const orders = await order_model_1.default.find({})
            .populate("items.product")
            .populate("user", "email")
            .sort({ createdAt: -1 });
        res.status(200).json({ orders });
    }
    catch (err) {
        console.error("ADMIN FETCH ORDERS ERROR:", err);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});
// GET /api/admin/orders/:id — get a single order by ID (admin)
router.get("/:id", async (req, res) => {
    try {
        const order = await order_model_1.default.findById(req.params.id)
            .populate("items.product")
            .populate("user", "email");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ order });
    }
    catch (err) {
        console.error("ADMIN FETCH ORDER ERROR:", err);
        res.status(500).json({ message: "Failed to fetch order" });
    }
});
// PATCH /api/admin/orders/:id/status — update order status (admin)
router.patch("/:id/status", async (req, res) => {
    const { status } = req.body;
    if (!status || !ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }
    try {
        const order = await order_model_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true })
            .populate("items.product")
            .populate("user", "email");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ order });
    }
    catch (err) {
        console.error("ADMIN UPDATE ORDER STATUS ERROR:", err);
        res.status(500).json({ message: "Failed to update order status" });
    }
});
exports.default = router;
