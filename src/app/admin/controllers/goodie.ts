import { connectToDB } from "../lib/utils";
import GoodieModel from "../models/goodie";

export const fetchGoodies = async (q: string, page: number) => {
  console.log(q);
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 5;

  try {
    await connectToDB();
    const count = await GoodieModel.find({ name: { $regex: regex } }).countDocuments();
    const goodies = await GoodieModel.find({ name: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    console.log("list of goodies", goodies);
    return { count, goodies };
  } catch (err) {
    console.error("Error fetching goodies:", err);
    throw new Error("Failed to fetch goodies!");
  }
};