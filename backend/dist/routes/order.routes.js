"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/order.routes.ts
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const order_model_1 = __importDefault(require("../models/order.model"));
const cart_1 = __importDefault(require("../models/cart"));
const router = express_1.default.Router();
router.use(auth_middleware_1.protect);
const SHIPPING = {
    inside_dhaka: { charge: 60, label: "2–3 business days" },
    outside_dhaka: { charge: 120, label: "4–7 business days" },
};
// POST /api/orders  — place order from current cart
router.post("/", async (req, res) => {
    const { shippingAddress } = req.body;
    try {
        const cart = await cart_1.default.findOne({ user: req.user.userId }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        const zone = shippingAddress.zone;
        const { charge, label } = SHIPPING[zone];
        const itemsTotal = cart.items.reduce((sum, i) => {
            return sum + i.product.price * i.quantity;
        }, 0);
        const grandTotal = itemsTotal + charge;
        const order = await order_model_1.default.create({
            user: req.user.userId,
            items: cart.items.map((i) => ({
                product: i.product._id,
                quantity: i.quantity,
                price: i.product.price,
            })),
            shippingAddress,
            paymentMethod: "cash_on_delivery",
            itemsTotal,
            shippingCharge: charge,
            grandTotal,
            estimatedDelivery: label,
            status: "pending",
        });
        // Clear the cart after order placed
        await cart_1.default.findOneAndDelete({ user: req.user.userId });
        res.status(201).json({ order });
    }
    catch (err) {
        console.error("ORDER ERROR:", err);
        res.status(500).json({ message: "Failed to place order" });
    }
});
// GET /api/orders — get current user's orders
router.get("/", async (req, res) => {
    try {
        const orders = await order_model_1.default.find({ user: req.user.userId })
            .populate("items.product")
            .sort({ createdAt: -1 });
        res.status(200).json({ orders });
    }
    catch (err) {
        console.error("FETCH ORDERS ERROR:", err);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});
//// GET /api/orders/:id — get a single order by ID (owner only)
router.get("/:id", async (req, res) => {
    try {
        const order = await order_model_1.default.findOne({
            _id: req.params.id,
            user: req.user.userId,
        }).populate("items.product");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ order });
    }
    catch (err) {
        console.error("FETCH ORDER ERROR:", err);
        res.status(500).json({ message: "Failed to fetch order" });
    }
});
exports.default = router;
