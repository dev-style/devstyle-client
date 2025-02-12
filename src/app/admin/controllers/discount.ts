"use server";

import { revalidatePath } from "next/cache";
import { IDiscount } from "../lib/interfaces";
import { connectToDB } from "../lib/utils";
import DiscountModel from "../models/discount";
import GoodieModel from "../models/goodie";

export const fetchDiscounts = async (q: string, page: number) => {
  console.log("Query:", q);
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 15;

  try {
    await connectToDB();

    const count = await DiscountModel.find({
      name: { $regex: regex },
    }).countDocuments();

    const discounts = await DiscountModel.find({ code: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1))
      .populate("goodies")
      .sort({ createdAt: -1 })

      .lean();

    console.log("Number of discount found:", count);
    console.log("First discount:", discounts[0]);

    if (!discounts || discounts.length === 0) {
      console.log("No discount found");
      return { count: 0, discounts: [] };
    }

    return { count, discounts };
  } catch (err) {
    console.error("Error fetching discount:", err);
    if (err instanceof Error) {
      throw new Error(`Failed to fetch discounts: ${err.message}`);
    } else {
      throw new Error("Failed to fetch discounts: Unknown error");
    }
  }
};

export async function createDiscount(formData: {
  code: string;
  percent: number;
  limit: number;
  goodies: Array<string>;
}) {
  console.log("form", formData);
  try {
    await connectToDB();

    const hasDiscount = await DiscountModel.find({
      goodies: { $in: formData.goodies },
    });

    console.log("hasDiscount", hasDiscount);

    if (hasDiscount.length > 0){
      throw new Error("Error in creation of the discount");
    } else {
      const newDiscount = new DiscountModel({
        code: formData.code,
        percent: formData.limit,
        limit: formData.percent,
        isActive: true,
        goodies: formData.goodies,
      });
      console.log("new discount", newDiscount);
      await newDiscount.save();
      return { status: 200 };
    }
  } catch (error) {
    console.error("Error in creatio of discount", error);
    throw new Error("Error in creation of the discount");
  }
  revalidatePath("/admin/dashboard/discount");
}

export async function useDiscount() {
  try {
  } catch (error) {
    console.error("Error when we try to use the discount");
  }
}

export async function deleteDiscount() {}
