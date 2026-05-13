"use client";

type Props = {
    colors: string[];
    selectedColor: string;
    setSelectedColor: (color: string) => void;
};

export default function ColorPicker({
    colors,
    selectedColor,
    setSelectedColor,
}: Props) {

    
    if (!colors || colors.length <= 1) return null;

    return (
        <div className="space-y-2">

            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest text-gray-400">
                    Color
                </p>
                <span className="text-sm font-medium text-gray-700 capitalize">
                    {selectedColor}
                </span>
            </div>

            {/* Swatches */}
            <div className="flex items-center gap-3 flex-wrap">
                {colors.map((c) => {
                    const isActive = selectedColor === c;

                    return (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setSelectedColor(c)}
                            title={c}
                            className={`w-8 h-8 rounded-full border-2 transition-all duration-150 active:scale-95 ${isActive
                                ? "border-indigo-500 ring-2 ring-indigo-200 scale-110"
                                : "border-gray-200 hover:border-gray-400"
                                }`}
                            style={{ backgroundColor: c.toLowerCase() }}
                            aria-label={`Select color ${c}`}
                            aria-pressed={isActive}
                        />
                    );
                })}
            </div>

        </div>
    );
}
