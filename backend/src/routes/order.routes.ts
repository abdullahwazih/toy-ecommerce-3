// routes/order.routes.ts
import express, { Response } from "express";
import { protect } from "../middleware/auth.middleware";
import type { AuthRequest } from "../types/auth";
import Order from "../models/order.model";
import Cart from "../models/cart";

const router = express.Router();

router.use(protect);

const SHIPPING = {
    inside_dhaka: { charge: 60, label: "2–3 business days" },
    outside_dhaka: { charge: 120, label: "4–7 business days" },
};

// POST /api/orders  — place order from current cart
router.post("/", async (req: AuthRequest, res: Response) => {
    const { shippingAddress } = req.body;

    try {
        const cart = await Cart.findOne({ user: req.user!.userId }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const zone = shippingAddress.zone as "inside_dhaka" | "outside_dhaka";
        const { charge, label } = SHIPPING[zone];

        const itemsTotal = cart.items.reduce((sum: number, i: any) => {
            return sum + i.product.price * i.quantity;
        }, 0);

        const grandTotal = itemsTotal + charge;

        const order = await Order.create({
            user: req.user!.userId,
            items: cart.items.map((i: any) => ({
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
        await Cart.findOneAndDelete({ user: req.user!.userId });

        res.status(201).json({ order });
    } catch (err) {
        console.error("ORDER ERROR:", err);
        res.status(500).json({ message: "Failed to place order" });
    }
});

// GET /api/orders — get current user's orders
router.get("/", async (req: AuthRequest, res: Response) => {
    try {
        const orders = await Order.find({ user: req.user!.userId })
            .populate("items.product")
            .sort({ createdAt: -1 });
        res.status(200).json({ orders });
    } catch (err) {
        console.error("FETCH ORDERS ERROR:", err);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});


//// GET /api/orders/:id — get a single order by ID (owner only)

router.get("/:id", async (req: AuthRequest, res: Response) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user!.userId,
        }).populate("items.product");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ order });
    } catch (err) {
        console.error("FETCH ORDER ERROR:", err);
        res.status(500).json({ message: "Failed to fetch order" });
    }
});


export default router;