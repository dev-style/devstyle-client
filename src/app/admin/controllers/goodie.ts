"use server"

import { connectToDB } from "../lib/utils";
import CollectionModel from "../models/collection";
import GoodieModel from "../models/goodie";
import SizeModel from "../models/size";

export const fetchGoodies = async (q: string, page: number) => {
  console.log("Query:", q);
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 5;

  try {
    await connectToDB();

    const count = await GoodieModel.find({
      name: { $regex: regex },
    }).countDocuments();

    const goodies = await GoodieModel.find({ name: { $regex: regex } }).limit(ITEM_PER_PAGE).populate("sizes").populate("fromCollection")
      .skip(ITEM_PER_PAGE * (page - 1))
      .lean();

    console.log("Number of goodies found:", count);
    console.log("First goodie:", goodies[0]);

    if (!goodies || goodies.length === 0) {
      console.log("No goodies found");
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
