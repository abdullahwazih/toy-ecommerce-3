// app/admin/orders/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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

function fullAddress(a: ShippingAddress) {
  return `${a.address}, ${a.area}, ${a.city}`;
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<OrderStatus | "all">("all");

  useEffect(() => {
    let alive = true;
    const fetchOrders = async () => {
      try {
        setError(null);
        const res = await API.get("/admin/orders");
        if (!alive) return;
        setOrders(res.data.orders ?? []);
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
        setError(apiErr.response?.data?.message ?? "Failed to load orders.");
      } finally {
        if (alive) setLoading(false);
      }
    };
    fetchOrders();
    return () => {
      alive = false;
    };
  }, [router]);

  const filteredOrders = useMemo(() => {
    if (activeStatus === "all") return orders;
    return orders.filter((o) => o.status === activeStatus);
  }, [orders, activeStatus]);

  const stats = useMemo(() => {
    const counts: Record<OrderStatus, number> = {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    for (const o of orders) counts[o.status] += 1;
    return counts;
  }, [orders]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-500 tracking-wide">Loading orders…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Orders</h1>
            <p className="text-sm text-gray-400 mt-1">
              {orders.length === 0 ? "No orders yet" : `${orders.length} order${orders.length > 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => setActiveStatus("all")}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition ${
              activeStatus === "all"
                ? "bg-indigo-600 border-indigo-600 text-white"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            All ({orders.length})
          </button>
          {(Object.keys(STATUS_STYLES) as OrderStatus[]).map((key) => {
            const s = STATUS_STYLES[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveStatus(key)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition ${
                  activeStatus === key
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
                title={s.label}
              >
                {s.label} ({stats[key]})
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-700 text-sm rounded-2xl p-4">
            {error}
          </div>
        )}

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
            <h2 className="text-lg font-bold text-gray-900">No orders found</h2>
            <p className="text-sm text-gray-500 mt-1">
              {activeStatus === "all" ? "Orders will appear here as customers place them." : "Try another status filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const s = STATUS_STYLES[order.status];
              const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);
              return (
                <div key={order._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="text-base font-bold text-gray-900 tracking-tight">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                          <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                          {s.label}
                        </span>
                        {order.user?.email && (
                          <span className="text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
                            {order.user.email}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                          <p className="text-xs font-semibold text-gray-500">Customer</p>
                          <p className="text-sm font-bold text-gray-900 mt-1">{order.shippingAddress.fullName}</p>
                          <p className="text-sm text-gray-600 mt-0.5">{order.shippingAddress.phone}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                          <p className="text-xs font-semibold text-gray-500">Address</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1 truncate">
                            {fullAddress(order.shippingAddress)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(order.createdAt)} • {totalItems} item{totalItems > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3">
                        <p className="text-xs font-semibold text-gray-400">Total</p>
                        <p className="text-xl font-extrabold text-gray-900 mt-0.5">৳{money(order.grandTotal)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => router.push(`/admin/orders/${order._id}`)}
                        className="px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold transition-all duration-150"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
