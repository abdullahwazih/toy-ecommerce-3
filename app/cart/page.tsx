// app/cart/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/app/lib/api";

// Types
import type { Product } from "@/app/models/Cart-Product";
import type { CartItem } from "@/app/models/Cart-Item";
import type { Cart } from "@/app/models/Cart";

// Icons
import { TrashIcon } from "../components/Cart/Trash-icon";
import { MinusIcon } from "../components/Cart/Minus-icon";
import { PlusIcon } from "../components/Cart/plus-icon";
import { EmptyCartIcon } from "../components/Cart/Empty-cart-icon";




export default function CartPage() {

    const router = useRouter();
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [checkingOut, setCheckingOut] = useState(false);

    useEffect(() => {
        setCheckingOut(false);
        const fetchCart = async () => {
            try {
                const res = await API.get("/cart");
                setCart(res.data.cart);
            } catch (err: any) {
                if (err.response?.status === 401) {
                    router.push("/login");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    const updateQuantity = async (itemId: string, quantity: number) => {
        setUpdatingId(itemId);
        try {
            const res = await API.patch(`/cart/${itemId}`, { quantity });
            setCart(res.data.cart);
        } catch {
            console.error("Failed to update quantity");
        } finally {
            setUpdatingId(null);
        }
    };

    const removeItem = async (itemId: string) => {
        setUpdatingId(itemId);
        try {
            const res = await API.delete(`/cart/${itemId}`);
            setCart(res.data.cart);
        } catch {
            console.error("Failed to remove item");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleCheckout = () => {
        setCheckingOut(true);
        router.push("/cart/checkout");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                    <p className="text-sm text-gray-500 tracking-wide">Loading your cart…</p>
                </div>
            </div>
        );
    }

    // app/cart/page.tsx

    const items = (cart?.items ?? []).filter(i => i.product != null); // 👈 add this filter
    const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const isEmpty = items.length === 0;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Cart</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        {isEmpty ? "No items yet" : `${items.length} item${items.length > 1 ? "s" : ""}`}
                    </p>
                </div>

                {isEmpty ? (
                    /* Empty State */
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-24 gap-5">
                        <EmptyCartIcon />
                        <div className="text-center space-y-1">
                            <p className="text-lg font-semibold text-gray-800">Your cart is empty</p>
                            <p className="text-sm text-gray-400">Add some toys to get started.</p>
                        </div>
                        <button
                            onClick={() => router.push("/")}
                            className="mt-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-150"
                        >
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-3">
                            {items.map((item) => {
                                const isUpdating = updatingId === item._id;
                                return (
                                    <div
                                        key={item._id}
                                        className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-5 transition-opacity duration-200 ${isUpdating ? "opacity-50 pointer-events-none" : ""}`}
                                    >
                                        {/* Product Image */}
                                        <div className="w-24 h-24 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                                            <img
                                                src={item.product.imageUrl}
                                                alt={item.product.name}
                                                className="w-full h-full object-contain p-2"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 flex flex-col justify-between min-w-0">
                                            <div>
                                                <p className="text-xs text-gray-400 mb-0.5">{item.product.brand}</p>
                                                <p className="font-semibold text-gray-900 text-sm leading-snug truncate">{item.product.name}</p>
                                                <span className="inline-block mt-1 text-xs bg-indigo-50 text-indigo-600 font-medium px-2 py-0.5 rounded-full">
                                                    {item.product.category}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between mt-3">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-2 py-1">
                                                    <button
                                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-gray-600 transition-colors"
                                                    >
                                                        <MinusIcon />
                                                    </button>
                                                    <span className="w-5 text-center text-sm font-semibold text-gray-800">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-gray-600 transition-colors"
                                                    >
                                                        <PlusIcon />
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <p className="text-base font-bold text-gray-900">
                                                        ${(item.product.price * item.quantity).toFixed(2)}
                                                    </p>
                                                    <button
                                                        onClick={() => removeItem(item._id)}
                                                        className="text-gray-300 hover:text-red-400 transition-colors p-1"
                                                        title="Remove item"
                                                    >
                                                        <TrashIcon />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6 space-y-5">
                                <h2 className="text-base font-bold text-gray-900 tracking-tight">Order Summary</h2>

                                <div className="space-y-3 text-sm">
                                    {items.map((item) => (
                                        <div key={item._id} className="flex justify-between text-gray-500">
                                            <span className="truncate max-w-[160px]">
                                                {item.product.name}{" "}
                                                <span className="text-gray-400">×{item.quantity}</span>
                                            </span>
                                            <span className="font-medium text-gray-700 ml-2 flex-shrink-0">
                                                ${(item.product.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-500">Subtotal</span>
                                    <span className="text-xl font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                                </div>

                                <p className="text-xs text-gray-400">
                                    Shipping and any applicable fees calculated at checkout.
                                </p>

                                <button
                                    type="button"
                                    onClick={handleCheckout}
                                    disabled={checkingOut}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 text-white text-sm font-semibold py-3.5 rounded-xl transition-all duration-150 flex items-center justify-center gap-2"
                                >
                                    {checkingOut ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Processing…
                                        </>
                                    ) : (
                                        "Proceed to Checkout"
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => router.push("/")}
                                    className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors text-center py-1"
                                >
                                    ← Continue Shopping
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
