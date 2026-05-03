// app/admin/orders/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import API from "@/app/lib/api";

type Product = {
  _id: string;
  name: string;
  imageUrl: string;
  price: number;
};

type OrderItem = {
  _id: string;
  product: Product;
  quantity: number;
  price: number;
};

type ShippingAddress = {
  fullName: string;
  phone: string;
  address: string;
  area: string;
  city: string;
  zone: "inside_dhaka" | "outside_dhaka";
};

type UserPreview = {
  _id: string;
  email: string;
};

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

type AdminOrder = {
  _id: string;
  user?: UserPreview;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: "cash_on_delivery";
  itemsTotal: number;
  shippingCharge: number;
  grandTotal: number;
  estimatedDelivery: string;
  status: OrderStatus;
  createdAt: string;
};

const STATUS_STYLES: Record<OrderStatus, { bg: string; text: string; dot: string; label: string }> = {
  pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400", label: "Pending" },
  confirmed: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400", label: "Confirmed" },
  shipped: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-400", label: "Shipped" },
  delivered: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400", label: "Delivered" },
  cancelled: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-400", label: "Cancelled" },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function money(value: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return "0.00";
  return value.toFixed(2);
}

export default function AdminOrderDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const orderId = params?.id;

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusDraft, setStatusDraft] = useState<OrderStatus>("pending");
  const [savingStatus, setSavingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusToast, setStatusToast] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    let alive = true;

    const fetchOrder = async () => {
      try {
        setError(null);
        const res = await API.get(`/admin/orders/${orderId}`);
        if (!alive) return;
        setOrder(res.data.order);
        setStatusDraft(res.data.order?.status ?? "pending");
      } catch (err: unknown) {
        const apiErr = err as { response?: { status?: number; data?: { message?: string } } };
        if (!alive) return;
        if (apiErr.response?.status === 401) {
          router.push("/login");
          return;
        }
        if (apiErr.response?.status === 403) {
          setError("Admin access required.");
          return;
        }
        setError(apiErr.response?.data?.message ?? "Failed to load order.");
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchOrder();
    return () => {
      alive = false;
    };
  }, [orderId, router]);

  const updateStatus = async () => {
    if (!orderId) return;
    setSavingStatus(true);
    setStatusError(null);
    setStatusToast(null);
    try {
      const res = await API.patch(`/admin/orders/${orderId}/status`, { status: statusDraft });
      setOrder(res.data.order);
      setStatusDraft(res.data.order?.status ?? statusDraft);
      setStatusToast("Order status updated successfully.");
    } catch (err: unknown) {
      const apiErr = err as { response?: { status?: number; data?: { message?: string } } };
      if (apiErr.response?.status === 401) {
        router.push("/login");
        return;
      }
      if (apiErr.response?.status === 403) {
        setStatusError("Admin access required.");
        return;
      }
      setStatusError(apiErr.response?.data?.message ?? "Failed to update status.");
    } finally {
      setSavingStatus(false);
    }
  };

  useEffect(() => {
    if (!statusToast) return;
    const t = setTimeout(() => setStatusToast(null), 2200);
    return () => clearTimeout(t);
  }, [statusToast]);

  const totalItems = useMemo(() => {
    if (!order) return 0;
    return order.items.reduce((sum, i) => sum + i.quantity, 0);
  }, [order]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-500 tracking-wide">Loading order…</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <button
            type="button"
            onClick={() => router.push("/admin/orders")}
            className="text-sm font-semibold text-gray-600 hover:text-gray-900"
          >
            ← Back to Orders
          </button>
          <div className="mt-6 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <p className="text-sm text-gray-700">{error ?? "Order not found."}</p>
          </div>
        </div>
      </div>
    );
  }

  const s = STATUS_STYLES[order.status];
  const changed = statusDraft !== order.status;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {statusToast && (
          <div className="fixed top-5 right-5 z-50">
            <div className="bg-gray-900 text-white text-sm font-semibold px-4 py-3 rounded-2xl shadow-lg border border-white/10">
              {statusToast}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => router.push("/admin/orders")}
            className="text-sm font-semibold text-gray-600 hover:text-gray-900"
          >
            ← Back to Orders
          </button>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
              <span className={`w-2 h-2 rounded-full ${s.dot}`} />
              {s.label}
            </span>
            <div className="flex items-center gap-2">
              <select
                value={statusDraft}
                onChange={(e) => setStatusDraft(e.target.value as OrderStatus)}
                className="h-9 px-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700"
                aria-label="Order status"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                type="button"
                onClick={updateStatus}
                disabled={!changed || savingStatus}
                className="h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold transition"
              >
                {savingStatus ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>

        {statusError && (
          <div className="mt-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-2xl p-4">
            {statusError}
          </div>
        )}

        <div className="mt-6 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Order #{order._id.slice(-6).toUpperCase()}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(order.createdAt)} • {totalItems} item{totalItems > 1 ? "s" : ""} •{" "}
              <span className="font-semibold text-gray-700">৳{money(order.grandTotal)}</span>
            </p>
            {order.user?.email && (
              <p className="text-sm text-gray-500 mt-1">
                Account: <span className="font-semibold text-gray-700">{order.user.email}</span>
              </p>
            )}
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <p className="text-xs font-semibold text-gray-500">Customer</p>
              <p className="text-base font-bold text-gray-900 mt-1">{order.shippingAddress.fullName}</p>
              <p className="text-sm text-gray-700 mt-1">{order.shippingAddress.phone}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <p className="text-xs font-semibold text-gray-500">Shipping Address</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{order.shippingAddress.address}</p>
              <p className="text-sm text-gray-700 mt-1">
                {order.shippingAddress.area}, {order.shippingAddress.city} ({order.shippingAddress.zone.replace("_", " ")})
              </p>
              <p className="text-xs text-gray-500 mt-2">ETA: {order.estimatedDelivery}</p>
            </div>
          </div>

          <div className="px-6 pb-6">
            <h2 className="text-base font-bold text-gray-900 tracking-tight mb-3">Items</h2>
            <div className="space-y-3">
              {order.items.map((it) => (
                <div
                  key={it._id}
                  className="rounded-2xl border border-gray-100 bg-white p-4 flex items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                    <Image
                      src={it.product.imageUrl}
                      alt={it.product.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 truncate">{it.product.name}</p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Qty {it.quantity} • Unit ৳{money(it.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Line total</p>
                    <p className="text-sm font-extrabold text-gray-900">৳{money(it.price * it.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-semibold text-gray-500">Items Total</p>
                <p className="text-lg font-extrabold text-gray-900 mt-0.5">৳{money(order.itemsTotal)}</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-semibold text-gray-500">Shipping</p>
                <p className="text-lg font-extrabold text-gray-900 mt-0.5">৳{money(order.shippingCharge)}</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-4">
                <p className="text-xs font-semibold text-gray-400">Grand Total</p>
                <p className="text-2xl font-extrabold text-gray-900 mt-0.5">৳{money(order.grandTotal)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
