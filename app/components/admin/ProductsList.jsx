"use client";

import Link from "next/link";

export default function ProductsList({ products, loading, onDelete }) {
  if (loading) {
    return (
      <div className="overflow-x-auto bg-base-200 rounded-xl p-4">
        <div className="h-8 w-full animate-pulse rounded bg-black/5" />
        <div className="mt-3 h-32 w-full animate-pulse rounded bg-black/5" />
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="bg-base-200 rounded-xl p-6 text-sm text-slate-600">
        No products found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-base-200 rounded-xl p-4">
      <table className="table w-full">

        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Category</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.brand}</td>
              <td>${p.price}</td>
              <td>{p.category}</td>
              <td>{p.rating}</td>

              <td className="flex gap-2">

                <Link href={`/admin/products/edit/${p._id}`}>
                  <button className="btn btn-sm btn-warning">
                    Edit
                  </button>
                </Link>

                <button
                  className="btn btn-sm btn-error"
                  onClick={() => onDelete?.(p._id)}
                >
                  Delete
                </button>

              </td>
            </tr>
          ))}

        </tbody>

      </table>
    </div>
  );
}
