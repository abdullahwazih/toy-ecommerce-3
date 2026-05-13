"use client";

type Props = {
    ageRange: string;
    material: string;
    color: string;
    dimensions: string;
    weight: string;
};

export default function SpecsGrid({
    ageRange,
    material,
    color,
    dimensions,
    weight,
}: Props) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 bg-gray-50 rounded-2xl p-5 border border-gray-100">

            <div>
                <p className="text-xs text-gray-400">Age Range</p>
                <p className="text-sm font-medium text-gray-800">{ageRange}</p>
            </div>

            <div>
                <p className="text-xs text-gray-400">Material</p>
                <p className="text-sm font-medium text-gray-800">{material}</p>
            </div>

            <div>
                <p className="text-xs text-gray-400">Color</p>
                <p className="text-sm font-medium text-gray-800">{color}</p>
            </div>

            <div>
                <p className="text-xs text-gray-400">Dimensions</p>
                <p className="text-sm font-medium text-gray-800">{dimensions}</p>
            </div>

            <div>
                <p className="text-xs text-gray-400">Weight</p>
                <p className="text-sm font-medium text-gray-800">{weight}</p>
            </div>

        </div>
    );
}