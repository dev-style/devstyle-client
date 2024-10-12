"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useRef } from "react";
import { addCollection } from "@/app/admin/lib/action";

const collectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  colors: z.string().min(1, "At least one color is required"),
  show: z.boolean(),
  views: z.number().default(0),
  image: z.string().min(1, " image is required"),
});

type CollectionFormData = z.infer<typeof collectionSchema>;

const AddCollectionPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      show: false,
      views: 0,
    },
  });

  const imageInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (data: CollectionFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image") {
        formData.append(key, value as File);
      } else {
        formData.append(key, value.toString());
      }
    });
    await addCollection(formData);
  };

  const imageFile = watch("image");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setValue("image", base64String);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-primary p-8 rounded-lg mt-5 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-left text-[var(--text)]">
        Add New Collection
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
            name="slug"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Slug"
                className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            )}
          />
          {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}

          <Controller
            name="colors"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Colors (comma-separated)"
                className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            )}
          />
          {errors.colors && (
            <p className="text-red-500">{errors.colors.message}</p>
          )}

          <div className="flex items-center">
            <Controller
              name="show"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="checkbox"
                  id="show"
                  className="mr-2 h-5 w-5"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
            <label htmlFor="show" className="text-[var(--text)]">
              Show Collection
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="image" className="mb-2 text-[var(--text)]">
              Collection Image
            </label>
            <Controller
              name="image"
              control={control}
              render={({ field: { value, ...field } }) => (
                <div className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus-within:ring-2 focus-within:ring-teal-500">
                  <input
                    {...field}
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    ref={imageInputRef}
                  />
                  <label
                    htmlFor="image"
                    className="cursor-pointer flex items-center justify-center"
                  >
                    {imageFile ? (
                      <img
                        src={imageFile}
                        alt="Collection preview"
                        className="max-w-full max-h-48 object-contain"
                      />
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                        <p>Click to upload collection image</p>
                      </div>
                    )}
                  </label>
                </div>
              )}
            />
            {errors.image && (
              <p className="text-red-500">{errors.image.message}</p>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="w-full p-4 bg-teal-500 text-white font-bold border-none rounded-lg cursor-pointer hover:bg-teal-600 transition duration-300"
        >
          Add Collection
        </button>
      </form>
    </div>
  );
};

export default AddCollectionPage;
