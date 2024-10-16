"use server"

import { connectToDB } from "../lib/utils";
import CollectionModel from "../models/collection";
import GoodieModel from "../models/goodie";
import SizeModel from "../models/size";

export const fetchGoodies = async (q: string, page: number) => {
  console.log(q);
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 5;

  try {
    await connectToDB();

   

    const count = await GoodieModel.find({
      name: { $regex: regex },
    }).countDocuments();
    const goodies = await GoodieModel.find({ name: { $regex: regex } })
      .populate("sizes")
      .populate("fromCollection")
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1)).lean();
    console.log("list of goodies", goodies);
    return { count, goodies };
  } catch (err) {
    console.error("Error fetching goodies:", err);
    throw new Error("Failed to fetch goodies!");
  }
};
