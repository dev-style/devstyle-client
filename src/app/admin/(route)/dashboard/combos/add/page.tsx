"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useRef } from "react";
// import { addCombo } from "@/app/admin/lib/action";

const comboSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be a positive number"),
  inPromo: z.boolean(),
  promoPercentage: z.number().min(0).max(100).optional(),
  items: z.array(z.string()).min(1, "At least one item is required"),
  availableColors: z.array(z.string()).min(1, "At least one available color is required"),
  backgroundColors: z.array(z.string()).min(1, "At least one background color is required"),
  mainImage: z.string().min(1, "Main image is required"),
});

type ComboFormData = z.infer<typeof comboSchema>;

const AddComboPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ComboFormData>({
    resolver: zodResolver(comboSchema),
    defaultValues: {
      inPromo: false,
      items: [],
      availableColors: [],
      backgroundColors: [],
    },
  });

  const imageInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (data: ComboFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "mainImage") {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    });
    // await addCombo(formData);
  };

  const mainImage = watch("mainImage");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setValue("mainImage", base64String);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-primary p-8 rounded-lg mt-5 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-left text-[var(--text)]">
        Add New Combo
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Title"
                className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            )}
          />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="Description"
                className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            )}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}

          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                placeholder="Price"
                className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            )}
          />
          {errors.price && (
            <p className="text-red-500">{errors.price.message}</p>
          )}

          <div className="flex items-center">
            <Controller
              name="inPromo"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="checkbox"
                  id="inPromo"
                  className="mr-2 h-5 w-5"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
            <label htmlFor="inPromo" className="text-[var(--text)]">
              In Promo
            </label>
          </div>

          {watch("inPromo") && (
            <Controller
              name="promoPercentage"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  placeholder="Promo Percentage"
                  className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              )}
            />
          )}
          {errors.promoPercentage && (
            <p className="text-red-500">{errors.promoPercentage.message}</p>
          )}

          <Controller
            name="items"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Items (comma-separated)"
                className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={(e) => field.onChange(e.target.value.split(','))}
              />
            )}
          />
          {errors.items && (
            <p className="text-red-500">{errors.items.message}</p>
          )}

          <Controller
            name="availableColors"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Available Colors (comma-separated)"
                className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={(e) => field.onChange(e.target.value.split(','))}
              />
            )}
          />
          {errors.availableColors && (
            <p className="text-red-500">{errors.availableColors.message}</p>
          )}

          <Controller
            name="backgroundColors"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Background Colors (comma-separated)"
                className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={(e) => field.onChange(e.target.value.split(','))}
              />
            )}
          />
          {errors.backgroundColors && (
            <p className="text-red-500">{errors.backgroundColors.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="mainImage" className="mb-2 text-[var(--text)]">
              Main Image
            </label>
            <Controller
              name="mainImage"
              control={control}
              render={({ field: { value, ...field } }) => (
                <div className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus-within:ring-2 focus-within:ring-teal-500">
                  <input
                    {...field}
                    type="file"
                    id="mainImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    ref={imageInputRef}
                  />
                  <label
                    htmlFor="mainImage"
                    className="cursor-pointer flex items-center justify-center"
                  >
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt="Combo preview"
                        className="max-w-full max-h-48 object-contain"
                      />
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                        <p>Click to upload main image</p>
                      </div>
                    )}
                  </label>
                </div>
              )}
            />
            {errors.mainImage && (
              <p className="text-red-500">{errors.mainImage.message}</p>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="w-full p-4 bg-teal-500 text-white font-bold border-none rounded-lg cursor-pointer hover:bg-teal-600 transition duration-300"
        >
          Add Combo
        </button>
      </form>
    </div>
  );
};

export default AddComboPage;
