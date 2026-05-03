import { useState } from "react";

export default function ToyFilter() {
    const [price, setPrice] = useState([0, 500]);

    return (
        <div className="bg-base-200 p-4 rounded-xl space-y-4">

            <h2 className="font-bold text-lg">Filters</h2>

            {/* Category */}
            <div>
                <p className="font-semibold mb-1">Category</p>
                <select className="select select-bordered w-full">
                    <option>All</option>
                    <option>Cars</option>
                    <option>Dolls</option>
                    <option>Blocks</option>
                </select>
            </div>

            {/* ⭐ Price Range */}
            <div>
                <p className="font-semibold mb-2">
                    Price Range: ${price[0]} - ${price[1]}
                </p>

                {/* Min */}
                <input
                    type="range"
                    min="0"
                    max="500"
                    value={price[0]}
                    onChange={(e) =>
                        setPrice([Number(e.target.value), price[1]])
                    }
                    className="range range-primary"
                />

                {/* Max */}
                <input
                    type="range"
                    min="0"
                    max="500"
                    value={price[1]}
                    onChange={(e) =>
                        setPrice([price[0], Number(e.target.value)])
                    }
                    className="range range-primary mt-2"
                />
            </div>

            {/* Rating */}
            <div>
                <p className="font-semibold mb-1">Minimum Rating</p>
                <select className="select select-bordered w-full">
                    <option>All</option>
                    <option>4+</option>
                    <option>3+</option>
                </select>
            </div>

        </div>
    );
}