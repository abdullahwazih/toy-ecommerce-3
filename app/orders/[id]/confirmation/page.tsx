// app/orders/[id]/confirmation/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import API from "@/app/lib/api";

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<Order["status"], { bg: string; text: string; dot: string; label: string }> = {
    pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400", label: "Pending" },
    confirmed: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400", label: "Confirmed" },
    shipped: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-400", label: "Shipped" },
    delivered: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400", label: "Delivered" },
    cancelled: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-400", label: "Cancelled" },
};

// ─── Confetti (tiny CSS-only burst) ──────────────────────────────────────────

const CONFETTI_COLORS = ["#6366f1", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#38bdf8"];

function ConfettiBurst() {
    const pieces = Array.from({ length: 24 }, (_, i) => ({
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        angle: (360 / 24) * i,
        size: Math.random() * 6 + 4,
        dist: Math.random() * 60 + 50,
        delay: Math.random() * 300,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {pieces.map((p, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: p.size,
                        height: p.size,
                        borderRadius: i % 3 === 0 ? "50%" : "2px",
                        background: p.color,
                        opacity: 0,
                        transform: "translate(-50%, -50%)",
                        animation: `confetti-fly 0.9s ease-out ${p.delay}ms forwards`,
                        ["--angle" as any]: `${p.angle}deg`,
                        ["--dist" as any]: `${p.dist}px`,
                    }}
                />
            ))}
            <style>{`
                @keyframes confetti-fly {
                    0%   { opacity: 1; transform: translate(-50%, -50%) rotate(0deg) translateY(0); }
                    100% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--angle)) translateY(calc(-1 * var(--dist))); }
                }
            `}</style>
        </div>
    );
}

// ─── Animated check icon ──────────────────────────────────────────────────────

function AnimatedCheck() {
    return (
        <div className="relative w-16 h-16 flex-shrink-0">
            <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
                <circle
                    cx="32" cy="32" r="28"
                    stroke="#6366f1"
                    strokeWidth="3"
                    strokeDasharray="175.9"
                    strokeDashoffset="175.9"
                    style={{ animation: "draw-circle 0.5s ease forwards" }}
                />
                <polyline
                    points="18,32 27,41 46,22"
                    stroke="#6366f1"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="42"
                    strokeDashoffset="42"
                    style={{ animation: "draw-check 0.4s ease 0.45s forwards" }}
                />
            </svg>
            <style>{`
                @keyframes draw-circle {
                    to { stroke-dashoffset: 0; }
                }
                @keyframes draw-check {
                    to { stroke-dashoffset: 0; }
                }
            `}</style>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrderConfirmationPage() {
    const router = useRouter();
    const params = useParams();
    const orderId = params?.id as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showBurst, setShowBurst] = useState(false);
    const burstTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await API.get(`/orders/${orderId}`);
                setOrder(res.data.order);
                // Trigger confetti burst shortly after mount
                burstTimer.current = setTimeout(() => {
                    setShowBurst(true);
                    setTimeout(() => setShowBurst(false), 1400);
                }, 200);
            } catch (err: any) {
                if (err.response?.status === 401) router.push("/login");
                else setError("Could not load your order. Please check your orders page.");
            } finally {
                setLoading(false);
            }
        };
        if (orderId) fetchOrder();
        return () => { if (burstTimer.current) clearTimeout(burstTimer.current); };
    }, [orderId]);

    // ── Loading ──

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                    <p className="text-sm text-gray-500">Loading your order…</p>
                </div>
            </div>
        );
    }

    // ── Error ──

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md w-full text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                    </div>
                    <p className="text-sm text-gray-600">{error ?? "Order not found."}</p>
                    <button
                        onClick={() => router.push("/orders")}
                        className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                        Go to My Orders →
                    </button>
                </div>
            </div>
        );
    }

    const { shippingAddress: addr, items, itemsTotal, shippingCharge, grandTotal, estimatedDelivery, status, createdAt } = order;
    const statusStyle = STATUS_STYLES[status];
    const formattedDate = new Date(createdAt).toLocaleDateString("en-BD", {
        year: "numeric", month: "long", day: "numeric",
    });
    const formattedTime = new Date(createdAt).toLocaleTimeString("en-BD", {
        hour: "2-digit", minute: "2-digit",
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto space-y-5">

                {/* ── Success Banner ── */}
                <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center text-center overflow-hidden">
                    {showBurst && <ConfettiBurst />}

                    <AnimatedCheck />

                    <h1
                        className="text-2xl font-bold text-gray-900 mt-5 tracking-tight"
                        style={{ animation: "fade-up 0.5s ease 0.8s both" }}
                    >
                        Order Placed!
                    </h1>
                    <p
                        className="text-sm text-gray-500 mt-1.5 max-w-xs leading-relaxed"
                        style={{ animation: "fade-up 0.5s ease 0.95s both" }}
                    >
                        Thank you, <span className="font-medium text-gray-700">{addr.fullName}</span>. Your order has been received and will be delivered to you soon.
                    </p>

                    {/* Order ID + Date */}
                    <div
                        className="mt-5 flex flex-wrap justify-center gap-3"
                        style={{ animation: "fade-up 0.5s ease 1.05s both" }}
                    >
                        <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 text-xs text-gray-500 font-medium">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-gray-400">
                                <rect x="3" y="3" width="18" height="18" rx="3" />
                                <path d="M8 7h8M8 12h5" />
                            </svg>
                            #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 text-xs text-gray-500 font-medium">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-gray-400">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {formattedDate} · {formattedTime}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 ${statusStyle.bg} border border-transparent rounded-full px-4 py-1.5 text-xs ${statusStyle.text} font-medium`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                            {statusStyle.label}
                        </span>
                    </div>

                    <style>{`
                        @keyframes fade-up {
                            from { opacity: 0; transform: translateY(10px); }
                            to   { opacity: 1; transform: translateY(0); }
                        }
                    `}</style>
                </div>

                {/* ── Delivery Info ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Delivery Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div className="flex gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-indigo-600">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">Contact</p>
                                <p className="text-sm font-semibold text-gray-800">{addr.fullName}</p>
                                <p className="text-xs text-gray-500">{addr.phone}</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-indigo-600">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">Address</p>
                                <p className="text-sm font-semibold text-gray-800">{addr.address}</p>
                                <p className="text-xs text-gray-500">{addr.area}, {addr.city}</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-indigo-600">
                                    <rect x="1" y="3" width="15" height="13" rx="2" />
                                    <path d="M16 8h4l3 5v3h-7V8z" />
                                    <circle cx="5.5" cy="18.5" r="2.5" />
                                    <circle cx="18.5" cy="18.5" r="2.5" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">Est. Delivery</p>
                                <p className="text-sm font-semibold text-gray-800">{estimatedDelivery}</p>
                                <p className="text-xs text-gray-500">{addr.zone === "inside_dhaka" ? "Inside Dhaka" : "Outside Dhaka"}</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-indigo-600">
                                    <rect x="2" y="5" width="20" height="14" rx="2" />
                                    <line x1="2" y1="10" x2="22" y2="10" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">Payment</p>
                                <p className="text-sm font-semibold text-gray-800">Cash on Delivery</p>
                                <p className="text-xs text-gray-500">Pay when order arrives</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ── Order Items ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                        Items ({items.length})
                    </h2>

                    <div className="space-y-3">
                        {items.map((item) => (
                            <div key={item._id} className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden">
                                    <img
                                        src={item.product.imageUrl}
                                        alt={item.product.name}
                                        className="w-full h-full object-contain p-1"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{item.product.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        ৳{item.price.toFixed(2)} × {item.quantity}
                                    </p>
                                </div>
                                <p className="text-sm font-semibold text-gray-700 flex-shrink-0">
                                    ৳{(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Subtotal</span>
                            <span className="font-medium text-gray-700">৳{itemsTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Shipping</span>
                            <span className="font-medium text-gray-700">৳{shippingCharge.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                            <span className="text-sm font-medium text-gray-600">Total Payable</span>
                            <span className="text-2xl font-bold text-gray-900">৳{grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* ── CTA Buttons ── */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => router.push("/orders")}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold py-4 rounded-xl transition-all duration-150 flex items-center justify-center gap-2"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                            <rect x="9" y="3" width="6" height="4" rx="1" />
                        </svg>
                        View My Orders
                    </button>
                    <button
                        onClick={() => router.push("/")}
                        className="flex-1 bg-white hover:bg-gray-50 active:scale-[0.98] text-gray-700 text-sm font-semibold py-4 rounded-xl border border-gray-200 transition-all duration-150 flex items-center justify-center gap-2"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        Continue Shopping
                    </button>
                </div>

            </div>
        </div>
    );
}