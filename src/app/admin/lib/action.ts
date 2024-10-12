"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { connectToDB } from "./utils";
import GoodieModel from "../models/goodie";
import CollectionModel from "../models/collection";
import { ICloudinaryUploadResponse } from "./interfaces";
import uploadToCloudinary from "./cloudinaryConfig";

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
      const mainImageResult: ICloudinaryUploadResponse = (await uploader(
        mainImage
      )) as ICloudinaryUploadResponse;
      console.log("mainImageResult", mainImageResult);
      uploadedMainImage = {
        public_id: mainImageResult.public_id,
        url: mainImageResult.secure_url,
      };
    }

    // Upload additional images
    const uploadedImages = [];
    if (images) {
      console.log("les image existe :", images);
      for (const image of images) {
        const myCloud: ICloudinaryUploadResponse = (await uploader(
          image
        )) as ICloudinaryUploadResponse;

        uploadedImages.push({
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        });
      }
      console.log("uploadedImages", uploadedImages);
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

const uploader = async (path: any) =>
  await uploadToCloudinary(path, `DevStyle/Goodies`, {
    transformation: [
      {
        overlay: "devstyle_watermark",
        opacity: 10,
        gravity: "north_west",
        x: 5,
        y: 5,
        width: "0.5",
      },
      {
        overlay: "devstyle_watermark",
        opacity: 6.5,
        gravity: "center",
        width: "1.0",
        angle: 45,
      },
      {
        overlay: "devstyle_watermark",
        opacity: 10,
        gravity: "south_east",
        x: 5,
        y: 5,
        width: "0.5",
      },
    ],
  });

export const addCollection = async (formData: FormData) => {
  const { title, slug, colors, show, views, image } =
    Object.fromEntries(formData);

  try {
    await connectToDB();

    let uploadedImage = { public_id: "", url: "" };
    if (image) {
      const imageResult = await uploadToCloudinary(
        image,
        "DevStyle/Collections"
      );
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
