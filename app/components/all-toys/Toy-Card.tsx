type Toy = {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
    rating: number;
};

import ImageLightbox from "@/app/components/ImageLightbox";
import Link from "next/link";

export default function ToyCard({ toy }: { toy: Toy }) {
    return (
        <div className="bg-base-200 rounded-xl p-4 shadow flex flex-col">

            {/* Image */}
            <ImageLightbox
                src={toy.imageUrl}
                alt={toy.name}
                triggerClassName="w-full"
                imgClassName="w-full h-40 object-cover rounded-lg"
            />

            {/* Info */}
            <h3 className="font-semibold mt-3">{toy.name}</h3>
            <p className="text-sm opacity-70">{toy.category}</p>

            <div className="flex justify-between items-center mt-2">
                <span className="font-bold">${toy.price}</span>
                <span className="text-sm">⭐ {toy.rating}</span>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex gap-2">

                {/* View Details */}
                <Link
                    href={`/all-toys/${toy._id}`}
                    className="flex-1"
                >
                    <button className="btn btn-sm btn-outline w-full">
                        View Details
                    </button>
                </Link>

                {/* Buy */}
                <button className="btn btn-sm btn-primary flex-1">
                    Buy
                </button>

            </div>

        </div>
    );
}
