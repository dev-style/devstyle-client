"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ICloudinaryUploadResponse } from "../lib/interfaces";
import { connectToDB } from "../lib/utils";
import CollectionModel from "../models/collection";
import GoodieModel from "../models/goodie";
import SizeModel from "../models/size";
import DiscountModel from "../models/discount";
import {
  deleteImageFromCloudinary,
  uploader,
  uploadToCloudinary,
} from "../lib/cloudinaryConfig";

type GoodieImageInfo = { url: string; public_id?: string };
interface GoodieDataForDB {
  name: string;
  description?: string;
  fromCollection: string[];
  price: number;
  inPromo?: boolean;
  promoPercentage?: number; // Optional car `undefined` si non en promo
  sizes?: string[];
  availableColors: string;
  backgroundColors: string;
  show: boolean;
  views: number;
  likes: number;
  mainImage: GoodieImageInfo; // Reçoit l'objet direct { url, public_id }
  images?: GoodieImageInfo[]; // Reçoit le tableau d'objets { url, public_id }
  etsy?: string;
}

export const fetchGoodie = async (id: string) => {
  try {
    await connectToDB();
    const goodie = await GoodieModel.findById(id)
      .populate({
        path: "sizes",
        model: SizeModel,
      })
      .populate({
        path: "fromCollection",
        model: CollectionModel,
      })
      .lean();
    if (!goodie) {
      // console.log("Goodie not found");
      return null;
    }
    // // console.log("Goodie found:", goodie);
    return { goodie };
  } catch (error: any) {
    console.error("Error fetching goodie:", error);
    throw new Error(`Failed to fetch goodie: ${error.message}`);
  }
};

export const fetchGoodies = async (q: string, page: number) => {
  // console.log("Query:", q);
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 15;

  try {
    await connectToDB();

    const count = await GoodieModel.find({
      name: { $regex: regex },
    }).countDocuments();

    const goodies = await GoodieModel.find({ name: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1))
      .populate({
        path: "sizes",
        model: SizeModel,
      })
      .populate({
        path: "fromCollection",
        model: CollectionModel,
      })
      .sort({ createdAt: -1 })
      .lean();

    // console.log("Number of goodies found:", count);
    // console.log("First goodie:", goodies[0]);

    if (!goodies || goodies.length === 0) {
      // console.log("No goodies found");
      return { count: 0, goodies: [] };
    }

    return { count, goodies };
  } catch (err) {
    console.error("Error fetching goodies:", err);
    if (err instanceof Error) {
      throw new Error(`Failed to fetch goodies: ${err.message}`);
    } else {
      throw new Error("Failed to fetch goodies: Unknown error");
    }
  }
};

export const updateGoodie = async (id: string, data: any) => {
  // console.log("goodie data to be updated", id, data);

  try {
    await connectToDB();

    // Upload main image and additional images concurrently
    const uploadPromises = [];
    let uploadedMainImage = {};

    // Check if mainImage is not a string to proceed with upload
    if (
      typeof data.mainImage == "string" &&
      data.mainImage.startsWith("data:image")
    ) {
      uploadPromises.push(
        uploader(data.mainImage).then((result: ICloudinaryUploadResponse) => {
          uploadedMainImage = {
            public_id: result.public_id,
            url: result.secure_url,
          };
        }),
      );
    }

    const uploadedImages: { public_id: string; url: string }[] = [];
    if (data.images) {
      // console.log("images exist:", data.images);
      uploadPromises.push(
        ...data.images.map((image: any) => {
          if (typeof image === "string" && image.startsWith("data:image")) {
            return uploader(image).then((result: ICloudinaryUploadResponse) => {
              uploadedImages.push({
                public_id: result.public_id,
                url: result.secure_url,
              });
            });
          }
          return Promise.resolve(); // Skip non-base64 strings
        }),
      );
    }

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);

    // console.log("mainImageResult", uploadedMainImage);
    // console.log("uploadedImages", uploadedImages);

    // Generate unique slug
    // const collection = await CollectionModel.findById(data.fromCollection);

    // if (!collection) {
    //   throw new Error("Collection not found");
    // }

    // edit goodie feature
    const updateGoodie = await GoodieModel.findByIdAndUpdate(id, {
      name: data.name,
      description: data.description,
      fromCollection: data.fromCollection,
      price: data.price,
      inPromo: data.inPromo,
      promoPercentage: data.promoPercentage,
      sizes: data.sizes,
      availableColors: data.availableColors,
      backgroundColors: data.backgroundColors,
      show: data.show,
      views: data.views,
      likes: data.likes,
      etsy: data.etsy,
      // images: uploadedImages,
      ...(uploadedImages.length > 0 ? { images: uploadPromises } : {}),
      ...(Object.keys(uploadedMainImage).length > 0
        ? { mainImage: uploadedMainImage }
        : {}),
    });

    // console.log("Goodie updated successfully:", updateGoodie);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Failed to edit goodies: ${err.message}`);
    } else {
      throw new Error("Failed to edit goodies: Unknown error");
    }
  }

  revalidatePath("/admin/dashboard/goodies");
};

// Définition de l'interface pour les informations d'image

// Définition du type pour les données que cette Server Action attend,
// après le parsing JSON qui est fait côté client.

export const addGoodie = async (data: GoodieDataForDB) => {
  const {
    name,
    description,
    fromCollection,
    price,
    inPromo,
    promoPercentage,
    sizes,
    availableColors,
    backgroundColors,
    show,
    views,
    likes,
    mainImage, // Maintenant un objet GoodieImageInfo
    images, // Maintenant un tableau d'objets GoodieImageInfo
    etsy,
  } = data;

  // console.log(
  //   "Données du goodie à envoyer (avec objets image déjà uploadés):",
  //   {
  //     name,
  //     description,
  //     fromCollection,
  //     price,
  //     inPromo,
  //     promoPercentage,
  //     sizes,
  //     availableColors,
  //     backgroundColors,
  //     show,
  //     views,
  //     likes,
  //     etsy,
  //     mainImage,
  //     images, // Ces logs montreront maintenant les objets image
  //   },
  // );

  try {
    await connectToDB();

    // --- LOGIQUE D'UPLOAD RETIRÉE ---
    // Les images (mainImage et images) sont déjà uploadées sur Cloudinary
    // et leurs URLs ainsi que public_id sont déjà disponibles dans 'data'.
    // Plus besoin d'appeler 'uploader' ici.

    // Générer le slug unique
    const collection = await CollectionModel.findById(fromCollection);
    if (!collection) {
      throw new Error("Collection non trouvée");
    }
    const slug = `${collection.slug}-${name
      .toLowerCase()
      .replace(/\s+/g, "-")}`;

    const newGoodie = new GoodieModel({
      name,
      description,
      slug,
      fromCollection,
      price: price, // 'price' est déjà un nombre grâce à z.coerce.number() côté client
      inPromo,
      promoPercentage: promoPercentage, // 'promoPercentage' est déjà un nombre ou undefined
      sizes: sizes,
      // Ces champs sont maintenant des chaînes comma-separated, convertissez-les en tableaux si votre modèle les attend ainsi.
      availableColors: (availableColors as string)
        .split(",")
        .map((color: string) => color.trim()),
      backgroundColors: (backgroundColors as string)
        .split(",")
        .map((color: string) => color.trim()),
      show,
      views: views, // 'views' est déjà un nombre
      likes: likes, // 'likes' est déjà un nombre
      mainImage: mainImage, // Stocke directement l'objet { url, public_id }
      images: images || [], // Stocke directement le tableau d'objets { url, public_id }
      etsy,
    });

    await newGoodie.save();
  } catch (err: any) {
    console.error("Erreur lors de la création du goodie:", err);
    throw new Error(err.message || "Échec de la création du goodie !");
  }

  // Ces appels doivent être après le try/catch pour s'assurer que l'opération est réussie.
  revalidatePath("/admin/dashboard/goodies");
  redirect("/admin/dashboard/goodies");
};

export const deleteGoodie = async (id: string) => {
  try {
    await connectToDB();
    const deletedGoodie = await GoodieModel.findById(id);

    // const { mainImage, images } = deletedGoodie;
    // const deletionPromises = [mainImage, ...images].map(async (image) => {
    //   const public_id = image.url.split("/").pop().split(".")[0];
    //   // // console.log("publicId", public_id);
    //   await deleteFromCloudinary(public_id);
    // });

    // await Promise.all(deletionPromises);

    await GoodieModel.findByIdAndDelete(id);
  } catch (err) {
    console.error("Error deleting goodie:", err);
    throw new Error("Failed to delete goodie!");
  }
  redirect("/admin/dashboard/goodies");
  revalidatePath("/admin/dashboard/goodies");
};

const deleteFromCloudinary = async (public_id: string) => {
  await deleteImageFromCloudinary(public_id);
};

export async function getGoodiesWithoutDiscount() {
  try {
    const discount = await DiscountModel.find({}, "goodies");

    const discountedGoodiesIds = discount.flatMap((d) => d.goodies);

    const goodies = await GoodieModel.find({
      _id: { $nin: discountedGoodiesIds },
    })
      .populate({
        path: "sizes",
        model: SizeModel,
      })
      .populate({
        path: "fromCollection",
        model: CollectionModel,
      })
      .sort({ createdAt: -1 })
      .lean();

    // console.log(" all goodeis:", goodies);

    if (!goodies || goodies.length === 0) {
      // console.log("No goodies found");
      return { count: 0, goodies: [] };
    }

    return { goodies };
  } catch (error) {
    console.error("Failed to fetch collections:", error);
    throw new Error("Failed to fetch collections. Please try again later.");
  }
}
