"use client";

import ImageLightbox from "@/app/components/ImageLightbox";

type Props = {
    images: string[];
    activeImageIndex: number;
    setActiveImageIndex: (index: number) => void;
    toyName: string;
};

export default function ImagePanel({
    images,
    activeImageIndex,
    setActiveImageIndex,
    toyName,
}: Props) {
    
    const activeImageSrc = images[activeImageIndex] ?? images[0];

    return (
        <div className="bg-gray-100 p-6 lg:p-10 min-h-[420px]">
            {/* Main Image */}
            <div className="flex items-center justify-center">
                <ImageLightbox
                    src={activeImageSrc}
                    alt={toyName}
                    triggerClassName="w-full max-w-sm"
                    imgClassName="w-full object-contain drop-shadow-xl transition-transform duration-300 hover:scale-[1.03]"
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="mt-6 grid grid-cols-5 gap-3">
                    {images.map((src, i) => {
                        const isActive = i === activeImageIndex;

                        return (
                            <button
                                key={`${src}-${i}`}
                                type="button"
                                onClick={() => setActiveImageIndex(i)}
                                className={`rounded-xl border bg-white p-1 transition-all ${isActive
                                        ? "border-indigo-500 ring-2 ring-indigo-200"
                                        : "border-gray-200 hover:border-gray-300"
                                    }`}
                                aria-label={`View image ${i + 1}`}
                            >
                                <img
                                    src={src}
                                    alt={`${toyName} thumbnail ${i + 1}`}
                                    className="h-16 w-full rounded-lg object-cover"
                                />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}