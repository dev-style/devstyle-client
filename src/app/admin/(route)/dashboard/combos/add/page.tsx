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
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { uploadComboImage } from "@/app/admin/controllers/imageUpload";


type ComboImageInfo = { url: string; public_id?: string };

const comboSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  inPromo: z.boolean(),
  show: z.boolean(),
  promoPercentage: z.coerce.number().min(0).max(100).optional(),
  items: z.array(z.string()).min(1, "At least one item is required"),


  mainImage: z
    .string()
    .min(1, "Main image is required")
    .refine(
      (val) => {
        try {
          const parsed = JSON.parse(val);
          return (
            typeof parsed.url === "string"
            // typeof parsed.public_id === "string"
          );
        } catch {
          return false;
        }
      },
      { message: "Main image data is invalid or missing URL/public_id." },
    ),
  // images est un tableau de chaînes JSON d'objets { url, public_id }
  images: z
    .array(z.string())
    .optional()
    .refine(
      (arr) => {
        if (!arr) return true;
        return arr.every((val) => {
          try {
            const parsed = JSON.parse(val);
            return (
              typeof parsed.url === "string"
              // typeof parsed.public_id === "string"
            );
          } catch {
            return false;
          }
        });
      },
      {
        message:
          "Additional images data contains invalid or missing URL/public_id.",
      },
    ),

  // mainImage: z.string().min(1, "Main image is required"),
  // images: z.array(z.string()).optional(),
  // availableColors: z.array(z.string()),
  // backgroundColors: z.array(z.string()),
});

type ComboFormData = z.infer<typeof comboSchema>;


type ComboFormDataParsed = Omit<ComboFormData, "mainImage" | "images"> & {
  mainImage: ComboImageInfo;
  images?: ComboImageInfo[];
};


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
    className={`border rounded-lg p-4 cursor-pointer transition-all ${isSelected ? 'border-teal-500 bg-teal-100' : 'border-gray-300 hover:border-teal-300'
      }`}
    onClick={() => onSelect(goodie._id)}
  >
    <img src={goodie.mainImage.url} alt={goodie.name} className="w-full h-32 object-cover rounded-md mb-2" />
    <h3 className="text-sm font-semibold text-center">{goodie.name}</h3>
  </div>
);

const AddComboPage = () => {
  const router = useRouter();

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
      show: false,
      items: [],
      mainImage: "", // Valeur par défaut vide pour le string JSON
      images: [],
      // availableColors: [],
      // backgroundColors: [],
    },
  });

  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);
  const [goodies, setGoodies] = useState<IGoodie[]>([]);
  const [selectedGoodies, setSelectedGoodies] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false); // Gère l'état de chargement de l'image principale ou additionnelle
  const [isUploadingMainImage, setIsUploadingMainImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Gère l'état de chargement global du formulaire

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
    // console.log("data", data);
    setIsLoading(true);
    try {

      const parsedData: ComboFormDataParsed = {
        ...data,
        // items: selectedGoodies,
        mainImage: JSON.parse(data.mainImage),
        images: (data.images || []).map((imgStr) => JSON.parse(imgStr)),
      }

      await addCombo(parsedData);
      toast.success("Combo ajouté avec succès !");
      router.push("/admin/dashboard/combos");
    } catch (error) {
      console.error("Error adding combo:", error);
      toast.error("An error occurred while adding the combo.");
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

  const mainImageFile = watch("mainImage") ? JSON.parse(watch("mainImage")).url
    : "";

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingMainImage(true);
      const formData = new FormData();
      formData.append("file", file);
      try {

        const result = await uploadComboImage(formData)
        if (result.success) {
          setValue("mainImage", JSON.stringify({
            url: result.imageUrl,
            public_id: result.publicId
          }))
          toast.success("Image principale uploadée avec succès !");
        } else {
          toast.error(
            result.message || "Erreur lors de l'upload de l'image principale.",

          )
        }

      } catch (error) {
        console.error(
          "Erreur inattendue lors de l'upload de l'image principale:",
          error,
        );
        toast.error(
          "Erreur inattendue lors de l'upload de l'image principale.",
        );
      } finally {
        setIsUploadingMainImage(false); // Désactive le spinner
        if (mainImageInputRef.current) {
          mainImageInputRef.current.value = ""; // Réinitialise le champ de fichier
        }
      }
    }
  }

  const handleAdditionalImagesChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploadingImages(true); // Active le spinner
    const newComboImagesData: ComboImageInfo[] = []; // Pour stocker les objets {url, public_id}
    const newDisplayUrls: string[] = []; // Pour l'affichage des aperçus
    const newColors: string[] = [];
    const newBackgroundColors: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const result = (await uploadComboImage(formData)) as {
          success: boolean;
          imageUrl: string;
          publicId: string;
        }; // Appelle la Server Action pour chaque image

        if (result.success) {
          newComboImagesData.push({
            url: result.imageUrl,
            public_id: result.publicId,
          });
          newDisplayUrls.push(result.imageUrl); // Pour l'affichage immédiat


        } else {
          toast.error(`Échec de l'upload pour ${file.name}: ${result.message}`);
        }
      } catch (error) {
        console.error(
          `Erreur inattendue lors de l'upload de ${file.name}:`,
          error,
        );
        toast.error(`Erreur inattendue pour ${file.name}.`);
      }
    }

    setAdditionalImages((prev) => [...prev, ...newDisplayUrls]); // Met à jour l'état local pour les aperçus (URLs)

    // Met à jour le champ 'images' du formulaire avec les chaînes JSON d'objets {url, public_id}
    const currentFormImages = watch("images") || [];
    const serializedNewImages = newComboImagesData.map((img) =>
      JSON.stringify(img),
    );
    setValue("images", [...currentFormImages, ...serializedNewImages]);


    setIsUploadingImages(false); // Désactive le spinner
    if (additionalImagesInputRef.current) {
      additionalImagesInputRef.current.value = ""; // Réinitialise le champ de fichier
    }
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

            {/* <div className="flex flex-col space-y-2">
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
            </div> */}
            {/* 
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
            </div> */}

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
                      {isUploadingMainImage ? (

                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </>


                      ) : (

                        <>
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
                        </>


                      )}


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

                      {isUploadingImages ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </>
                      ) : (
                        <>
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
                        </>
                      )}



                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-4 bg-teal-500 text-white font-bold border-none rounded-lg cursor-pointer hover:bg-teal-600 transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Adding Combo...
              </span>
            ) : (
              "Add Combo"
            )}
          </button>
        </form>
      </div>
    </DndProvider>
  );
};

export default AddComboPage;
