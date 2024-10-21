"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useRef, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {fetchCollections} from "@/app/admin/controllers/collection";
import { fetchSizes } from "@/app/admin/controllers/size";
import { Editor } from '@tinymce/tinymce-react';
import { addGoodie } from "@/app/admin/controllers/goodie";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const goodieSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  fromCollection: z
    .array(z.string())
    .min(1, "At least one collection is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  inPromo: z.boolean(),
  promoPercentage: z.coerce.number().min(0).max(100).optional(),
  sizes: z.array(z.string()).min(1, "At least one size is required"),
  availableColors: z.string().min(1, "At least one color is required"),
  backgroundColors: z
    .string()
    .min(1, "At least one background color is required"),
  show: z.boolean(),
  views: z.number().default(0),
  likes: z.number().default(0),
  mainImage: z.string().min(1, "Main image is required"),
  images: z.array(z.string()).optional(),
  etsy: z.string().url("Invalid URL").optional(),
});

type GoodieFormData = z.infer<typeof goodieSchema>;

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

const AddGoodiePage = () => {
  const router = useRouter();
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
      fromCollection: [],
      sizes: [],
      availableColors: "",
      backgroundColors: "",
      etsy: "",
    },
  });

  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);
  const [collections, setCollections] = useState<{ _id: string; title: string }[]>([]);
  const [availableSizes, setAvailableSizes] = useState<{ _id: string; size: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    const fetchData = async () => {
      const {  collections } = await fetchCollections();
      setCollections(collections);

      const { sizes } = await fetchSizes();
      setAvailableSizes(sizes);
    };
    fetchData();
  },[])

  const onSubmit = async (data: GoodieFormData) => {
    setIsLoading(true);
    try {
      await addGoodie(data);
      router.push('/admin/dashboard/goodies');
    } catch (error) {
      toast.error('An error occurred while adding the goodie.');
    } finally {
      setIsLoading(false);
    }
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

  const extractColorFromFileName = (fileName: string): string | null => {
    const match = fileName.match(/_([0-9A-Fa-f]{6})_/);
    return match ? `#${match[1]}` : null;
  };

  const getBackgroundColor = (imageData: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx?.getImageData(0, 0, 1, 1);
        if (imageData) {
          const [r, g, b] = imageData.data;
          resolve(`#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`);
        } else {
          resolve('#FFFFFF'); // Default to white if we can't get the color
        }
      };
      img.src = imageData;
    });
  };

  const handleAdditionalImagesChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    const newImages: string[] = [];
    const newColors: string[] = [];
    const newBackgroundColors: string[] = [];

    for (const file of files) {
      const reader = new FileReader();
      const base64String = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      newImages.push(base64String);
      
      const color = extractColorFromFileName(file.name);
      if (color) {
        newColors.push(color);
      }

      const backgroundColor = await getBackgroundColor(base64String);
      newBackgroundColors.push(backgroundColor);
    }

    setAdditionalImages(prev => [...prev, ...newImages]);
    setValue("images", [...additionalImages, ...newImages]);
    
    // Update availableColors
    const currentColors = watch("availableColors").split(",").filter(Boolean);
    const uniqueColors = Array.from(new Set([...currentColors, ...newColors]));
    setValue("availableColors", uniqueColors.join(","));

    // Update backgroundColors
    const currentBackgroundColors = watch("backgroundColors").split(",").filter(Boolean);
    const uniqueBackgroundColors = Array.from(new Set([...currentBackgroundColors, ...newBackgroundColors]));
    setValue("backgroundColors", uniqueBackgroundColors.join(","));
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
            <div className="flex flex-col space-y-2">
              <div className="relative">
                <Controller
                  name="name"
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
                  Name
                </label>
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <div className="relative">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Editor
                      apiKey="88rw7imkx4lg0r7qxqpnl6avup60lw6uyuqij8zm9j8h5owv"
                      init={{
                        height: 300,
                        menubar: false,
                        plugins: [
                          'advlist autolink lists link image charmap print preview anchor',
                          'searchreplace visualblocks code fullscreen',
                          'insertdatetime media table paste code help wordcount'
                        ],
                        toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                      }}
                      onEditorChange={(content) => field.onChange(content)}
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
                  name="fromCollection"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none peer"
                      onChange={(e) =>
                        field.onChange(
                          Array.from(
                            e.target.selectedOptions,
                            (option) => option.value
                          )
                        )
                      }
                      
                    >
                      <option value="" disabled hidden></option>
                      {collections.map((collection) => (
                        <option key={collection._id} value={collection._id}>
                          {collection.title}
                        </option>
                      ))}
                    </select>
                  )}
                />
                <label className="absolute text-sm text-[var(--text)] dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[var(--bg)] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                  From Collection
                </label>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--text)]">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              {errors.fromCollection && (
                <p className="text-red-500 text-sm">{errors.fromCollection.message}</p>
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
                      placeholder=" "
                      className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 peer"
                    />
                  )}
                />
                <label className="absolute text-sm text-[var(--text)] dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[var(--bg)] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                  Price (CFA Franc)
                </label>
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
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
                <div className="relative flex-grow">
                  <Controller
                    name="promoPercentage"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        placeholder=" "
                        className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 peer"
                      />
                    )}
                  />
                  <label className="absolute text-sm text-[var(--text)] dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[var(--bg)] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                    Promo %
                  </label>
                </div>
              </div>
              {errors.promoPercentage && (
                <p className="text-red-500 text-sm">{errors.promoPercentage.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <div className="relative">
                <Controller
                  name="sizes"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <select
                        {...field}
                        className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none peer"
                        onChange={(e) =>
                          field.onChange(
                            Array.from(
                              e.target.selectedOptions,
                              (option) => option.value
                            )
                          )
                        }
                        
                      >
                        <option value="" disabled hidden></option>
                        {availableSizes.map((size) => (
                          <option key={size._id} value={size._id}>
                            {size.size}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--text)]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                />
                <label className="absolute text-sm text-[var(--text)] dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[var(--bg)] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                  Sizes
                </label>
              </div>
              {errors.sizes && (
                <p className="text-red-500 text-sm">{errors.sizes.message}</p>
              )}
            </div>

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
          </div>

          <div className="flex flex-col space-y-2">
            <div className="relative">
              <Controller
                name="etsy"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="url"
                    placeholder=" "
                    className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 peer"
                  />
                )}
              />
              <label className="absolute text-sm text-[var(--text)] dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[var(--bg)] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                Etsy Link (Optional)
              </label>
            </div>
            {errors.etsy && (
              <p className="text-red-500 text-sm">{errors.etsy.message}</p>
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
          <div className="flex flex-col space-y-2">
            <div className="relative">
              <Controller
                name="availableColors"
                control={control}
                render={({ field }) => (
                  <div
                    {...field}
                    className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg opacity-70 cursor-not-allowed"
                  >
                    {field.value || "Colors will be extracted from images"}
                  </div>
                )}
              />
              <label className="absolute text-sm text-[var(--text)] dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[var(--bg)] px-2 left-1">
                Available Colors (extracted from images)
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
                  <div
                    {...field}
                    className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg opacity-70 cursor-not-allowed"
                  >
                    {field.value || "Background colors will be extracted from images"}
                  </div>
                )}
              />
              <label className="absolute text-sm text-[var(--text)] dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[var(--bg)] px-2 left-1">
                Background Colors (extracted from images)
              </label>
            </div>
            {errors.backgroundColors && (
              <p className="text-red-500 text-sm">{errors.backgroundColors.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-4 bg-teal-500 text-white font-bold border-none rounded-lg cursor-pointer hover:bg-teal-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding Goodie...
              </span>
            ) : (
              'Add Goodie'
            )}
          </button>
        </form>
      </div>
    </DndProvider>
  );
};

export default AddGoodiePage;
