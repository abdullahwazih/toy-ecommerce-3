"use client";

type Props = {
    toy: {
        name: string;
        category: string;
        brand: string;
        rating: number;
        description: string;
    };
    ratingRounded: number;
};

export default function ProductInfo({ toy, ratingRounded }: Props) {
    return (
        <div className="space-y-3">

            {/* Category + Brand */}
            <div className="flex items-center gap-2">
                <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full">
                    {toy.category}
                </span>
                <span className="text-xs text-gray-400">{toy.brand}</span>
            </div>

            {/* Name */}
            <h1 className="text-3xl font-bold text-gray-900 leading-tight tracking-tight">
                {toy.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <span
                            key={i}
                            className={i < ratingRounded ? "text-amber-400" : "text-gray-300"}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <span className="text-sm font-medium text-gray-600">
                    {toy.rating.toFixed(1)}
                </span>

                <span className="text-sm text-gray-400">out of 5</span>
            </div>

            {/* Description */}
            <p className="text-gray-500 text-sm leading-relaxed">
                {toy.description}
            </p>

        </div>
    );
}