"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/app/lib/api";
import ImageLightbox from "@/app/components/ImageLightbox";

type Toy = {
  _id: string;
  name: string;
  description: string;
  brand: string;
  price: number;
  ageRange: string;
  material: string;
  dimensions: string;
  weight: string;
  color: string;
  colors?: string[];
  imageUrl: string;
  imageUrls?: string[];
  rating: number;
  category: string;
};

type AddToCartStatus = "idle" | "loading" | "success" | "error" | "unauth";

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.5"
    className={filled ? "text-amber-400" : "text-gray-300"}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const Badge = ({ label }: { label: string }) => (
  <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full">
    {label}
  </span>
);

const Spec = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
      {label}
    </span>
    <span className="text-sm font-medium text-gray-800">{value}</span>
  </div>
);

const CartIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ColorSwatch = ({
  color,
  selected,
  onClick,
}: {
  color: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={color}
    className={`w-8 h-8 rounded-full border-2 transition-all duration-150 active:scale-95 ${
      selected
        ? "border-indigo-500 ring-2 ring-indigo-200 scale-110"
        : "border-gray-200 hover:border-gray-400"
    }`}
    style={{ backgroundColor: color.toLowerCase() }}
    aria-label={`Select color ${color}`}
    aria-pressed={selected}
  />
);

export default function ToyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [toy, setToy] = useState<Toy | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartStatus, setCartStatus] = useState<AddToCartStatus>("idle");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");

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

  const handleAddToCart = async () => {
    setCartStatus("loading");
    try {
      await API.post("/cart", { productId: toy!._id, quantity: 1 });
      setCartStatus("success");
      setTimeout(() => setCartStatus("idle"), 2000);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setCartStatus("unauth");
        setTimeout(() => router.push("/login"), 1000);
      } else {
        setCartStatus("error");
        setTimeout(() => setCartStatus("idle"), 2000);
      }
    }
  };

  const handleBuyNow = async () => {
    setCartStatus("loading");
    try {
      await API.post("/cart", { productId: toy!._id, quantity: 1 });
      router.push("/cart");
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push("/login");
      } else {
        setCartStatus("error");
        setTimeout(() => setCartStatus("idle"), 2000);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-500 tracking-wide">
            Loading product…
          </p>
        </div>
      </div>
    );
  }

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
      ? toy.imageUrls
      : toy.imageUrl
      ? [toy.imageUrl]
      : []
  ).filter(Boolean);

  const activeImageSrc = images[activeImageIndex] ?? images[0];

  const hasMultipleColors =
    Array.isArray(toy.colors) && toy.colors.length > 1;

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
            <CheckIcon /> Added!
          </>
        );
      case "unauth":
        return "Redirecting to login…";
      case "error":
        return "Failed — try again";
      default:
        return (
          <>
            <CartIcon /> Add to Cart
          </>
        );
    }
  };

  const cartButtonClass = () => {
    const base =
      "flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-3.5 px-6 rounded-xl border transition-all duration-150 active:scale-[0.98]";
    if (cartStatus === "success")
      return `${base} bg-green-50 border-green-200 text-green-700`;
    if (cartStatus === "error")
      return `${base} bg-red-50 border-red-200 text-red-600`;
    return `${base} bg-white hover:bg-gray-50 text-gray-700 border-gray-200`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* IMAGE PANEL */}
          <div className="bg-gray-100 p-6 lg:p-10 min-h-[420px]">
            <div className="flex items-center justify-center">
              <ImageLightbox
                src={activeImageSrc}
                alt={toy.name}
                triggerClassName="w-full max-w-sm"
                imgClassName="w-full object-contain drop-shadow-xl transition-transform duration-300 hover:scale-[1.03]"
              />
            </div>

            {images.length > 1 && (
              <div className="mt-6 grid grid-cols-5 gap-3">
                {images.map((src, i) => {
                  const isActive = i === activeImageIndex;
                  return (
                    <button
                      key={`${src}-${i}`}
                      type="button"
                      onClick={() => setActiveImageIndex(i)}
                      className={`rounded-xl border bg-white p-1 transition-all ${
                        isActive
                          ? "border-indigo-500 ring-2 ring-indigo-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      aria-label={`View image ${i + 1}`}
                    >
                      <img
                        src={src}
                        alt={`${toy.name} thumbnail ${i + 1}`}
                        className="h-16 w-full rounded-lg object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* DETAILS PANEL */}
          <div className="p-8 lg:p-12 flex flex-col justify-between gap-8">

            {/* NAME / RATING / DESCRIPTION */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge label={toy.category} />
                <span className="text-xs text-gray-400">{toy.brand}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight tracking-tight">
                {toy.name}
              </h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} filled={i < ratingRounded} />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {toy.rating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-400">out of 5</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                {toy.description}
              </p>
            </div>

            {/* PRICE */}
            <div className="border-t border-gray-100 pt-5">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
                Price
              </p>
              <p className="text-4xl font-bold text-gray-900">
                ${toy.price.toFixed(2)}
              </p>
            </div>

            {/* COLOR PICKER — only shown when multiple colors exist */}
            {hasMultipleColors && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-widest text-gray-400">
                    Color
                  </p>
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {selectedColor}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {toy.colors!.map((c) => (
                    <ColorSwatch
                      key={c}
                      color={c}
                      selected={selectedColor === c}
                      onClick={() => setSelectedColor(c)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* SPECS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <Spec label="Age Range" value={toy.ageRange} />
              <Spec label="Material" value={toy.material} />
              {/* Show selected color if multi-color, otherwise fall back to toy.color */}
              <Spec
                label="Color"
                value={hasMultipleColors ? selectedColor : toy.color}
              />
              <Spec label="Dimensions" value={toy.dimensions} />
              <Spec label="Weight" value={toy.weight} />
            </div>

            {/* ACTIONS */}
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