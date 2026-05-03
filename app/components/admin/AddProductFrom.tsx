"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import API from "@/app/lib/api";

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  brand: z.string().min(2, "Brand is required"),
  category: z.string().min(2, "Category is required"),
  shortDescription: z.string().min(10, "Short description is required"),
  description: z.string().min(20, "Description is required"),
  price: z.number().min(0, "Price must be 0 or greater"),
  rating: z.number().min(0, "Rating must be 0-5").max(5, "Rating must be 0-5"),
  ageRange: z.string().min(2, "Age range is required"),
  material: z.string().min(2, "Material is required"),
  dimensions: z.string().min(2, "Dimensions is required"),
  weight: z.string().min(1, "Weight is required"),
  colors: z.array(z.string().min(1, "Color is required")).min(1, "At least one color is required"),
  imageUrls: z
    .array(z.string().url("Image URL must be a valid URL"))
    .min(1, "At least one image is required"),
});

type FormData = z.infer<typeof productSchema>;

export default function AddProductForm() {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      rating: 0,
      price: 0,
      imageUrls: [""],
      colors: [""],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "imageUrls",
  });

  const {
    fields: colorFields,
    append: appendColor,
    remove: removeColor,
    move: moveColor,
  } = useFieldArray({
    control,
    name: "colors",
  });

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        imageUrl: data.imageUrls[0],
        color: data.colors[0],
      };

      await API.post("/products", payload);
      alert("✅ Product added successfully");
      reset();
      router.push("/admin/products");
      router.refresh();
    } catch {
      alert("❌ Failed to add product");
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Add Product</h2>
          <p className="mt-1 text-sm text-slate-600">
            Fill in the product details. All fields are required.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => router.push("/admin/products")}
        >
          Back to Products
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">Basic Info</div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Name</span>
              </div>
              <input
                {...register("name")}
                placeholder="e.g., Wooden Building Blocks"
                className="input input-bordered w-full"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Brand</span>
              </div>
              <input
                {...register("brand")}
                placeholder="e.g., SunnySprout"
                className="input input-bordered w-full"
              />
              {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>}
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Category</span>
              </div>
              <input
                {...register("category")}
                placeholder="e.g., Educational"
                className="input input-bordered w-full"
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Age Range</span>
              </div>
              <input
                {...register("ageRange")}
                placeholder="e.g., 3-6 years"
                className="input input-bordered w-full"
              />
              {errors.ageRange && (
                <p className="mt-1 text-sm text-red-600">{errors.ageRange.message}</p>
              )}
            </label>
          </div>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Short Description</span>
            </div>
            <input
              {...register("shortDescription")}
              placeholder="One sentence summary for cards/listing"
              className="input input-bordered w-full"
            />
            {errors.shortDescription && (
              <p className="mt-1 text-sm text-red-600">{errors.shortDescription.message}</p>
            )}
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Description</span>
            </div>
            <textarea
              {...register("description")}
              placeholder="Full product description..."
              className="textarea textarea-bordered min-h-28 w-full"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </label>
        </div>

        <div className="grid gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">Pricing & Media</div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Price</span>
              </div>
              <input
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                placeholder="0.00"
                className="input input-bordered w-full"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Rating (0-5)</span>
              </div>
              <input
                type="number"
                step="0.1"
                {...register("rating", { valueAsNumber: true })}
                placeholder="4.5"
                className="input input-bordered w-full"
              />
              {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>}
            </label>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-slate-900">Images</div>
                <p className="text-xs text-slate-500">
                  First image is the primary image used in listings.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => append("")}
              >
                + Add Image
              </button>
            </div>

            {errors.imageUrls?.message && (
              <p className="text-sm text-red-600">{errors.imageUrls.message}</p>
            )}

            <div className="grid gap-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-col gap-2 sm:flex-row sm:items-start">
                  <div className="grow">
                    <label className="form-control w-full">
                      <div className="label">
                        <span className="label-text">
                          Image URL {index === 0 ? "(Primary)" : ""}
                        </span>
                      </div>
                      <input
                        {...register(`imageUrls.${index}`)}
                        placeholder="https://..."
                        className="input input-bordered w-full"
                      />
                      {errors.imageUrls?.[index] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.imageUrls[index]?.message}
                        </p>
                      )}
                    </label>
                  </div>

                  <div className="mt-1 flex items-center gap-2 sm:mt-9">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => move(index, 0)}
                      disabled={index === 0}
                      title="Make primary"
                    >
                      Primary
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      title="Remove"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Tip: use a direct image link (ends with .jpg/.png) for best results.
          </p>
        </div>

        <div className="grid gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">Specifications</div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Material</span>
              </div>
              <input
                {...register("material")}
                placeholder="e.g., Wood"
                className="input input-bordered w-full"
              />
              {errors.material && (
                <p className="mt-1 text-sm text-red-600">{errors.material.message}</p>
              )}
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Dimensions</span>
              </div>
              <input
                {...register("dimensions")}
                placeholder="e.g., 10 x 8 x 6 cm"
                className="input input-bordered w-full"
              />
              {errors.dimensions && (
                <p className="mt-1 text-sm text-red-600">{errors.dimensions.message}</p>
              )}
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Weight</span>
              </div>
              <input
                {...register("weight")}
                placeholder="e.g., 250g"
                className="input input-bordered w-full"
              />
              {errors.weight && (
                <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
              )}
            </label>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between gap-3">
                <div className="label py-0">
                  <span className="label-text">Colors</span>
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => appendColor("")}
                >
                  + Add Color
                </button>
              </div>

              {errors.colors?.message && (
                <p className="mt-1 text-sm text-red-600">{errors.colors.message}</p>
              )}

              <div className="mt-2 grid gap-2">
                {colorFields.map((field, index) => (
                  <div key={field.id} className="flex flex-col gap-2 sm:flex-row sm:items-start">
                    <div className="grow">
                      <input
                        {...register(`colors.${index}`)}
                        placeholder={index === 0 ? "Primary color" : "Color"}
                        className="input input-bordered w-full"
                      />
                      {errors.colors?.[index] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.colors[index]?.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 sm:mt-1">
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => moveColor(index, 0)}
                        disabled={index === 0}
                        title="Make primary"
                      >
                        Primary
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => removeColor(index)}
                        disabled={colorFields.length === 1}
                        title="Remove"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => reset()}
            disabled={isSubmitting}
          >
            Reset
          </button>
          <button disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
