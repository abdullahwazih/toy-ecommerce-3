// /types/toy.ts
export type Toy = {
  _id: string;
  name: string;
  description: string;
  brand: string;
  price: number;
  ageRange: string;
  material: string;
  dimensions: string;
  weight: string;
  color: string;
  colors?: string[];
  imageUrl: string;
  imageUrls?: string[];
  rating: number;
  category: string;
};

export type AddToCartStatus =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "unauth";