// app/orders/page.tsx
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

type Order = {
    _id: string;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: "cash_on_delivery";
    itemsTotal: number;
    shippingCharge: number;
    grandTotal: number;
    estimatedDelivery: string;
    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
    createdAt: string;
};

const STATUS_STYLES: Record<Order["status"], { bg: string; text: string; dot: string; label: string }> = {
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

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeStatus, setActiveStatus] = useState<Order["status"] | "all">("all");

    useEffect(() => {
        let alive = true;
        const fetchOrders = async () => {
            try {
                setError(null);
                const res = await API.get("/orders");
                if (!alive) return;
                setOrders(res.data.orders ?? []);
            } catch (err: unknown) {
                const apiErr = err as { response?: { status?: number; data?: { message?: string } } };
                if (!alive) return;
                if (apiErr.response?.status === 401) {
                    router.push("/login");
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
        const counts: Record<Order["status"], number> = {
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
                    <p className="text-sm text-gray-500 tracking-wide">Loading your orders…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Orders</h1>
                        <p className="text-sm text-gray-400 mt-1">
                            {orders.length === 0 ? "No orders yet" : `${orders.length} order${orders.length > 1 ? "s" : ""}`}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => router.push("/")}
                            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                        >
                            Continue Shopping
                        </button>
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
                    {(Object.keys(STATUS_STYLES) as Order["status"][]).map((key) => {
                        const s = STATUS_STYLES[key];
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setActiveStatus(key)}
                                className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition ${
                                    activeStatus === key
                                        ? "bg-indigo-600 border-indigo-600 text-white"
                                        : `bg-white border-gray-200 text-gray-600 hover:bg-gray-50`
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
                            {activeStatus === "all"
                                ? "When you place an order, it will show up here."
                                : "Try switching the filter to see other orders."}
                        </p>
                        <button
                            type="button"
                            onClick={() => router.push("/")}
                            className="mt-6 inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-150"
                        >
                            Shop Now
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => {
                            const s = STATUS_STYLES[order.status];
                            const preview = order.items.slice(0, 3);
                            const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);
                            return (
                                <div
                                    key={order._id}
                                    className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
                                >
                                    <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <p className="text-base font-bold text-gray-900 tracking-tight">
                                                    Order #{order._id.slice(-6).toUpperCase()}
                                                </p>
                                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                                                    <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                                                    {s.label}
                                                </span>
                                            </div>
                                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                                                <span>{formatDate(order.createdAt)}</span>
                                                <span className="text-gray-300">•</span>
                                                <span>{totalItems} item{totalItems > 1 ? "s" : ""}</span>
                                                <span className="text-gray-300">•</span>
                                                <span className="font-semibold text-gray-700">৳{money(order.grandTotal)}</span>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500">
                                                Delivery: <span className="font-medium text-gray-700">{order.estimatedDelivery}</span>
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => router.push(`/orders/${order._id}/confirmation`)}
                                                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold transition-all duration-150"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>

                                    <div className="px-6 pb-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {preview.map((it) => (
                                                <div
                                                    key={it._id}
                                                    className="rounded-2xl border border-gray-100 bg-gray-50 p-3 flex items-center gap-3"
                                                >
                                                    <div className="w-14 h-14 rounded-xl bg-white border border-gray-100 overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={it.product.imageUrl}
                                                            alt={it.product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                                            {it.product.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Qty {it.quantity} • ৳{money(it.price)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-3 flex items-center justify-center text-sm text-gray-500">
                                                    +{order.items.length - 3} more item{order.items.length - 3 > 1 ? "s" : ""}
                                                </div>
                                            )}
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
