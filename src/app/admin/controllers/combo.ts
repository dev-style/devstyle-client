"use server"
import { ICombo } from "../lib/interfaces";
import { connectToDB } from "../lib/utils";
import ComboModel from "../models/combo";

export const fetchCombos = async (q: string, page: number) => {
  // console.log(q);
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 5;

  try {
    await connectToDB();
    const count = await ComboModel.find({
      name: { $regex: regex },
    }).countDocuments();
    const combos = await ComboModel.find({ name: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    // console.log("list of combos", combos);
    return { count, combos };
  } catch (err) {
    console.error("Error fetching combos:", err);
    throw new Error("Failed to fetch combos!");
  }
};
export const addCombo = async (data: ICombo) => {

  // console.log("combo data",data)
 
};
