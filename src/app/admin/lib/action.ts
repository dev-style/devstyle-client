"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { connectToDB } from "./utils";
import GoodieModel from "../models/goodie";
import CollectionModel from "../models/collection";
import { ICloudinaryUploadResponse } from "./interfaces";
import {uploadToCloudinary} from "./cloudinaryConfig";
import OrderModel from "../models/order";


export const addCollection = async (formData: FormData) => {
  const { title, slug, colors, show, views, image, etsy } =
    Object.fromEntries(formData);

  // console.log(
  //   "title,slug,colors,show,views,image,etsy",
  //   title,
  //   slug,
  //   colors,
  //   show,
  //   views,
  //   image,
  //   etsy
  // );

  try {
    await connectToDB();

    let uploadedImage = { public_id: "", url: "" };
    if (image) {
      const imageResult: any = await uploadToCloudinary(
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
      etsy,
    });

    await newCollection.save();
  } catch (err) {
    console.error("Error creating collection:", err);
    // i want to return the error message to the front
    throw new Error("Failed to create collection!");
  }

  revalidatePath("/admin/dashboard/collections");
  redirect("/admin/dashboard/collections");
};



// Note: This implementation now handles file uploads directly in these server actions,
// using the uploadToCloudinary function from ./utils.
