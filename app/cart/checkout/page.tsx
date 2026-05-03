    // app/checkout/page.tsx
    "use client";

    import { useEffect, useState } from "react";
    import { useRouter } from "next/navigation";
    import { useForm, Controller } from "react-hook-form";
    import { zodResolver } from "@hookform/resolvers/zod";
    import { z } from "zod";
    import API from "@/app/lib/api";

    // ─── Types ───────────────────────────────────────────────────────────────────

    type Product = {
        _id: string;
        name: string;
        imageUrl: string;
        price: number;
    };

    type CartItem = {
        _id: string;
        product: Product;
        quantity: number;
    };

    type Cart = {
        items: CartItem[];
    };

    type Zone = "inside_dhaka" | "outside_dhaka";

    // ─── Constants ───────────────────────────────────────────────────────────────

    const SHIPPING: Record<Zone, { charge: number; label: string }> = {
        inside_dhaka: { charge: 60, label: "2–3 business days" },
        outside_dhaka: { charge: 120, label: "4–7 business days" },
    };

    const DHAKA_AREAS = [
        "Dhanmondi", "Gulshan", "Banani", "Mirpur", "Mohammadpur",
        "Uttara", "Motijheel", "Wari", "Khilgaon", "Badda",
        "Rampura", "Tejgaon", "Farmgate", "Shahbag", "Paltan",
    ];

    // ─── Zod Schema ──────────────────────────────────────────────────────────────

    const checkoutSchema = z.object({
        zone: z.enum(["inside_dhaka", "outside_dhaka"]),
        fullName: z.string().min(2, "Full name must be at least 2 characters"),
        phone: z
            .string()
            .min(1, "Phone number is required")
            .regex(
                /^(?:\+880|01)[0-9]{9}$/,
                "Enter a valid Bangladeshi phone number (e.g. 01712345678)"
            ),
        address: z.string().min(5, "Please enter your full street address"),
        area: z.string().min(1, "Area is required"),
        city: z.string().min(1, "City is required"),
    });

    type CheckoutFormData = z.infer<typeof checkoutSchema>;

    // ─── Sub-components ──────────────────────────────────────────────────────────

    const FieldWrapper = ({
        label,
        error,
        children,
    }: {
        label: string;
        error?: string;
        children: React.ReactNode;
    }) => (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {label}
            </label>
            {children}
            {error && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );

    const inputClass = (hasError: boolean) =>
        `w-full px-4 py-3 rounded-xl border text-sm text-gray-800 placeholder-gray-400 outline-none transition-all ${hasError
            ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-gray-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
        }`;

    // ─── Page ─────────────────────────────────────────────────────────────────────

    export default function CheckoutPage() {
        const router = useRouter();
        const [cart, setCart] = useState<Cart | null>(null);
        const [cartLoading, setCartLoading] = useState(true);
        const [submitError, setSubmitError] = useState<string | null>(null);

        const {
            register,
            handleSubmit,
            control,
            watch,
            setValue,
            formState: { errors, isSubmitting },
        } = useForm<CheckoutFormData>({
            resolver: zodResolver(checkoutSchema),
            defaultValues: {
                zone: "inside_dhaka",
                fullName: "",
                phone: "",
                address: "",
                area: "",
                city: "Dhaka",
            },
        });

        const selectedZone = watch("zone");

        // When zone changes, reset area and fix city for Dhaka
        const handleZoneChange = (zone: Zone) => {
            setValue("zone", zone, { shouldValidate: true });
            setValue("area", "", { shouldValidate: false });
            setValue("city", zone === "inside_dhaka" ? "Dhaka" : "", { shouldValidate: false });
        };

        useEffect(() => {
            const fetchCart = async () => {
                try {
                    const res = await API.get("/cart");
                    const cartData: Cart = res.data.cart;
                    if (!cartData?.items?.length) {
                        router.push("/cart");
                        return;
                    }
                    setCart(cartData);
                } catch (err: any) {
                    if (err.response?.status === 401) router.push("/login");
                } finally {
                    setCartLoading(false);
                }
            };
            fetchCart();
        }, []);

        const onSubmit = async (data: CheckoutFormData) => {
            setSubmitError(null);
            try {
                const res = await API.post("/orders", { shippingAddress: data });
                router.push(`/orders/${res.data.order._id}/confirmation`);
            } catch (err: any) {
                if (err.response?.status === 401) {
                    router.push("/login");
                } else {
                    setSubmitError("Something went wrong. Please try again.");
                }
            }
        };

        if (cartLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                        <p className="text-sm text-gray-500">Preparing checkout…</p>
                    </div>
                </div>
            );
        }

        const items = cart?.items ?? [];
        const itemsTotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
        const { charge, label: deliveryLabel } = SHIPPING[selectedZone];
        const grandTotal = itemsTotal + charge;

        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-5xl mx-auto">

                    {/* Header */}
                    <div className="mb-8">
                        <button
                            type="button"
                            onClick={() => router.push("/cart")}
                            className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-4 flex items-center gap-1"
                        >
                            ← Back to Cart
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Checkout</h1>
                        <p className="text-sm text-gray-400 mt-1">Fill in your delivery details below</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* ── LEFT COLUMN ── */}
                            <div className="lg:col-span-2 space-y-5">

                                {/* Delivery Zone */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <h2 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">
                                        Delivery Zone
                                    </h2>
                                    <Controller
                                        name="zone"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="grid grid-cols-2 gap-3">
                                                {(["inside_dhaka", "outside_dhaka"] as Zone[]).map((z) => (
                                                    <button
                                                        key={z}
                                                        type="button"
                                                        onClick={() => handleZoneChange(z)}
                                                        className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all duration-150 text-left ${field.value === z
                                                                ? "border-indigo-500 bg-indigo-50"
                                                                : "border-gray-200 bg-white hover:border-gray-300"
                                                            }`}
                                                    >
                                                        <span className={`text-sm font-semibold ${field.value === z ? "text-indigo-700" : "text-gray-700"}`}>
                                                            {z === "inside_dhaka" ? "🏙 Inside Dhaka" : "🗺 Outside Dhaka"}
                                                        </span>
                                                        <span className={`text-xs mt-1 ${field.value === z ? "text-indigo-500" : "text-gray-400"}`}>
                                                            ৳{SHIPPING[z].charge} — {SHIPPING[z].label}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    />
                                </div>

                                {/* Contact Information */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                                        Contact Information
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FieldWrapper label="Full Name" error={errors.fullName?.message}>
                                            <input
                                                {...register("fullName")}
                                                placeholder="e.g. Rahim Uddin"
                                                className={inputClass(!!errors.fullName)}
                                            />
                                        </FieldWrapper>
                                        <FieldWrapper label="Phone Number" error={errors.phone?.message}>
                                            <input
                                                {...register("phone")}
                                                type="tel"
                                                placeholder="e.g. 01712345678"
                                                className={inputClass(!!errors.phone)}
                                            />
                                        </FieldWrapper>
                                    </div>
                                </div>

                                {/* Delivery Address */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                                        Delivery Address
                                    </h2>

                                    <FieldWrapper label="Street Address" error={errors.address?.message}>
                                        <input
                                            {...register("address")}
                                            placeholder="House no, road no, block"
                                            className={inputClass(!!errors.address)}
                                        />
                                    </FieldWrapper>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                        {/* Area */}
                                        <FieldWrapper label="Area" error={errors.area?.message}>
                                            {selectedZone === "inside_dhaka" ? (
                                                <select
                                                    {...register("area")}
                                                    className={inputClass(!!errors.area)}
                                                >
                                                    <option value="">Select area</option>
                                                    {DHAKA_AREAS.map((a) => (
                                                        <option key={a} value={a}>{a}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    {...register("area")}
                                                    placeholder="e.g. Agrabad, Panchlaish"
                                                    className={inputClass(!!errors.area)}
                                                />
                                            )}
                                        </FieldWrapper>

                                        {/* City */}
                                        <FieldWrapper label="City" error={errors.city?.message}>
                                            {selectedZone === "inside_dhaka" ? (
                                                <input
                                                    value="Dhaka"
                                                    disabled
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-400 cursor-not-allowed"
                                                />
                                            ) : (
                                                <input
                                                    {...register("city")}
                                                    placeholder="e.g. Chittagong, Sylhet"
                                                    className={inputClass(!!errors.city)}
                                                />
                                            )}
                                        </FieldWrapper>

                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
                                        Payment Method
                                    </h2>
                                    <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-indigo-500 bg-indigo-50">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-indigo-600">
                                                <rect x="2" y="5" width="20" height="14" rx="2" />
                                                <line x1="2" y1="10" x2="22" y2="10" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-indigo-700">Cash on Delivery</p>
                                            <p className="text-xs text-indigo-400 mt-0.5">Pay when your order arrives at your door</p>
                                        </div>
                                        <div className="ml-auto w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* ── RIGHT COLUMN — Order Summary ── */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6 space-y-5">
                                    <h2 className="text-base font-bold text-gray-900 tracking-tight">Order Summary</h2>

                                    {/* Items */}
                                    <div className="space-y-3">
                                        {items.map((item) => (
                                            <div key={item._id} className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                                                    <img
                                                        src={item.product.imageUrl}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-contain p-1"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-gray-700 truncate">{item.product.name}</p>
                                                    <p className="text-xs text-gray-400">×{item.quantity}</p>
                                                </div>
                                                <p className="text-xs font-semibold text-gray-700 flex-shrink-0">
                                                    ৳{(item.product.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Totals */}
                                    <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                                        <div className="flex justify-between text-gray-500">
                                            <span>Subtotal</span>
                                            <span className="font-medium text-gray-700">৳{itemsTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500">
                                            <span>Shipping</span>
                                            <span className="font-medium text-gray-700">৳{charge}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-indigo-500 bg-indigo-50 rounded-lg px-3 py-2">
                                            <span>Est. Delivery</span>
                                            <span className="font-semibold">{deliveryLabel}</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-500">Total</span>
                                        <span className="text-2xl font-bold text-gray-900">৳{grandTotal.toFixed(2)}</span>
                                    </div>

                                    {/* Submit error */}
                                    {submitError && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-600 flex items-center gap-2">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                            </svg>
                                            {submitError}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 text-white text-sm font-semibold py-4 rounded-xl transition-all duration-150 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Placing Order…
                                            </>
                                        ) : (
                                            "Place Order — Cash on Delivery"
                                        )}
                                    </button>

                                    <p className="text-xs text-gray-400 text-center leading-relaxed">
                                        By placing your order you agree to our terms. Payment is collected upon delivery.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        );
    }