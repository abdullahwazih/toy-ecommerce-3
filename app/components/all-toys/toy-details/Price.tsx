"use client";

type Props = {
    price: number;
};

export default function PriceDisplay({ price }: Props) {
    return (
        <div className="border-t border-gray-100 pt-5">

            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
                Price
            </p>

            <p className="text-4xl font-bold text-gray-900">
                ${price.toFixed(2)}
            </p>

        </div>
    );
}