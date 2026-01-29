"use server"
import { revalidatePath } from "next/cache";
import { ICombo } from "../lib/interfaces";
import { connectToDB } from "../lib/utils";
import ComboModel from "../models/combo";
import { redirect } from "next/navigation";


type ComboImageInfo = { url: string; public_id?: string };
interface ComboDataForDB {
  title: string;
  description?: string;
  price: number;
  inPromo?: boolean;
  items: String[];
  promoPercentage?: number; // Optional car `undefined` si non en promo
  show: boolean;
  mainImage: ComboImageInfo; // Reçoit l'objet direct { url, public_id }
  images?: ComboImageInfo[]; // Reçoit le tableau d'objets { url, public_id }
}


export const fetchCombos = async (q: string, page: number) => {
  // console.log(q);
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 5;

  try {
    await connectToDB();
    const count = await ComboModel.find({
      name: { $regex: regex },
    }).countDocuments();
    const combos = await ComboModel.find({ title: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    console.log("list of combos", combos);
    return { count, combos };
  } catch (err) {
    console.error("Error fetching combos:", err);
    throw new Error("Failed to fetch combos!");
  }
};
export const addCombo = async (data: ComboDataForDB) => {

  // console.log("combo data",data)
  const { title, description, price, inPromo, promoPercentage, items, mainImage, images, show } = data
  console.log("combo data", title, description, price, inPromo, promoPercentage, items, show, mainImage, images)

  try {
    await connectToDB();
    const combo = new ComboModel({
      title,
      description,
      price,
      inPromo,
      promoPercentage,
      items,
      mainImage,
      images,
      show,
    })
    await combo.save()

  } catch (err) {
    console.error("Error adding combo:", err);
    throw new Error("Failed to add combo!");
  }

  revalidatePath("/admin/dashboard/combo")
  redirect("/admin/dashboard/combo")

};
