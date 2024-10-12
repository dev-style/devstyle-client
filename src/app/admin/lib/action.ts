"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { connectToDB, uploadToCloudinary } from "./utils";
import GoodieModel from "../models/goodie";
import CollectionModel from "../models/collection";
import { ICloudinaryUploadResponse } from "./interfaces";

export const addGoodie = async (formData: any) => {
  const {
    name,
    description,
    slug,
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
    mainImage,
    images,
  } = formData;

  console.log("Données du goodie à envoyer:", {
    name,
    description,
    slug,
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
  });

  try {
    await connectToDB();

    // Upload main image
    let uploadedMainImage = { public_id: "", url: "" };
    if (mainImage) {
      const mainImageResult = await uploadToCloudinary(mainImage, "DevStyle/Goodies");
      uploadedMainImage = {
        public_id: mainImageResult.public_id,
        url: mainImageResult.secure_url,
      };
    }

    // Upload additional images
    const uploadedImages = [];
    if (images && Array.isArray(images)) {
      for (const image of images) {
        const imageResult = await uploadToCloudinary(image, "DevStyle/Goodies");
        uploadedImages.push({
          public_id: imageResult.public_id,
          url: imageResult.secure_url,
        });
      }
    }

    const newGoodie = new GoodieModel({
      name,
      description,
      slug,
      fromCollection,
      price: Number(price),
      inPromo,
      promoPercentage: promoPercentage ? Number(promoPercentage) : undefined,
      sizes,
      availableColors: (availableColors as string)
        .split(",")
        .map((color: string) => color.trim()),
      backgroundColors: (backgroundColors as string)
        .split(",")
        .map((color: string) => color.trim()),
      show,
      views: Number(views),
      likes: Number(likes),
      mainImage: uploadedMainImage,
      images: uploadedImages,
    });

    await newGoodie.save();
  } catch (err) {
    console.error("Error creating goodie:", err);
    throw new Error("Failed to create goodie!");
  }

  revalidatePath("/admin/dashboard/goodies");
  redirect("/admin/dashboard/goodies");
};

export const addCollection = async (formData: FormData) => {
  const { title, slug, colors, show, views, image } =
    Object.fromEntries(formData);

  try {
    await connectToDB();

    let uploadedImage = { public_id: "", url: "" };
    if (image) {
      const imageResult = await uploadToCloudinary(image, "DevStyle/Collections");
      uploadedImage = {
        public_id: imageResult.public_id,
        url: imageResult.secure_url,
      };
    }

    const newCollection = new CollectionModel({
      title,
      slug,
      colors,
      show: show === "true",
      views: Number(views),
      image: uploadedImage,
    });

    await newCollection.save();
  } catch (err) {
    console.error("Error creating collection:", err);
    throw new Error("Failed to create collection!");
  }

  revalidatePath("/dashboard/collections");
  redirect("/dashboard/collections");
};

// Note: This implementation now handles file uploads directly in these server actions,
// using the uploadToCloudinary function from ./utils.
