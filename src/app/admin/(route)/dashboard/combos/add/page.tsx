"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useRef, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { fetchGoodies } from "@/app/admin/controllers/goodie";
import { Editor } from '@tinymce/tinymce-react';
import { addCombo } from "@/app/admin/controllers/combo";
import { ICombo, IGoodie } from "@/app/admin/lib/interfaces";
import ReactPaginate from 'react-paginate';

const comboSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  inPromo: z.boolean(),
  promoPercentage: z.coerce.number().min(0).max(100).optional(),
  items: z.array(z.string()).min(1, "At least one item is required"),
  mainImage: z.string().min(1, "Main image is required"),
  images: z.array(z.string()).optional(),
  availableColors: z.array(z.string()),
  backgroundColors: z.array(z.string()),
});

type ComboFormData = z.infer<typeof comboSchema>;

const ImagePreview = ({
  imageData,
  index,
  moveImage,
}: {
  imageData: string;
  index: number;
  moveImage: (fromIndex: number, toIndex: number) => void;
}) => {
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
        src={imageData}
        alt={`Preview ${index}`}
        className="w-full h-full object-cover rounded-lg"
      />
      <span className="absolute top-0 right-0 bg-white rounded-full p-1">
        {index + 1}
      </span>
    </div>
  );
};

const GoodieCard = ({ goodie, isSelected, onSelect }: { goodie: IGoodie, isSelected: boolean, onSelect: (id: string) => void }) => (
  <div
    className={`border rounded-lg p-4 cursor-pointer transition-all ${
      isSelected ? 'border-teal-500 bg-teal-100' : 'border-gray-300 hover:border-teal-300'
    }`}
    onClick={() => onSelect(goodie._id)}
  >
    <img src={goodie.mainImage.url} alt={goodie.name} className="w-full h-32 object-cover rounded-md mb-2" />
    <h3 className="text-sm font-semibold text-center">{goodie.name}</h3>
  </div>
);

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

  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);
  const [goodies, setGoodies] = useState<IGoodie[]>([]);
  const [selectedGoodies, setSelectedGoodies] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchGoodiesData(1);
  }, []);

  const fetchGoodiesData = async (page: number) => {
    const { goodies, count } = await fetchGoodies("", page);
    setGoodies(goodies);
    setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    fetchGoodiesData(selected + 1);
  };

  const onSubmit = async (data: ComboFormData) => {
    console.log("data", data);
    await addCombo(data as ICombo);
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
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setValue("mainImage", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    const newImages: string[] = [];

    for (const file of files) {
      const reader = new FileReader();
      const base64String = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      newImages.push(base64String);
    }

    setAdditionalImages(prev => [...prev, ...newImages]);
    setValue("images", [...additionalImages, ...newImages]);
  };

  const handleGoodieSelection = (goodieId: string) => {
    setSelectedGoodies(prev => {
      const newSelection = prev.includes(goodieId)
        ? prev.filter(id => id !== goodieId)
        : [...prev, goodieId];
      setValue("items", newSelection);
      return newSelection;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-primary p-8 rounded-lg mt-5 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-left text-[var(--text)]">
          Add New Combo
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2 col-span-2">
              <label className="text-[var(--text)] font-semibold mb-2">Select Goodies for Combo</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {goodies.map((goodie) => (
                  <GoodieCard
                    key={goodie._id}
                    goodie={goodie}
                    isSelected={selectedGoodies.includes(goodie._id)}
                    onSelect={handleGoodieSelection}
                  />
                ))}
              </div>
              <ReactPaginate
                previousLabel={"← Previous"}
                nextLabel={"Next →"}
                pageCount={totalPages}
                onPageChange={handlePageChange}
                containerClassName={"flex justify-center mt-4 space-x-2"}
                previousLinkClassName={"px-3 py-2 bg-teal-500 text-white rounded-md"}
                nextLinkClassName={"px-3 py-2 bg-teal-500 text-white rounded-md"}
                pageLinkClassName={"px-3 py-2 bg-gray-200 text-gray-700 rounded-md"}
                activeLinkClassName={"bg-teal-600 text-white"}
                disabledClassName={"opacity-50 cursor-not-allowed"}
              />
              {errors.items && (
                <p className="text-red-500 text-sm">{errors.items.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <div className="relative">
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder=" "
                      className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 peer"
                    />
                  )}
                />
                <label className="absolute text-sm text-[var(--text)] dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[var(--bg)] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                  Title
                </label>
              </div>
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <div className="relative">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      placeholder=" "
                      className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 peer"
                      rows={4}
                    />
                  )}
                />
                <label className="absolute text-sm text-[var(--text)] dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[var(--bg)] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                  Description
                </label>
              </div>
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <div className="relative">
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      step="0.01"
                      placeholder=" "
                      className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 peer"
                    />
                  )}
                />
                <label className="absolute text-sm text-[var(--text)] dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[var(--bg)] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                  Price
                </label>
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <div className="relative flex items-center">
                <Controller
                  name="inPromo"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="checkbox"
                      className="mr-2"
                    />
                  )}
                />
                <label className="text-sm text-[var(--text)]">
                  In Promo
                </label>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="relative">
                <Controller
                  name="promoPercentage"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      step="1"
                      min="0"
                      max="100"
                      placeholder=" "
                      className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 peer"
                    />
                  )}
                />
                <label className="absolute text-sm text-[var(--text)] dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[var(--bg)] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                  Promo Percentage
                </label>
              </div>
              {errors.promoPercentage && (
                <p className="text-red-500 text-sm">{errors.promoPercentage.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <div className="relative">
                <Controller
                  name="availableColors"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder=" "
                      className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 peer"
                      onChange={(e) => field.onChange(e.target.value.split(','))}
                    />
                  )}
                />
                <label className="absolute text-sm text-[var(--text)] dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[var(--bg)] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                  Available Colors (comma-separated)
                </label>
              </div>
              {errors.availableColors && (
                <p className="text-red-500 text-sm">{errors.availableColors.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <div className="relative">
                <Controller
                  name="backgroundColors"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder=" "
                      className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 peer"
                      onChange={(e) => field.onChange(e.target.value.split(','))}
                    />
                  )}
                />
                <label className="absolute text-sm text-[var(--text)] dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[var(--bg)] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                  Background Colors (comma-separated)
                </label>
              </div>
              {errors.backgroundColors && (
                <p className="text-red-500 text-sm">{errors.backgroundColors.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
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
                            src={mainImageFile}
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
                  <p className="text-red-500 text-sm">{errors.mainImage.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
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
                        {additionalImages.map((imageData, index) => (
                          <ImagePreview
                            key={index}
                            imageData={imageData}
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
          </div>

          <button
            type="submit"
            className="w-full p-4 bg-teal-500 text-white font-bold border-none rounded-lg cursor-pointer hover:bg-teal-600 transition duration-300"
          >
            Add Combo
          </button>
        </form>
      </div>
    </DndProvider>
  );
};

export default AddComboPage;
