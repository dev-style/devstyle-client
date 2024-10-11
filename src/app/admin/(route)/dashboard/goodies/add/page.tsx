"use client";

import { addGoodie } from "@/app/admin/lib/action";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const goodieSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  slug: z.string().min(1, "Slug is required"),
  fromCollection: z
    .array(z.string())
    .min(1, "At least one collection is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  inPromo: z.boolean(),
  promoPercentage: z.coerce.number().min(0).max(100).optional(),
  sizes: z.string().min(1, "At least one size is required"),
  availableColors: z.string().min(1, "At least one color is required"),
  backgroundColors: z
    .string()
    .min(1, "At least one background color is required"),
  show: z.boolean(),
  views: z.number().default(0),
  likes: z.number().default(0),
  mainImage: z
    .instanceof(File)
    .refine((file) => file !== null, "Main image is required"),
  images: z.array(z.instanceof(File)).optional(),
});

type GoodieFormData = z.infer<typeof goodieSchema>;

const ImagePreview = ({ file, index, moveImage }: { file: File; index: number; moveImage: (fromIndex: number, toIndex: number) => void }) => {
  const [, ref] = useDrag({
    type: "IMAGE",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "IMAGE",
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveImage(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="relative w-24 h-24 m-2">
      <img
        src={URL.createObjectURL(file)}
        alt={`Preview ${index}`}
        className="w-full h-full object-cover rounded-lg"
      />
      <span className="absolute top-0 right-0 bg-white rounded-full p-1">
        {index + 1}
      </span>
    </div>
  );
};

const AddGoodiePage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<GoodieFormData>({
    resolver: zodResolver(goodieSchema),
    defaultValues: {
      inPromo: false,
      show: false,
      views: 0,
      likes: 0,
    },
  });

  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (data: GoodieFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "mainImage") {
        formData.append(key, value as File);
      } else if (key === "images") {
        additionalImages.forEach((file, index) => {
          formData.append(`images`, file);
        });
      } else if (key === "fromCollection") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    });
    await addGoodie(formData);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    setAdditionalImages((prevImages) => {
      const newImages = [...prevImages];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      return newImages;
    });
  };

  const mainImageFile = watch("mainImage");

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("mainImage", file);
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAdditionalImages((prev) => [...prev, ...files]);
    setValue("images", [...additionalImages, ...files]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-primary p-8 rounded-lg mt-5 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-left text-[var(--text)]">
          Add New Goodie
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ... (previous form fields remain unchanged) ... */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Name"
                  className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              )}
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Description"
                  className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              )}
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
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
            {errors.slug && (
              <p className="text-red-500">{errors.slug.message}</p>
            )}

            <Controller
              name="fromCollection"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Collections (comma-separated)"
                  className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.split(",").map((item) => item.trim())
                    )
                  }
                />
              )}
            />
            {errors.fromCollection && (
              <p className="text-red-500">{errors.fromCollection.message}</p>
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

            <div className="flex items-center space-x-4">
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
              <Controller
                name="promoPercentage"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    placeholder="Promo %"
                    className="flex-grow p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                )}
              />
            </div>
            {errors.promoPercentage && (
              <p className="text-red-500">{errors.promoPercentage.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="sizes"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Sizes (comma-separated)"
                  className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              )}
            />
            {errors.sizes && (
              <p className="text-red-500">{errors.sizes.message}</p>
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
                />
              )}
            />
            {errors.availableColors && (
              <p className="text-red-500">{errors.availableColors.message}</p>
            )}
          </div>
          <Controller
            name="backgroundColors"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Background Colors (comma-separated)"
                className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            )}
          />
          {errors.backgroundColors && (
            <p className="text-red-500">{errors.backgroundColors.message}</p>
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
              Show Goodie
            </label>
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
                      onChange={handleMainImageChange}
                      className="hidden"
                      ref={mainImageInputRef}
                    />
                    <label
                      htmlFor="mainImage"
                      className="cursor-pointer flex items-center justify-center"
                    >
                      {mainImageFile ? (
                        <img
                          src={URL.createObjectURL(mainImageFile)}
                          alt="Main preview"
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
            <div className="flex flex-col">
              <label htmlFor="images" className="mb-2 text-[var(--text)]">
                Additional Images
              </label>
              <Controller
                name="images"
                control={control}
                render={({ field: { value, ...field } }) => (
                  <div className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus-within:ring-2 focus-within:ring-teal-500">
                    <input
                      {...field}
                      type="file"
                      id="images"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImagesChange}
                      className="hidden"
                      ref={additionalImagesInputRef}
                    />
                    <label
                      htmlFor="images"
                      className="cursor-pointer flex flex-wrap items-center"
                    >
                      {additionalImages.map((file, index) => (
                        <ImagePreview
                          key={index}
                          file={file}
                          index={index}
                          moveImage={moveImage}
                        />
                      ))}
                      <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center m-2">
                        <p>+</p>
                      </div>
                    </label>
                  </div>
                )}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full p-4 bg-teal-500 text-white font-bold border-none rounded-lg cursor-pointer hover:bg-teal-600 transition duration-300"
          >
            Add Goodie
          </button>
        </form>
      </div>
    </DndProvider>
  );
};

export default AddGoodiePage;
