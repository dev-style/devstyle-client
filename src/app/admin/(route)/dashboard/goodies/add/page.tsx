"use client";
require("dotenv").config();

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useRef, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { fetchCollections } from "@/app/admin/controllers/collection";
import { fetchSizes } from "@/app/admin/controllers/size";
import { Editor } from "@tinymce/tinymce-react";
import { addGoodie } from "@/app/admin/controllers/goodie"; // Votre Server Action principale d'ajout de goodie
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { uploadGoodieImage } from "@/app/admin/controllers/imageUpload";
import { color } from "framer-motion";

// Définition de l'interface pour les informations d'image que nous stockerons
type GoodieImageInfo = { url: string; public_id?: string };

// Mise à jour du schéma Zod pour mainImage et images
const goodieSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  fromCollection: z
    .array(z.string())
    .min(1, "At least one collection is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  inPromo: z.boolean(),
  promoPercentage: z.coerce.number().min(0).max(100).optional(),
  sizes: z.array(z.string()),
  availableColors: z.array(z.string()),
  backgroundColors: z.array(z.string()),
  show: z.boolean(),
  views: z.number().default(0),
  likes: z.number().default(0),
  // mainImage est maintenant une chaîne JSON de l'objet { url, public_id }
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
  etsy: z.string(),
});

type GoodieFormData = z.infer<typeof goodieSchema>;

// Définition du type pour le formulaire après parsing JSON pour `addGoodie`
type GoodieFormDataParsed = Omit<GoodieFormData, "mainImage" | "images" | "availableColors" | "backgroundColors"> & {
  availableColors: string,
  backgroundColors: string,
  mainImage: GoodieImageInfo;
  images?: GoodieImageInfo[];
};

export function ImagePreview ({
  imageData, // C'est maintenant l'URL de l'image pour l'affichage
  index,
  moveImage,
  removeImage
}: {
  imageData: string;
  index: number;
  moveImage: (fromIndex: number, toIndex: number) => void;
  removeImage: (index: number) => void;
}){
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
      <span className="absolute top-0 right-0 bg-white rounded-full p-1 text-black h-6 w-6 flex items-center justify-center font-bold">
        {index + 1}
      </span>
      <button
        type="button"
        className="absolute bottom-0 right-0 bg-red-500 rounded-full p-1 text-white h-6 w-6 flex items-center justify-center font-bold"
        onClick={(e) => {
          e.preventDefault();
          removeImage(index);
        }}
      >
        &times;
      </button>
    </div>
  );
};

const AddGoodiePage = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
    watch,
    setValue,
  } = useForm<GoodieFormData>({
    // Le type ici reste GoodieFormData car c'est ce que react-hook-form manipule
    resolver: zodResolver(goodieSchema),
    defaultValues: {
      inPromo: false,
      show: false,
      views: 0,
      likes: 0,
      fromCollection: [],
      sizes: [],
      availableColors: [],
      backgroundColors: [],
      etsy: "",
      mainImage: "", // Valeur par défaut vide pour le string JSON
      images: [], // Valeur par défaut tableau vide de strings JSON
    },
  });

  const [selectSizesOptions, setSelectSizesOptions] = useState<string[]>([]);
  // additionalImages affiche les URLs, donc reste string[]
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);
  const [collections, setCollections] = useState<
    { _id: string; title: string }[]
  >([]);
  const [availableSizes, setAvailableSizes] = useState<
    { _id: string; size: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false); // Gère l'état de chargement global du formulaire
  const [isUploadingImages, setIsUploadingImages] = useState(false); // Gère l'état de chargement de l'image principale ou additionnelle
  const [isUploadingMainImage, setIsUploadingMainImage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { collections } = await fetchCollections();
        // console.log("my collections", collections);
        setCollections(collections);

        const { sizes } = await fetchSizes();
        setAvailableSizes(sizes);
        // console.log("my sizes", sizes);
      } catch (err) {
        toast.error("Failed to load collections or sizes.");
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data: GoodieFormData) => {
    setIsLoading(true);
    // console.log("Raw form data before parsing:", data); // Les images sont encore des chaînes JSON ici

    try {
      // Parse les chaînes JSON des images en objets JavaScript
      const parsedData: GoodieFormDataParsed = {
        ...data,
        availableColors: data.availableColors.join(","),
        backgroundColors: data.backgroundColors.join(","),
        mainImage: JSON.parse(data.mainImage),
        images: (data.images || []).map((imgStr) => JSON.parse(imgStr)),
      };

      // console.log("Data to send to addGoodie after parsing:", parsedData);

      await addGoodie(parsedData); // Appelle la Server Action principale avec les objets image
      toast.success("Goodie ajouté avec succès !");
      router.push("/admin/dashboard/goodies");
    } catch (error) {
      console.error("Error adding goodie:", error);
      toast.error("An error occurred while adding the goodie.");
    } finally {
      setIsLoading(false);
      // La redirection est déjà faite en cas de succès, pas besoin de la dupliquer ici.
    }
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    // Récupère les valeurs actuelles des images du formulaire (qui sont des chaînes JSON)
    const currentFormImages = watch("images") || [];
    const newFormImages = [...currentFormImages];
    const [movedImage] = newFormImages.splice(fromIndex, 1);
    newFormImages.splice(toIndex, 0, movedImage);

    // Met à jour l'état local pour l'affichage (qui sont les URLs directement)
    setAdditionalImages((prevImages) => {
      const newDisplayImages = [...prevImages];
      const [movedDisplayImage] = newDisplayImages.splice(fromIndex, 1);
      newDisplayImages.splice(toIndex, 0, movedDisplayImage);
      return newDisplayImages;
    });

    // Met à jour la valeur du formulaire avec les nouvelles chaînes JSON réorganisées
    setValue("images", newFormImages);
  };

  // mainImageFile pour l'affichage est l'URL stockée dans le formulaire
  const mainImageFile = watch("mainImage")
    ? JSON.parse(watch("mainImage")).url
    : "";
    
  const removeImage = (index: number) => {
    setAdditionalImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // MODIFIÉ: Gère l'upload de l'image principale
  const handleMainImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingMainImage(true); // Active le spinner
      const formData = new FormData();
      formData.append("file", file); // Ajoute le fichier au FormData

      try {
        const result = await uploadGoodieImage(formData); // Appelle la Server Action d'upload Cloudinary

        if (result.success) {
          // Stocke l'objet { url, public_id } sous forme de chaîne JSON dans le champ mainImage
          setValue(
            "mainImage",
            JSON.stringify({
              url: result.imageUrl,
              public_id: result.publicId,
            }),
          );
          toast.success("Image principale uploadée avec succès !");
        } else {
          toast.error(
            result.message || "Erreur lors de l'upload de l'image principale.",
          );
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
  };

  const extractColorFromFileName = (fileName: string): string | null => {
    const match = fileName.match(/_([0-9A-Fa-f]{6})_/);
    return match ? `#${match[1]}` : null;
  };

  const generateMatchingBackgroundColor = (fileName: string): string | null => {
    const parts = fileName.split("_");
    if (parts.length > 3) {
      const match = parts[3].match(/^(.{6})/);
      if (match) {
        const goodieColor = `#${match[1]}`;
        return goodieColor;
      }
    }
    return null;
  };
  // La fonction getBackgroundColor n'est plus nécessaire si les couleurs sont extraites des noms de fichiers.
  // Elle serait utile si vous vouliez analyser les pixels de l'image.
  // const getBackgroundColor = (imageData: string): Promise<string> => { /* ... */ };

  // MODIFIÉ: Gère l'upload des images additionnelles
  const handleAdditionalImagesChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploadingImages(true); // Active le spinner
    const newGoodieImagesData: GoodieImageInfo[] = []; // Pour stocker les objets {url, public_id}
    const newDisplayUrls: string[] = []; // Pour l'affichage des aperçus
    const newColors: string[] = [];
    const newBackgroundColors: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const result = (await uploadGoodieImage(formData)) as {
          success: boolean;
          imageUrl: string;
          publicId: string;
        }; // Appelle la Server Action pour chaque image

        if (result.success) {
          newGoodieImagesData.push({
            url: result.imageUrl,
            public_id: result.publicId,
          });
          newDisplayUrls.push(result.imageUrl); // Pour l'affichage immédiat

          // Extrait les couleurs des noms de fichiers APRES l'upload réussi
          const color = extractColorFromFileName(file.name);
          if (color) {
            newColors.push(color);
          }
          const backgroundColor = generateMatchingBackgroundColor(file.name);
          if (backgroundColor) {
            newBackgroundColors.push(backgroundColor);
          }
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
    const serializedNewImages = newGoodieImagesData.map((img) =>
      JSON.stringify(img),
    );
    setValue("images", [...currentFormImages, ...serializedNewImages]);

    // Met à jour les couleurs (logique existante)
    const currentColors = watch("availableColors") || [];
    const uniqueColors = Array.from(new Set([...currentColors, ...newColors]));
    setValue("availableColors", uniqueColors);

    const currentBackgroundColors = watch("backgroundColors") || [];
    const uniqueBackgroundColors = Array.from(
      new Set([...currentBackgroundColors, ...newBackgroundColors]),
    );
    setValue("backgroundColors", uniqueBackgroundColors);

    setIsUploadingImages(false); // Désactive le spinner
    if (additionalImagesInputRef.current) {
      additionalImagesInputRef.current.value = ""; // Réinitialise le champ de fichier
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectSizesOptions((prevSizes) => {
        const result = [...prevSizes, value];
        setValue("sizes", result);
        return result;
      });
    } else {
      setSelectSizesOptions((prevSizes) => {
        const result = prevSizes.filter((option) => option !== value);
        setValue("sizes", result);
        return result;
      });
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-primary p-8 rounded-lg mt-5 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-left text-[var(--text)]">
          Add New Goodie
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ... (Your existing form fields for name, description, collection, price, promo, etc.) ... */}

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
                      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                      init={{
                        height: 300,
                        menubar: false,
                        plugins: [
                          "advlist autolink lists link image charmap print preview anchor",
                          "searchreplace visualblocks code fullscreen",
                          "insertdatetime media table paste code help wordcount",
                        ],
                        toolbar:
                          "undo redo | formatselect | " +
                          "bold italic backcolor | alignleft aligncenter " +
                          "alignright alignjustify | bullist numlist outdent indent | " +
                          "removeformat | help",
                        content_style:
                          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px}",
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
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
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
                            (option) => option.value,
                          ),
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
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              {errors.fromCollection && (
                <p className="text-red-500 text-sm">
                  {errors.fromCollection.message}
                </p>
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
                <p className="text-red-500 text-sm">
                  {errors.promoPercentage.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <div className="relative flex flex-col gap-y-2">
                <div>Select your sizes</div>
                {availableSizes.map((size: any, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      id={size._id}
                      value={size._id}
                      checked={selectSizesOptions.includes(size._id)}
                      onChange={(e) => handleCheckboxChange(e)}
                    />
                    <span className="ml-3">{size.size}</span>
                  </div>
                ))}
              </div>
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
                          onChange={handleMainImageChange} // <--- Appel de la fonction modifiée
                          className="hidden"
                          ref={mainImageInputRef}
                        />
                        <label
                          htmlFor="mainImage"
                          className="cursor-pointer flex items-center justify-center"
                        >
                          {/* mainImageFile est maintenant une URL */}
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
                <p className="text-red-500 text-sm">
                  {errors.mainImage.message}
                </p>
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
                          removeImage={removeImage}                            
                        />
                      ))}
                      <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center m-2">
                        <p>+</p>
                      </div>
                    </label>
                    </>)}
                  </div>
                  )}
                  />
            </div>
            <div className="flex flex-col space-y-2">
              <div className="relative">
                <Controller
                  name="availableColors"
                  control={control}
                  render={({ field }) => (
                    <div
                      className="w-full flex items-center  gap-3 justify-start p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg opacity-70"
                    >
                     {field.value.map((item: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: item }}
                          ></div>
                          <input
                            type="text"
                            value={item}
                            className="text-[var(--text)] bg-[var(--bg)] border border-gray-300 p-2 w-20 h-8"
                            style={{ borderRadius: "4px" }}
                            onChange={(e) => {
                              const newColors = field.value.map(
                                (color: string, i: number) =>
                                  i === index ? e.target.value : color,
                              );
                              field.onChange(newColors);
                            }}
                          />
                          <button
                            type="button"
                            className="ml-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => {
                              const newColors = field.value.filter(
                                (_: string, i: number) => i !== index,
                              );
                              field.onChange(newColors);
                            }}
                            aria-label="Remove color"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="ml-2 px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600"
                        onClick={() => {
                          field.onChange([...field.value, "#FFFFFF"]);
                        }}
                      >
                        Add Color
                      </button>
                    </div>
                  )}
                />
                <label className="absolute text-sm text-[var(--text)] dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[var(--bg)] px-2 left-1">
                  Available Colors (extracted from images)
                </label>
              </div>
              {errors.availableColors && (
                <p className="text-red-500 text-sm">
                  {errors.availableColors.message}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <div className="relative">
                <Controller
                  name="backgroundColors"
                  control={control}
                  render={({ field }) => (
                    <div
                      className="w-full flex items-center  gap-3 justify-start p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg opacity-70"
                    >
                      {field.value.map((item: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: item }}
                          ></div>
                          <input
                            type="text"
                            value={item}
                            className="text-[var(--text)] bg-[var(--bg)] border border-gray-300 p-2 w-20 h-8"
                            style={{ borderRadius: "4px" }}
                            onChange={(e) => {
                              const newColors = field.value.map(
                                (color: string, i: number) =>
                                  i === index ? e.target.value : color,
                              );
                              field.onChange(newColors);
                            }}
                          />
                          <button
                            type="button"
                            className="ml-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => {
                              const newColors = field.value.filter(
                                (_: string, i: number) => i !== index,
                              );
                              field.onChange(newColors);
                            }}
                            aria-label="Remove color"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="ml-2 px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600"
                        onClick={() => {
                          field.onChange([...field.value, "#FFFFFF"]);
                        }}
                      >
                        Add Color
                      </button>
                    </div>
                  )}
                />
                <label className="absolute text-sm text-[var(--text)] dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-[var(--bg)] px-2 left-1">
                  Background Colors (extracted from images)
                </label>
              </div>
              {errors.backgroundColors && (
                <p className="text-red-500 text-sm">
                  {errors.backgroundColors.message}
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full p-4 bg-teal-500 text-white font-bold border-none rounded-lg cursor-pointer hover:bg-teal-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                Adding Goodie...
              </span>
            ) : (
              "Add Goodie"
            )}
          </button>
        </form>
      </div>
    </DndProvider>
  );
};

export default AddGoodiePage;
