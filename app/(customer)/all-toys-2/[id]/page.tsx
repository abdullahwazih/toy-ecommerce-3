"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";


import API from "@/app/lib/api";
import axios from "axios";

// Types
import { Toy, AddToCartStatus } from "@/types/toy";

//Components
import Loading from "../../../components/ui/Loading";
import ImagePanel from "@/app/components/all-toys/toy-details/Image-Panel";
import ProductInfo from "@/app/components/all-toys/toy-details/Name-Rating-Desc";
import PriceDisplay from "@/app/components/all-toys/toy-details/Price";
import ColorPicker from "@/app/components/all-toys/toy-details/Color-Picker";
import SpecsGrid from "@/app/components/all-toys/toy-details/Spec";

// Icons
import { ShoppingCart, Check } from "lucide-react";

export default function ToyDetailPage() {


    const { id } = useParams();
    const router = useRouter();
    const [toy, setToy] = useState<Toy | null>(null);
    const [loading, setLoading] = useState(true);
    const [cartStatus, setCartStatus] = useState<AddToCartStatus>("idle");
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState<string>("");


    // Fetch toy details on mount
    useEffect(() => {
        const fetchToy = async () => {
            try {
                const res = await API.get(`/products/${id}`);
                const fetchedToy: Toy = res.data.product;
                setToy(fetchedToy);
                setActiveImageIndex(0);
                // Set default selected color
                if (fetchedToy.colors && fetchedToy.colors.length > 0) {
                    setSelectedColor(fetchedToy.colors[0]);
                } else if (fetchedToy.color) {
                    setSelectedColor(fetchedToy.color);
                }
            } catch {
                console.error("Failed to fetch toy");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchToy();

    }, [id]);

    // Handle Add to Cart
    const handleAddToCart = async () => {
        setCartStatus("loading");
        try {
            await API.post("/cart", { productId: toy!._id, quantity: 1 });
            setCartStatus("success");
            setTimeout(() => setCartStatus("idle"), 2000);

        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    setCartStatus("unauth");

                    setTimeout(() => {
                        router.push("/login");
                    }, 1000);

                    return;
                }
            } else {
                setCartStatus("error");
                setTimeout(() => setCartStatus("idle"), 2000);
            }
        }
    };

    // For "Buy Now", we can reuse the add to cart logic but redirect immediately to cart page on success
    const handleBuyNow = async () => {
        setCartStatus("loading");
        try {
            await API.post("/cart", { productId: toy!._id, quantity: 1 });
            router.push("/cart");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    router.push("/login");
                }
            }
        }
    };

    // Render loading state
    if (loading) {
        return <Loading fullScreen size="lg" text="Loading product..." />
    }

    // In case toy is null after loading (e.g., product not found), show a message
    if (!toy) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center space-y-2">
                    <p className="text-2xl font-semibold text-gray-800">
                        Product not found
                    </p>
                    <p className="text-sm text-gray-500">
                        The item you're looking for doesn't exist or was removed.
                    </p>
                </div>
            </div>
        );
    }

    const ratingRounded = Math.round(toy.rating);

    const isActionDisabled =
        cartStatus === "loading" || cartStatus === "unauth";

    const images = (
        Array.isArray(toy.imageUrls) && toy.imageUrls.length > 0
            ? toy.imageUrls : toy.imageUrl ? [toy.imageUrl] : []
    ).filter(Boolean);

    const cartButtonClass = () => {
        const base =
            "flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-3.5 px-6 rounded-xl border transition-all duration-150 active:scale-[0.98]";
        if (cartStatus === "success")
            return `${base} bg-green-50 border-green-200 text-green-700`;
        if (cartStatus === "error")
            return `${base} bg-red-50 border-red-200 text-red-600`;
        return `${base} bg-white hover:bg-gray-50 text-gray-700 border-gray-200`;
    };

    const cartButtonContent = () => {
        switch (cartStatus) {
            case "loading":
                return (
                    <>
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        Adding…
                    </>
                );
            case "success":
                return (
                    <>
                        <Check size={16} /> Added!
                    </>
                );
            case "unauth":
                return "Redirecting to login…";
            case "error":
                return "Failed — try again";
            default:
                return (
                    <>
                        <ShoppingCart size={16} /> Add to Cart
                    </>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">

                    {/* IMAGE PANEL */}

                    <ImagePanel
                        images={images}
                        activeImageIndex={activeImageIndex}
                        setActiveImageIndex={setActiveImageIndex}
                        toyName={toy.name}
                    />
                    {/* INFO PANEL */}
                    <div className="p-8 lg:p-12 flex flex-col justify-between gap-8">


                        <ProductInfo toy={toy} ratingRounded={ratingRounded} />
                        <PriceDisplay price={toy.price} />
                        <ColorPicker
                            colors={toy.colors || []}
                            selectedColor={selectedColor}
                            setSelectedColor={setSelectedColor}
                        />
                        <SpecsGrid
                            ageRange={toy.ageRange}
                            material={toy.material}
                            color={selectedColor || toy.color}
                            dimensions={toy.dimensions}
                            weight={toy.weight}
                        />

                        {/* Action */}

                        <div className="flex flex-col sm:flex-row gap-3 pt-1">
                            <button
                                onClick={handleBuyNow}
                                disabled={isActionDisabled}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 text-white text-sm font-semibold py-3.5 px-6 rounded-xl transition-all duration-150"
                            >
                                Buy Now
                            </button>

                            <button
                                onClick={handleAddToCart}
                                disabled={isActionDisabled}
                                className={cartButtonClass()}
                            >
                                {cartButtonContent()}
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </div>

    );
}