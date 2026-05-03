"use client";

import ToyCard from "../components/all-toys/Toy-Card";
import ToyFilter from "../components/all-toys/Side-Bar";



import { useQuery } from "@tanstack/react-query";
import API from "@/app/lib/api";


type Toy = {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  rating: number;
};

type Response = {
  products: Toy[];
};

export default function ToysPage() {
  const { data, isLoading, isError } = useQuery<Response>({
    queryKey: ["toys"],
    queryFn: async () => {
      const res = await API.get("/products");
      return res.data;
    },
  });

  return (
    <div className="p-6 flex gap-6">

      {/* LEFT SIDEBAR (FILTERS) */}
      <aside className="w-72 bg-base-200 p-4 rounded-xl h-fit sticky top-6">
        <ToyFilter />
      </aside>

      {/* RIGHT CONTENT (TOYS GRID) */}
      <main className="flex-1">

        <h1 className="text-2xl font-bold mb-4">All Toys</h1>

        {isLoading && <p>Loading toys...</p>}
        {isError && <p>Failed to load toys</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.products.map((toy) => (
            <ToyCard key={toy._id} toy={toy} />
          ))}
        </div>

      </main>

    </div>
  );
}