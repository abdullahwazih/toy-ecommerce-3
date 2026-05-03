import mongoose, { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  brand: string;
  shortDescription: string;
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
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    ageRange: { type: String, required: true, trim: true },
    material: { type: String, required: true, trim: true },
    dimensions: { type: String, required: true, trim: true },
    weight: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    colors: { type: [String], default: [] },
    imageUrl: { type: String, required: true, trim: true },
    imageUrls: { type: [String], default: [] },
    rating: { type: Number, required: true, min: 0, max: 5 },
    category: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export default mongoose.model<IProduct>("Product", productSchema);
