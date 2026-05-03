// models/order.model.ts
import mongoose, { Document } from "mongoose";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number; // snapshot of price at time of order
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  area: string;
  city: string;
  zone: "inside_dhaka" | "outside_dhaka";
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: "cash_on_delivery";
  itemsTotal: number;
  shippingCharge: number;
  grandTotal: number;
  estimatedDelivery: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new mongoose.Schema<IOrderItem>({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }, // saved at order time, not live price
});

const shippingAddressSchema = new mongoose.Schema<IShippingAddress>({
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  area: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  zone: { type: String, enum: ["inside_dhaka", "outside_dhaka"], required: true },
});

const orderSchema = new mongoose.Schema<IOrder>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    shippingAddress: { type: shippingAddressSchema, required: true },
    paymentMethod: { type: String, enum: ["cash_on_delivery"], default: "cash_on_delivery" },
    itemsTotal: { type: Number, required: true },
    shippingCharge: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    estimatedDelivery: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", orderSchema);