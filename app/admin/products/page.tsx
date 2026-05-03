"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import API from "@/app/lib/api";
import ProductsList from "@/app/components/admin/ProductsList";


export default function ProductsPage() {
    type Product = {
        _id: string;
        name: string;
        brand: string;
        price: number;
        category: string;
        rating: number;
    };

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const fetchProducts = async () => {
            try {
                const res = await API.get("/products");
                if (!cancelled) setProducts(res.data.products ?? []);
            } catch {
                if (!cancelled) setProducts([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchProducts();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleDelete = async (id: string) => {
        const confirmDelete = confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        try {
            await API.delete(`/products/${id}`);
            alert("✅ Product deleted");
            setProducts((prev) => prev.filter((p) => p._id !== id));
        } catch {
            alert("❌ Failed to delete");
        }
    };

    const totalProducts = products.length;
    const categoriesCount = useMemo(() => {
        const set = new Set(products.map((p) => p.category).filter(Boolean));
        return set.size;
    }, [products]);

    const avgRating = useMemo(() => {
        if (!products.length) return 0;
        const total = products.reduce((sum, p) => sum + (Number.isFinite(p.rating) ? p.rating : 0), 0);
        return total / products.length;
    }, [products]);

    return (
        <div className="p-6 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Products</h1>

                <Link href="/admin/products/add">
                    <button className="btn btn-primary btn-sm">
                        + Add Product
                    </button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-base-200 p-4 rounded-xl">
                    <p className="text-sm opacity-70">Total Products</p>
                    <h2 className="text-2xl font-bold">{loading ? "…" : totalProducts}</h2>
                </div>

                <div className="bg-base-200 p-4 rounded-xl">
                    <p className="text-sm opacity-70">Categories</p>
                    <h2 className="text-2xl font-bold">{loading ? "…" : categoriesCount}</h2>
                </div>

                <div className="bg-base-200 p-4 rounded-xl">
                    <p className="text-sm opacity-70">Avg Rating</p>
                    <h2 className="text-2xl font-bold">
                        {loading ? "…" : `${avgRating.toFixed(1)} ⭐`}
                    </h2>
                </div>
            </div>

            {/* Table */}

            <ProductsList products={products} loading={loading} onDelete={handleDelete} />


        </div>
    );
}
