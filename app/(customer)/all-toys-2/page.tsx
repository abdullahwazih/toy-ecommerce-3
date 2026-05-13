'use client';

import ToyCard from "../../components/all-toys/Toy-Card";
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

export default function AllToysPage2() {
  
  const { data, isLoading, isError } = useQuery<Response>({
    queryKey: ["toys"],
    queryFn: async () => {
      const res = await API.get("/products");
      return res.data;
    },
  });

  return (
    <div>

      {isLoading && <p>Loading toys...</p>}

      {isError && <p>Failed to load toys</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.products.map((toy) => (
          <ToyCard key={toy._id} toy={toy} />
        ))}
      </div>
      
    </div>
  );
}
