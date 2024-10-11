"use server"

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { connectToDB } from "./utils";
import GoodieModel from "../models/goodie";

export const addGoodie = async (formData: FormData) => {
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
      images
    } = Object.fromEntries(formData);
  
    console.log("data gooodie que j'envois",{
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
      images
    });

    // try {
    //   connectToDB();
  
    //   const newGoodie = new GoodieModel({
    //     name,
    //     description,
    //     slug,
    //     fromCollection: JSON.parse(fromCollection as string),
    //     price: Number(price),
    //     inPromo: inPromo === 'true',
    //     promoPercentage: promoPercentage ? Number(promoPercentage) : undefined,
    //     size: sizes.split(',').map((size: string) => ({ size: size.trim() })),
    //     availableColors: availableColors.split(',').map((color: string) => color.trim()),
    //     backgroundColors: backgroundColors.split(',').map((color: string) => color.trim()),
    //     show: show === 'true',
    //     views: Number(views),
    //     likes: Number(likes),
    //     mainImage: { public_id: '', url: '' }, // You'll need to handle file upload separately
    //     images: [], // You'll need to handle multiple file uploads separately
    //   });
  
    //   await newGoodie.save();
    // } catch (err) {
    //   console.log(err);
    //   throw new Error("Failed to create goodie!");
    // }
  
    // revalidatePath("/dashboard/goodies");
    // redirect("/dashboard/goodies");
  };