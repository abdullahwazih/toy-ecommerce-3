// routes/admin.order.routes.ts
import express, { Response } from "express";
import { protect, requireAdmin } from "../middleware/auth.middleware";
import type { AuthRequest } from "../types/auth";
import Order from "../models/order.model";

const router = express.Router();

router.use(protect, requireAdmin);

const ALLOWED_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
type AllowedStatus = (typeof ALLOWED_STATUSES)[number];

// GET /api/admin/orders — get all orders (admin)
router.get("/", async (_req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({})
      .populate("items.product")
      .populate("user", "email")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (err) {
    console.error("ADMIN FETCH ORDERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// GET /api/admin/orders/:id — get a single order by ID (admin)
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("user", "email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (err) {
    console.error("ADMIN FETCH ORDER ERROR:", err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

// PATCH /api/admin/orders/:id/status — update order status (admin)
router.patch("/:id/status", async (req: AuthRequest, res: Response) => {
  const { status } = req.body as { status?: AllowedStatus };

  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    )
      .populate("items.product")
      .populate("user", "email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (err) {
    console.error("ADMIN UPDATE ORDER STATUS ERROR:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

export default router;
